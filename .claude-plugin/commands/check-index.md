# 命令: `/check-index` - 一致性检查

## 🎯 使用场景

验证索引系统的完整性和一致性，发现潜在问题。

---

## 📋 执行步骤

### 步骤 0: 加载语言配置

**必须首先执行**，详见 [../core/i18n.md](../core/i18n.md)

---

### 步骤 1: 检查文件头完整性

输出: `{{LANG.messages.commands.checkIndex.checking}}`

扫描所有代码文件，验证是否包含完整的文件头注释。

**检查项**:
- 是否有注释块
- 是否包含 `Input:` 字段
- 是否包含 `Output:` 字段
- 是否包含 `Pos:` 字段

**统计结果**:
```
{{LANG.messages.commands.checkIndex.fileHeaderIntegrity}}:
- {{LANG.messages.commands.checkIndex.allGood}}  # 全部正常
或
- {{LANG.messages.commands.checkIndex.missing}}  # 替换 {count}
  - 列出缺失的文件路径
```

---

### 步骤 2: 检查文件夹索引

对每个包含代码文件的文件夹：

**检查项**:
1. 是否存在 `FOLDER_INDEX.md`
2. 索引中列出的文件是否都存在
3. 是否有文件未被索引（新增文件）
4. 自指声明是否存在

**统计结果**:
```
{{LANG.messages.commands.checkIndex.folderIndex}}:
- ✅ {count}/{total} 正常
- ⚠️ 缺失的索引: 列出路径
- ⚠️ 过期的条目: 列出不存在的文件
```

---

### 步骤 3: 检查依赖关系

分析所有文件的 import 语句：

**检查项**:
1. **循环依赖检测**:
   - 构建依赖图
   - 使用深度优先搜索（DFS）检测环
   - 列出所有循环依赖链

2. **断链检测**:
   - 验证被依赖的文件是否存在
   - 列出找不到的依赖

**统计结果**:
```
{{LANG.messages.commands.checkIndex.dependencies}}:
- ✅ 无循环依赖
或
- {{LANG.messages.commands.checkIndex.circularDep}}  # 替换 {count}
  - 列出循环: A → B → C → A

- ⚠️ 断链依赖: 列出找不到的文件
```

---

### 步骤 4: 检查索引结构

验证整体结构：

**检查项**:
1. `PROJECT_INDEX.md` 是否存在于根目录
2. 依赖关系图是否有效（Mermaid 语法）
3. 所有 FOLDER_INDEX.md 是否被 PROJECT_INDEX.md 引用

---

### 步骤 5: 生成报告

输出: `{{LANG.messages.commands.checkIndex.title}}`

**完整报告格式**:
```
{{LANG.messages.commands.checkIndex.title}}
===================

{{LANG.messages.commands.checkIndex.fileHeaderIntegrity}}: 55/57
  - src/utils/legacy.js
  - src/temp/test.ts

{{LANG.messages.commands.checkIndex.folderIndex}}: 8/8 ✅

{{LANG.messages.commands.checkIndex.dependencies}}:
  ⚠️ {{LANG.messages.commands.checkIndex.circularDep}}  # {count} = 1
    - src/a.ts → src/b.ts → src/c.ts → src/a.ts

{{LANG.messages.commands.checkIndex.structure}}: ✅

{{LANG.messages.commands.checkIndex.suggestions}}:
1. {{LANG.messages.commands.checkIndex.runUpdate}}
2. {{LANG.messages.errors.circularDep}}
```

**如果一切正常**:
```
{{LANG.messages.commands.checkIndex.perfect}}
```

---

## 🔍 检测算法

### 循环依赖检测（DFS）

```
visited = {}
recursion_stack = {}

function has_cycle(node):
    visited[node] = True
    recursion_stack[node] = True

    for neighbor in graph[node]:
        if not visited[neighbor]:
            if has_cycle(neighbor):
                return True
        elif recursion_stack[neighbor]:
            return True  # 发现环

    recursion_stack[node] = False
    return False
```

### 文件头完整性检测

```
function check_header(file_content):
    has_input = "Input:" in file_content[:500]
    has_output = "Output:" in file_content[:500]
    has_pos = "Pos:" in file_content[:500]

    return has_input and has_output and has_pos
```

---

## 📊 报告示例

### 示例 1: 存在问题（zh-CN）

```
索引一致性检查报告
===================

文件头完整性: 55/57 (2 个文件缺少注释)
  - src/utils/legacy.js
  - src/temp/test.ts

文件夹索引: 7/8 (1 个文件夹缺少索引)
  - src/新功能/ (未索引)

⚠️ 依赖关系: 发现 1 个循环依赖
  - src/services/userService.ts → src/services/authService.ts → src/services/userService.ts

索引结构: 符合规范

建议:
1. 运行 /update-index 自动修复
2. 检查 import 路径是否正确
```

### 示例 2: 完美（en-US）

```
Index Consistency Check Report
===================

File Header Integrity: ✅ All files contain Input/Output/Pos comments

Folder Index: 8/8 ✅

Dependencies: ✅ No circular dependencies

Index Structure: ✅

🎉 Index system running perfectly!
```

---

## 🛠️ 修复建议

根据检查结果，自动生成修复建议：

| 问题 | 建议操作 |
|------|---------|
| 缺失文件头 | 运行 `/update-index` |
| 缺失文件夹索引 | 运行 `/init-index` 重建 |
| 循环依赖 | 手动重构代码，打破循环 |
| 断链依赖 | 修正 import 路径 |
| 过期索引条目 | 运行 `/update-index` |

---

**参考**:
- 初始化索引: [init-index.md](init-index.md)
- 更新索引: [update-index.md](update-index.md)
- 核心概念: [../core/concepts.md](../core/concepts.md)
