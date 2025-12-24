# 分形索引系统 - Steering 配置

> **Kiro AI 编辑器专用配置** - 本文件在每次新对话时自动加载

---

## 📋 核心规则引用

本项目使用**分形多级索引系统**自动维护文档。

完整的维护规则请参考:

#[[file:../../core/rules/doc-maintenance.md]]

---

## 🎯 核心工作流程

当你修改代码文件时,请遵循以下流程:

### 1. 检测变更类型

检查文件内容是否包含**结构性变更关键字**:
- **依赖**: `import`, `require`, `use`, `from`, `#include`, `using`
- **导出**: `export`, `public`, `class`, `interface`, `function`, `def`, `fn`, `struct`

### 2. 执行更新策略

- **结构性变更** → 执行完整更新 (文件头 + FOLDER_INDEX + PROJECT_INDEX)
- **实现变更** → 跳过更新,继续当前任务

### 3. 保持静默

- 小改动: 静默处理,不打断用户
- 大改动: 简短提示 (一行信息)

---

## 🔄 关键原则

1. **主动性**: 主动检测并执行更新,不等待用户提醒
2. **准确性**: 正确识别变更类型
3. **静默性**: 不打断用户工作流
4. **一致性**: 确保三级索引同步

---

## 📖 详细规则

所有详细的执行流程、错误处理、输出风格等,请查看:

#[[file:../../core/rules/doc-maintenance.md]]

---

## 💡 快速参考

### 过滤规则
- 跳过: `PROJECT_INDEX.md`, `FOLDER_INDEX.md`, 索引文件
- 跳过: `node_modules`, `.git`, `dist`, `build` 等目录
- 跳过: 非代码文件 (只处理 .js .ts .py .java .rs .go 等)
- 跳过: 大于 500KB 的文件

### 三级索引结构
```
PROJECT_INDEX.md (根索引 + Mermaid 依赖图)
├── FOLDER_INDEX.md (文件夹索引)
│   └── file.ts (文件头注释: Input/Output/Pos)
```

### 更新时机
- ✅ 创建新文件
- ✅ 修改现有文件 (含结构性变更)
- ✅ 删除文件
- ❌ 仅修改注释或实现细节

---

**版本**: 2.0.0
**更新日期**: 2025-12-24
**架构**: 引用分离 (Reference Separation)
**自动生成**: 由 scripts/generate-platform-configs.js 生成
