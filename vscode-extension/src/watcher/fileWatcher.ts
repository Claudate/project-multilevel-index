/**
 * Input: vscode, ../core/config, ./filter, ./detector, ../core/logger
 * Output: FileWatcher
 * Pos: Application code
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import * as vscode from 'vscode';
import { IndexConfig } from '../core/config';
import { Filter } from './filter';
import { ChangeDetector } from './detector';
import { Logger } from '../core/logger';

export class FileWatcher implements vscode.Disposable {
  private watcher: vscode.FileSystemWatcher;
  private filter: Filter;
  private detector: ChangeDetector;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly DEBOUNCE_MS = 300;

  constructor(
    private workspaceRoot: string,
    private config: IndexConfig,
    private onStructuralChange: (uri: vscode.Uri) => Promise<void>,
    private logger: Logger
  ) {
    this.filter = new Filter(workspaceRoot, config);
    this.detector = new ChangeDetector();
    this.setupWatcher();
  }

  private setupWatcher(): void {
    // Monitor code files
    const pattern = '**/*.{ts,tsx,js,jsx,py,java,kt,rs,go,cpp,c,h,hpp,php,rb,swift,cs}';
    this.watcher = vscode.workspace.createFileSystemWatcher(pattern);

    this.logger.info(`File watcher created for pattern: ${pattern}`);

    // File modified event
    this.watcher.onDidChange((uri) => {
      this.handleChangeDebounced(uri, 'modified');
    });

    // File created event
    this.watcher.onDidCreate((uri) => {
      this.handleChangeDebounced(uri, 'created');
    });

    // File deleted event
    this.watcher.onDidDelete((uri) => {
      this.handleChangeDebounced(uri, 'deleted');
    });
  }

  private handleChangeDebounced(
    uri: vscode.Uri,
    changeType: 'modified' | 'created' | 'deleted'
  ): void {
    const key = uri.fsPath;

    // Clear existing timer
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.debounceTimers.delete(key);
      this.handleChange(uri, changeType).catch((error) => {
        this.logger.error(`Error handling file change for ${uri.fsPath}:`, error);
      });
    }, this.DEBOUNCE_MS);

    this.debounceTimers.set(key, timer);
  }

  private async handleChange(
    uri: vscode.Uri,
    changeType: 'modified' | 'created' | 'deleted'
  ): Promise<void> {
    this.logger.debug(`File ${changeType}: ${uri.fsPath}`);

    // 1. Apply filter rules
    if (this.filter.shouldSkip(uri)) {
      this.logger.debug(`Skipped (filter): ${uri.fsPath}`);
      return;
    }

    // 2. Detect structural changes
    const isStructural = await this.detector.isStructuralChange(uri, changeType);
    if (!isStructural) {
      this.logger.debug(`Skipped (no structural change): ${uri.fsPath}`);
      return;
    }

    // 3. Trigger index update
    this.logger.info(`Structural change detected: ${uri.fsPath}`);
    await this.onStructuralChange(uri);
  }

  dispose(): void {
    this.watcher.dispose();

    // Clear all pending timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();

    this.logger.info('File watcher disposed');
  }
}
