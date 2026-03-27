import * as vscode from 'vscode';
import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface StreamCallback {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

export class ApiProvider {
  private axiosInstance: AxiosInstance;
  private outputChannel: vscode.OutputChannel;

  constructor(
    private apiKey: string,
    private baseUrl: string,
    private timeout: number
  ) {
    this.outputChannel = vscode.window.createOutputChannel('SumoData Toolbox');
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout * 1000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/health', {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async sendRequest(systemPrompt: string, code: string, model?: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post('/v1/chat/completions', {
        model: model || 'claude-haiku-4-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: code }
        ],
        stream: false
      });

      return {
        success: true,
        data: response.data.choices[0].message.content
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async sendStreamingRequest(
    systemPrompt: string,
    code: string,
    callback: StreamCallback,
    model?: string
  ): Promise<void> {
    try {
      const response = await this.axiosInstance.post(
        '/v1/chat/completions',
        {
          model: model || 'claude-haiku-4-5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: code }
          ],
          stream: true
        },
        {
          responseType: 'stream',
          adapter: 'http'
        }
      );

      let buffer = '';

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              callback.onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices[0]?.delta?.content;
              if (token) {
                callback.onToken(token);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      });

      response.data.on('end', () => {
        callback.onComplete();
      });

      response.data.on('error', (error: Error) => {
        callback.onError(error.message);
      });

    } catch (error) {
      const result = this.handleError(error);
      callback.onError(result.error || 'Unknown error');
    }
  }

  private handleError(error: unknown): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        const status = axiosError.response.status;
        
        switch (status) {
          case 401:
            this.logError('Authentication failed', error);
            return {
              success: false,
              error: 'Invalid API Key - please check your settings'
            };
          
          case 429:
            this.logError('Rate limit exceeded', error);
            return {
              success: false,
              error: 'Rate limit exceeded - please try again later'
            };
          
          case 500:
          case 502:
          case 503:
            this.logError('Server error', error);
            return {
              success: false,
              error: 'Server error - please try again later'
            };
          
          default:
            this.logError(`HTTP error ${status}`, error);
            return {
              success: false,
              error: `Request failed with status ${status}`
            };
        }
      } else if (axiosError.request) {
        this.logError('Network error', error);
        return {
          success: false,
          error: 'Cannot connect to ai.sumopod.com - check your internet connection'
        };
      }
    }

    this.logError('Unknown error', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }

  private logError(message: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullMessage = `[${new Date().toISOString()}] ${message}: ${errorMessage}`;
    
    this.outputChannel.appendLine(fullMessage);
    
    if (error instanceof Error && error.stack) {
      this.outputChannel.appendLine(error.stack);
    }
  }

  dispose(): void {
    this.outputChannel.dispose();
  }
}
