/**
 * Input: vscode, path, ../core/config
 * Output: Filter
 * Pos: Application code
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { IndexConfig } from '../core/config';

export class Filter {
  constructor(
    private workspaceRoot: string,
    private config: IndexConfig
  ) {}

  shouldSkip(uri: vscode.Uri): boolean {
    const filePath = uri.fsPath;

    // 1. Skip index files themselves
    const fileName = path.basename(filePath);
    if (fileName === 'PROJECT_INDEX.md' || fileName === 'FOLDER_INDEX.md') {
      return true;
    }

    // 2. Skip excluded patterns
    const relativePath = path.relative(this.workspaceRoot, filePath);
    for (const pattern of this.config.exclude.patterns) {
      if (this.matchPattern(relativePath, pattern)) {
        return true;
      }
    }

    // 3. Check file extension
    const ext = path.extname(filePath);
    const allowedExtensions = [
      '.ts', '.tsx', '.js', '.jsx',
      '.py',
      '.java', '.kt',
      '.rs',
      '.go',
      '.cpp', '.c', '.h', '.hpp',
      '.php',
      '.rb',
      '.swift',
      '.cs'
    ];

    if (!allowedExtensions.includes(ext)) {
      return true;
    }

    return false;
  }

  private matchPattern(filePath: string, pattern: string): boolean {
    // Simple glob pattern matching
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath.replace(/\\/g, '/'));
  }
}
