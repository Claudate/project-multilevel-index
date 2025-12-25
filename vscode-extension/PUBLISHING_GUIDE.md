# VSCode Extension Publishing Guide

完整的VSCode扩展发布指南，包括VSCode Marketplace和Open VSX Registry。

---

## 📋 发布前检查清单

### 必须完成的项目
- [ ] 手动测试通过
- [ ] 创建扩展图标 (icon.png)
- [ ] 更新README.md (添加截图)
- [ ] 创建CHANGELOG.md
- [ ] 版本号正确 (package.json)
- [ ] 许可证文件存在 (LICENSE)
- [ ] 仓库信息正确 (package.json)

### 可选但推荐的项目
- [ ] 添加演示GIF/视频
- [ ] 完善文档
- [ ] 添加单元测试
- [ ] 代码审查

---

## 🎯 发布目标平台

### 1. VSCode Marketplace (官方)
- **支持平台**: VSCode, Cursor, Windsurf
- **网址**: https://marketplace.visualstudio.com/
- **覆盖率**: ~80%用户

### 2. Open VSX Registry (开源替代)
- **支持平台**: VSCodium, Gitpod, Eclipse Theia, Kiro
- **网址**: https://open-vsx.org/
- **覆盖率**: ~20%用户

**建议**: 同时发布到两个平台，覆盖100%用户！

---

## 📦 方法1: 发布到VSCode Marketplace

### 步骤1: 创建发布者账号

#### 1.1 创建Azure DevOps组织
```bash
# 访问
https://dev.azure.com/

# 1. 登录Microsoft账号（没有就注册一个）
# 2. 点击 "Create new organization"
# 3. 组织名称: claudate-extensions（或你喜欢的名字）
# 4. 选择地区: Asia Pacific - East Asia
# 5. 完成创建
```

#### 1.2 创建Personal Access Token (PAT)
```bash
# 在Azure DevOps中：
# 1. 点击右上角头像 → Personal access tokens
# 2. 点击 "New Token"
# 3. 填写信息：
#    Name: VSCode Marketplace Publisher
#    Organization: All accessible organizations
#    Expiration: 90 days（或更长）
#    Scopes:
#      ✅ Marketplace: Acquire, Manage, Publish
# 4. 点击 Create
# 5. **重要**: 立即复制Token（只显示一次！）
#    保存到安全的地方，例如：
#    ~/.vscode-marketplace-token
```

#### 1.3 创建发布者
```bash
# 访问
https://marketplace.visualstudio.com/manage

# 1. 登录Microsoft账号
# 2. 点击 "Create publisher"
# 3. 填写信息：
#    Publisher ID: Claudate（必须唯一，小写字母）
#    Publisher name: Claudate
#    Email: your-email@example.com
# 4. 点击 Create
```

### 步骤2: 安装vsce工具

```bash
# 全局安装vsce（VSCode Extension Manager）
npm install -g @vscode/vsce

# 验证安装
vsce --version
# 应该显示: 2.x.x
```

### 步骤3: 准备扩展文件

#### 3.1 更新package.json
```json
{
  "name": "project-multilevel-index",
  "displayName": "Project Multilevel Index",
  "description": "Fractal self-referential documentation system - Auto-maintains code indexes, file headers & dependency graphs",
  "version": "0.1.0",
  "publisher": "Claudate",  // ← 你的publisher ID
  "author": {
    "name": "Claudate",
    "url": "https://github.com/Claudate"
  },
  "license": "MIT",
  "icon": "icon.png",  // ← 确保文件存在
  "repository": {
    "type": "git",
    "url": "https://github.com/Claudate/project-multilevel-index.git"
  },
  "bugs": {
    "url": "https://github.com/Claudate/project-multilevel-index/issues"
  },
  "homepage": "https://github.com/Claudate/project-multilevel-index#readme",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": [
    "Other",
    "Programming Languages",
    "Formatters"
  ],
  "keywords": [
    "documentation",
    "index",
    "dependency-graph",
    "auto-documentation",
    "fractal",
    "code-organization",
    "project-structure",
    "multi-language",
    "typescript",
    "python"
  ]
}
```

