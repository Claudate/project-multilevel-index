/**
 * Input: vscode
 * Output: Logger
 * Pos: Core - Fundamental logic
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import * as vscode from 'vscode';

export class Logger {
  private outputChannel: vscode.OutputChannel;

  constructor(name: string = 'ProjectIndex') {
    this.outputChannel = vscode.window.createOutputChannel(name);
  }

  info(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] [INFO] ${message}`);
    if (args.length > 0) {
      this.outputChannel.appendLine(JSON.stringify(args, null, 2));
    }
  }

  warn(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] [WARN] ${message}`);
    if (args.length > 0) {
      this.outputChannel.appendLine(JSON.stringify(args, null, 2));
    }
  }

  error(message: string, error?: any): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] [ERROR] ${message}`);
    if (error) {
      if (error instanceof Error) {
        this.outputChannel.appendLine(`  ${error.message}`);
        if (error.stack) {
          this.outputChannel.appendLine(`  ${error.stack}`);
        }
      } else {
        this.outputChannel.appendLine(JSON.stringify(error, null, 2));
      }
    }
  }

  debug(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] [DEBUG] ${message}`);
    if (args.length > 0) {
      this.outputChannel.appendLine(JSON.stringify(args, null, 2));
    }
  }

  show(): void {
    this.outputChannel.show();
  }

  dispose(): void {
    this.outputChannel.dispose();
  }
}
