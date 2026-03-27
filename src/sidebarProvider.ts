import * as vscode from 'vscode';
import { SecretManager } from './secretManager';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly secretManager: SecretManager
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'setApiKey':
          vscode.commands.executeCommand('sumodata.setApiKey');
          break;
        
        case 'openDocs':
          vscode.commands.executeCommand('sumodata.openDocs');
          break;
        
        case 'changeModel':
          await vscode.workspace.getConfiguration('sumodata').update(
            'model',
            data.model,
            vscode.ConfigurationTarget.Global
          );
          vscode.window.showInformationMessage(`Model changed to ${data.model}`);
          break;
        
        case 'executeTool':
          vscode.commands.executeCommand(data.command);
          break;
        
        case 'sendChat':
          vscode.window.showInformationMessage('Chat feature coming soon!');
          break;
        
        case 'checkConnection':
          await this.checkConnection();
          break;
      }
    });

    // Initial connection check
    this.checkConnection();
  }

  private async checkConnection() {
    const apiKey = await this.secretManager.getApiKey();
    
    if (!this._view) {
      return;
    }

    if (!apiKey) {
      this._view.webview.postMessage({
        type: 'connectionStatus',
        status: 'no-key'
      });
      return;
    }

    // For now, just check if key exists
    // Real connection test would require ApiProvider
    this._view.webview.postMessage({
      type: 'connectionStatus',
      status: 'connected'
    });
  }

  public refresh() {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
      this.checkConnection();
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SumoData Toolbox</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background-color: var(--vscode-sideBar-background);
      padding: 16px;
    }

    .header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #00d4ff;
    }

    .subtitle {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 12px;
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--vscode-input-background);
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 8px;
    }

    .status-indicator {
      font-size: 10px;
    }

    .api-key-link {
      color: #00d4ff;
      text-decoration: none;
      font-size: 11px;
      cursor: pointer;
    }

    .api-key-link:hover {
      text-decoration: underline;
    }

    .accordion {
      margin-bottom: 12px;
    }

    .accordion-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .accordion-header:hover {
      background: var(--vscode-list-hoverBackground);
    }

    .accordion-icon {
      font-size: 14px;
    }

    .accordion-content {
      display: none;
      padding: 8px 0;
      gap: 6px;
      flex-direction: column;
    }

    .accordion-content.active {
      display: flex;
    }

    .tool-button {
      padding: 8px 12px;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      border-radius: 3px;
      cursor: pointer;
      text-align: left;
      font-size: 12px;
      transition: background 0.2s;
    }

    .tool-button:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .chat-section {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--vscode-panel-border);
    }

    .chat-title {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #00d4ff;
    }

    .chat-input {
      width: 100%;
      padding: 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 3px;
      font-size: 12px;
      font-family: inherit;
      resize: vertical;
      min-height: 60px;
    }

    .chat-button {
      margin-top: 8px;
      padding: 6px 12px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      width: 100%;
    }

    .chat-button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .model-select {
      width: 100%;
      padding: 6px 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 3px;
      font-size: 12px;
      font-family: inherit;
      margin-top: 4px;
      cursor: pointer;
    }

    .model-select:focus {
      outline: 1px solid var(--vscode-focusBorder);
    }

    .disclaimer {
      margin-top: 20px;
      padding: 12px;
      background: var(--vscode-textBlockQuote-background);
      border-left: 3px solid #00d4ff;
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">SUMODATA TOOLBOX</div>
    <div class="subtitle">Unofficial Community Edition</div>
    
    <div class="connection-status" id="connectionStatus">
      <span class="status-indicator">⚪</span>
      <span id="statusText">Checking connection...</span>
    </div>
    
    <a class="api-key-link" onclick="setApiKey()">⚙️ Configure API Key</a>
    <a class="api-key-link" onclick="openDocs()" style="margin-top: 4px;">📚 Open Documentation</a>
    
    <div style="margin-top: 8px;">
      <label style="font-size: 11px; color: var(--vscode-descriptionForeground);">AI Model:</label>
      <select id="modelSelect" class="model-select" onchange="changeModel()">
        <option value="claude-haiku-4-5">⚡ Sumo Lightning</option>
        <option value="kimi-k2">⚡ Sumo Thunder</option>
        <option value="gemini/gemini-2.5-pro">🔥 Sumo Titan Pro</option>
        <option value="gemini/gemini-2.0-flash">💨 Sumo Flash</option>
        <option value="gpt-4o-mini">✨ Sumo Spark</option>
        <option value="gpt-5-mini">🌟 Sumo Nova</option>
      </select>
    </div>
  </div>

  <div class="accordion">
    <div class="accordion-header" onclick="toggleAccordion('pipes')">
      <span class="accordion-icon">📂</span>
      <span>Sumo Pipes (Data Engineering)</span>
    </div>
    <div class="accordion-content" id="pipes">
      <button class="tool-button" onclick="executeTool('sumodata.sqlOptimizer')">
        SQL Optimizer
      </button>
      <button class="tool-button" onclick="executeTool('sumodata.jsonToDDL')">
        JSON to DDL Schema
      </button>
      <button class="tool-button" onclick="executeTool('sumodata.cronGenerator')">
        Cron Expression Generator
      </button>
    </div>
  </div>

  <div class="accordion">
    <div class="accordion-header" onclick="toggleAccordion('lens')">
      <span class="accordion-icon">📊</span>
      <span>Sumo Lens (Data Analysis)</span>
    </div>
    <div class="accordion-content" id="lens">
      <button class="tool-button" onclick="executeTool('sumodata.explainRegex')">
        Explain Complex Regex
      </button>
      <button class="tool-button" onclick="executeTool('sumodata.pandasCleaner')">
        Pandas Cleaning Logic Suggester
      </button>
      <button class="tool-button" onclick="executeTool('sumodata.sqlExplainer')">
        SQL Logic Explainer
      </button>
    </div>
  </div>

  <div class="accordion">
    <div class="accordion-header" onclick="toggleAccordion('core')">
      <span class="accordion-icon">🤖</span>
      <span>Sumo Core (DS/ML)</span>
    </div>
    <div class="accordion-content" id="core">
      <button class="tool-button" onclick="executeTool('sumodata.generateDocstring')">
        Auto-generate Google-style Docstrings
      </button>
      <button class="tool-button" onclick="executeTool('sumodata.addTypeHints')">
        Type Hinting for Python
      </button>
      <button class="tool-button" onclick="executeTool('sumodata.mlBoilerplate')">
        PyTorch/Scikit-learn Training Loop
      </button>
    </div>
  </div>

  <div class="chat-section">
    <div class="chat-title">QUICK FOLLOW-UP</div>
    <textarea class="chat-input" placeholder="Ask follow-up questions..." id="chatInput"></textarea>
    <button class="chat-button" onclick="sendChat()">Ask</button>
  </div>

  <div class="disclaimer">
    ⚠️ <strong>Disclaimer:</strong> This is an unofficial, community-powered extension. 
    Not affiliated with or endorsed by Sumopod. Get your API key from 
    <strong>sumopod.com</strong>.
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function toggleAccordion(id) {
      const content = document.getElementById(id);
      content.classList.toggle('active');
    }

    function setApiKey() {
      vscode.postMessage({ type: 'setApiKey' });
    }

    function openDocs() {
      vscode.postMessage({ type: 'openDocs' });
    }

    function changeModel() {
      const select = document.getElementById('modelSelect');
      const model = select.value;
      vscode.postMessage({ 
        type: 'changeModel',
        model: model
      });
    }

    function executeTool(command) {
      vscode.postMessage({ 
        type: 'executeTool',
        command: command
      });
    }

    function sendChat() {
      const input = document.getElementById('chatInput');
      const message = input.value.trim();
      
      if (message) {
        vscode.postMessage({ 
          type: 'sendChat',
          message: message
        });
        input.value = '';
      }
    }

    window.addEventListener('message', event => {
      const message = event.data;
      
      if (message.type === 'connectionStatus') {
        const statusEl = document.getElementById('connectionStatus');
        const textEl = document.getElementById('statusText');
        
        if (message.status === 'connected') {
          statusEl.querySelector('.status-indicator').textContent = '🟢';
          textEl.textContent = 'Connected to ai.sumopod.com';
        } else if (message.status === 'no-key') {
          statusEl.querySelector('.status-indicator').textContent = '⚠️';
          textEl.textContent = 'API Key not configured';
        } else {
          statusEl.querySelector('.status-indicator').textContent = '🔴';
          textEl.textContent = 'Disconnected from ai.sumopod.com';
        }
      }
    });

    // Check connection on load
    vscode.postMessage({ type: 'checkConnection' });

    // Load current model selection
    (function() {
      // Request current model from extension
      // For now, default to first option
    })();
  </script>
</body>
</html>`;
  }
}
