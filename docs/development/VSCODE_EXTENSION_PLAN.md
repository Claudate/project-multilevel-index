# VSCode Extension Plan: 全自动索引维护

## 📋 文档信息

**创建日期**: 2025-12-24
**版本**: 1.0.0
**目标**: 为 Cursor/Windsurf/Kiro/VSCode 实现真正的全自动化索引维护
**状态**: 规划阶段

---

## 🎯 目标概述

### 当前问题

| 平台 | 当前状态 | 问题 |
|------|---------|------|
| **Claude Code** | ✅ 全自动 | 通过 Hook 系统完美运行 |
| **Cursor** | 🔧 半自动 | 需要用户手动提醒 AI 更新索引 |
| **Windsurf** | 🔧 半自动 | 依赖 AI 主动理解规则文件 |
| **Kiro** | 🔧 半自动 | AI 经常忘记执行更新 |

**根本原因**: 这些平台缺少类似 Claude Code 的 Hook 系统,无法自动监听文件变化。

### 解决方案

开发一个 **VSCode 扩展**,利用 VSCode 的 FileSystemWatcher API 实现真正的全自动化:

- **Cursor**: 完全兼容 VSCode 扩展 ✅
- **Windsurf**: 基于 VSCode,支持扩展 ✅
- **Kiro**: 基于 Code OSS,支持 Open VSX 扩展 ✅
- **VSCode**: 原生支持 ✅

**一次开发,四个平台全覆盖!**

---

## 🏗️ 技术架构

### 核心组件

```
┌─────────────────────────────────────────────────────┐
│           VSCode Extension                          │
│   "project-multilevel-index-auto"                   │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────┐        ┌─────▼────┐
   │  File    │        │  Index   │
   │  Watcher │        │  Engine  │
   └────┬─────┘        └─────┬────┘
        │                     │
   ┌────▼──────────────┬──────▼───────────┐
   │ FileSystemWatcher │  Analyzer        │
   │ + Filter          │  + Generator     │
   │ + Change Detector │  + Updater       │
   └───────────────────┴──────────────────┘
```

### 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| **语言** | TypeScript | ^5.0.0 |
| **构建工具** | esbuild | ^0.19.0 |
| **测试框架** | Vitest | ^1.0.0 |
| **VSCode API** | @types/vscode | ^1.85.0 |
| **依赖分析** | @babel/parser | ^7.23.0 |
| **图生成** | mermaid (文本) | - |

---

## 📦 扩展结构

```
project-multilevel-index-vscode/
├── package.json              # 扩展清单
├── tsconfig.json             # TypeScript 配置
├── .vscode/
│   ├── launch.json           # 调试配置
│   └── tasks.json            # 构建任务
├── src/
│   ├── extension.ts          # 扩展入口
│   ├── watcher/
│   │   ├── fileWatcher.ts    # 文件监听器
│   │   ├── filter.ts         # 过滤规则
│   │   └── detector.ts       # 变更检测
│   ├── indexer/
│   │   ├── analyzer.ts       # 依赖分析
│   │   ├── generator.ts      # 索引生成
│   │   └── updater.ts        # 索引更新
│   ├── core/
│   │   ├── config.ts         # 配置管理
│   │   ├── logger.ts         # 日志系统
│   │   └── i18n.ts           # 国际化
│   └── utils/
│       ├── fileUtils.ts      # 文件工具
│       └── patterns.ts       # 正则模式
├── templates/                # 文件头模板
│   ├── javascript.hbs
│   ├── python.hbs
│   └── ...
├── locales/                  # 语言文件
│   ├── zh-CN.json
│   └── en-US.json
├── test/
│   ├── suite/
│   │   ├── watcher.test.ts
│   │   ├── analyzer.test.ts
│   │   └── generator.test.ts
│   └── fixtures/             # 测试用例
└── README.md
```

---

## 🔧 核心功能设计

### 1. 文件监听器 (File Watcher)

#### 功能描述
监听项目中所有代码文件的变化,自动触发索引更新。

#### 实现细节

