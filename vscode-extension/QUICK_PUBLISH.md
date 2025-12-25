# VSCode Extension - 快速发布指南

5步快速发布到VSCode Marketplace

---

## 📋 准备工作（一次性设置）

### 1. 创建Microsoft账号
如果没有，去 https://account.microsoft.com/ 注册

### 2. 创建Azure DevOps组织和Token

```bash
# 访问: https://dev.azure.com/

# 步骤:
1. 登录Microsoft账号
2. 创建组织（随便起个名字，如"my-extensions"）
3. 点击右上角头像 → Personal access tokens
4. New Token:
   - Name: VSCode Publisher
   - Scopes: Marketplace (Acquire, Manage, Publish)
5. 复制Token并保存（只显示一次！）
```

### 3. 创建Publisher

```bash
# 访问: https://marketplace.visualstudio.com/manage

# 步骤:
1. 登录Microsoft账号
2. Create publisher
3. Publisher ID: Claudate（你的唯一ID）
4. Name: Claudate
5. Email: your-email@example.com
```

### 4. 安装发布工具

```bash
npm install -g @vscode/vsce
```

---

## 🚀 发布步骤（每次发布）

### 步骤1: 完成必需文件

```bash
cd vscode-extension

# 确保这些文件存在且正确:
✅ package.json    # publisher字段 = 你的Publisher ID
✅ README.md       # 扩展介绍
✅ CHANGELOG.md    # 版本更新日志
✅ LICENSE         # MIT许可证
✅ icon.png        # 128x128或256x256图标（可选但推荐）
```

#### 快速创建CHANGELOG.md
```markdown
# Change Log

## [0.1.0] - 2025-12-25

### Added
- Initial release
- Automatic index generation
- File header comments
- Folder and project indexes
- Auto-update on file save
- 4 VSCode commands
```

### 步骤2: 构建扩展

```bash
npm run build
```

### 步骤3: 打包扩展

```bash
vsce package

# 生成: project-multilevel-index-0.1.0.vsix
```

### 步骤4: 本地测试（可选但推荐）

```bash
# 在VSCode中安装测试
code --install-extension project-multilevel-index-0.1.0.vsix

# 测试功能是否正常
# 测试完后可以卸载
```

### 步骤5: 发布

```bash
# 首次发布需要登录
vsce login Claudate
# 输入你的Personal Access Token

# 发布
vsce publish

# 完成！等待5-10分钟后访问:
# https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index
```

---

## ⚡ 一键发布脚本

创建 `publish-quick.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Quick Publishing..."

# 1. 构建
npm run build

# 2. 打包
vsce package

# 3. 发布
vsce publish

echo "✅ Published! Check:"
echo "https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index"
```

使用:
```bash
chmod +x publish-quick.sh
./publish-quick.sh
```

---

## 🔄 更新版本

```bash
# 修改代码后更新版本:

# 方法1: 自动升级版本号
vsce publish patch  # 0.1.0 → 0.1.1
vsce publish minor  # 0.1.0 → 0.2.0
vsce publish major  # 0.1.0 → 1.0.0

# 方法2: 手动指定版本
vsce publish 0.2.0

# 别忘了更新CHANGELOG.md！
```

---

## ❗ 常见错误

### "ERROR Failed request: (401)"
```bash
# Token过期
# 解决: 重新登录
vsce login Claudate
```

### "ERROR Missing publisher name"
```bash
# package.json缺少publisher字段
# 解决: 添加
{
  "publisher": "Claudate"
}
```

### "ERROR Icon not found"
```bash
# 解决: 创建icon.png或移除package.json中的"icon"字段
```

---

## 📊 发布后检查

访问你的扩展页面:
```
https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index
```

检查:
- ✅ 图标显示
- ✅ README正确
- ✅ Install按钮可用
- ✅ 版本号正确

---

## 🎯 完整发布清单

发布前:
- [ ] 代码测试通过
- [ ] package.json完整（name, version, publisher, description）
- [ ] README.md完善
- [ ] CHANGELOG.md已更新
- [ ] LICENSE文件存在
- [ ] icon.png已创建（可选）
- [ ] npm run build成功

发布:
- [ ] vsce package成功
- [ ] 本地测试通过（可选）
- [ ] vsce publish成功

发布后:
- [ ] Marketplace页面正常
- [ ] 可以正常安装
- [ ] 功能正常工作

---

## 📚 详细文档

完整发布指南（包括Open VSX等）:
- [PUBLISHING_GUIDE.md](PUBLISHING_GUIDE.md)

---

**就是这么简单！** 🎉
