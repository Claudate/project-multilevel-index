# 平台支持详细说明 (Platform Support)

[简体中文](#简体中文) | [English](#english)

---

## 简体中文

### 概览

项目多级索引系统提供多种部署方式，适应不同的开发场景：

| 平台 | 自动化程度 | 适用场景 | 状态 |
|------|-----------|---------|------|
| **CLI 工具 (codex)** | 手动命令 | CI/CD, 批量处理 | ✅ 已发布 |
| **Claude Code** | 完全自动 (Hook) | Claude Code 开发 | ✅ 已发布 |
| **VSCode Extension** | 完全自动 (FileSystemWatcher) | VSCode 系编辑器 | 🚧 开发中 |
| **规则文件方案** | 半自动 (提醒 AI) | Cursor/Windsurf/Kiro | ✅ 可用 |

---

## 1. CLI 工具 - codex (✅ 已发布)

### 概述

**独立命令行工具** - 不依赖任何编辑器，适用于任何项目和 CI/CD 环境。

### 特点

- ✅ **多语言支持**: 10+ 编程语言 (JS/TS/Python/Java/Rust/Go...)
- ✅ **智能分析**: 使用 Babel AST 分析 JS/TS，其他语言使用正则表达式
- ✅ **完整生成**: 文件头注释 + FOLDER_INDEX.md + PROJECT_INDEX.md + Mermaid 依赖图
- ✅ **用户友好**: 彩色输出、进度条、清晰的错误提示
- ✅ **CI/CD 就绪**: 可集成到自动化流程中

### 安装

```bash
# 1. 克隆仓库
git clone https://github.com/Claudate/project-multilevel-index.git
cd project-multilevel-index/cli

# 2. 安装依赖并编译
npm install && npm run build

# 3. 全局链接
npm link

# 4. 验证安装
codex --help
```

### 使用

```bash
# 初始化索引系统
cd /your/project
codex init

# 自定义选项
codex init --max-depth 5 --max-nodes 30
```

### 输出示例

```
🎼 Fractal Multi-level Index System

Project root: /your/project

✔ Found 45 code files
✔ Analyzed 45 files
✔ Generated 45 file headers
✔ Generated 8 folder indexes
✔ Generated PROJECT_INDEX.md

✅ Index system initialized successfully!

📖 View the project index at: /your/project/PROJECT_INDEX.md
```

### 工作原理

1. **扫描项目**: 递归扫描项目目录，收集所有代码文件
2. **分析代码**: 使用 AST 或正则表达式分析依赖关系
3. **生成索引**: 创建文件头注释、文件夹索引和项目索引
4. **可视化**: 生成 Mermaid 依赖关系图

### 相关文档

- [CLI README](cli/README.md) - 完整使用指南
- [CLI 实现说明](CLI_IMPLEMENTATION.md) - 技术细节

---

## 2. Claude Code 插件 (✅ 已发布)

### 概述

**完整自动化支持** - 通过 Hook 系统实现真正的自动化索引更新。

### 特点

- ✅ **自动更新**: 通过 PostToolUse Hook 自动检测文件变化
- ✅ **结构性变更检测**: 智能识别 import/export 等关键变更
- ✅ **级联更新**: 自动更新文件头、FOLDER_INDEX 和 PROJECT_INDEX
- ✅ **零配置**: 开箱即用，无需额外设置

### 安装

#### 方法 1: 从市场安装（推荐）

```bash
/plugin marketplace add Claudate/project-multilevel-index
/plugin install project-multilevel-index
```

#### 方法 2: 手动安装（开发者）

```bash
git clone https://github.com/Claudate/project-multilevel-index.git
cd project-multilevel-index

# Windows (PowerShell)
Copy-Item -Path . -Destination "$env:USERPROFILE\.claude\plugins\project-multilevel-index" -Recurse

# macOS/Linux
cp -r . ~/.claude/plugins/project-multilevel-index
```

### 使用

```bash
# 初始化索引
/project-multilevel-index:init-index

# 手动更新
/project-multilevel-index:update-index

# 一致性检查
/project-multilevel-index:check-index

# 切换语言
/project-multilevel-index:set-language
```

### 自动更新流程

```
用户修改文件
    ↓
PostToolUse Hook 触发
    ↓
SKILL.md 中的逻辑判断
    ↓
是否为代码文件？→ 否 → 跳过
    ↓ 是
是否为索引文件？→ 是 → 跳过（防止循环）
    ↓ 否
是否为结构性变更？→ 否 → 跳过
    ↓ 是
执行级联更新
    ├─ 更新文件头注释
    ├─ 更新 FOLDER_INDEX.md
    └─ 更新 PROJECT_INDEX.md
```

### 智能判断逻辑

| 变更内容 | 是否更新 |
|---------|---------|
| 新增/删除 import | ✅ 是 |
| 修改函数签名 | ✅ 是 |
| 新增/删除 export | ✅ 是 |
| 函数内部实现 | ❌ 否 |
| 注释修改 | ❌ 否（除文件头） |
| 格式化代码 | ❌ 否 |

### 相关文档

- [INSTALL_GUIDE.md](INSTALL_GUIDE.md) - 详细安装指南
- [QUICKSTART.md](QUICKSTART.md) - 5分钟快速上手

---

## 3. VSCode 扩展 (🚧 开发中)

### 概述

**完全自动化扩展** - 使用 FileSystemWatcher 监听文件变化，真正的全平台自动化。

### 支持平台

- ✅ **VSCode**: 原生支持
- ✅ **Cursor**: 完全兼容 VSCode 扩展
- ✅ **Windsurf**: 基于 VSCode，支持扩展
- ✅ **Kiro**: 基于 Code OSS，支持 Open VSX 扩展

### 核心特性

- 🔄 **FileSystemWatcher**: 自动监听文件变化
- 🎯 **结构性变更检测**: 智能识别 import/export 关键词
- 🚫 **智能过滤**: 排除 node_modules、.git 等无关文件
- ⚙️ **配置管理**: VSCode settings + 配置文件双重支持
- 📊 **日志系统**: 完整的调试和日志输出

### 安装方式（计划）

```bash
# VSCode Marketplace
ext install project-multilevel-index

# Open VSX Registry (for Kiro)
code --install-extension project-multilevel-index
```

### 工作原理

```
文件系统变化
    ↓
FileSystemWatcher 监听
    ↓
Debounce (防抖动)
    ↓
结构性变更检测
    ↓
调用分析器 (Analyzer)
    ↓
调用生成器 (Generator)
    ↓
调用更新器 (Updater)
    ↓
更新文件头和索引文件
```

### 项目结构

```
vscode-extension/
├── src/
│   ├── extension.ts          # 主入口
│   ├── watcher/              # 文件监听系统
│   │   ├── fileWatcher.ts
│   │   └── changeDetector.ts
│   ├── indexer/              # 索引更新逻辑
│   │   ├── analyzer.ts       # 代码分析
│   │   ├── generator.ts      # 内容生成
│   │   └── updater.ts        # 文件更新
│   └── core/                 # 核心工具
│       ├── config.ts
│       └── logger.ts
├── package.json              # 扩展清单
└── tsconfig.json
```

### 预计发布

📅 **2026-01-10**

### 相关文档

- [VSCODE_EXTENSION_PLAN.md](VSCODE_EXTENSION_PLAN.md) - 技术方案
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - 开发路线图
- [vscode-extension/DEVELOPMENT_STATUS.md](vscode-extension/DEVELOPMENT_STATUS.md) - 开发状态

---

## 4. 规则文件方案 (✅ 可用)

### 概述

**半自动化方案** - 适用于 Cursor、Windsurf、Kiro 等不支持 Hook 的 AI 编辑器。

### 支持平台

- 🔧 **Cursor**: 半自动支持（需手动提醒 AI）
- 🔧 **Windsurf**: 半自动支持（需手动提醒 AI）
- 🔧 **Kiro**: 半自动支持（需手动提醒 AI）

### 工作原理

通过在项目中放置规则文件（`.cursorrules`、`.windsurfrules`），AI 会读取这些规则并执行索引更新逻辑。

**用户需要**：
- 手动提醒 AI 执行索引更新
- 或在每次修改后明确要求更新索引

### 安装步骤

#### Cursor 示例

1. 复制规则文件到项目根目录：
   ```bash
   cp examples/cursor-example/.cursorrules /your/project/
   ```

2. 复制 SKILL.md（核心逻辑）：
   ```bash
   mkdir -p /your/project/skills/project-multilevel-index
   cp skills/project-multilevel-index/SKILL.md /your/project/skills/project-multilevel-index/
   ```

3. 使用 Cursor AI 执行命令：
   ```
   请初始化项目索引系统
   ```

#### Windsurf 示例

类似步骤，使用 `.windsurfrules` 文件。

#### Kiro 示例

类似步骤，使用 `.kirorules` 或 `.cursorrules` 文件（Kiro 兼容 Cursor 规则）。

### 完整示例项目

我们提供了三个平台的完整示例项目：

- **[Cursor 示例](examples/cursor-example/)** - 完整的 TypeScript 项目示例
- **[Windsurf 示例](examples/windsurf-example/)** - Windsurf 配置示例
- **[Kiro 示例](examples/kiro-example/)** - Kiro 配置示例

每个示例都包含：
- ✅ 完整的项目结构（Controllers/Services/Models/Utils）
- ✅ 配置好的规则文件
- ✅ 已生成的索引文件（PROJECT_INDEX、FOLDER_INDEX、文件头注释）
- ✅ 详细的 README 和使用说明

### 限制

- ❌ **非自动**: 需要用户手动提醒 AI 更新索引
- ❌ **无 Hook 支持**: 无法自动检测文件变化
- ✅ **可用性**: 仍然可以正常使用核心功能

---

## 平台选择建议

### 如果你使用 Claude Code
→ **使用 Claude Code 插件**（完全自动化，最佳体验）

### 如果你需要 CI/CD 集成
→ **使用 CLI 工具 codex**（独立运行，适合自动化流程）

### 如果你使用 VSCode/Cursor/Windsurf/Kiro
→ **等待 VSCode Extension**（2026-01-10 发布）
→ 或 **使用规则文件方案**（过渡期临时方案）

### 如果你需要批量处理多个项目
→ **使用 CLI 工具 codex**（最快速、最可靠）

---

## 相关文档

- [CLI README](cli/README.md) - CLI 工具完整指南
- [CLI_IMPLEMENTATION.md](CLI_IMPLEMENTATION.md) - CLI 实现细节
- [VSCODE_EXTENSION_PLAN.md](VSCODE_EXTENSION_PLAN.md) - VSCode 扩展技术方案
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - 整体开发路线图
- [examples/](examples/) - 各平台示例项目

---

## English

### Overview

The Project Multi-level Index System provides multiple deployment options for different development scenarios:

| Platform | Automation Level | Use Case | Status |
|----------|-----------------|----------|--------|
| **CLI Tool (codex)** | Manual command | CI/CD, batch processing | ✅ Released |
| **Claude Code** | Full Auto (Hook) | Claude Code development | ✅ Released |
| **VSCode Extension** | Full Auto (FileSystemWatcher) | VSCode-based editors | 🚧 In Development |
| **Rules-based** | Semi-Auto (prompt AI) | Cursor/Windsurf/Kiro | ✅ Available |

---

## 1. CLI Tool - codex (✅ Released)

### Overview

**Standalone command-line tool** - Works independently of any editor, perfect for projects and CI/CD.

### Features

- ✅ **10+ Languages**: JavaScript/TypeScript, Python, Java, Rust, Go, etc.
- ✅ **Smart Analysis**: Babel AST for JS/TS, regex for other languages
- ✅ **Complete Generation**: File headers + FOLDER_INDEX.md + PROJECT_INDEX.md + Mermaid graph
- ✅ **User-Friendly**: Colorful output, progress bars, clear error messages
- ✅ **CI/CD Ready**: Easy integration into automation workflows

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Claudate/project-multilevel-index.git
cd project-multilevel-index/cli

# 2. Install dependencies and build
npm install && npm run build

# 3. Link globally
npm link

# 4. Verify installation
codex --help
```

### Usage

```bash
# Initialize index system
cd /your/project
codex init

# Custom options
codex init --max-depth 5 --max-nodes 30
```

### Documentation

- [CLI README](cli/README.md) - Full usage guide
- [CLI Implementation](CLI_IMPLEMENTATION.md) - Technical details

---

## 2. Claude Code Plugin (✅ Released)

### Overview

**Full automation support** - True automatic index updates via Hook system.

### Features

- ✅ **Auto-Update**: Automatic file change detection via PostToolUse Hook
- ✅ **Structural Change Detection**: Smart recognition of import/export changes
- ✅ **Cascade Updates**: Auto-update file headers, FOLDER_INDEX, and PROJECT_INDEX
- ✅ **Zero Config**: Works out of the box

### Installation

#### Method 1: From Marketplace (Recommended)

```bash
/plugin marketplace add Claudate/project-multilevel-index
/plugin install project-multilevel-index
```

#### Method 2: Manual Installation (Developers)

```bash
git clone https://github.com/Claudate/project-multilevel-index.git
cd project-multilevel-index

# Windows (PowerShell)
Copy-Item -Path . -Destination "$env:USERPROFILE\.claude\plugins\project-multilevel-index" -Recurse

# macOS/Linux
cp -r . ~/.claude/plugins/project-multilevel-index
```

### Documentation

- [INSTALL_GUIDE.md](INSTALL_GUIDE.md) - Detailed installation guide
- [QUICKSTART.md](QUICKSTART.md) - 5-minute quick start

---

## 3. VSCode Extension (🚧 In Development)

### Overview

**Full automation extension** - Uses FileSystemWatcher to monitor file changes, true cross-platform automation.

### Supported Platforms

- ✅ **VSCode**: Native support
- ✅ **Cursor**: Fully compatible with VSCode extensions
- ✅ **Windsurf**: Based on VSCode, supports extensions
- ✅ **Kiro**: Based on Code OSS, supports Open VSX extensions

### Expected Release

📅 **2026-01-10**

### Documentation

- [VSCODE_EXTENSION_PLAN.md](VSCODE_EXTENSION_PLAN.md) - Technical design
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Development roadmap
- [vscode-extension/DEVELOPMENT_STATUS.md](vscode-extension/DEVELOPMENT_STATUS.md) - Development status

---

## 4. Rules-based Approach (✅ Available)

### Overview

**Semi-automatic solution** - For AI editors without Hook support (Cursor, Windsurf, Kiro).

### Supported Platforms

- 🔧 **Cursor**: Semi-automatic (manual AI prompting required)
- 🔧 **Windsurf**: Semi-automatic (manual AI prompting required)
- 🔧 **Kiro**: Semi-automatic (manual AI prompting required)

### Complete Example Projects

We provide complete example projects for three platforms:

- **[Cursor Example](examples/cursor-example/)** - Full TypeScript project example
- **[Windsurf Example](examples/windsurf-example/)** - Windsurf configuration example
- **[Kiro Example](examples/kiro-example/)** - Kiro configuration example

Each example includes:
- ✅ Complete project structure (Controllers/Services/Models/Utils)
- ✅ Pre-configured rule files
- ✅ Generated index files (PROJECT_INDEX, FOLDER_INDEX, file headers)
- ✅ Detailed README and usage instructions

---

## Platform Selection Guide

### If you use Claude Code
→ **Use Claude Code Plugin** (Full automation, best experience)

### If you need CI/CD integration
→ **Use CLI Tool codex** (Standalone, perfect for automation)

### If you use VSCode/Cursor/Windsurf/Kiro
→ **Wait for VSCode Extension** (Release: 2026-01-10)
→ Or **Use Rules-based Approach** (Temporary solution)

### If you need batch processing
→ **Use CLI Tool codex** (Fastest, most reliable)

---

## Related Documentation

- [CLI README](cli/README.md) - CLI tool complete guide
- [CLI_IMPLEMENTATION.md](CLI_IMPLEMENTATION.md) - CLI implementation details
- [VSCODE_EXTENSION_PLAN.md](VSCODE_EXTENSION_PLAN.md) - VSCode extension technical design
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Overall development roadmap
- [examples/](examples/) - Platform example projects
