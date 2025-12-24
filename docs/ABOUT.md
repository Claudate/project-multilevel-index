# 关于分形多级索引系统

## 🎯 这是什么?

**分形多级索引系统 (Fractal Multi-level Index System)** 是一个代码文档自动化系统,可在多个 AI 编辑器平台使用。

### 核心定位

这**不是**一个纯粹的 Claude Code 插件,而是:

- ✅ 一个**跨平台的代码文档自动化系统**
- ✅ 一套**平台无关的核心架构** ([universal/](universal/))
- ✅ 多个**平台适配器**的集合

---

## 🏗️ 架构设计

```
分形多级索引系统
├── Universal 核心 (平台无关)
│   ├── 核心概念和算法
│   ├── 依赖分析器
│   ├── 索引生成器
│   └── 国际化系统
│
└── 平台适配器 (多平台支持)
    ├── Claude Code 适配器 (完整自动化)
    ├── Cursor 适配器 (半自动化)
    ├── Windsurf 适配器 (半自动化)
    ├── Kiro 适配器 (半自动化)
    └── VSCode 适配器 (计划中)
```

---

## 🌐 平台支持

### 主平台: Claude Code

**状态**: ✅ 完整支持 (v1.0+)

**特点**:
- 🔧 通过 **Plugin 系统**安装
- 🪝 通过 **Hook 系统**自动触发更新
- 📝 通过 **Skill 系统**提供命令
- ⚡ **完全自动化**,无需手动干预

**安装方式**:
```bash
/plugin marketplace add Claudate/project-multilevel-index
/plugin install project-multilevel-index
```

**适用场景**: 主要开发平台,提供最佳体验

---

### 实验性平台: Cursor/Windsurf/Kiro

**状态**: 🔧 实验性支持 (v2.0+)

**特点**:
- 📁 通过**规则文件**配置 (`.cursor/rules/`, `.windsurf/rules/`, `.kiro/rules/`)
- 🤖 依赖 **AI 主动理解**规则
- 👤 需要**用户手动提醒** AI 执行更新
- ⚡ **半自动化**,AI 理解力决定效果

**安装方式**:
1. 复制对应平台的配置文件
2. 在 AI Chat 中提醒遵守规则
3. 手动触发索引更新

**示例项目**:
- [examples/cursor-example/](examples/cursor-example/) - Cursor 完整示例
- [examples/windsurf-example/](examples/windsurf-example/) - Windsurf 示例
- [examples/kiro-example/](examples/kiro-example/) - Kiro 示例

**适用场景**: 无法使用 Claude Code 的用户,接受手动操作

---

### 计划支持: VSCode

**状态**: ⏳ 计划中 (v2.1)

**方式**: VSCode 扩展

**特点**:
- 通过 Language Server Protocol (LSP) 实现
- 可能与 Cursor 兼容 (Cursor 基于 VSCode)

---

## 🔄 自动化程度对比

| 平台 | 自动化级别 | 安装方式 | 触发机制 | 用户操作 |
|------|----------|---------|---------|---------|
| **Claude Code** | ⭐⭐⭐⭐⭐ 完全自动 | Plugin | Hook 系统 | 无需操作 |
| **Cursor** | ⭐⭐⭐ 半自动 | 配置文件 | AI 理解 | 需提醒 AI |
| **Windsurf** | ⭐⭐⭐ 半自动 | 配置文件 | AI 理解 | 需提醒 AI |
| **Kiro** | ⭐⭐⭐ 半自动 | 配置文件 | AI 理解 | 需提醒 AI |
| **VSCode** | ⏳ 计划中 | Extension | LSP | - |

---

## 📦 项目结构

### 核心组件

```
project-multilevel-index/
├── universal/                    # 通用核心 (平台无关)
│   ├── core/                    # 核心算法和逻辑
│   │   ├── concepts.md          # 核心概念
│   │   ├── analyzer/            # 代码分析器
│   │   └── generator/           # 索引生成器
│   └── adapters/                # 平台适配器
│       ├── claude-code/         # Claude Code 适配
│       ├── cursor/              # Cursor 适配
│       ├── windsurf/            # Windsurf 适配
│       └── kiro/                # Kiro 适配
```

### Claude Code 专有

```
├── skills/                       # Claude Code Skills
│   └── project-multilevel-index/
│       ├── SKILL.md             # 技能定义
│       └── commands_impl/       # 命令实现
├── hooks/                        # Claude Code Hooks
│   └── hooks.json               # Hook 配置
├── plugin.json                   # Plugin 元数据
└── marketplace.json              # Marketplace 信息
```

### 多平台示例

```
├── examples/                     # 示例项目
│   ├── cursor-example/          # Cursor 完整示例
│   ├── windsurf-example/        # Windsurf 示例
│   └── kiro-example/            # Kiro 示例
```

---

## 🎓 为什么是多平台设计?

### 设计理念

**核心思想**: 分形索引的**概念和算法**是平台无关的

