/**
 * Header and index generator
 * Standalone version for CLI (VSCode-independent)
 */

import * as path from 'path';
import { FileAnalysis } from './analyzer.js';

export class Generator {
  /**
   * Generate file header comment
   */
  async generateFileHeader(filePath: string, analysis: FileAnalysis): Promise<string> {
    const ext = path.extname(filePath);

    // Format inputs and outputs
    const inputsStr = analysis.inputs.length > 0
      ? analysis.inputs.slice(0, 10).join(', ')
      : 'None';

    const outputsStr = analysis.outputs.length > 0
      ? analysis.outputs.slice(0, 10).join(', ')
      : 'None';

    // Choose comment style based on file extension
    switch (ext) {
      case '.ts':
      case '.tsx':
      case '.js':
      case '.jsx':
      case '.mjs':
      case '.cjs':
      case '.java':
      case '.kt':
      case '.cs':
      case '.swift':
        return this.generateBlockComment(inputsStr, outputsStr, analysis.position);

      case '.py':
      case '.rb':
        return this.generateDocstring(inputsStr, outputsStr, analysis.position);

      case '.rs':
      case '.cpp':
      case '.c':
      case '.h':
      case '.hpp':
        return this.generateLineComment(inputsStr, outputsStr, analysis.position);

      case '.go':
        return this.generateGoComment(inputsStr, outputsStr, analysis.position);

      case '.php':
        return this.generatePhpComment(inputsStr, outputsStr, analysis.position);

      default:
        return this.generateBlockComment(inputsStr, outputsStr, analysis.position);
    }
  }

  /**
   * Generate block comment (JS/TS/Java/C#/Swift)
   */
  private generateBlockComment(inputs: string, outputs: string, position: string): string {
    return `/**
 * Input: ${inputs}
 * Output: ${outputs}
 * Pos: ${position}
 *
 * 🔄 Self-reference: When this file changes, update this header
 */`;
  }

  /**
   * Generate docstring (Python/Ruby)
   */
  private generateDocstring(inputs: string, outputs: string, position: string): string {
    return `"""
Input: ${inputs}
Output: ${outputs}
Pos: ${position}

🔄 Self-reference: When this file changes, update this header
"""`;
  }

  /**
   * Generate //! style comment (Rust)
   */
  private generateLineComment(inputs: string, outputs: string, position: string): string {
    return `//! Input: ${inputs}
//! Output: ${outputs}
//! Pos: ${position}
//!
//! 🔄 Self-reference: When this file changes, update this header`;
  }

  /**
   * Generate Go package comment
   */
  private generateGoComment(inputs: string, outputs: string, position: string): string {
    return `// Input: ${inputs}
// Output: ${outputs}
// Pos: ${position}
//
// 🔄 Self-reference: When this file changes, update this header`;
  }

  /**
   * Generate PHP comment
   */
  private generatePhpComment(inputs: string, outputs: string, position: string): string {
    return `<?php
/**
 * Input: ${inputs}
 * Output: ${outputs}
 * Pos: ${position}
 *
 * 🔄 Self-reference: When this file changes, update this header
 */`;
  }

  /**
   * Generate FOLDER_INDEX.md content
   */
  async generateFolderIndex(
    folderPath: string,
    files: Array<{ filePath: string; analysis: FileAnalysis }>
  ): Promise<string> {
    const folderName = path.basename(folderPath);

    // Build file list
    const fileList = files
      .map(({ filePath, analysis }) => {
        const fileName = path.basename(filePath);
        const description = this.summarizeFile(analysis);
        return `- \`${fileName}\` - ${description}`;
      })
      .join('\n');

    return `## 📁 ${folderName}/

**Architecture**:
- ${this.inferFolderPurpose(folderName)}

**Files**:
${fileList}

🔄 **Self-reference**: When files in this folder change, update this index and PROJECT_INDEX.md
`;
  }

  /**
   * Summarize file based on analysis
   */
  private summarizeFile(analysis: FileAnalysis): string {
    if (analysis.outputs.length > 0) {
      const firstOutput = analysis.outputs[0];
      if (analysis.outputs.length === 1) {
        return `Exports ${firstOutput}`;
      } else {
        return `Exports ${firstOutput} and ${analysis.outputs.length - 1} more`;
      }
    }
    return analysis.position;
  }