#### 3.2 创建或更新README.md
```markdown
# Project Multilevel Index

🎼 Fractal self-referential documentation system for VSCode

## Features

- ✨ Automatic index generation
- 🔄 Real-time updates
- 📊 Dependency visualization
- 🌍 10+ languages support

## Quick Start

1. Install the extension
2. Open a project folder
3. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
4. Run: `Project Index: Initialize Index System`

## Screenshots

![Feature 1](images/screenshot1.png)
![Feature 2](images/screenshot2.png)

## Commands

- `Project Index: Initialize Index System` - Create all indexes
- `Project Index: Update All Indexes` - Refresh indexes
- `Project Index: Check Index Consistency` - Validate integrity
- `Project Index: Toggle Auto Update` - Enable/disable auto-update

## Configuration

See settings under `projectMultilevelIndex.*`

## Known Issues

See [GitHub Issues](https://github.com/Claudate/project-multilevel-index/issues)

## Release Notes

### 0.1.0

Initial release with core features.

## License

MIT
```

#### 3.3 创建CHANGELOG.md
```markdown
# Change Log

## [0.1.0] - 2025-12-25

### Added
- Initial release
- Automatic index generation for 10+ programming languages
- File header comments with Input/Output/Pos structure
- FOLDER_INDEX.md generation for each folder
- PROJECT_INDEX.md with Mermaid dependency graph
- Auto-update on file save with FileSystemWatcher
- 4 VSCode commands
- Configurable settings
- Multi-platform support (VSCode, Cursor, Windsurf, Kiro)

### Known Issues
- Welcome message may show multiple times
- Project index updates frequently on large projects
```

#### 3.4 创建图标 (icon.png)
```bash
# 要求:
# - 尺寸: 128x128 或 256x256 像素
# - 格式: PNG
# - 位置: vscode-extension/icon.png

# 临时解决方案（如果还没创建）：
# 使用在线工具生成简单图标
# 网站推荐:
# - https://www.canva.com/
# - https://www.figma.com/
# - AI生成: DALL-E, Midjourney

# 或使用placeholder（纯色正方形）
# 颜色建议: #007ACC (VSCode蓝色)
```

### 步骤4: 验证扩展

```bash
cd h:\Project\Claud_skill\project-multilevel-index\vscode-extension

# 检查是否有错误
vsce ls

# 应该显示所有将要打包的文件列表
# 检查是否包含:
# ✅ package.json
# ✅ README.md
# ✅ CHANGELOG.md
# ✅ LICENSE
# ✅ icon.png
# ✅ dist/extension.js

# 如果有不想包含的文件，创建 .vscodeignore
```

#### 4.1 创建.vscodeignore (可选)
```bash
# .vscodeignore 文件内容:
src/
node_modules/
test-output/
*.test.ts
*.test.js
test-automated.js
test-functional.js
test-manual.md
TEST_REPORT.md
DEVELOPMENT_STATUS.md
IMPLEMENTATION_SUMMARY.md
.vscode/
tsconfig.json
.gitignore
```

### 步骤5: 打包扩展

```bash
cd vscode-extension

# 先构建
npm run build

# 打包成.vsix文件
vsce package

# 成功后会生成:
# project-multilevel-index-0.1.0.vsix

# 文件大小应该在1-5MB之间
```

#### 5.1 本地测试.vsix文件
```bash
# 在VSCode中安装测试
code --install-extension project-multilevel-index-0.1.0.vsix

# 或者通过GUI:
# 1. 打开VSCode
# 2. Extensions面板 (Ctrl+Shift+X)
# 3. 点击 "..." 菜单
# 4. 选择 "Install from VSIX..."
# 5. 选择.vsix文件

# 测试功能是否正常
# 测试完后可以卸载
```

### 步骤6: 发布到Marketplace

```bash
# 登录（使用之前创建的PAT）
vsce login Claudate
# 输入你的Personal Access Token

# 发布
vsce publish

# 或者指定版本号发布
vsce publish 0.1.0

# 或者发布已有的.vsix文件
vsce publish project-multilevel-index-0.1.0.vsix
```

#### 6.1 首次发布可能出现的问题

**问题1: "Publisher not found"**
```bash
# 确保package.json中的publisher字段与你创建的一致
"publisher": "Claudate"
```