```typescript
// src/watcher/fileWatcher.ts

import * as vscode from 'vscode';
import { Filter } from './filter';
import { ChangeDetector } from './detector';

export class FileWatcher {
  private watcher: vscode.FileSystemWatcher;
  private filter: Filter;
  private detector: ChangeDetector;

  constructor(
    private workspaceRoot: string,
    private onStructuralChange: (uri: vscode.Uri) => Promise<void>
  ) {
    this.filter = new Filter(workspaceRoot);
    this.detector = new ChangeDetector();
    this.setupWatcher();
  }

  private setupWatcher(): void {
    // 监听所有代码文件
    const pattern = '**/*.{ts,tsx,js,jsx,py,java,kt,rs,go,cpp,c,h,php,rb,swift,cs}';
    this.watcher = vscode.workspace.createFileSystemWatcher(pattern);

    // 文件修改事件
    this.watcher.onDidChange(async (uri) => {
      await this.handleChange(uri, 'modified');
    });

    // 文件创建事件
    this.watcher.onDidCreate(async (uri) => {
      await this.handleChange(uri, 'created');
    });

    // 文件删除事件
    this.watcher.onDidDelete(async (uri) => {
      await this.handleChange(uri, 'deleted');
    });
  }

  private async handleChange(
    uri: vscode.Uri,
    changeType: 'modified' | 'created' | 'deleted'
  ): Promise<void> {
    // 1. 应用过滤规则
    if (this.filter.shouldSkip(uri)) {
      return;
    }

    // 2. 检测是否为结构性变更
    const isStructural = await this.detector.isStructuralChange(uri, changeType);
    if (!isStructural) {
      return;
    }

    // 3. 触发索引更新
    await this.onStructuralChange(uri);
  }

  dispose(): void {
    this.watcher.dispose();
  }
}
```

#### 过滤规则

```typescript
// src/watcher/filter.ts

export class Filter {
  private excludePatterns: string[];

  constructor(private workspaceRoot: string) {
    this.loadConfig();
  }

  shouldSkip(uri: vscode.Uri): boolean {
    const path = uri.fsPath;

    // 1. 跳过索引文件本身
    if (path.includes('PROJECT_INDEX.md') || path.includes('FOLDER_INDEX.md')) {
      return true;
    }

    // 2. 跳过排除目录
    const excludeDirs = [
      'node_modules', '.git', 'dist', 'build', '.next',
      'target', 'vendor', '__pycache__', '.cache',
      'coverage', '.turbo', '.venv', 'venv',
      'pnpm-store', '.yarn'
    ];

    if (excludeDirs.some(dir => path.includes(dir))) {
      return true;
    }

    // 3. 检查文件大小 (>500KB 跳过)
    const stats = fs.statSync(path);
    if (stats.size > 500 * 1024) {
      return true;
    }

    return false;
  }

  private loadConfig(): void {
    // 从 .claude/index-config.json 读取自定义规则
    // ...
  }
}
```

#### 变更检测

```typescript
// src/watcher/detector.ts

export class ChangeDetector {
  async isStructuralChange(
    uri: vscode.Uri,
    changeType: 'modified' | 'created' | 'deleted'
  ): Promise<boolean> {
    // 新建和删除文件总是结构性变更
    if (changeType === 'created' || changeType === 'deleted') {
      return true;
    }

    // 修改文件时检测内容
    const content = await vscode.workspace.fs.readFile(uri);
    const text = content.toString();

    return this.hasStructuralKeywords(text);
  }

  private hasStructuralKeywords(content: string): boolean {
    // 依赖关键字
    const dependencyPatterns = [
      /\bimport\s+/,
      /\brequire\s*\(/,
      /\bfrom\s+['"]/,
      /\buse\s+/,
      /^#include\s+/m,
      /\busing\s+/
    ];

    // 导出关键字
    const exportPatterns = [
      /\bexport\s+(default|const|function|class|interface)/,
      /\bpublic\s+(class|interface|function|fn)/,
      /\bclass\s+\w+/,
      /\binterface\s+\w+/,
      /\bfunction\s+\w+/,
      /\bdef\s+\w+/,
      /\bfn\s+\w+/,
      /\basync\s+(function|fn)/,
      /\bstruct\s+\w+/
    ];

    const allPatterns = [...dependencyPatterns, ...exportPatterns];
    return allPatterns.some(pattern => pattern.test(content));
  }
}
```

---

### 2. 索引引擎 (Index Engine)

#### 依赖分析器

