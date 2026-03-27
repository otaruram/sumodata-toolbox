import * as vscode from 'vscode';
import { SecretManager } from './secretManager';
import { ApiProvider } from './apiProvider';
import { SidebarProvider } from './sidebarProvider';
import { SYSTEM_PROMPTS, ToolType } from './prompts';

let secretManager: SecretManager;
let apiProvider: ApiProvider | undefined;
let sidebarProvider: SidebarProvider;

export async function activate(context: vscode.ExtensionContext) {
  console.log('SumoData Toolbox is now active');

  secretManager = new SecretManager(context);
  
  // Initialize API provider
  await initializeApiProvider();

  // Register sidebar
  sidebarProvider = new SidebarProvider(context.extensionUri, secretManager);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('sumodata.sidebar', sidebarProvider)
  );

  // Register commands
  registerCommands(context);

  // Watch for API key changes
  context.subscriptions.push(
    secretManager.onDidChange(async () => {
      await initializeApiProvider();
      sidebarProvider.refresh();
    })
  );

  // Watch for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('sumodata')) {
        await initializeApiProvider();
        sidebarProvider.refresh();
      }
    })
  );
}

async function initializeApiProvider(): Promise<void> {
  const apiKey = await secretManager.getApiKey();
  
  if (!apiKey) {
    apiProvider = undefined;
    return;
  }

  const config = vscode.workspace.getConfiguration('sumodata');
  const baseUrl = config.get<string>('baseUrl', 'https://ai.sumopod.com');
  const timeout = config.get<number>('timeout', 30);

  apiProvider = new ApiProvider(apiKey, baseUrl, timeout);
}

function registerCommands(context: vscode.ExtensionContext): void {
  // Set API Key command
  context.subscriptions.push(
    vscode.commands.registerCommand('sumodata.setApiKey', async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your Sumopod API Key',
        password: true,
        placeHolder: 'sk-...'
      });

      if (apiKey) {
        try {
          await secretManager.setApiKey(apiKey);
          vscode.window.showInformationMessage('API Key saved successfully');
        } catch (error) {
          vscode.window.showErrorMessage(
            error instanceof Error ? error.message : 'Failed to save API Key'
          );
        }
      }
    })
  );

  // Tool commands
  const tools: Array<{ command: string; tool: ToolType }> = [
    { command: 'sumodata.sqlOptimizer', tool: 'sqlOptimizer' },
    { command: 'sumodata.jsonToDDL', tool: 'jsonToDDL' },
    { command: 'sumodata.cronGenerator', tool: 'cronGenerator' },
    { command: 'sumodata.explainRegex', tool: 'explainRegex' },
    { command: 'sumodata.pandasCleaner', tool: 'pandasCleaner' },
    { command: 'sumodata.sqlExplainer', tool: 'sqlExplainer' },
    { command: 'sumodata.generateDocstring', tool: 'generateDocstring' },
    { command: 'sumodata.addTypeHints', tool: 'addTypeHints' },
    { command: 'sumodata.mlBoilerplate', tool: 'mlBoilerplate' }
  ];

  tools.forEach(({ command, tool }) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, () => executeTool(tool))
    );
  });
}

async function executeTool(tool: ToolType): Promise<void> {
  if (!apiProvider) {
    const result = await vscode.window.showErrorMessage(
      'API Key not configured. Please set your API Key first.',
      'Set API Key'
    );
    
    if (result === 'Set API Key') {
      vscode.commands.executeCommand('sumodata.setApiKey');
    }
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor. Please open a file and select code.');
    return;
  }

  const selection = editor.selection;
  let code = editor.document.getText(selection);

  // If no selection, use entire document
  if (!code || code.trim().length === 0) {
    const useEntireDoc = await vscode.window.showWarningMessage(
      'No code selected. Use entire document?',
      'Yes',
      'Cancel'
    );
    
    if (useEntireDoc !== 'Yes') {
      return;
    }
    
    code = editor.document.getText();
  }

  // Check max length
  const config = vscode.workspace.getConfiguration('sumodata');
  const maxLength = config.get<number>('maxCodeLength', 10000);
  
  if (code.length > maxLength) {
    vscode.window.showWarningMessage(
      `Selected code exceeds ${maxLength} characters. Truncating...`
    );
    code = code.substring(0, maxLength);
  }

  const systemPrompt = SYSTEM_PROMPTS[tool];
  const model = config.get<string>('model', 'claude-haiku-4-5');

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Processing with SumoData...',
      cancellable: false
    },
    async (progress) => {
      const response = await apiProvider!.sendRequest(systemPrompt, code, model);

      if (response.success && response.data) {
        // Create new document with result
        const doc = await vscode.workspace.openTextDocument({
          content: response.data,
          language: detectLanguage(tool)
        });
        
        await vscode.window.showTextDocument(doc, {
          viewColumn: vscode.ViewColumn.Beside,
          preview: false
        });

        // Show action buttons
        const action = await vscode.window.showInformationMessage(
          'Result ready',
          'Copy to Clipboard',
          'Insert at Cursor'
        );

        if (action === 'Copy to Clipboard') {
          await vscode.env.clipboard.writeText(response.data);
          vscode.window.showInformationMessage('Copied to clipboard');
        } else if (action === 'Insert at Cursor') {
          editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, response.data!);
          });
        }
      } else {
        vscode.window.showErrorMessage(response.error || 'Request failed');
      }
    }
  );
}

function detectLanguage(tool: ToolType): string {
  const languageMap: Record<ToolType, string> = {
    sqlOptimizer: 'sql',
    jsonToDDL: 'sql',
    cronGenerator: 'plaintext',
    explainRegex: 'markdown',
    pandasCleaner: 'python',
    sqlExplainer: 'markdown',
    generateDocstring: 'python',
    addTypeHints: 'python',
    mlBoilerplate: 'python'
  };

  return languageMap[tool] || 'plaintext';
}

export function deactivate() {
  if (apiProvider) {
    apiProvider.dispose();
  }
}