**问题2: "Icon not found"**
```bash
# 确保icon.png存在
ls icon.png

# 如果不存在，暂时移除package.json中的icon字段
```

**问题3: "README.md required"**
```bash
# 确保README.md存在且不为空
```

### 步骤7: 验证发布

```bash
# 发布后等待5-10分钟

# 访问你的扩展页面
https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index

# 检查:
# ✅ 扩展显示正常
# ✅ 图标正确
# ✅ README渲染正确
# ✅ 版本号正确
# ✅ 可以点击Install按钮
```

### 步骤8: 更新扩展

```bash
# 后续更新版本:

# 1. 修改代码
# 2. 更新CHANGELOG.md
# 3. 更新package.json中的version
#    "version": "0.1.1"  或 "0.2.0"

# 4. 构建
npm run build

# 5. 发布（自动升级版本号）
vsce publish patch  # 0.1.0 → 0.1.1
vsce publish minor  # 0.1.0 → 0.2.0
vsce publish major  # 0.1.0 → 1.0.0

# 或手动指定版本
vsce publish 0.2.0
```

---

## 🌐 方法2: 发布到Open VSX Registry

### 步骤1: 创建账号

```bash
# 1. 访问
https://open-vsx.org/

# 2. 点击右上角 "Login"
# 3. 使用GitHub账号登录
# 4. 授权Open VSX访问
```

### 步骤2: 获取Access Token

```bash
# 1. 登录后，点击右上角头像
# 2. 选择 "Access Tokens"
# 3. 点击 "Generate New Token"
# 4. 填写:
#    Description: Publishing token
#    Scopes: 选择所有
# 5. 点击 "Generate"
# 6. 复制Token（只显示一次！）
#    保存到: ~/.open-vsx-token
```

### 步骤3: 安装ovsx工具

```bash
# 全局安装ovsx
npm install -g ovsx

# 验证安装
ovsx --version
```

### 步骤4: 发布扩展

```bash
cd vscode-extension

# 使用token发布
ovsx publish project-multilevel-index-0.1.0.vsix -p YOUR_TOKEN

# 或者先设置token
ovsx publish project-multilevel-index-0.1.0.vsix --pat YOUR_TOKEN

# 等待处理（可能需要几分钟）
```

### 步骤5: 验证发布

```bash
# 访问扩展页面
https://open-vsx.org/extension/Claudate/project-multilevel-index

# 检查显示是否正常
```

---

## 🔄 同时发布到两个平台

### 方法1: 手动发布
```bash
cd vscode-extension

# 1. 构建
npm run build

# 2. 打包
vsce package

# 3. 发布到VSCode Marketplace
vsce publish

# 4. 发布到Open VSX
ovsx publish project-multilevel-index-0.1.0.vsix -p YOUR_OVSX_TOKEN
```

### 方法2: 使用npm脚本自动化

在package.json中添加:
```json
{
  "scripts": {
    "publish:vsce": "vsce publish",
    "publish:ovsx": "ovsx publish -p $OVSX_TOKEN",
    "publish:all": "npm run publish:vsce && npm run publish:ovsx"
  }
}
```

使用:
```bash
# 设置环境变量
export OVSX_TOKEN=your_token_here

# 发布到两个平台
npm run publish:all
```

### 方法3: 使用GitHub Actions自动发布

创建 `.github/workflows/publish.yml`:
```yaml
name: Publish Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd vscode-extension
          npm install

      - name: Build extension
        run: |
          cd vscode-extension
          npm run build

      - name: Publish to VSCode Marketplace
        run: |
          cd vscode-extension
          npx @vscode/vsce publish -p ${{ secrets.VSCE_TOKEN }}

      - name: Publish to Open VSX
        run: |
          cd vscode-extension
          npx ovsx publish -p ${{ secrets.OVSX_TOKEN }}
```

在GitHub设置secrets:
```bash
# Repository → Settings → Secrets → Actions
# 添加:
# - VSCE_TOKEN: 你的VSCode Marketplace token
# - OVSX_TOKEN: 你的Open VSX token
```

发布新版本:
```bash
git tag v0.1.0
git push origin v0.1.0
# GitHub Actions自动发布
```

---

## 📊 发布后的管理