```typescript
// src/indexer/analyzer.ts

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export interface FileAnalysis {
  inputs: string[];      // 依赖列表
  outputs: string[];     // 导出列表
  position: string;      // 系统定位
}

export class Analyzer {
  async analyzeFile(uri: vscode.Uri): Promise<FileAnalysis> {
    const content = await vscode.workspace.fs.readFile(uri);
    const text = content.toString();
    const ext = path.extname(uri.fsPath);

    switch (ext) {
      case '.ts':
      case '.tsx':
      case '.js':
      case '.jsx':
        return this.analyzeJavaScript(text);
      case '.py':
        return this.analyzePython(text);
      // ... 其他语言
      default:
        return this.analyzeGeneric(text);
    }
  }

  private analyzeJavaScript(code: string): FileAnalysis {
    const inputs: string[] = [];
    const outputs: string[] = [];

    // 使用 Babel 解析 AST
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    traverse(ast, {
      ImportDeclaration(path) {
        inputs.push(path.node.source.value);
      },
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          // export const/function/class ...
          const declaration = path.node.declaration;
          if (declaration.type === 'FunctionDeclaration' && declaration.id) {
            outputs.push(declaration.id.name);
          }
          // 其他导出类型...
        }
      },
      ExportDefaultDeclaration(path) {
        outputs.push('default');
      }
    });

    return {
      inputs,
      outputs,
      position: this.inferPosition(uri.fsPath)
    };
  }

  private inferPosition(filePath: string): string {
    // 根据路径推断系统定位
    if (filePath.includes('/controllers/')) {
      return 'API Layer - HTTP request handler';
    } else if (filePath.includes('/services/')) {
      return 'Service Layer - Business logic';
    } else if (filePath.includes('/models/')) {
      return 'Data Layer - Data model';
    } else if (filePath.includes('/utils/')) {
      return 'Utility Layer - Helper functions';
    }
    return 'Application code';
  }
}
```

#### 索引生成器

```typescript
// src/indexer/generator.ts

export class Generator {
  async generateFileHeader(
    uri: vscode.Uri,
    analysis: FileAnalysis
  ): Promise<string> {
    const ext = path.extname(uri.fsPath);
    const template = this.getTemplate(ext);

    return template
      .replace('{{inputs}}', analysis.inputs.join(', '))
      .replace('{{outputs}}', analysis.outputs.join(', '))
      .replace('{{position}}', analysis.position);
  }

  async generateFolderIndex(
    folderPath: string,
    files: vscode.Uri[]
  ): Promise<string> {
    const folderName = path.basename(folderPath);
    const fileList = files.map(f => {
      const name = path.basename(f.fsPath);
      const desc = '...'; // 从文件头提取
      return `- \`${name}\` - ${desc}`;
    }).join('\n');

    return `## 📁 ${folderName}/

**架构说明**:
- [待补充]

**文件清单**:
${fileList}

🔄 **自指**: 当此文件夹中的文件变化时,更新本索引和 PROJECT_INDEX.md
`;
  }

  async generateProjectIndex(
    workspaceRoot: string,
    allFiles: vscode.Uri[]
  ): Promise<string> {
    // 生成目录树
    const tree = this.buildDirectoryTree(workspaceRoot, allFiles);

    // 生成依赖图
    const graph = await this.buildDependencyGraph(allFiles);

    return `# 项目索引

## 项目概览
...

## 目录结构
\`\`\`
${tree}
\`\`\`

## 依赖关系图
\`\`\`mermaid
${graph}
\`\`\`

🔄 **自指**: 当项目结构变化时,更新本索引
`;
  }

  private async buildDependencyGraph(files: vscode.Uri[]): Promise<string> {
    // 分析所有文件的依赖关系
    // 生成 Mermaid 图代码
    return 'graph TD\n  A --> B\n  B --> C';
  }
}
```

#### 索引更新器

```typescript
// src/indexer/updater.ts

export class Updater {
  async updateAll(uri: vscode.Uri): Promise<void> {
    // 1. 更新文件头
    await this.updateFileHeader(uri);

    // 2. 更新文件夹索引
    const folderUri = vscode.Uri.file(path.dirname(uri.fsPath));
    await this.updateFolderIndex(folderUri);

    // 3. 更新项目索引
    await this.updateProjectIndex();

    // 4. 显示提示
    this.showNotification(uri);
  }

  private async updateFileHeader(uri: vscode.Uri): Promise<void> {
    const analyzer = new Analyzer();
    const generator = new Generator();

    const analysis = await analyzer.analyzeFile(uri);
    const header = await generator.generateFileHeader(uri, analysis);

    // 读取现有内容
    const content = await vscode.workspace.fs.readFile(uri);
    const text = content.toString();

    // 替换或插入文件头
    const newText = this.replaceOrInsertHeader(text, header);

    // 写回文件
    await vscode.workspace.fs.writeFile(
      uri,
      Buffer.from(newText, 'utf8')
    );
  }

