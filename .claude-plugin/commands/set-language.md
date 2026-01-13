# 命令: `/set-language` - 切换语言

## 🎯 使用场景

快速切换索引系统的界面语言（中文 ↔ 英文）。

---

## 📋 执行步骤

### 步骤 1: 询问用户选择语言

显示双语提示：
```
Choose your language / 选择语言:

1. 简体中文 (zh-CN)
2. English (en-US)

Please enter 1 or 2 / 请输入 1 或 2:
```

---

### 步骤 2: 验证选择

根据用户输入：
- `1` → 设置为 `zh-CN`
- `2` → 设置为 `en-US`
- 其他 → 提示错误，重新询问

---

### 步骤 3: 创建/更新配置文件

**配置文件路径**: `.claude/locale-config.json`

**配置内容**:
```json
{
  "language": "{用户选择}",
  "fallback": "zh-CN",
  "description": "项目多级索引系统语言配置 / Language configuration for project multi-level index system",
  "availableLanguages": ["zh-CN", "en-US"]
}
```

**操作步骤**:
1. 检查 `.claude/` 目录是否存在
   - 不存在 → 使用 Bash 工具创建: `mkdir -p .claude`
2. 使用 Write 工具创建或覆盖 `locale-config.json`

---

### 步骤 4: 验证语言文件

检查对应语言文件是否存在：

**必需文件**:
```
locales/{language}/messages.json
locales/{language}/skill.json
locales/{language}/templates.json
locales/{language}/hooks.json
```

使用 Read 工具尝试读取，如果任一文件缺失：
```
⚠️ 警告: 语言文件不完整
缺失文件: locales/{language}/messages.json

索引系统将使用备用语言 (zh-CN)
```

---

### 步骤 5: 确认切换成功

**成功消息（中文选择）**:
```
✅ 语言已切换为简体中文 (zh-CN)

配置文件已创建: .claude/locale-config.json

下次运行 /init-index, /update-index 或 /check-index 时将使用中文界面。
```

**成功消息（英文选择）**:
```
✅ Language switched to English (en-US)

Configuration file created: .claude/locale-config.json

Next time you run /init-index, /update-index, or /check-index, the English interface will be used.
```

---

## 🔄 切换方式对比

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| `/set-language` 命令 | 快速、交互式 | 需手动执行 | 偶尔切换 |
| 手动编辑配置文件 | 灵活、可批量 | 需了解JSON格式 | 高级用户 |
| 环境变量 `CLAUDE_LOCALE` | 全局生效 | 需配置环境 | CI/CD |
| 初始化时询问 | 首次友好 | 只在初始化时 | 新项目 |

---

## 📝 配置文件示例

### 切换到英文
```json
{
  "language": "en-US",
  "fallback": "zh-CN"
}
```

### 切换到中文（默认）
```json
{
  "language": "zh-CN",
  "fallback": "zh-CN"
}
```

---

## 🌍 支持的语言

当前支持：
- **zh-CN**: 简体中文（默认）
- **en-US**: 美国英语

未来扩展（预留）：
- ja-JP: 日语
- ko-KR: 韩语
- de-DE: 德语
- fr-FR: 法语

---

## 🔧 环境变量方式

如果用户更喜欢使用环境变量：

### Linux/macOS
```bash
# 临时设置
export CLAUDE_LOCALE=en-US

# 永久设置（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export CLAUDE_LOCALE=en-US' >> ~/.bashrc
```

### Windows (PowerShell)
```powershell
# 临时设置
$env:CLAUDE_LOCALE = "en-US"

# 永久设置
[Environment]::SetEnvironmentVariable("CLAUDE_LOCALE", "en-US", "User")
```

**优先级**:
1. 项目配置文件 `.claude/locale-config.json`
2. 环境变量 `CLAUDE_LOCALE`
3. 默认值 `zh-CN`

---

## 🚨 错误处理

### 配置文件无法创建

如果 Write 工具失败：
```
❌ 无法创建配置文件 / Failed to create configuration file

原因: 权限不足 / Reason: Permission denied

请手动创建文件: .claude/locale-config.json
Please manually create: .claude/locale-config.json

内容 / Content:
{
  "language": "en-US",
  "fallback": "zh-CN"
}
```

### 语言文件缺失

如果选择的语言文件不存在：
```
⚠️ 警告 / Warning:
所选语言 ({language}) 的语言文件不完整
Language files for {language} are incomplete

系统将使用备用语言: zh-CN
System will fallback to: zh-CN

如需完整支持，请检查以下文件:
To enable full support, check these files:
- locales/{language}/messages.json
- locales/{language}/skill.json
- locales/{language}/templates.json
- locales/{language}/hooks.json
```

---

## 💡 提示

**快速测试语言切换**:
```bash
# 1. 切换到英文
/set-language
# 选择 2

# 2. 运行命令查看效果
/check-index

# 3. 切换回中文
/set-language
# 选择 1
```

---

**参考**:
- 国际化实现: [../core/i18n.md](../core/i18n.md)
- 语言文件位置: `../../locales/`
- 配置示例: `../../.claude/locale-config.example.json`
