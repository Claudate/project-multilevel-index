/**
 * Input: vscode, fs/promises, path, ./watcher/fileWatcher, ./indexer/updater, ./core/config, ./core/logger
 * Output: activate, deactivate
 * Pos: Application code
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileWatcher } from './watcher/fileWatcher';
import { Updater } from './indexer/updater';
import { Config } from './core/config';
import { Logger } from './core/logger';

let fileWatcher: FileWatcher | undefined;
let logger: Logger;

/**
 * Extension activation
 */
export async function activate(context: vscode.ExtensionContext) {
  logger = new Logger('ProjectIndex');
  logger.info('Activating Project Multilevel Index extension...');

  // Get workspace folder
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    logger.warn('No workspace folder found. Extension will not activate.');
    return;
  }

  const workspaceRoot = workspaceFolder.uri.fsPath;
  logger.info(`Workspace root: ${workspaceRoot}`);

  // Load configuration
  const config = await Config.load(workspaceRoot);
  logger.info(`Configuration loaded. Auto-update: ${config.index.autoUpdate}`);

  // Create updater
  const updater = new Updater(logger);

  // Create file watcher
  if (config.index.autoUpdate) {
    fileWatcher = new FileWatcher(
      workspaceRoot,
      config,
      async (uri) => {
        try {
          await updater.updateAll(uri);
        } catch (error) {
          logger.error(`Failed to update index for ${uri.fsPath}:`, error);
          vscode.window.showErrorMessage(
            `Failed to update index: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      },
      logger
    );
    logger.info('File watcher started');
  }

  // Register commands
  registerCommands(context, workspaceRoot, updater);

  // Register configuration change listener
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('projectMultilevelIndex')) {
        logger.info('Configuration changed, reloading...');
        handleConfigurationChange(workspaceRoot, config);
      }
    })
  );

  // Register disposables
  if (fileWatcher) {
    context.subscriptions.push(fileWatcher);
  }

  logger.info('✅ Project Multilevel Index extension activated successfully');

  // Show welcome message (only first time)
  const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
  if (!hasShownWelcome) {
    showWelcomeMessage(context);
  }
}

/**
 * Extension deactivation
 */
export function deactivate() {
  logger?.info('Deactivating Project Multilevel Index extension...');
  fileWatcher?.dispose();
  logger?.info('✅ Extension deactivated');
}

/**
 * Register extension commands
 */
function registerCommands(
  context: vscode.ExtensionContext,
  workspaceRoot: string,
  updater: Updater
) {
  // Initialize index command
  const initCommand = vscode.commands.registerCommand(
    'project-multilevel-index.init',
    async () => {
      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Initializing Project Index',
            cancellable: false
          },
          async (progress) => {
            progress.report({ message: 'Scanning project files...' });
            await initializeIndex(workspaceRoot, updater);
            progress.report({ message: 'Done!' });
          }
        );
        vscode.window.showInformationMessage('✅ Project index initialized successfully!');
      } catch (error) {
        logger.error('Failed to initialize index:', error);
        vscode.window.showErrorMessage(
          `Failed to initialize index: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  );

  // Update all indexes command
  const updateCommand = vscode.commands.registerCommand(
    'project-multilevel-index.update',
    async () => {
      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Updating Project Index',
            cancellable: false
          },
          async (progress) => {
            progress.report({ message: 'Updating all indexes...' });
            await updateAllIndexes(workspaceRoot, updater);
            progress.report({ message: 'Done!' });
          }
        );
        vscode.window.showInformationMessage('✅ All indexes updated successfully!');
      } catch (error) {
        logger.error('Failed to update indexes:', error);
        vscode.window.showErrorMessage(
          `Failed to update indexes: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  );

  // Check index consistency command
  const checkCommand = vscode.commands.registerCommand(
    'project-multilevel-index.check',
    async () => {
      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Checking Index Consistency',
            cancellable: false
          },
          async (progress) => {
            progress.report({ message: 'Analyzing index integrity...' });
            await checkIndexConsistency(workspaceRoot);
            progress.report({ message: 'Done!' });
          }
        );
      } catch (error) {
        logger.error('Failed to check index:', error);
        vscode.window.showErrorMessage(
          `Failed to check index: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  );

  // Toggle auto-update command
  const toggleCommand = vscode.commands.registerCommand(
    'project-multilevel-index.toggleAutoUpdate',
    async () => {
      const config = vscode.workspace.getConfiguration('projectMultilevelIndex');
      const current = config.get<boolean>('autoUpdate', true);
      await config.update('autoUpdate', !current, vscode.ConfigurationTarget.Workspace);
      vscode.window.showInformationMessage(
        `Auto-update ${!current ? 'enabled' : 'disabled'}`
      );
    }
  );

  context.subscriptions.push(initCommand, updateCommand, checkCommand, toggleCommand);
}

/**
 * Show welcome message
 */
function showWelcomeMessage(context: vscode.ExtensionContext) {
  const message = '🎼 Project Multilevel Index is now active! Initialize your project index?';
  const action = 'Initialize Now';
  const doNotShowAgain = "Don't Show Again";

  vscode.window.showInformationMessage(message, action, doNotShowAgain).then((selection) => {
    if (selection === action) {
      vscode.commands.executeCommand('project-multilevel-index.init');
    } else if (selection === doNotShowAgain) {
      context.globalState.update('hasShownWelcome', true);
    }
  });
}

/**
 * Handle configuration changes
 */
async function handleConfigurationChange(workspaceRoot: string, oldConfig: any) {
  const newConfig = await Config.load(workspaceRoot);

  // Restart file watcher if auto-update setting changed
  if (oldConfig.index.autoUpdate !== newConfig.index.autoUpdate) {
    logger.info(`Auto-update setting changed: ${newConfig.index.autoUpdate}`);
    // TODO: Restart watcher
  }
}

/**
 * Initialize index system
 */
async function initializeIndex(workspaceRoot: string, updater: Updater): Promise<void> {
  logger.info('Initializing index system...');

  try {
    // 1. Get all code files in the project
    const allFiles = await getAllCodeFilesRecursive(workspaceRoot);
    logger.info(`Found ${allFiles.length} code files`);

    // 2. Update all file headers
    let headersUpdated = 0;
    for (const uri of allFiles) {
      try {
        const analysis = await updater.analyzer.analyzeFile(uri);
        await updater.updateFileHeader(uri, analysis);
        headersUpdated++;
      } catch (error) {
        logger.warn(`Failed to update header for ${uri.fsPath}:`, error);
      }
    }
    logger.info(`Updated ${headersUpdated} file headers`);

    // 3. Get all folders
    const folders = await getAllFoldersWithCode(workspaceRoot);
    logger.info(`Found ${folders.size} folders with code`);

    // 4. Update all FOLDER_INDEX.md files
    let foldersUpdated = 0;
    for (const folderPath of folders.keys()) {
      try {
        const folderUri = vscode.Uri.file(folderPath);
        await updater.updateFolderIndex(folderUri);
        foldersUpdated++;
      } catch (error) {
        logger.warn(`Failed to update folder index for ${folderPath}:`, error);
      }
    }
    logger.info(`Updated ${foldersUpdated} folder indexes`);

    // 5. Update PROJECT_INDEX.md
    await updater.updateProjectIndex(workspaceRoot);
    logger.info('Updated project index');

    logger.info('✅ Index system initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize index system:', error);
    throw error;
  }
}

/**
 * Update all indexes
 */
async function updateAllIndexes(workspaceRoot: string, updater: Updater): Promise<void> {
  logger.info('Updating all indexes...');

  try {
    // Get all folders with code
    const folders = await getAllFoldersWithCode(workspaceRoot);

    // Update all folder indexes
    for (const folderPath of folders.keys()) {
      try {
        const folderUri = vscode.Uri.file(folderPath);
        await updater.updateFolderIndex(folderUri);
      } catch (error) {
        logger.warn(`Failed to update folder index for ${folderPath}:`, error);
      }
    }

    // Update project index
    await updater.updateProjectIndex(workspaceRoot);

    logger.info('✅ All indexes updated successfully');
  } catch (error) {
    logger.error('Failed to update all indexes:', error);
    throw error;
  }
}

/**
 * Check index consistency
 */
async function checkIndexConsistency(workspaceRoot: string): Promise<void> {
  logger.info('Checking index consistency...');

  try {
    const issues: string[] = [];

    // 1. Check if PROJECT_INDEX.md exists
    const projectIndexPath = path.join(workspaceRoot, 'PROJECT_INDEX.md');
    try {
      await fs.access(projectIndexPath);
    } catch {
      issues.push('❌ PROJECT_INDEX.md not found');
    }

    // 2. Check all folders for FOLDER_INDEX.md
    const folders = await getAllFoldersWithCode(workspaceRoot);
    let missingFolderIndexes = 0;
    for (const folderPath of folders.keys()) {
      const folderIndexPath = path.join(folderPath, 'FOLDER_INDEX.md');
      try {
        await fs.access(folderIndexPath);
      } catch {
        missingFolderIndexes++;
      }
    }
    if (missingFolderIndexes > 0) {
      issues.push(`⚠️  ${missingFolderIndexes} folders missing FOLDER_INDEX.md`);
    }

    // 3. Check all code files for headers
    const allFiles = await getAllCodeFilesRecursive(workspaceRoot);
    let filesWithoutHeaders = 0;
    for (const uri of allFiles) {
      try {
        const content = await fs.readFile(uri.fsPath, 'utf8');
        const hasHeader = /^(\/\*\*|"""|\/\/!)[\s\S]*?(Input:|Output:|Pos:)/.test(content.substring(0, 500));
        if (!hasHeader) {
          filesWithoutHeaders++;
        }
      } catch (error) {
        logger.warn(`Failed to check header for ${uri.fsPath}:`, error);
      }
    }
    if (filesWithoutHeaders > 0) {
      issues.push(`⚠️  ${filesWithoutHeaders} files missing headers`);
    }

    // Show results
    if (issues.length === 0) {
      vscode.window.showInformationMessage('✅ Index system is consistent!');
    } else {
      const message = `Index consistency check:\n${issues.join('\n')}`;
      vscode.window.showWarningMessage(message, 'Fix Issues').then((selection) => {
        if (selection === 'Fix Issues') {
          vscode.commands.executeCommand('project-multilevel-index.init');
        }
      });
    }

    logger.info('Consistency check complete');
  } catch (error) {
    logger.error('Failed to check index consistency:', error);
    throw error;
  }
}

/**
 * Get all code files recursively
 */
async function getAllCodeFilesRecursive(workspaceRoot: string): Promise<vscode.Uri[]> {
  const files: vscode.Uri[] = [];
  const codeExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.kt', '.rs', '.go', '.cpp', '.c', '.h', '.hpp', '.php', '.rb', '.swift', '.cs'];

  async function scanDir(dir: string, depth: number = 0): Promise<void> {
    if (depth > 5) return;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (shouldSkipFolder(entry.name)) {
          continue;
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (codeExts.includes(ext)) {
            files.push(vscode.Uri.file(fullPath));
          }
        }
      }
    } catch (error) {
      // Ignore permission errors
    }
  }

  await scanDir(workspaceRoot);
  return files;
}

/**
 * Get all folders containing code files
 */
async function getAllFoldersWithCode(workspaceRoot: string): Promise<Map<string, number>> {
  const folders = new Map<string, number>();
  const codeExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.kt', '.rs', '.go', '.cpp', '.c', '.h', '.hpp', '.php', '.rb', '.swift', '.cs'];

  async function scanDir(dir: string, depth: number = 0): Promise<void> {
    if (depth > 5) return;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      let fileCount = 0;

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (shouldSkipFolder(entry.name)) {
          continue;
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (codeExts.includes(ext)) {
            fileCount++;
          }
        }
      }

      if (fileCount > 0) {
        folders.set(dir, fileCount);
      }
    } catch (error) {
      // Ignore permission errors
    }
  }

  await scanDir(workspaceRoot);
  return folders;
}

/**
 * Check if folder should be skipped
 */
function shouldSkipFolder(folderName: string): boolean {
  const skipFolders = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'target',
    'vendor',
    '__pycache__',
    '.cache',
    'coverage',
    '.turbo',
    '.venv',
    'venv',
    '.vscode',
    '.idea'
  ];

  return skipFolders.includes(folderName);
}
