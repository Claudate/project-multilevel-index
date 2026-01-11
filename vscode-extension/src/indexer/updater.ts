/**
 * Input: vscode, fs/promises, path, ../core/logger, ./analyzer, ./generator
 * Output: Updater
 * Pos: Application code
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '../core/logger';
import { Analyzer, FileAnalysis } from './analyzer';
import { Generator } from './generator';

export class Updater {
  public analyzer: Analyzer;
  private generator: Generator;

  constructor(private logger: Logger) {
    this.analyzer = new Analyzer(logger);
    this.generator = new Generator(logger);
  }

  /**
   * Update all indexes for a file change
   */
  async updateAll(uri: vscode.Uri): Promise<void> {
    this.logger.info(`Updating indexes for: ${uri.fsPath}`);

    try {
      // 1. Analyze the file
      const analysis = await this.analyzer.analyzeFile(uri);
      this.logger.debug('File analysis:', analysis);

      // 2. Update file header
      await this.updateFileHeader(uri, analysis);

      // 3. Update FOLDER_INDEX.md
      const folderUri = vscode.Uri.file(path.dirname(uri.fsPath));
      await this.updateFolderIndex(folderUri);

      // 4. Update PROJECT_INDEX.md (debounced)
      // TODO: Add debouncing for project index updates

      this.logger.info(`✅ Indexes updated for: ${uri.fsPath}`);

      // Show notification if enabled
      const config = vscode.workspace.getConfiguration('projectMultilevelIndex');
      if (config.get<boolean>('notifications.enabled', true)) {
        const fileName = path.basename(uri.fsPath);
        vscode.window.showInformationMessage(`📄 Index updated: ${fileName}`);
      }
    } catch (error) {
      this.logger.error(`Failed to update indexes for ${uri.fsPath}:`, error);
      throw error;
    }
  }

  /**
   * Update file header comment
   */
  async updateFileHeader(uri: vscode.Uri, analysis: FileAnalysis): Promise<void> {
    this.logger.debug(`Updating file header: ${uri.fsPath}`);

    try {
      // Read current file content
      const content = await fs.readFile(uri.fsPath, 'utf8');

      // Generate new header
      const newHeader = await this.generator.generateFileHeader(uri, analysis);

      // Replace or insert header
      const updatedContent = this.replaceOrInsertHeader(content, newHeader);

      // Write back if changed
      if (updatedContent !== content) {
        await fs.writeFile(uri.fsPath, updatedContent, 'utf8');
        this.logger.debug(`✅ File header updated: ${uri.fsPath}`);
      } else {
        this.logger.debug(`⏭️  File header unchanged: ${uri.fsPath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to update file header for ${uri.fsPath}:`, error);
      throw error;
    }
  }

  /**
   * Replace or insert file header
   */
  private replaceOrInsertHeader(content: string, newHeader: string): string {
    // Pattern to match existing headers (multi-line comments at file start)
    const patterns = [
      // /* */ style
      /^\/\*\*[\s\S]*?\*\/\s*/,
      // """ """ style (Python)
      /^"""[\s\S]*?"""\s*/,
      // //! style (Rust)
      /^(?:\/\/!.*\n)+/,
      // // style (Go)
      /^(?:\/\/.*\n){3,}/,
      // <?php /** */ style
      /^<\?php\s*\/\*\*[\s\S]*?\*\/\s*/
    ];

    // Check if we're looking at a PHP file
    const isPhp = newHeader.startsWith('<?php');

    // Try to find and replace existing header
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        return content.replace(pattern, newHeader + '\n\n');
      }
    }

    // No existing header found, insert at the beginning
    // But preserve shebang if present
    const shebangMatch = content.match(/^#!.*\n/);
    if (shebangMatch) {
      return shebangMatch[0] + newHeader + '\n\n' + content.substring(shebangMatch[0].length);
    }

    // For PHP files, ensure we don't duplicate <?php
    if (isPhp) {
      const phpTagMatch = content.match(/^<\?php\s*/);
      if (phpTagMatch) {
        return newHeader + '\n\n' + content.substring(phpTagMatch[0].length);
      }
    }

    return newHeader + '\n\n' + content;
  }

  /**
   * Update FOLDER_INDEX.md
   */
  async updateFolderIndex(folderUri: vscode.Uri): Promise<void> {
    this.logger.debug(`Updating folder index: ${folderUri.fsPath}`);

    try {
      // Find all code files in this folder (not recursive)
      const files = await this.getFilesInFolder(folderUri);

      if (files.length === 0) {
        this.logger.debug(`⏭️  No files in folder: ${folderUri.fsPath}`);
        return;
      }

      // Analyze all files
      const analyzed = await Promise.all(
        files.map(async (uri) => ({
          uri,
          analysis: await this.analyzer.analyzeFile(uri)
        }))
      );

      // Generate folder index content
      const content = await this.generator.generateFolderIndex(folderUri, analyzed);

      // Write FOLDER_INDEX.md
      const indexPath = path.join(folderUri.fsPath, 'FOLDER_INDEX.md');
      await fs.writeFile(indexPath, content, 'utf8');

      this.logger.debug(`✅ Folder index updated: ${indexPath}`);
    } catch (error) {
      this.logger.error(`Failed to update folder index for ${folderUri.fsPath}:`, error);
      // Don't throw - folder index update is not critical
    }
  }

  /**
   * Update PROJECT_INDEX.md
   */
  async updateProjectIndex(workspaceRoot: string): Promise<void> {
    this.logger.debug('Updating project index');

    try {
      // Get all folders with code files
      const folderStructure = await this.scanProjectStructure(workspaceRoot);

      // Get all code files for dependency graph
      const allFiles = await this.getAllCodeFiles(workspaceRoot);
      const analyzed = await Promise.all(
        allFiles.map(async (uri) => ({
          uri,
          analysis: await this.analyzer.analyzeFile(uri)
        }))
      );

      // Generate dependency graph
      const config = vscode.workspace.getConfiguration('projectMultilevelIndex');
      const maxNodes = config.get<number>('visualization.maxNodes', 50);
      const dependencyGraph = await this.generator.generateDependencyGraph(analyzed, maxNodes);

      // Generate project index content
      const content = await this.generator.generateProjectIndex(
        workspaceRoot,
        folderStructure,
        dependencyGraph
      );

      // Write PROJECT_INDEX.md
      const indexPath = path.join(workspaceRoot, 'PROJECT_INDEX.md');
      await fs.writeFile(indexPath, content, 'utf8');

      this.logger.info(`✅ Project index updated: ${indexPath}`);
    } catch (error) {
      this.logger.error('Failed to update project index:', error);
      throw error;
    }
  }

  /**
   * Get all code files in a folder (non-recursive)
   */
  private async getFilesInFolder(folderUri: vscode.Uri): Promise<vscode.Uri[]> {
    const files: vscode.Uri[] = [];

    const entries = await fs.readdir(folderUri.fsPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name);
        const codeExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.kt', '.rs', '.go', '.cpp', '.c', '.h', '.hpp', '.php', '.rb', '.swift', '.cs'];

        if (codeExts.includes(ext)) {
          files.push(vscode.Uri.file(path.join(folderUri.fsPath, entry.name)));
        }
      }
    }

    return files;
  }

  /**
   * Scan project structure
   */
  private async scanProjectStructure(workspaceRoot: string): Promise<Map<string, number>> {
    const structure = new Map<string, number>();

    const scanDir = async (dir: string, depth: number = 0): Promise<void> => {
      if (depth > 5) return;  // Limit depth

      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        let fileCount = 0;

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          // Skip excluded folders
          if (this.shouldSkipFolder(entry.name)) {
            continue;
          }

          if (entry.isDirectory()) {
            await scanDir(fullPath, depth + 1);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            const codeExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.kt', '.rs', '.go', '.cpp', '.c', '.h', '.hpp', '.php', '.rb', '.swift', '.cs'];
            if (codeExts.includes(ext)) {
              fileCount++;
            }
          }
        }

        if (fileCount > 0) {
          const relativePath = path.relative(workspaceRoot, dir);
          structure.set(relativePath || '.', fileCount);
        }
      } catch (error) {
        // Ignore permission errors
      }
    };

    await scanDir(workspaceRoot);
    return structure;
  }

  /**
   * Get all code files in project
   */
  private async getAllCodeFiles(workspaceRoot: string): Promise<vscode.Uri[]> {
    const files: vscode.Uri[] = [];

    const scanDir = async (dir: string, depth: number = 0): Promise<void> => {
      if (depth > 5) return;

      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (this.shouldSkipFolder(entry.name)) {
            continue;
          }

          if (entry.isDirectory()) {
            await scanDir(fullPath, depth + 1);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            const codeExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.kt', '.rs', '.go', '.cpp', '.c', '.h', '.hpp', '.php', '.rb', '.swift', '.cs'];
            if (codeExts.includes(ext)) {
              files.push(vscode.Uri.file(fullPath));
            }
          }
        }
      } catch (error) {
        // Ignore
      }
    };

    await scanDir(workspaceRoot);
    return files;
  }

  /**
   * Check if folder should be skipped
   */
  private shouldSkipFolder(folderName: string): boolean {
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
      'venv'
    ];

    return skipFolders.includes(folderName);
  }
}
