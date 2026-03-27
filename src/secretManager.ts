import * as vscode from 'vscode';

const API_KEY_SECRET = 'sumodata.apiKey';

export class SecretManager {
  constructor(private context: vscode.ExtensionContext) {}

  async getApiKey(): Promise<string | undefined> {
    return await this.context.secrets.get(API_KEY_SECRET);
  }

  async setApiKey(apiKey: string): Promise<void> {
    if (!this.validateApiKey(apiKey)) {
      throw new Error('Invalid API Key format');
    }
    await this.context.secrets.store(API_KEY_SECRET, apiKey);
  }

  async deleteApiKey(): Promise<void> {
    await this.context.secrets.delete(API_KEY_SECRET);
  }

  private validateApiKey(apiKey: string): boolean {
    // Basic validation: non-empty, reasonable length
    return apiKey.trim().length > 10 && apiKey.trim().length < 500;
  }

  onDidChange(callback: () => void): vscode.Disposable {
    return this.context.secrets.onDidChange((e) => {
      if (e.key === API_KEY_SECRET) {
        callback();
      }
    });
  }
}
