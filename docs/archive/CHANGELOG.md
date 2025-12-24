# 更新日志 (Changelog)

本文档记录项目多级索引系统插件的所有重要变更。

---

## [1.0.2] - 2025-12-22

### 🐛 Bug 修复

- **[关键]** 修复 hooks.json 中缺少 `.jsx` 和 `.tsx` 扩展名的问题（影响 React/TypeScript 项目的自动更新功能）
- 补全 skill.json 中的文件类型列表（添加 .php, .rb, .swift, .cs）
- 更新排除目录列表，添加现代化工具目录（.turbo, .venv, coverage, pnpm-store, .yarn 等）

### 📝 文档改进

- 在 commands/*.md 中添加版本说明块，明确区分已实现功能和 v2.0 计划功能
- 在 index-config.example.json 中添加 `_readme` 说明，标注为 v2.0 计划功能
- 新增 BUG_FIXES_v1.0.2.md 详细修复报告

### 🎯 影响

- React/TypeScript 项目现在可以正常使用 PostToolUse Hook 自动更新功能
- 文档与实际实现的一致性大幅提升
- 用户清楚知道哪些功能已实现，哪些是计划功能

### ⚡ 性能

- 改进的排除目录规则提升大型项目扫描性能

---

## [1.0.0] - 2025-12-22

### 🎉 首次发布

完整实现受《哥德尔、埃舍尔、巴赫》启发的分形多级索引系统。

### ✨ 新功能

#### 核心功能
- ✅ 三级分形索引系统（PROJECT_INDEX → FOLDER_INDEX → 文件头注释）
- ✅ 自动监听文件变更并更新索引（PostToolUse Hook）
- ✅ 智能判断变更类型（结构性 vs 实现细节）
- ✅ Mermaid 依赖关系图自动生成
- ✅ 循环依赖检测

#### 命令系统
- ✅ `/init-index` - 初始化项目索引
- ✅ `/update-index` - 手动更新索引
- ✅ `/check-index` - 一致性检查

#### 多语言支持
- ✅ JavaScript/TypeScript（JSDoc 风格）
- ✅ Python（Docstring 风格）
- ✅ Java/Kotlin（JavaDoc 风格）
- ✅ Rust（模块文档注释风格）
- ✅ Go（单行注释风格）
- ✅ C/C++（Doxygen 风格）

#### Hook 系统
- ✅ PostToolUse Hook：文件修改时自动触发更新
- ✅ Stop Hook：会话结束前一致性提示
- ✅ 智能过滤：排除索引文件、非代码文件
- ✅ 防死循环设计

### 📚 文档

- ✅ README.md - 完整使用指南（7KB+）
- ✅ INSTALL.md - 安装配置指南
- ✅ SKILL.md - 核心逻辑实现（15KB+）
- ✅ 6 种语言的文件头模板
- ✅ PROJECT_INDEX 和 FOLDER_INDEX 示例

### 🏗️ 架构设计

- ✅ Skill-based 架构（纯 Markdown，无外部脚本依赖）
- ✅ 利用 Claude 语义理解能力
- ✅ 声明式配置（JSON + Markdown）
- ✅ 模块化设计（命令、技能、Hook 分离）

### 🎨 设计亮点

- ✅ 分形自指结构："当我变化时，更新我"
- ✅ 复调音乐类比：代码与文档相互呼应
- ✅ 智能级联更新：文件 → 文件夹 → 根
- ✅ 性能优化：增量更新、智能过滤

---

## 未来计划

### [1.1.0] - 计划中

#### 功能增强
- [ ] `/visualize-deps` 单独生成依赖图命令
- [ ] 支持自定义配置文件（`.claude/index-config.json`）
- [ ] 文件夹级别依赖图聚合视图
- [ ] 更智能的架构推断算法

#### 多语言扩展
- [ ] PHP 支持
- [ ] Ruby 支持
- [ ] Swift 支持
- [ ] C# 支持

#### 集成增强
- [ ] 与 .gitignore 集成
- [ ] 与 VSCode 集成（状态栏提示）
- [ ] 导出为 HTML/PDF 报告

### [2.0.0] - 长期规划

#### 高级功能
- [ ] 架构变更影响分析
- [ ] 代码质量评分
- [ ] 自动重构建议
- [ ] AI 驱动的架构优化建议

#### 可视化
- [ ] 交互式依赖图（D3.js）
- [ ] 架构演化时间线
- [ ] 模块热力图

---

## 技术债务

无（首次发布）

---

## 致谢

- 灵感来源：《哥德尔、埃舍尔、巴赫：集异璧之大成》- 道格拉斯·霍夫施塔特
- 架构建议：Claude Code 社区
- 测试反馈：早期用户

---

## 许可证

MIT License - 详见 LICENSE 文件

---

**让代码项目如赋格曲般，自我指涉、自我维护、优雅和谐！** 🎼