  private replaceOrInsertHeader(content: string, header: string): string {
    // 检测现有文件头
    const headerRegex = /^\/\*\*[\s\S]*?\*\//;
    if (headerRegex.test(content)) {
      return content.replace(headerRegex, header);
    } else {
      return header + '\n\n' + content;
    }
  }

  private showNotification(uri: vscode.Uri): void {
    const fileName = path.basename(uri.fsPath);
    vscode.window.showInformationMessage(
      `索引已更新: ${fileName}`,
      { detail: '文件头、FOLDER_INDEX、PROJECT_INDEX 已同步' }
    );
  }
}
```

---

### 3. 配置管理

```typescript
// src/core/config.ts

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
        '**/build/**'
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

  static async load(workspaceRoot: string): Promise<IndexConfig> {
    const configPath = path.join(workspaceRoot, '.claude', 'index-config.json');

    try {
      const content = await fs.promises.readFile(configPath, 'utf8');
      const userConfig = JSON.parse(content);
      return { ...this.DEFAULT_CONFIG, ...userConfig };
    } catch {
      return this.DEFAULT_CONFIG;
    }
  }

  static async save(workspaceRoot: string, config: IndexConfig): Promise<void> {
    const configPath = path.join(workspaceRoot, '.claude', 'index-config.json');
    await fs.promises.mkdir(path.dirname(configPath), { recursive: true });
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
  }
}
```

---

### 4. 扩展入口

```typescript
// src/extension.ts

import * as vscode from 'vscode';
import { FileWatcher } from './watcher/fileWatcher';
import { Updater } from './indexer/updater';
import { Config } from './core/config';
import { Logger } from './core/logger';

export async function activate(context: vscode.ExtensionContext) {
  const logger = new Logger();
  logger.info('Project Multilevel Index extension is activating...');

  // 获取工作区根目录
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    logger.warn('No workspace folder found');
    return;
  }

  const workspaceRoot = workspaceFolder.uri.fsPath;

  // 加载配置
  const config = await Config.load(workspaceRoot);

  // 创建更新器
  const updater = new Updater();

  // 创建文件监听器
  const watcher = new FileWatcher(
    workspaceRoot,
    async (uri) => {
      if (config.index.autoUpdate) {
        await updater.updateAll(uri);
      }
    }
  );

  // 注册命令
  const initCommand = vscode.commands.registerCommand(
    'project-multilevel-index.init',
    async () => {
      await initializeIndex(workspaceRoot);
    }
  );

  const updateCommand = vscode.commands.registerCommand(
    'project-multilevel-index.update',
    async () => {
      await updateAllIndexes(workspaceRoot);
    }
  );

  const checkCommand = vscode.commands.registerCommand(
    'project-multilevel-index.check',
    async () => {
      await checkIndexConsistency(workspaceRoot);
    }
  );

  // 注册配置监听
  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('projectMultilevelIndex')) {
      logger.info('Configuration changed, reloading...');
      // 重新加载配置
    }
  });

  // 注册清理函数
  context.subscriptions.push(
    watcher,
    initCommand,
    updateCommand,
    checkCommand,
    configWatcher
  );

  logger.info('Project Multilevel Index extension activated successfully');
}

export function deactivate() {
  // 清理资源
}

async function initializeIndex(workspaceRoot: string): Promise<void> {
  // 初始化索引系统
  // ...
}

async function updateAllIndexes(workspaceRoot: string): Promise<void> {
  // 手动更新所有索引
  // ...
}