### 监控下载量
```bash
# VSCode Marketplace
https://marketplace.visualstudio.com/manage/publishers/Claudate

# Open VSX
https://open-vsx.org/user-settings/extensions
```

### 回复用户评论
```bash
# VSCode Marketplace
# 在扩展页面的Q&A和Reviews标签

# Open VSX
# 通过GitHub Issues
```

### 更新扩展信息
```bash
# 修改package.json后重新发布即可
# 或在Marketplace网站上直接编辑部分信息
```

---

## ⚠️ 常见问题

### Q1: 发布失败 "ERROR Failed request: (401)"
```bash
# Token过期或无效
# 解决: 重新生成token并登录
vsce login Claudate
```

### Q2: 图标不显示
```bash
# 检查icon.png:
# 1. 文件必须在根目录
# 2. 尺寸必须是128x128或256x256
# 3. 格式必须是PNG
# 4. package.json中正确引用: "icon": "icon.png"
```

### Q3: README格式错误
```bash
# VSCode Marketplace使用GitHub风格Markdown
# 但有些限制:
# - 不支持HTML
# - 图片必须使用绝对URL（发布后）
# - 或使用相对路径（本地图片会被打包）
```

### Q4: 扩展太大
```bash
# 检查.vscodeignore是否正确排除了:
# - node_modules/
# - src/ (只需要dist/)
# - *.test.ts
# - test-output/

# 优化后重新打包
vsce package
```

### Q5: "Extension already exists"
```bash
# 扩展名称已被占用
# 解决: 修改package.json中的name字段
# 建议: 先在marketplace搜索名称是否可用
```

---

## 🎯 发布检查清单

### 发布前
- [ ] 代码已测试
- [ ] package.json完整
- [ ] README.md完善
- [ ] CHANGELOG.md已更新
- [ ] LICENSE文件存在
- [ ] icon.png已创建（128x128或256x256）
- [ ] 版本号正确
- [ ] .vscodeignore配置正确
- [ ] 构建成功 (npm run build)

### 发布时
- [ ] vsce package成功
- [ ] .vsix文件大小合理（1-5MB）
- [ ] 本地安装测试通过
- [ ] vsce publish成功
- [ ] ovsx publish成功

### 发布后
- [ ] Marketplace页面显示正常
- [ ] 图标显示正确
- [ ] README渲染正确
- [ ] 可以正常安装
- [ ] 功能正常工作
- [ ] GitHub Release已创建
- [ ] 宣传推广

---

## 📝 快速发布脚本

创建 `publish.sh`:
```bash
#!/bin/bash

echo "🚀 Publishing VSCode Extension..."

# 1. 构建
echo "📦 Building..."
npm run build

# 2. 打包
echo "📦 Packaging..."
vsce package

# 3. 本地测试（可选）
# echo "🧪 Testing locally..."
# code --install-extension *.vsix

# 4. 发布到VSCode Marketplace
echo "📤 Publishing to VSCode Marketplace..."
vsce publish

# 5. 发布到Open VSX
echo "📤 Publishing to Open VSX..."
ovsx publish *.vsix -p $OVSX_TOKEN

echo "✅ Published successfully!"
echo "📊 Check status at:"
echo "   VSCode: https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index"
echo "   Open VSX: https://open-vsx.org/extension/Claudate/project-multilevel-index"
```

使用:
```bash
chmod +x publish.sh
export OVSX_TOKEN=your_token
./publish.sh
```

---

## 🎉 发布后的推广

### 1. 创建GitHub Release
```bash
# 在GitHub仓库页面:
# Releases → Create a new release
# Tag: v0.1.0
# Title: v0.1.0 - Initial Release
# Description: 复制CHANGELOG内容
# 附加.vsix文件
```

### 2. 社交媒体宣传
- Twitter/X
- Reddit (r/vscode)
- Dev.to
- Hacker News
- 产品猎人 (Product Hunt)

### 3. 文档和教程
- 写博客文章
- 录制演示视频
- 创建使用教程

---

**祝发布顺利！** 🎊

如有问题，参考官方文档：
- VSCode Publishing: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- Open VSX: https://github.com/eclipse/openvsx/wiki/Publishing-Extensions
