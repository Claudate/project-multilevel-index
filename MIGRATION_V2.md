# 迁移到 V2.0 引用分离架构

> **简要说明**: V2.0 引入了新的"引用分离"架构,实现了真正的 DRY 原则。本指南帮助你平滑迁移到新架构。

---

## 📊 变更概览

### 核心变更

**从**: 每个平台都有独立的完整规则文件副本
```
examples/kiro-example/.kiro/rules/doc-maintenance.md      (258行)
examples/cursor-example/.cursor/rules/doc-maintenance.md  (258行)
examples/windsurf-example/.windsurf/rules/doc-maintenance.md (258行)
总计: 774 行重复代码
```

**到**: 单一真实来源 + 平台适配层
```
universal/core/rules/doc-maintenance.md                   (258行, 核心)
universal/.kiro/steering/index-system.md                  (30行, 引用)
examples/cursor-example/.cursorrules                      (88行, 要点)
examples/windsurf-example/.windsurfrules                  (290行, 自动生成)
总计: 350 行 (减少 66%)
```

---

## 🎯 迁移步骤

### 步骤 1: 更新代码

```bash
# 拉取最新代码
git pull origin master

# 或者克隆新版本
git clone https://github.com/Claudate/project-multilevel-index.git
cd project-multilevel-index
```

### 步骤 2: 生成平台配置 (可选)

```bash
# 如果你修改过规则文件,运行此命令重新生成平台配置
node scripts/generate-platform-configs.js
```

输出:
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

### 步骤 3: 验证配置

#### Kiro 用户

检查新的 steering 配置:
```bash
# 查看新的 steering 配置
cat .kiro/steering/index-system.md

# 应该看到文件引用语法
# #[[file:../../core/rules/doc-maintenance.md]]
```

**使用建议**:
- ✅ 使用新的 `.kiro/steering/index-system.md` (推荐)
- ⚠️ 旧的 `.kiro/rules/doc-maintenance.md` 仍然保留,但不建议使用

#### Cursor 用户

检查优化后的配置:
```bash
# 查看优化后的 .cursorrules
cat .cursorrules

# 应该看到核心要点 + 路径引用
```

**使用建议**:
- ✅ 新的 `.cursorrules` 包含核心要点,无需额外操作
- ✅ 详细规则仍在 `.cursor/rules/doc-maintenance.md`

#### Windsurf 用户

检查自动生成的配置:
```bash
# 查看自动生成的 .windsurfrules
cat .windsurfrules

# 应该看到完整的内联规则
```

**使用建议**:
- ✅ `.windsurfrules` 由脚本自动生成,包含完整规则
- ⚠️ 不建议手动编辑,通过 `npm run generate:configs` 更新

---

## 🆕 新功能使用

### 1. 自动生成平台配置

```bash
# 从核心规则自动生成所有平台配置
npm run generate:configs
```

### 2. 查看架构文档

```bash
# 查看核心规则 README
cat universal/core/rules/README.md

# 查看项目 README 中的架构设计章节
cat README.md
```

### 3. 自定义核心规则

```bash
# 1. 编辑核心规则
vi universal/core/rules/doc-maintenance.md

# 2. 重新生成所有平台配置
npm run generate:configs

# 3. 提交更改
git add universal/core/rules/
git add universal/.kiro/steering/
git add examples/
git commit -m "chore: update core rules"
```

---

## 🔍 常见问题

### Q1: 旧的规则文件还能用吗?

**A**: 可以,但不推荐。

- Kiro: 旧的 `.kiro/rules/doc-maintenance.md` 仍然存在,但建议使用新的 `.kiro/steering/index-system.md`
- Cursor: 旧的 `.cursorrules` 已被优化,向后兼容
- Windsurf: 旧的 `.windsurfrules` 已被完整版本替换

### Q2: 我需要修改我的项目配置吗?

**A**: 不需要,所有变更都是向后兼容的。

- 如果你使用示例项目中的配置,直接复制即可
- 如果你有自定义配置,可以选择性迁移到新架构

### Q3: 如何验证新架构是否生效?

**A**: 在 Kiro 中测试:

1. 打开 Kiro 编辑器
2. 开始新对话
3. 检查 AI 是否读取了 `.kiro/steering/index-system.md`
4. 修改一个包含 `import` 的代码文件
5. 验证 AI 是否自动更新了索引

### Q4: 新架构对性能有影响吗?

**A**: 反而更好!

- **Kiro**: 配置文件从 258 行减至 30 行,加载更快
- **Cursor**: 核心要点版本,减少上下文窗口占用
- **Windsurf**: 完整内联,无需引用,加载性能不变

### Q5: 我可以继续使用旧版本吗?

**A**: 可以,但不推荐。

- V1.0 仍然可用,但不会获得新功能和优化
- V2.0 带来了显著的架构改进和维护优势
- 迁移过程简单且无破坏性变更

---

## 📚 相关文档

- [CHANGELOG.md](CHANGELOG.md) - 完整的变更日志
- [universal/core/rules/README.md](universal/core/rules/README.md) - 核心规则架构说明
- [README.md](README.md) - 项目主文档 (含架构设计章节)

---

## 🆘 需要帮助?

如果迁移过程中遇到问题:

1. **查看文档**: 阅读 [universal/core/rules/README.md](universal/core/rules/README.md)
2. **查看示例**: 参考 [examples/](examples/) 目录中的示例项目
3. **提交 Issue**: [GitHub Issues](https://github.com/Claudate/project-multilevel-index/issues)
4. **社区讨论**: 加入 [微信交流群](docs/community/WECHAT_GROUP.md)

---

**迁移愉快! 🎉**
