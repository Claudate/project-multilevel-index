/**
 * Input: vscode, fs/promises, path
 * Output: IndexConfig, Config
 * Pos: Core - Fundamental logic
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface IndexConfig {
  exclude: {
    patterns: string[];
    useGitignore: boolean;
  };
  index: {
    autoUpdate: boolean;
    maxDepth: number;
    minFilesForFolder: number;
  };
  visualization: {
    maxNodes: number;
    groupByFolder: boolean;
    showLabels: boolean;
  };
  notifications: {
    enabled: boolean;
    showOnMinorChange: boolean;
  };
}

export class Config {
  private static readonly DEFAULT_CONFIG: IndexConfig = {
    exclude: {
      patterns: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/target/**',
        '**/vendor/**',
        '**/__pycache__/**',
        '**/.cache/**',
        '**/coverage/**'
      ],
      useGitignore: true
    },
    index: {
      autoUpdate: true,
      maxDepth: 5,
      minFilesForFolder: 2
    },
    visualization: {
      maxNodes: 50,
      groupByFolder: true,
      showLabels: true
    },
    notifications: {
      enabled: true,
      showOnMinorChange: false
    }
  };

  /**
   * Load configuration from workspace settings and config file
   */
  static async load(workspaceRoot: string): Promise<IndexConfig> {
    // Start with default config
    let config = { ...this.DEFAULT_CONFIG };

    // Try to load from config file
    try {
      const configPath = path.join(workspaceRoot, '.claude', 'index-config.json');
      const content = await fs.readFile(configPath, 'utf8');
      const fileConfig = JSON.parse(content);
      config = this.mergeConfig(config, fileConfig);
    } catch (error) {
      // Config file doesn't exist or is invalid, use defaults
    }

    // Merge with VSCode workspace settings
    const vscodeConfig = vscode.workspace.getConfiguration('projectMultilevelIndex');

    if (vscodeConfig.has('autoUpdate')) {
      config.index.autoUpdate = vscodeConfig.get<boolean>('autoUpdate', true);
    }

    if (vscodeConfig.has('exclude.patterns')) {
      config.exclude.patterns = vscodeConfig.get<string[]>('exclude.patterns', config.exclude.patterns);
    }

    if (vscodeConfig.has('exclude.useGitignore')) {
      config.exclude.useGitignore = vscodeConfig.get<boolean>('exclude.useGitignore', true);
    }

    if (vscodeConfig.has('visualization.maxNodes')) {
      config.visualization.maxNodes = vscodeConfig.get<number>('visualization.maxNodes', 50);
    }

    if (vscodeConfig.has('notifications.enabled')) {
      config.notifications.enabled = vscodeConfig.get<boolean>('notifications.enabled', true);
    }

    return config;
  }

  /**
   * Save configuration to file
   */
  static async save(workspaceRoot: string, config: IndexConfig): Promise<void> {
    const configPath = path.join(workspaceRoot, '.claude', 'index-config.json');
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Merge two configurations (deep merge)
   */
  private static mergeConfig(base: IndexConfig, override: Partial<IndexConfig>): IndexConfig {
    return {
      exclude: { ...base.exclude, ...override.exclude },
      index: { ...base.index, ...override.index },
      visualization: { ...base.visualization, ...override.visualization },
      notifications: { ...base.notifications, ...override.notifications }
    };
  }
}
