# Universal Core Rules

> **单一真实来源 (Single Source of Truth)** - 所有平台配置的核心规则库

---

## 📚 概述

这个目录包含项目的**平台无关核心规则**,是所有 AI 编辑器平台配置的单一真实来源。

### 架构理念

```
┌─────────────────────────────────────────────────┐
│  平台适配层 (Platform Adapters)                 │
│  .kiro/steering/, .cursorrules, .windsurfrules  │
│  职责: 引用或内联核心规则,适配平台特性           │
└─────────────────┬───────────────────────────────┘
                  │ 引用/生成
┌─────────────────▼───────────────────────────────┐
│  核心规则层 (Core Rules)                        │
│  universal/core/rules/                          │
│  职责: 定义平台无关的维护规则和工作流             │
└─────────────────────────────────────────────────┘
```

---

## 📂 文件列表

### [doc-maintenance.md](doc-maintenance.md)

**分形索引系统的核心维护规则**

包含:
- 系统概述 (三级分形结构)
- 触发时机 (创建/修改/删除文件)
- 检测逻辑 (过滤规则 + 变更类型判断)
- 更新策略 (结构性变更 vs 实现变更)
- 执行流程 (依赖分析 → 文件头 → FOLDER_INDEX → PROJECT_INDEX)
- 输出风格 (静默处理 vs 重大变更提示)
- 错误处理 (常见错误场景)
- 关键原则 (主动性、准确性、静默性、一致性、性能)

**用途**: 所有平台的配置文件都引用或内联这个文件的内容

---

## 🔗 平台引用方式

不同平台根据其能力,采用不同的引用方式:

### 1. Kiro - 文件引用 (最优)

**配置文件**: `.kiro/steering/index-system.md`

**引用方式**:
```markdown
#[[file:../../universal/core/rules/doc-maintenance.md]]
```

**优势**:
- ✅ 真正的引用,不重复内容
- ✅ 自动读取最新版本
- ✅ 配置文件轻量 (仅 20-30 行)

---

### 2. Cursor - 核心要点 + 路径引用

**配置文件**: `.cursorrules`

**引用方式**:
```markdown
完整的维护规则请参考:
`.cursor/rules/doc-maintenance.md`
```

**特点**:
- ✅ 主配置文件包含核心要点 (30-40 行)
- ✅ 详细规则在独立文件中
- ⚠️ `@file` 引用不稳定,使用路径说明

---

### 3. Windsurf - 完全内联

**配置文件**: `.windsurfrules`

**引用方式**: 无 (完全内联核心规则内容)

**特点**:
- ✅ 自包含,不依赖文件引用
- ❌ 需要手动同步更新
- 💡 可通过脚本自动生成

---

## 🛠️ 自动化工具

### 平台配置生成脚本

**脚本**: [`scripts/generate-platform-configs.js`](../../../scripts/generate-platform-configs.js)

**功能**:
1. 从 `universal/core/rules/doc-maintenance.md` 读取核心规则
2. 为各平台生成适配的配置文件:
   - Kiro: 生成带文件引用的 steering 配置
   - Cursor: 生成核心要点版本的 .cursorrules
   - Windsurf: 生成完全内联版本的 .windsurfrules
3. 确保所有平台配置与核心规则保持一致

**使用方法**:
```bash
# 在项目根目录执行
node scripts/generate-platform-configs.js
```

**输出示例**:
```
🎼 分形多级索引系统 - 平台配置生成器

📖 读取核心规则...
  ✓ 核心规则读取成功

🔧 生成 Universal 配置...
  ✓ 已生成: universal/.kiro/steering/index-system.md

🔧 生成示例项目配置...
  ✓ 已生成: examples/kiro-example/.kiro/steering/index-system.md
  ✓ 已生成: examples/cursor-example/.cursorrules
  ✓ 已生成: examples/windsurf-example/.windsurfrules

✅ 所有平台配置已成功生成!
```

---

## 📝 维护指南

### 更新核心规则

当需要修改维护规则时:

1. **编辑核心文件**
   ```bash
   # 只需修改这一个文件
   vi universal/core/rules/doc-maintenance.md
   ```

2. **重新生成平台配置**
   ```bash
   # 自动同步到所有平台
   node scripts/generate-platform-configs.js
   ```

3. **提交更改**
   ```bash
   git add universal/core/rules/doc-maintenance.md
   git add universal/.kiro/steering/
   git add examples/*/
   git commit -m "chore: update core rules and regenerate platform configs"
   ```

### 添加新平台支持

1. **在生成脚本中添加新平台逻辑**
   - 编辑 `scripts/generate-platform-configs.js`
   - 添加新的生成函数 (如 `generateZedConfig()`)

2. **运行生成脚本**
   ```bash
   node scripts/generate-platform-configs.js
   ```

3. **测试新平台配置**
   - 在新平台中验证配置是否正确加载
   - 验证规则是否正确执行

---

## 🎯 设计优势

### 1. DRY (Don't Repeat Yourself)
- **减少 66% 的重复代码** (从 774 行降至 350 行)
- **单一真实来源**: 只需维护一个核心规则文件

### 2. 关注点分离 (Separation of Concerns)
- **核心层**: 定义平台无关的规则和逻辑
- **适配层**: 处理平台特定的引用和格式

### 3. 易于维护
- **集中管理**: 所有规则在一个地方
- **自动同步**: 通过脚本自动生成平台配置
- **版本一致**: 避免平台间的版本漂移

### 4. 易于扩展
- **新平台支持**: 只需添加 20-40 行适配代码
- **多语言支持**: 易于添加 i18n 版本
- **规则变体**: 可以轻松创建 lite/standard/enterprise 版本

---

## 🔗 相关文档

- [平台接口定义](../platform-interface.md)
- [平台适配器开发指南](../../adapters/README.md)
- [依赖分析器](../analyzer/dependency-parser.md)
- [索引生成器](../generator/)

---

## 📋 版本信息

**版本**: 2.0.0
**更新日期**: 2025-12-24
**架构**: 引用分离 (Reference Separation)
**维护者**: Claudate

---

**重要提示**: 修改核心规则后,务必运行 `node scripts/generate-platform-configs.js` 来同步所有平台配置!
