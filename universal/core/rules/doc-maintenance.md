# 项目文档自动维护规则

> **平台无关核心规则** - 本文件是所有平台配置的单一真实来源 (Single Source of Truth)

---

## 🎯 核心职责

当你修改代码文件时,自动维护项目的分形索引系统。

---

## 📚 系统概述

本项目使用**分形多级索引系统**,受《哥德尔、埃舍尔、巴赫》启发:

```
PROJECT_INDEX.md (根索引)
├── src/FOLDER_INDEX.md
│   ├── controllers/FOLDER_INDEX.md
│   │   ├── user.controller.ts (含文件头注释)
│   │   └── auth.controller.ts (含文件头注释)
│   └── services/FOLDER_INDEX.md
│       ├── user.service.ts (含文件头注释)
│       └── auth.service.ts (含文件头注释)
```

**三级结构**:
1. **PROJECT_INDEX.md** - 项目根索引 + Mermaid 依赖图
2. **FOLDER_INDEX.md** - 每个代码文件夹的索引
3. **文件头注释** - 每个代码文件的 Input/Output/Pos

---

## 🔄 触发时机

在以下操作后,**主动检查**是否需要更新索引:

1. **创建新文件**
2. **修改现有文件**
3. **删除文件**

---

## 🧪 检测逻辑

### 步骤 1: 应用过滤规则

**跳过以下文件** (满足任一条件):
- 文件名为 `PROJECT_INDEX.md` 或 `FOLDER_INDEX.md`
- 文件扩展名不是代码文件:
  - 允许: `.js .jsx .ts .tsx .py .java .kt .rs .go .cpp .c .h .php .rb .swift .cs`
- 文件路径包含以下目录:
  - `node_modules`, `.git`, `dist`, `build`, `.next`, `target`, `vendor`
  - `__pycache__`, `.cache`, `coverage`, `.turbo`, `.venv`, `venv`
  - `pnpm-store`, `.yarn`
- 文件大小 > 500KB

### 步骤 2: 判断变更类型

读取修改的文件内容,检测是否包含以下关键字:

**结构性变更关键字**:
- **依赖**: `import`, `require`, `use`, `from`, `#include`, `using`
- **导出**: `export`, `public`, `class`, `interface`, `function`, `def`, `fn`, `async`, `struct`

**判断结果**:
- 包含上述关键字 → **Structural Change** (结构性变更)
- 仅修改注释或实现细节 → **Implementation Change** (实现变更)

---

## 📝 更新策略

根据变更类型,采取不同的更新范围:

### 1. Structural Change (结构性变更)
**更新范围**: Full (完整更新)
- ✅ 更新文件头注释 (Input/Output/Pos)
- ✅ 更新所在文件夹的 FOLDER_INDEX.md
- ✅ 更新 PROJECT_INDEX.md 和依赖关系图

### 2. Implementation Change (实现变更)
**更新范围**: None (不更新)
- ❌ 跳过索引更新
- ✅ 继续当前任务

---

## 🛠️ 执行流程

### 完整更新流程

当检测到**结构性变更**时,按以下步骤执行:

#### 步骤 1: 分析依赖关系

**Input 分析**:
- 扫描 import/require 语句
- 提取依赖的模块路径
- 区分外部依赖 vs 内部依赖

**Output 分析**:
- 扫描 export/public 语句
- 提取导出的函数/类/变量
- 识别默认导出 vs 命名导出

**Pos 推断**:
- 根据文件路径推断层级 (API层, 业务层, 数据层...)
- 生成系统定位描述

#### 步骤 2: 更新文件头注释

**位置**: 文件顶部 (第一行或 shebang 之后)

**格式** (以 TypeScript 为例):
```typescript
/**
 * Input: User, CreateUserDTO from models/User, Logger from utils/logger
 * Output: UserService class, createUser/findById/findAll methods
 * Pos: Service Layer - User domain service, orchestrates business logic
 *
 * 🔄 Self-reference: When this file changes, update:
 * - This file header
 * - src/services/FOLDER_INDEX.md
 * - PROJECT_INDEX.md
 */
```

