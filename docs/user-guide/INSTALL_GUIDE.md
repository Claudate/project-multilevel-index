# 📦 安装和更新指南

完整的插件安装、更新和使用说明。

---

## 📋 目录

- [系统要求](#系统要求)
- [安装方法](#安装方法)
- [更新插件](#更新插件)
- [验证安装](#验证安装)
- [配置说明](#配置说明)
- [故障排除](#故障排除)
- [卸载](#卸载)

---

## 系统要求

### 必需
- **Claude Code CLI** >= 1.0.0
- **操作系统**: Windows 10+, macOS 12+, Linux (Ubuntu 20.04+)
- **磁盘空间**: ~5 MB

### 推荐
- **Git**: 用于版本管理和更新
- **Bash/Shell**: 用于运行验证脚本

---

## 安装方法

### 方法 1: 从 Claude Code 市场安装 (推荐给普通用户)

#### 一步安装 ⚡

在 Claude Code 中运行：

```bash
/plugin marketplace add Claudate/project-multilevel-index
/plugin install project-multilevel-index
```

插件会自动：
- ✅ 从 GitHub 下载最新版本
- ✅ 安装到 `~/.claude/plugins/project-multilevel-index`
- ✅ 启用所有命令和 Hook
- ✅ 无需手动配置

#### 验证安装

```bash
# 查看已安装插件
/plugins list

# 测试命令
/project-multilevel-index:init-index --help
```

> **📌 版本要求**: 市场安装需要 Claude Code >= 1.0.0

---

### 方法 2: 从 GitHub 手动安装 (推荐给开发者)

适用于：
- 🛠️ 需要修改插件源代码
- 🔧 开发自定义功能
- 🐛 调试问题
- 📝 贡献代码

#### 步骤 1: 克隆仓库

```bash
# 克隆到临时目录
git clone https://github.com/Claudate/project-multilevel-index.git
cd project-multilevel-index
```

#### 步骤 2: 复制到插件目录

**Windows (PowerShell)**:
```powershell
# 创建插件目录（如果不存在）
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\plugins"

# 复制插件
Copy-Item -Path . -Destination "$env:USERPROFILE\.claude\plugins\project-multilevel-index" -Recurse -Force
```

**Windows (CMD)**:
```cmd
mkdir "%USERPROFILE%\.claude\plugins" 2>nul
xcopy /E /I /Y . "%USERPROFILE%\.claude\plugins\project-multilevel-index"
```

**macOS/Linux**:
```bash
# 创建插件目录（如果不存在）
mkdir -p ~/.claude/plugins

# 复制插件
cp -r . ~/.claude/plugins/project-multilevel-index
```

#### 步骤 3: 验证文件结构

```bash
# 查看插件目录
ls ~/.claude/plugins/project-multilevel-index

# 应该看到以下文件结构：
# .claude-plugin/
# skills/
# commands/
# hooks/
# locales/
# README.md
# ...
```

---

### 方法 3: 本地测试模式 (推荐用于插件开发)

使用 `--plugin-dir` 参数进行本地测试，无需安装到全局：

```bash
# 克隆仓库到任意目录
git clone https://github.com/YOUR_USERNAME/project-multilevel-index.git
cd project-multilevel-index

# 直接以本地模式运行 Claude Code
claude --plugin-dir .
```

**优势**:
- 无需复制到 `~/.claude/plugins/`
- 立即测试修改，无需重启
- 适合插件开发和调试
- 不影响全局插件配置

**使用命令**:
在本地模式下，所有命令都需要带命名空间前缀：
```
/project-multilevel-index:init-index
/project-multilevel-index:update-index
/project-multilevel-index:check-index
```

---

### 方法 4: 使用符号链接 (开发者)

如果你想同时开发和使用插件：

```bash
# 克隆到开发目录
git clone https://github.com/YOUR_USERNAME/project-multilevel-index.git ~/dev/project-multilevel-index

# 创建符号链接
ln -s ~/dev/project-multilevel-index ~/.claude/plugins/project-multilevel-index
```

**优势**:
- 修改代码后无需重新复制
- 便于开发和测试
- 可以直接 git pull 更新

---

## 更新插件

### 自动更新 (使用 Git)

如果使用 Git 安装：

```bash
cd ~/.claude/plugins/project-multilevel-index
git pull origin main
```

### 手动更新

1. 下载新版本
2. 备份当前配置（可选）：
   ```bash
   cp ~/.claude/index-config.json ~/index-config.backup.json
   ```
3. 删除旧版本：
   ```bash
   rm -rf ~/.claude/plugins/project-multilevel-index
   ```
4. 按照安装步骤重新安装新版本
5. 恢复配置（如需要）

### 查看当前版本

```bash
cat ~/.claude/plugins/project-multilevel-index/.claude-plugin/plugin.json | grep version
```

---

## 验证安装

### 步骤 1: 重启 Claude Code

```bash
# 如果 Claude Code 正在运行，请重启
```

### 步骤 2: 检查插件是否加载

在 Claude Code 中运行：

```
/plugins list
```

应该看到 `project-multilevel-index` 在列表中。

### 步骤 3: 测试命令

**重要**: 命令需要使用完整的命名空间格式：

```
/project-multilevel-index:init-index
```

如果命令可用，说明安装成功！

> **⚠️ 注意**: 不是 `/init-index`，而是 `/project-multilevel-index:init-index`（这是 Claude Code 插件的要求）

### 步骤 4: 运行测试项目

```bash
cd ~/.claude/plugins/project-multilevel-index/test-project
# 在 Claude Code 中运行
/project-multilevel-index:init-index

# 运行验证脚本
./verify.sh
```

预期输出：
```
✅ 所有检查通过！索引系统工作正常。
```

---

## 配置说明

### 默认配置

插件开箱即用，无需额外配置。

### 自定义配置（可选）

创建配置文件 `~/.claude/index-config.json`：

```bash
# 复制示例配置
cp ~/.claude/plugins/project-multilevel-index/skills/project-multilevel-index/examples/index-config.simple.json ~/.claude/index-config.json

# 编辑配置
nano ~/.claude/index-config.json
```

**简化配置示例**：
```json
{
  "exclude": {
    "patterns": [
      "**/node_modules/**",
      "**/.git/**"
    ],
    "useGitignore": true
  },
  "index": {
    "autoUpdate": true,
    "maxDepth": 5
  },
  "visualization": {
    "maxNodes": 50,
    "highlightCircular": true
  }
}
```

完整配置选项请参考：
- [完整配置示例](skills/project-multilevel-index/examples/index-config.example.json)
- [配置文档](README.md#配置)

---

## 故障排除

### 问题 1: 插件未显示在列表中

**可能原因**:
- 插件目录路径错误
- 文件结构不完整

**解决方案**:
```bash
# 检查插件目录
ls -la ~/.claude/plugins/project-multilevel-index

# 确认 plugin.json 存在
cat ~/.claude/plugins/project-multilevel-index/.claude-plugin/plugin.json
```

### 问题 2: 命令无法执行

**可能原因**:
- 命令文件缺失
- 权限问题

**解决方案**:
```bash
# 检查命令文件
ls ~/.claude/plugins/project-multilevel-index/commands/

# 修复权限
chmod -R 755 ~/.claude/plugins/project-multilevel-index
```

### 问题 3: Hook 未自动触发

**可能原因**:
- Hook 配置文件损坏
- 配置中禁用了自动更新

**解决方案**:
```bash
# 检查 Hook 配置
cat ~/.claude/plugins/project-multilevel-index/hooks/hooks.json

# 检查用户配置
cat ~/.claude/index-config.json
# 确认 "autoUpdate": true
```

### 问题 4: Windows 路径问题

**症状**: 在 Windows 上提示路径错误

**解决方案**:
```powershell
# 使用 PowerShell（不要用 CMD）
# 确保路径使用正确的分隔符
$pluginPath = "$env:USERPROFILE\.claude\plugins\project-multilevel-index"
Test-Path $pluginPath
```

### 问题 5: 权限被拒绝

**症状**: 在 macOS/Linux 上提示权限错误

**解决方案**:
```bash
# 修复所有权
chown -R $USER:$USER ~/.claude/plugins/project-multilevel-index

# 修复权限
chmod -R 755 ~/.claude/plugins/project-multilevel-index
```

---

## 卸载

### 完全卸载

```bash
# 删除插件
rm -rf ~/.claude/plugins/project-multilevel-index

# 删除配置（可选）
rm ~/.claude/index-config.json

# 删除生成的索引文件（在项目中）
rm PROJECT_INDEX.md
find . -name "FOLDER_INDEX.md" -delete
```

### 临时禁用

不删除插件，仅禁用：

```
# 在 Claude Code 中
/plugins disable project-multilevel-index
```

重新启用：

```
/plugins enable project-multilevel-index
```

---

## 📚 下一步

安装成功后，建议：

1. **阅读快速开始**: [QUICKSTART.md](QUICKSTART.md)
2. **查看完整文档**: [README.md](README.md)
3. **了解贡献方式**: [CONTRIBUTING.md](CONTRIBUTING.md)
4. **查看更新日志**: [CHANGELOG.md](CHANGELOG.md)

---

## 🆘 获取帮助

遇到问题？

- 📖 查看 [FAQ](README.md#故障排除)
- 💬 在 [Discussions](https://github.com/YOUR_USERNAME/project-multilevel-index/discussions) 提问
- 🐛 提交 [Issue](https://github.com/YOUR_USERNAME/project-multilevel-index/issues)
- 📧 发送邮件（仅技术问题）

---

**祝使用愉快！** 🎉