  /**
   * Infer folder purpose from name
   */
  private inferFolderPurpose(folderName: string): string {
    const purposes: Record<string, string> = {
      'controllers': 'HTTP request handlers, API endpoints',
      'services': 'Business logic layer',
      'models': 'Data models and schemas',
      'utils': 'Utility functions and helpers',
      'components': 'UI components',
      'pages': 'Page components and routes',
      'middleware': 'Request/response middleware',
      'config': 'Configuration files',
      'lib': 'Library code',
      'core': 'Core functionality',
      'types': 'Type definitions',
      'interfaces': 'Interface definitions',
      'helpers': 'Helper functions'
    };

    return purposes[folderName.toLowerCase()] || 'Application code';
  }

  /**
   * Generate PROJECT_INDEX.md content
   */
  async generateProjectIndex(
    workspaceRoot: string,
    folderStructure: Map<string, number>,
    dependencyGraph: string
  ): Promise<string> {
    const projectName = path.basename(workspaceRoot);

    // Build directory tree
    const tree = this.buildDirectoryTree(folderStructure);

    return `# ${projectName} - Project Index

## 📖 Project Overview

Auto-generated project index maintained by the Fractal Multi-level Index System.

## 📁 Directory Structure

\`\`\`
${tree}
\`\`\`

## 🔗 Dependency Graph

\`\`\`mermaid
${dependencyGraph}
\`\`\`

## 📊 Statistics

- Total folders: ${folderStructure.size}
- Total files: ${Array.from(folderStructure.values()).reduce((a, b) => a + b, 0)}

---

🔄 **Self-reference**: When project structure changes, update this index

🎼 Generated by [Project Multilevel Index](https://github.com/Claudate/project-multilevel-index)
`;
  }

  /**
   * Build directory tree visualization
   */
  private buildDirectoryTree(folderStructure: Map<string, number>): string {
    const lines: string[] = [];

    for (const [folder, fileCount] of Array.from(folderStructure.entries()).sort()) {
      const depth = folder.split(/[/\\]/).length - 1;
      const indent = '  '.repeat(depth);
      const folderName = path.basename(folder);
      lines.push(`${indent}├── ${folderName}/ (${fileCount} files)`);
    }

    return lines.join('\n');
  }

  /**
   * Generate Mermaid dependency graph
   */
  async generateDependencyGraph(
    files: Array<{ filePath: string; analysis: FileAnalysis }>,
    maxNodes: number = 50
  ): Promise<string> {
    const nodes: Set<string> = new Set();
    const edges: Set<string> = new Set();

    // Limit number of files to prevent huge graphs
    const limitedFiles = files.slice(0, maxNodes);

    for (const { filePath, analysis } of limitedFiles) {
      const fileName = path.basename(filePath, path.extname(filePath));
      const nodeId = this.sanitizeNodeId(fileName);

      nodes.add(`  ${nodeId}[${fileName}]`);

      // Add edges for dependencies
      for (const dep of analysis.inputs.slice(0, 3)) {  // Limit dependencies
        const depName = this.extractModuleName(dep);
        if (depName && depName !== fileName) {
          const depId = this.sanitizeNodeId(depName);
          edges.add(`  ${nodeId} --> ${depId}`);
        }
      }
    }

    if (nodes.size === 0) {
      return 'graph TD\n  Empty[No files to display]';
    }

    return `graph TD\n${Array.from(nodes).join('\n')}\n${Array.from(edges).join('\n')}`;
  }

  /**
   * Sanitize node ID for Mermaid
   */
  private sanitizeNodeId(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  /**
   * Extract module name from import path
   */
  private extractModuleName(importPath: string): string | null {
    // Remove file extensions
    const withoutExt = importPath.replace(/\.(ts|tsx|js|jsx|py|java|rs|go)$/, '');

    // Get last part of path
    const parts = withoutExt.split(/[/\\]/);
    return parts[parts.length - 1] || null;
  }
}