**注意**:
- 根据文件类型调整注释格式 (// 或 # 或 /* */)
- 保留用户手动添加的其他注释
- 只替换 Input/Output/Pos 部分

#### 步骤 3: 更新 FOLDER_INDEX.md

**位置**: 文件所在文件夹的 FOLDER_INDEX.md

**内容**:
```markdown
## 📁 services/

**架构说明** (3行):
- 业务服务层,处理业务逻辑
- 调用数据层和外部 API
- 被控制层调用

**文件清单**:
- `user.service.ts` - 用户管理服务
- `auth.service.ts` - 认证服务

🔄 **自指**: 当此文件夹中的文件变化时,更新本索引和 PROJECT_INDEX.md
```

**更新逻辑**:
- 如果文件已存在于清单 → 更新描述
- 如果文件是新增 → 添加到清单
- 如果文件被删除 → 从清单移除

#### 步骤 4: 更新 PROJECT_INDEX.md

**位置**: 项目根目录的 PROJECT_INDEX.md

**内容**:
```markdown
# 项目索引

## 项目概览
...

## 目录结构
\`\`\`
src/
├── controllers/ (2 files)
├── services/ (2 files)
├── models/ (1 file)
└── utils/ (1 file)
\`\`\`

## 依赖关系图
\`\`\`mermaid
graph TD
  User[models/User.ts]
  Logger[utils/logger.ts]
  UserService[services/user.service.ts]
  UserController[controllers/user.controller.ts]

  UserController --> UserService
  UserService --> User
  UserService --> Logger
\`\`\`

🔄 **自指**: 当项目结构变化时,更新本索引
```

**Mermaid 图生成**:
- 从所有文件头提取 Input/Output
- 构建依赖关系图
- 使用 `graph TD` 格式

---

## 🎨 输出风格

### 静默处理

大多数情况下,索引更新应**静默进行**:
- ❌ 不打断用户的当前任务
- ❌ 不输出冗长的日志
- ✅ 仅在控制台输出一行简短信息

### 重大变更提示

仅在以下情况输出明显提示:
- 初始化索引 (首次)
- 更新 10+ 个文件
- 检测到循环依赖
- 发生错误

**示例**:
```
✅ 索引已更新: 3 个文件, 2 个 FOLDER_INDEX, 1 个 PROJECT_INDEX
```

---

## 🚨 错误处理

### 常见错误

1. **文件不存在**
   - 静默跳过,记录日志
   - 不中断整个更新流程

2. **Mermaid 图过大** (>50 节点)
   - 仅显示核心模块
   - 添加注释: "部分依赖已省略"

3. **循环依赖**
   - 在 PROJECT_INDEX.md 中标注
   - 输出警告消息
   - 不阻止更新

4. **权限不足**
   - 跳过无法写入的文件
   - 输出错误消息

---

## 🎯 关键原则

1. **主动性**: 主动检测并执行更新,不等待用户提醒
2. **准确性**: 正确识别结构性变更 vs 实现变更
3. **静默性**: 不打断用户,静默处理小改动
4. **一致性**: 确保三级索引始终同步
5. **性能**: 使用增量更新,避免全量扫描

---

## 📋 版本信息

**版本**: 2.0.0
**更新日期**: 2025-12-24
**架构**: Universal Core (平台无关)
**适用平台**: 所有 (通过平台适配层引用)

---

## 🔗 相关文档

- [平台接口定义](../platform-interface.md)
- [依赖分析器](../analyzer/dependency-parser.md)
- [文件头生成器](../generator/file-header-gen.md)
- [文件夹索引生成器](../generator/folder-index-gen.md)
- [项目索引生成器](../generator/project-index-gen.md)