- ✅ **分析代码依赖**: 解析 import/export (通用)
- ✅ **生成文件头注释**: Input/Output/Pos (通用)
- ✅ **构建索引树**: 三级结构 (通用)
- ✅ **可视化依赖**: Mermaid 图 (通用)

**差异点**: 不同平台的**触发机制**

- Claude Code: Hook 系统 (自动触发)
- Cursor/Windsurf/Kiro: AI 理解规则 (半自动触发)
- VSCode: LSP 事件 (自动触发,计划中)

### 实现方式

1. **Universal 核心**:
   - 平台无关的纯算法和逻辑
   - Markdown 文档形式 (AI 可理解)
   - 所有平台共享

2. **平台适配器**:
   - 将核心逻辑映射到特定平台
   - 实现平台特定的触发机制
   - 处理平台差异

3. **示例项目**:
   - 提供各平台的完整配置
   - 演示实际使用方法
   - 降低学习成本

---

## 🚀 选择哪个平台?

### 推荐使用 Claude Code (主平台)

**适用人群**:
- ✅ 已使用或愿意使用 Claude Code CLI
- ✅ 希望完全自动化,零干预
- ✅ 需要最佳用户体验

**优势**:
- 完全自动化,文件修改自动更新索引
- 原生支持,无需额外配置
- 持续维护和优化

---

### 实验性使用 Cursor/Windsurf/Kiro

**适用人群**:
- ✅ 无法使用 Claude Code
- ✅ 已在使用这些编辑器
- ✅ 接受半自动化工作流

**优势**:
- 无需切换编辑器
- 仍能获得索引系统的核心价值
- 完整的示例和文档支持

**劣势**:
- 需要手动提醒 AI 更新
- 依赖 AI 理解规则 (可能不稳定)
- 没有完全自动化

---

### 等待 VSCode 支持 (v2.1)

**适用人群**:
- ✅ VSCode 用户
- ✅ 希望完全自动化
- ✅ 愿意等待新版本

**预期**:
- 通过 Language Server 实现
- 接近 Claude Code 的自动化程度
- 兼容性更广 (包括 Cursor)

---

## 📊 功能对比

| 功能 | Claude Code | Cursor/Windsurf/Kiro | VSCode (计划) |
|------|------------|---------------------|--------------|
| **文件头注释** | ✅ 自动 | ✅ 手动触发 | ✅ 自动 |
| **FOLDER_INDEX** | ✅ 自动 | ✅ 手动触发 | ✅ 自动 |
| **PROJECT_INDEX** | ✅ 自动 | ✅ 手动触发 | ✅ 自动 |
| **依赖图** | ✅ 自动 | ✅ 手动触发 | ✅ 自动 |
| **国际化** | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| **一致性检查** | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| **安装复杂度** | ⭐ 简单 | ⭐⭐ 中等 | ⭐ 简单 |
| **学习成本** | ⭐ 低 | ⭐⭐⭐ 中 | ⭐ 低 |
| **维护成本** | ⭐ 低 | ⭐⭐⭐ 高 | ⭐ 低 |

---

## 💡 常见误解

### ❌ 误解 1: "这是一个 Claude Code 插件"

**正确理解**: 这是一个**多平台系统**,Claude Code 是**最佳实现平台**。

- 核心逻辑在 `universal/` (平台无关)
- Claude Code 提供最佳自动化
- 其他平台也可使用 (半自动化)

### ❌ 误解 2: "Cursor/Windsurf 不支持"

**正确理解**: **实验性支持**,需要手动操作。

- 提供完整的配置和示例
- 核心功能都可用
- 需要用户提醒 AI 执行

### ❌ 误解 3: "只能在 Claude Code 使用"

**正确理解**: 可以在**多个平台**使用,体验有差异。

- Claude Code: 完全自动化 (最佳)
- Cursor/Windsurf/Kiro: 半自动化 (可用)
- VSCode: 计划支持 (未来)

---

## 🎯 项目定位

**分形多级索引系统**是:

✅ 一个**跨平台的代码文档自动化系统**
✅ 一套**通用的核心架构和算法**
✅ 多个**平台适配器**的集合
✅ 一个**持续演进**的开源项目

❌ 不是一个纯 Claude Code 插件
❌ 不是只支持单一平台
❌ 不是闭源或专有系统

---

## 📖 更多信息

### 文档

- **[README.md](README.md)** - 项目总览
- **[examples/](examples/)** - 平台示例
- **[USE_CASES.md](USE_CASES.md)** - 使用案例
- **[universal/](universal/)** - 核心架构

### 快速链接

- **Claude Code 用户**: [快速开始](README.md#快速开始)
- **Cursor 用户**: [Cursor 示例](examples/cursor-example/)
- **Windsurf 用户**: [Windsurf 示例](examples/windsurf-example/)
- **Kiro 用户**: [Kiro 示例](examples/kiro-example/)
- **贡献者**: [贡献指南](CONTRIBUTING.md)

---

**总结**: 分形多级索引系统是一个**多平台代码文档自动化系统**,在 Claude Code 上提供最佳体验,同时支持其他 AI 编辑器平台的实验性使用。
