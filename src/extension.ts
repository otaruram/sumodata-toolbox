import * as vscode from 'vscode';
import { SecretManager } from './secretManager';
import { ApiProvider } from './apiProvider';
import { SidebarProvider } from './sidebarProvider';
import { SYSTEM_PROMPTS, ToolType } from './prompts';

let secretManager: SecretManager;
let apiProvider: ApiProvider | undefined;
let sidebarProvider: SidebarProvider;
let filePickerMode = false;

export async function activate(context: vscode.ExtensionContext) {
  console.log('SumoData Toolbox is now active');

  secretManager = new SecretManager(context);
  
  // Check if this is first activation
  const hasShownWelcome = context.globalState.get<boolean>('sumodata.hasShownWelcome');
  if (!hasShownWelcome) {
    // Show welcome message with documentation link
    const result = await vscode.window.showInformationMessage(
      '🎉 Welcome to SumoData Toolbox! Read the documentation to get started.',
      'Open Documentation',
      'Maybe Later'
    );
    
    if (result === 'Open Documentation') {
      vscode.env.openExternal(vscode.Uri.parse('https://otaruram.github.io/sumodata-toolbox-docs/'));
    }
    
    // Mark as shown
    await context.globalState.update('sumodata.hasShownWelcome', true);
  }
  
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

  // Open Documentation command
  context.subscriptions.push(
    vscode.commands.registerCommand('sumodata.openDocs', () => {
      vscode.env.openExternal(vscode.Uri.parse('https://otaruram.github.io/sumodata-toolbox-docs/'));
    })
  );

  // Toggle File Picker Mode command
  context.subscriptions.push(
    vscode.commands.registerCommand('sumodata.toggleFilePickerMode', (enabled: boolean) => {
      filePickerMode = enabled;
      vscode.window.showInformationMessage(
        filePickerMode 
          ? '📁 Multi-File Mode enabled. Tools will prompt for file selection.' 
          : '📝 Single-File Mode enabled. Tools will use active editor.'
      );
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
    { command: 'sumodata.mlBoilerplate', tool: 'mlBoilerplate' },
    { command: 'sumodata.dataQualityAuditor', tool: 'dataQualityAuditor' }
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

  let code = '';
  let fileContext = '';

  // File Picker Mode - allow selecting multiple files
  if (filePickerMode) {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: true,
      canSelectFiles: true,
      canSelectFolders: false,
      filters: {
        'Code Files': ['py', 'sql', 'ipynb', 'js', 'ts'],
        'All Files': ['*']
      },
      title: 'Select files to analyze (max 10 files recommended)'
    });

    if (!uris || uris.length === 0) {
      vscode.window.showInformationMessage('No files selected.');
      return;
    }

    // Warn if too many files selected
    if (uris.length > 10) {
      const proceed = await vscode.window.showWarningMessage(
        `You selected ${uris.length} files. This may take a while. Continue?`,
        'Yes, Continue',
        'Cancel'
      );
      
      if (proceed !== 'Yes, Continue') {
        return;
      }
    }

    // Process each file separately
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Processing ${uris.length} files with SumoData...`,
        cancellable: false
      },
      async (progress) => {
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < uris.length; i++) {
          const uri = uris[i];
          const fileName = uri.fsPath.split(/[\\/]/).pop() || 'unknown';
          
          progress.report({ 
            message: `Processing ${i + 1}/${uris.length}: ${fileName}`,
            increment: (100 / uris.length)
          });

          try {
            const document = await vscode.workspace.openTextDocument(uri);
            let fileCode = document.getText();

            // Check max length per file
            const config = vscode.workspace.getConfiguration('sumodata');
            const maxLength = config.get<number>('maxCodeLength', 10000);
            
            if (fileCode.length > maxLength) {
              fileCode = fileCode.substring(0, maxLength);
            }

            const systemPrompt = SYSTEM_PROMPTS[tool];
            const model = config.get<string>('model', 'claude-haiku-4-5');

            console.log(`[SumoData] Processing file: ${fileName}, Tool: ${tool}, Code length: ${fileCode.length}`);
            
            const response = await apiProvider!.sendRequest(systemPrompt, fileCode, model);

            if (response.success && response.data) {
              console.log(`[SumoData] Success for ${fileName}! Response length: ${response.data.length}`);
              
              // Create output file with unique name
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
              const outputFileName = `${tool}-${fileName.replace(/\.[^.]+$/, '')}-${timestamp}.${getFileExtension(tool)}`;
              
              const doc = await vscode.workspace.openTextDocument({
                content: response.data,
                language: detectLanguage(tool)
              });

              await vscode.window.showTextDocument(doc, { preview: false });
              successCount++;
            } else {
              console.error(`[SumoData] Error for ${fileName}: ${response.error}`);
              failCount++;
            }
          } catch (error) {
            console.error(`[SumoData] Exception for ${fileName}:`, error);
            failCount++;
          }
        }

        // Show summary
        if (successCount > 0) {
          vscode.window.showInformationMessage(
            `Completed! ${successCount} file(s) processed successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`
          );
        } else {
          vscode.window.showErrorMessage(`All ${failCount} file(s) failed to process.`);
        }
      }
    );
    
    return; // Exit early for multi-file mode
  }

  // Normal Mode - use active editor (single file)
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor. Please open a file or enable Multi-File Mode.');
    return;
  }

  const selection = editor.selection;
  code = editor.document.getText(selection);

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
      `Code exceeds ${maxLength} characters. Truncating...`
    );
    code = code.substring(0, maxLength);
  }

  const systemPrompt = SYSTEM_PROMPTS[tool];
  const model = config.get<string>('model', 'claude-haiku-4-5');

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Processing with SumoData (${filePickerMode ? 'Multi-File' : 'Single-File'})...`,
      cancellable: false
    },
    async (progress) => {
      console.log(`[SumoData] Tool: ${tool}, Model: ${model}, Code length: ${code.length}`);
      
      const response = await apiProvider!.sendRequest(systemPrompt, code, model);

      if (response.success && response.data) {
        console.log(`[SumoData] Success! Response length: ${response.data.length}`);
        
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
          'Copy to Clipboard'
        );

        if (action === 'Copy to Clipboard') {
          await vscode.env.clipboard.writeText(response.data);
          vscode.window.showInformationMessage('Copied to clipboard');
        }
      } else {
        console.error(`[SumoData] Error: ${response.error}`);
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
    mlBoilerplate: 'python',
    dataQualityAuditor: 'markdown'
  };

  return languageMap[tool] || 'plaintext';
}

function getFileExtension(tool: ToolType): string {
  const extensionMap: Record<ToolType, string> = {
    sqlOptimizer: 'sql',
    jsonToDDL: 'sql',
    cronGenerator: 'txt',
    explainRegex: 'md',
    pandasCleaner: 'py',
    sqlExplainer: 'md',
    generateDocstring: 'py',
    addTypeHints: 'py',
    mlBoilerplate: 'py',
    dataQualityAuditor: 'md'
  };

  return extensionMap[tool] || 'txt';
}

export function deactivate() {
  if (apiProvider) {
    apiProvider.dispose();
  }
}
