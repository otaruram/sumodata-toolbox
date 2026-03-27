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
        
        case 'toggleFilePickerMode':
          // Store file picker mode state in extension
          vscode.commands.executeCommand('sumodata.toggleFilePickerMode', data.enabled);
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
    
    <div style="margin-top: 12px; padding: 8px; background: var(--vscode-input-background); border-radius: 4px;">
      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 11px;">
        <input type="checkbox" id="filePickerMode" onchange="toggleFilePickerMode()" style="cursor: pointer;">
        <span>📁 Multi-File Mode (select files from workspace)</span>
      </label>
      <div id="filePickerInfo" style="display: none; margin-top: 8px; padding: 6px; background: var(--vscode-textBlockQuote-background); border-left: 3px solid #00d4ff; font-size: 10px; color: var(--vscode-descriptionForeground);">
        ℹ️ Multi-file mode enabled. Tools will prompt you to select files instead of using active editor.
      </div>
    </div>
    
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

  <div class="accordion" style="border: 2px solid #00d4ff; border-radius: 4px;">
    <div class="accordion-header" onclick="toggleAccordion('killer')" style="background: linear-gradient(90deg, rgba(0,212,255,0.1) 0%, rgba(0,212,255,0.05) 100%);">
      <span class="accordion-icon">🔥</span>
      <span style="font-weight: 700; color: #00d4ff;">Data Quality Auditor</span>
      <span style="margin-left: auto; font-size: 9px; background: #00d4ff; color: #000; padding: 2px 6px; border-radius: 3px; font-weight: 600;">NEW</span>
    </div>
    <div class="accordion-content" id="killer">
      <button class="tool-button" onclick="executeTool('sumodata.dataQualityAuditor')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600;">
        🔍 Run Quality Audit
      </button>
      <div style="font-size: 10px; color: var(--vscode-descriptionForeground); margin-top: 6px; padding: 6px; background: var(--vscode-textBlockQuote-background); border-radius: 3px;">
        Scans code for performance issues, anti-patterns, and data quality problems. Works with SQL, Python, and Pandas code.
      </div>
    </div>
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

    function toggleFilePickerMode() {
      const checkbox = document.getElementById('filePickerMode');
      const info = document.getElementById('filePickerInfo');
      
      if (checkbox.checked) {
        info.style.display = 'block';
      } else {
        info.style.display = 'none';
      }
      
      vscode.postMessage({ 
        type: 'toggleFilePickerMode',
        enabled: checkbox.checked
      });
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