async function checkIndexConsistency(workspaceRoot: string): Promise<void> {
  // 检查索引一致性
  // ...
}
```

---

## 📄 package.json 配置

```json
{
  "name": "project-multilevel-index",
  "displayName": "Project Multilevel Index",
  "description": "Fractal self-referential documentation system for code projects",
  "version": "1.0.0",
  "publisher": "Claudate",
  "icon": "icon.png",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": [
    "Other",
    "Programming Languages"
  ],
  "keywords": [
    "documentation",
    "index",
    "dependency",
    "architecture",
    "fractal"
  ],
  "activationEvents": [
    "onStartupFinished"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "project-multilevel-index.init",
        "title": "Initialize Index System",
        "category": "Project Index"
      },
      {
        "command": "project-multilevel-index.update",
        "title": "Update All Indexes",
        "category": "Project Index"
      },
      {
        "command": "project-multilevel-index.check",
        "title": "Check Index Consistency",
        "category": "Project Index"
      }
    ],
    "configuration": {
      "title": "Project Multilevel Index",
      "properties": {
        "projectMultilevelIndex.autoUpdate": {
          "type": "boolean",
          "default": true,
          "description": "Automatically update indexes on file changes"
        },
        "projectMultilevelIndex.notifications.enabled": {
          "type": "boolean",
          "default": true,
          "description": "Show notifications when indexes are updated"
        },
        "projectMultilevelIndex.visualization.maxNodes": {
          "type": "number",
          "default": 50,
          "description": "Maximum number of nodes in dependency graph"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run build",
    "build": "esbuild ./src/extension.ts --bundle --outfile=dist/extension.js --external:vscode --format=cjs --platform=node",
    "watch": "npm run build -- --watch",
    "test": "vitest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/vscode": "^1.85.0",
    "esbuild": "^0.19.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  },
  "dependencies": {
    "@babel/parser": "^7.23.0",
    "@babel/traverse": "^7.23.0"
  }
}
```

---

## 🧪 测试策略

### 单元测试

```typescript
// test/suite/detector.test.ts

import { describe, it, expect } from 'vitest';
import { ChangeDetector } from '../../src/watcher/detector';

describe('ChangeDetector', () => {
  const detector = new ChangeDetector();

  it('should detect import statements', () => {
    const code = `import { foo } from './bar';`;
    expect(detector.hasStructuralKeywords(code)).toBe(true);
  });

  it('should detect export statements', () => {
    const code = `export function hello() {}`;
    expect(detector.hasStructuralKeywords(code)).toBe(true);
  });

  it('should ignore implementation changes', () => {
    const code = `function hello() { console.log('world'); }`;
    expect(detector.hasStructuralKeywords(code)).toBe(false);
  });
});
```

### 集成测试

```typescript
// test/suite/integration.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { FileWatcher } from '../../src/watcher/fileWatcher';

describe('FileWatcher Integration', () => {
  let workspaceRoot: string;
  let watcher: FileWatcher;

  beforeEach(async () => {
    workspaceRoot = path.join(__dirname, '../fixtures/test-project');
    // 创建测试文件
    await fs.promises.mkdir(workspaceRoot, { recursive: true });
  });

  afterEach(async () => {
    watcher?.dispose();
    // 清理测试文件
    await fs.promises.rm(workspaceRoot, { recursive: true });
  });

  it('should trigger update on file creation', async () => {
    let triggered = false;

    watcher = new FileWatcher(workspaceRoot, async () => {
      triggered = true;
    });

    // 创建新文件
    const testFile = path.join(workspaceRoot, 'test.ts');
    await fs.promises.writeFile(testFile, 'export const foo = 1;');

    // 等待事件触发
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(triggered).toBe(true);
  });
});
```

---

## 📊 性能优化

### 1. 防抖处理

```typescript
// src/utils/debounce.ts

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// 使用
const debouncedUpdate = debounce(
  async (uri: vscode.Uri) => {
    await updater.updateAll(uri);
  },
  300 // 300ms 防抖
);
```

### 2. 增量更新

```typescript
// 仅更新受影响的部分,避免全量扫描
async updateFileHeader(uri: vscode.Uri): Promise<void> {
  // 只分析和更新单个文件头
  // 不重新扫描整个项目
}
```

### 3. 缓存机制

```typescript
// src/core/cache.ts

export class Cache {
  private fileAnalysisCache: Map<string, FileAnalysis> = new Map();

  set(path: string, analysis: FileAnalysis): void {
    this.fileAnalysisCache.set(path, analysis);
  }

  get(path: string): FileAnalysis | undefined {
    return this.fileAnalysisCache.get(path);
  }

  invalidate(path: string): void {
    this.fileAnalysisCache.delete(path);
  }
}
```

---

## 🌍 国际化支持

### 语言文件

```json
// locales/zh-CN.json
{
  "extension.name": "项目多级索引",
  "commands.init.title": "初始化索引系统",
  "commands.update.title": "更新所有索引",
  "commands.check.title": "检查索引一致性",
  "notifications.updated": "索引已更新: {0}",
  "notifications.error": "索引更新失败: {0}"
}
```

```json
// locales/en-US.json
{
  "extension.name": "Project Multilevel Index",
  "commands.init.title": "Initialize Index System",
  "commands.update.title": "Update All Indexes",
  "commands.check.title": "Check Index Consistency",
  "notifications.updated": "Index updated: {0}",
  "notifications.error": "Failed to update index: {0}"
}
```

---

## 🚀 发布计划

### 阶段 1: MVP 开发 (1-2 天)

- [x] 设计架构
- [ ] 实现文件监听器
- [ ] 实现基础的依赖分析 (TypeScript/JavaScript)
- [ ] 实现文件头生成和更新
- [ ] 基础测试

### 阶段 2: 功能完善 (3-5 天)

- [ ] 支持更多语言 (Python, Java, Rust, Go)
- [ ] 实现 FOLDER_INDEX 生成
- [ ] 实现 PROJECT_INDEX 和依赖图生成
- [ ] 添加配置管理
- [ ] 完整的单元测试

### 阶段 3: 优化和测试 (2-3 天)

- [ ] 性能优化 (防抖、缓存)
- [ ] 集成测试
- [ ] 跨平台测试 (Cursor/Windsurf/Kiro)
- [ ] 文档完善

### 阶段 4: 发布 (1 天)

- [ ] 打包扩展 (.vsix)
- [ ] 发布到 VSCode Marketplace
- [ ] 发布到 Open VSX Registry (Kiro 兼容)
- [ ] 更新项目文档

---

## 📦 发布渠道

### VSCode Marketplace

```bash
# 打包
vsce package

# 发布
vsce publish
```

**优势**:
- Cursor/Windsurf 自动兼容
- 用户基数大
- 官方认证

### Open VSX Registry

```bash
# 发布到 Open VSX (Kiro 使用)
npx ovsx publish project-multilevel-index-1.0.0.vsix -p <token>
```

**优势**:
- Kiro 官方扩展源
- 开源友好
- Eclipse 基金会支持

---

## 🎯 成功指标

| 指标 | 目标 |
|------|------|
| **文件监听延迟** | < 100ms |
| **索引更新时间** | < 500ms (单文件) |
| **内存占用** | < 50MB |
| **CPU 占用** | < 5% (后台) |
| **平台兼容性** | VSCode/Cursor/Windsurf/Kiro 100% |
| **测试覆盖率** | > 80% |

---

## 🔄 与现有系统的关系

```
┌─────────────────────────────────────────────────┐
│         Claude Code Plugin (现有)                │
│         + Hook 系统                              │
│         ✅ 完全自动化                            │
└─────────────────────────────────────────────────┘
                     ▲
                     │
                     │ 共享核心逻辑
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         VSCode Extension (新增)                  │
│         + FileSystemWatcher API                 │
│         ✅ 完全自动化                            │
│         ✅ Cursor/Windsurf/Kiro/VSCode 全覆盖    │
└─────────────────────────────────────────────────┘
```

**设计原则**:
- 核心分析逻辑与 Claude Code 插件保持一致
- 可以直接复用 `universal/core/` 下的逻辑
- 扩展作为独立发布,不影响现有 Claude Code 插件

---

## ⚠️ 风险和挑战

### 技术风险

| 风险 | 缓解措施 |
|------|---------|
| **性能问题** (大型项目) | 增量更新 + 防抖 + 缓存 |
| **AST 解析失败** (语法错误) | 降级到正则匹配 |
| **平台兼容性问题** | 充分测试,提供降级方案 |
| **内存泄漏** | 及时清理 watcher,限制缓存大小 |

### 用户体验风险

| 风险 | 缓解措施 |
|------|---------|
| **通知过多** | 可配置通知级别,仅重大变更提示 |
| **自动更新冲突** | 检测文件是否被其他进程修改 |
| **学习成本** | 详细文档 + 示例项目 |

---

## 📚 参考资料

### VSCode API 文档
- [FileSystemWatcher API](https://code.visualstudio.com/api/references/vscode-api#FileSystemWatcher)
- [Extension Activation](https://code.visualstudio.com/api/references/activation-events)
- [Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### 平台文档
- [Cursor Extension Support](https://forum.cursor.com/t/support-for-remote-wsl-filewatcher-polling/133140)
- [Windsurf Editor](https://windsurf.com/editor)
- [Kiro IDE](https://kiro.dev/)

### 相关项目
- [fractal-docs](https://github.com/wordflowlab/fractal-docs) - 类似项目(规则文件方案)

---

## 📞 联系和反馈

开发过程中如有问题,请提交 Issue:
- GitHub: https://github.com/Claudate/project-multilevel-index/issues

---

**下一步**: 创建 [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) 详细实施路线图
