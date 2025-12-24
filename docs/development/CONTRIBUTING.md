# 贡献指南 (Contributing Guide)

感谢你对项目多级索引系统的关注！我们欢迎所有形式的贡献。

---

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [提交规范](#提交规范)
- [测试要求](#测试要求)
- [文档更新](#文档更新)

---

## 行为准则

本项目遵循 [Contributor Covenant](https://www.contributor-covenant.org/) 行为准则。参与本项目即表示你同意遵守其条款。

请保持：
- 尊重和包容
- 建设性的反馈
- 专注于对项目最有利的事情
- 对社区成员表示同理心

---

## 如何贡献

### 🐛 报告 Bug

在提交 Bug 前，请：
1. 检查 [现有 Issues](../../issues) 是否已有相关报告
2. 使用最新版本测试问题是否仍然存在
3. 收集相关信息（版本、环境、错误日志）

**提交 Bug 时请包含**：
- 清晰的标题和描述
- 复现步骤
- 预期行为 vs 实际行为
- 截图或日志（如有）
- 系统环境（OS、Claude Code 版本等）

使用我们的 [Bug 报告模板](.github/ISSUE_TEMPLATE/bug_report.md)。

### 💡 功能建议

我们欢迎新功能建议！请：
1. 检查是否已有类似建议
2. 清楚描述功能的用途和价值
3. 提供使用场景示例

使用我们的 [功能请求模板](.github/ISSUE_TEMPLATE/feature_request.md)。

### 📝 改进文档

文档改进永远受欢迎！包括：
- 修正拼写/语法错误
- 改进说明清晰度
- 添加使用示例
- 翻译为其他语言

### 💻 代码贡献

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

---

## 开发流程

### 环境准备

```bash
# 1. Fork 并 Clone 仓库
git clone https://github.com/YOUR_USERNAME/project-multilevel-index.git
cd project-multilevel-index

# 2. 安装到 Claude Code 插件目录（用于测试）
cp -r . ~/.claude/plugins/project-multilevel-index

# 3. 在测试项目中验证
cd test-project
# 在 Claude Code 中运行 /init-index
```

### 项目结构

```
project-multilevel-index/
├── .claude-plugin/
│   └── plugin.json              # 插件元数据
├── skills/
│   └── project-multilevel-index/
│       ├── SKILL.md             # 核心 Skill 逻辑
│       ├── templates/           # 语言模板
│       └── examples/            # 示例文件
├── commands/
│   ├── init-index.md            # /init-index 命令
│   ├── update-index.md          # /update-index 命令
│   └── check-index.md           # /check-index 命令
├── hooks/
│   └── hooks.json               # PostToolUse Hook 配置
└── test-project/                # 测试项目
    └── verify.sh                # 验证脚本
```

### 添加新语言支持

1. **创建语言模板** (`skills/project-multilevel-index/templates/language.md`)：
   ```markdown
   # Language 文件头模板

   ## 注释语法
   ...

   ## Input/Output 识别规则
   ...
   ```

2. **更新 SKILL.md**：
   在"依赖分析规则"章节添加该语言的识别规则

3. **更新 LANGUAGES.md**：
   添加该语言到支持列表

4. **添加测试文件**：
   在 `test-project/` 中创建该语言的测试文件

5. **更新文档**：
   在 README.md 和相关文档中更新语言列表

---

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（不是新功能也不是 Bug 修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链更新

### 示例

```
feat(templates): add Kotlin language support

- Add kotlin.md template
- Update SKILL.md with Kotlin dependency rules
- Add test files for Kotlin

Closes #42
```

---

## 测试要求

### 手动测试

在提交 PR 前，请确保：

1. **运行测试项目验证**：
   ```bash
   cd test-project
   /init-index
   ./verify.sh
   ```

2. **测试所有命令**：
   - `/init-index`
   - `/update-index`
   - `/check-index`

3. **测试 Hook 自动更新**：
   - 修改代码文件
   - 验证索引自动更新

### 添加测试用例

如果添加新功能，请在 `test-project/` 中添加相应测试文件。

---

## 文档更新

代码变更时，请同步更新相关文档：

- **README.md**: 功能概述、安装说明
- **SKILL.md**: 核心逻辑、规则说明
- **CHANGELOG.md**: 版本变更记录
- **命令文档** (`commands/*.md`): 命令使用说明

---

## Pull Request 流程

### PR 检查清单

提交 PR 前，请确认：

- [ ] 代码遵循项目风格
- [ ] 已添加/更新相关文档
- [ ] 已测试所有修改功能
- [ ] Commit 信息符合规范
- [ ] PR 描述清晰说明了变更内容

### PR 模板

我们提供了 [PR 模板](.github/pull_request_template.md)，请按模板填写。

### 审查流程

1. 提交 PR 后，维护者会进行代码审查
2. 可能会有修改建议，请及时响应
3. 所有讨论解决后，PR 将被合并
4. 合并后你的贡献会出现在下一个版本的 CHANGELOG 中

---

## 获取帮助

有问题？可以通过以下方式获取帮助：

- 💬 [GitHub Discussions](../../discussions) - 提问和讨论
- 🐛 [GitHub Issues](../../issues) - Bug 报告和功能请求
- 📧 Email - 技术问题咨询

---

## 认可贡献者

所有贡献者都会在以下位置被认可：

- README.md 的贡献者列表
- CHANGELOG.md 的版本记录
- GitHub Contributors 页面

---

## 许可证

通过贡献代码，你同意你的贡献将在 [MIT License](LICENSE) 下授权。

---

**感谢你的贡献！让我们一起把这个项目做得更好！** 🚀
