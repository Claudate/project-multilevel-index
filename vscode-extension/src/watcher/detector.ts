/**
 * Input: vscode, fs/promises
 * Output: ChangeDetector
 * Pos: Application code
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import * as vscode from 'vscode';
import * as fs from 'fs/promises';

export class ChangeDetector {
  /**
   * Detect if a file change is structural
   */
  async isStructuralChange(
    uri: vscode.Uri,
    changeType: 'modified' | 'created' | 'deleted'
  ): Promise<boolean> {
    // File creation/deletion is always structural
    if (changeType === 'created' || changeType === 'deleted') {
      return true;
    }

    // For modifications, check content
    try {
      const content = await fs.readFile(uri.fsPath, 'utf8');
      return this.hasStructuralKeywords(content);
    } catch (error) {
      // File read error, skip
      return false;
    }
  }

  /**
   * Check if content contains structural keywords
   */
  private hasStructuralKeywords(content: string): boolean {
    // Dependency keywords
    const dependencyPatterns = [
      /\bimport\s+/,
      /\brequire\s*\(/,
      /\bfrom\s+['"]/,
      /\buse\s+/,
      /^#include\s+/m,
      /\busing\s+/
    ];

    // Export keywords
    const exportPatterns = [
      /\bexport\s+(default|const|function|class|interface|type|enum)/,
      /\bpublic\s+(class|interface|function|fn|struct|enum)/,
      /\bclass\s+\w+/,
      /\binterface\s+\w+/,
      /\bfunction\s+\w+/,
      /\bdef\s+\w+/,
      /\bfn\s+\w+/,
      /\basync\s+(function|fn)/,
      /\bstruct\s+\w+/,
      /\benum\s+\w+/
    ];

    const allPatterns = [...dependencyPatterns, ...exportPatterns];

    for (const pattern of allPatterns) {
      if (pattern.test(content)) {
        return true;
      }
    }

    return false;
  }
}
