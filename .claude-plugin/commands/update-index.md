# 命令: `/update-index` - 更新索引

## 🎯 使用场景

- 用户手动触发索引更新
- PostToolUse Hook 自动调用（文件修改后）

---

## 📋 执行步骤

### 步骤 0: 加载语言配置

**必须首先执行**，详见 [../core/i18n.md](../core/i18n.md)

---

### 步骤 1: 检测变更范围

输出: `{{LANG.messages.commands.updateIndex.analyzing}}`

如果是 Hook 触发，分析被修改的文件：

**过滤规则**:
- 是否为索引文件自身（PROJECT_INDEX.md, FOLDER_INDEX.md）? → 跳过
- 是否为代码文件? → 继续
- 文件大小 > 500KB? → 跳过（性能保护）

**变更类型判断**:

| 变更内容 | 类型 | 更新范围 |
|---------|------|---------|
| 新增/删除 import/require/use | `{{LANG.skill.changeTypes.structural}}` | `{{LANG.skill.updateRanges.full}}` |
| 修改 export/public/class 声明 | `{{LANG.skill.changeTypes.structural}}` | `{{LANG.skill.updateRanges.full}}` |
| 修改 Input/Output/Pos 注释 | `{{LANG.skill.changeTypes.header}}` | `{{LANG.skill.updateRanges.header}}` |
| 修改函数内部实现 | `{{LANG.skill.changeTypes.implementation}}` | `{{LANG.skill.updateRanges.none}}` |

**判断方法**:
1. 读取文件内容
2. 搜索关键字:
   - **依赖**: `import`, `require`, `use`, `from`, `#include`, `using`
   - **导出**: `export`, `public`, `class`, `interface`, `function`, `def`, `fn`, `async`, `struct`
3. 如果发现变更 → Structural
4. 否则检查文件头是否修改 → Header
5. 都不是 → Implementation（跳过）

---

### 步骤 2: 执行增量更新

根据变更类型执行不同更新策略：

#### Structural 变更

1. **重新分析文件**:
   - 分析 Input（依赖）
   - 分析 Output（导出）
   - 推断 Pos（定位）

2. **更新文件头注释**:
   - 使用 Edit 工具更新
   - 保留用户自定义内容

3. **更新 FOLDER_INDEX.md**:
   - 只更新该文件的条目
   - 不重新生成整个索引

4. **更新 PROJECT_INDEX.md**:
   - 重新生成依赖关系图
   - 更新受影响的目录结构描述

#### Header 变更

1. **仅更新文件头注释**
2. 不触及 FOLDER_INDEX 或 PROJECT_INDEX

---

### 步骤 3: 智能合并（批量更新优化）

如果短时间内（< 5秒）检测到多个文件变更：

1. **收集所有变更**
2. **去重文件夹**（每个文件夹只更新一次）
3. **最后统一更新根索引**

这样可以避免频繁写入同一文件。

---

### 步骤 4: 报告更新

**静默模式**（小改动）:
```
{{LANG.messages.notifications.skipped}}
```

**通知模式**（结构性变更）:
```
{{LANG.messages.commands.updateIndex.updated}}
- {{LANG.messages.commands.updateIndex.updatedItems}}
```

替换占位符:
- `{file}`: 文件名
- `{folder}`: 文件夹名

**示例输出（zh-CN）**:
```
[索引系统] 检测到结构性变更，已自动更新索引
已更新:
- 文件头注释、services/FOLDER_INDEX.md、PROJECT_INDEX.md
```

**示例输出（en-US）**:
```
[Index System] Detected structural change, automatically updated index
Updated:
- File header, services/FOLDER_INDEX.md, PROJECT_INDEX.md
```

---

## 🔄 PostToolUse Hook 集成

当 Hook 调用此命令时：

### 步骤 1: 应用过滤规则（来自 `LANG.hooks.postToolUse`）

跳过条件：
- 文件名为 PROJECT_INDEX.md 或 FOLDER_INDEX.md
- 文件扩展名不是代码文件
- 文件路径包含: `{{LANG.skill.excludePatterns.directories}}`
- 文件大小 > 500KB

### 步骤 2: 结构变更检测（来自 `LANG.hooks.postToolUse.structuralChange`）

检查关键字：
- 依赖: import, require, use, from, #include, using
- 导出: export, public, class, interface, function, def, fn, async, struct

### 步骤 3: 静默执行

- 小改动：不输出
- 重大变更：一行简短提示

---

## ⚡ 性能优化

1. **增量更新优先**:
   - 避免全量扫描
   - 只更新受影响的部分

2. **批量合并**:
   - 多文件变更时合并更新
   - 减少文件写入次数

3. **缓存机制**:
   - 缓存依赖分析结果
   - 避免重复解析

---

**参考**:
- 初始化索引: [init-index.md](init-index.md)
- 一致性检查: [check-index.md](check-index.md)
- Hook 配置: `locales/{language}/hooks.json`
