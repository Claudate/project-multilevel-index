# 🚀 立即发布到VSCode Marketplace

## 📋 发布前最终检查

### ✅ 已完成
- [x] 核心功能实现
- [x] 自动化测试通过 (19/19)
- [x] 扩展图标 (icon.png)
- [x] LICENSE文件
- [x] README.md
- [x] CHANGELOG.md
- [x] 打包成功 (.vsix)
- [x] 本地安装测试

### ⏳ 发布前准备
- [ ] 创建Azure DevOps账号
- [ ] 获取Personal Access Token
- [ ] 创建Publisher账号
- [ ] 发布到Marketplace

---

## 🎯 发布步骤

### 步骤1: 创建Microsoft账号（如果没有）

访问: https://account.microsoft.com/

1. 点击 "创建账号"
2. 使用邮箱注册
3. 验证邮箱

---

### 步骤2: 创建Azure DevOps组织

访问: https://dev.azure.com/

```
1. 使用Microsoft账号登录
2. 点击 "Create new organization"
3. 组织名称: claudate-extensions (或其他名字)
4. 选择地区: East Asia
5. 点击 "Continue"
```

---

### 步骤3: 创建Personal Access Token (PAT)

```
1. 在Azure DevOps页面，点击右上角用户图标
2. 选择 "Personal access tokens"
3. 点击 "New Token"
4. 填写信息:
   Name: VSCode Marketplace Publisher
   Organization: All accessible organizations
   Expiration: 90 days (或Custom选择更长)
   Scopes:
     ✅ Marketplace (选择 Manage)
5. 点击 "Create"
6. 🚨 重要：立即复制Token！只显示一次！
7. 保存到安全位置，例如：
   记事本 → 保存为 marketplace-token.txt
```

**Token示例格式**:
```
abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr
```

---

### 步骤4: 创建Publisher

访问: https://marketplace.visualstudio.com/manage

```
1. 使用Microsoft账号登录
2. 点击 "Create publisher"
3. 填写信息:
   Publisher ID: Claudate (必须唯一，只能小写字母、数字、连字符)
   Publisher name: Claudate
   Email: your-email@example.com
4. 点击 "Create"
```

**重要**：Publisher ID必须与package.json中的一致！

检查package.json:
```json
{
  "publisher": "Claudate"  // ← 必须匹配
}
```

---

### 步骤5: 登录vsce

打开命令行：

```bash
cd h:\Project\Claud_skill\project-multilevel-index\vscode-extension

# 登录
vsce login Claudate

# 会提示输入Personal Access Token
# 粘贴你在步骤3复制的Token
# 按Enter
```

应该看到：
```
Successfully logged in as Claudate!
```

---

### 步骤6: 最后检查

```bash
# 检查文件
ls -la

确认存在：
✅ package.json
✅ README.md
✅ CHANGELOG.md
✅ LICENSE
✅ icon.png
✅ dist/extension.js

# 检查package.json
cat package.json | grep -E "name|version|publisher|displayName"

应该显示：
  "name": "project-multilevel-index",
  "displayName": "Project Multilevel Index",
  "version": "0.1.0",
  "publisher": "Claudate",
```

---

### 步骤7: 发布！🚀

```bash
cd vscode-extension

# 方法1: 发布现有的.vsix文件
vsce publish

# 或方法2: 指定版本号
vsce publish 0.1.0

# 或方法3: 发布并自动升级版本
vsce publish patch   # 0.1.0 → 0.1.1
vsce publish minor   # 0.1.0 → 0.2.0
vsce publish major   # 0.1.0 → 1.0.0
```

**预期输出**：
```
Publishing Claudate.project-multilevel-index@0.1.0...
Successfully published Claudate.project-multilevel-index@0.1.0!

Your extension will live at:
https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index
```

---

## ⏱️ 发布后等待

发布后需要等待**5-10分钟**进行审核和处理。

### 检查发布状态

访问: https://marketplace.visualstudio.com/manage/publishers/Claudate

应该看到：
- 扩展名称
- 版本号
- 状态: Published
- 下载量: 0

---

## ✅ 验证发布成功

### 1. 访问扩展页面

```
https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index
```

检查：
- ✅ 扩展图标显示
- ✅ README内容正确
- ✅ Install按钮可用
- ✅ 版本号正确

### 2. 搜索测试

在VSCode中：
```
1. 打开VSCode
2. Ctrl+Shift+X 打开Extensions
3. 搜索: Project Multilevel Index
4. 应该能找到你的扩展
5. 点击Install测试
```

### 3. 安装测试

```bash
# 卸载本地版本
# 从Marketplace安装
# 测试所有功能
```

---

## 🎉 发布完成后

### 1. 创建GitHub Release

```bash
cd ..
git tag v0.1.0
git push origin v0.1.0
```

在GitHub页面创建Release:
```
1. 访问: https://github.com/Claudate/project-multilevel-index/releases
2. 点击 "Create a new release"
3. Tag: v0.1.0
4. Title: v0.1.0 - Initial Release
5. 描述: 复制CHANGELOG内容
6. 附件: 上传 project-multilevel-index-0.1.0.vsix
7. 点击 "Publish release"
```

### 2. 更新README.md

在项目根目录的README.md中添加安装徽章：

```markdown
[![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/Claudate.project-multilevel-index)](https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/Claudate.project-multilevel-index)](https://marketplace.visualstudio.com/items?itemName=Claudate.project-multilevel-index)
```

### 3. 宣传推广

- 更新项目README
- 发布到社交媒体
- 分享到开发者社区
- 写博客文章

---

## ❌ 常见发布问题

### 问题1: "ERROR Publisher 'Claudate' not found"

**原因**: Publisher未创建或名称不匹配

**解决**:
```bash
# 检查package.json中的publisher
cat package.json | grep publisher

# 必须与Marketplace上创建的Publisher ID完全一致
# 访问 https://marketplace.visualstudio.com/manage
# 检查Publisher ID
```

### 问题2: "ERROR 401 Unauthorized"

**原因**: Token过期或无效

**解决**:
```bash
# 重新登录
vsce logout
vsce login Claudate
# 输入新的Token
```

### 问题3: "ERROR Missing README"

**原因**: README.md不存在或为空

**解决**:
```bash
# 确保README.md存在且有内容
ls -lh README.md
cat README.md
```

### 问题4: "ERROR Icon not found"

**原因**: icon.png不存在

**解决**:
```bash
# 检查图标文件
ls -lh icon.png

# 如果不存在，暂时移除package.json中的icon字段
# 或确保icon.png存在
```

---

## 🔄 更新版本

发布新版本时：

```bash
# 1. 修改代码
# 2. 更新CHANGELOG.md
# 3. 构建
npm run build

# 4. 发布（自动升级版本）
vsce publish patch   # 0.1.0 → 0.1.1 (bug修复)
vsce publish minor   # 0.1.0 → 0.2.0 (新功能)
vsce publish major   # 0.1.0 → 1.0.0 (重大更新)
```

---

## 📊 发布后监控

### 查看统计

访问: https://marketplace.visualstudio.com/manage/publishers/Claudate

可以看到：
- 总下载量
- 每日/每周/每月下载趋势
- 用户评分和评论
- 活跃用户数

### 回复用户

- 及时回复Q&A
- 处理用户反馈
- 修复报告的bug
- 添加用户建议的功能

---

## 🎯 发布清单

打印这个清单，逐项完成：

```
前置准备：
□ Microsoft账号创建
□ Azure DevOps组织创建
□ Personal Access Token获取并保存
□ Publisher账号创建

文件检查：
□ package.json (publisher字段正确)
□ README.md (完整且格式正确)
□ CHANGELOG.md (包含0.1.0版本信息)
□ LICENSE (MIT许可证)
□ icon.png (30KB, 存在)
□ dist/extension.js (1.6MB, 已构建)

发布操作：
□ vsce login成功
□ vsce publish执行
□ 等待5-10分钟
□ 验证Marketplace页面
□ 测试安装

发布后：
□ 创建GitHub Release
□ 更新README徽章
□ 分享到社交媒体
□ 监控下载量和反馈
```

---

## 📞 需要帮助？

**发布过程遇到问题？**

1. 查看 [PUBLISHING_GUIDE.md](PUBLISHING_GUIDE.md) - 详细发布指南
2. 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 故障排查
3. 访问官方文档: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
4. 提交Issue: https://github.com/Claudate/project-multilevel-index/issues

---

## 🎊 准备好了吗？

如果所有准备工作完成，运行：

```bash
cd vscode-extension
vsce publish
```

让我们发布你的第一个VSCode扩展！🚀

---

**最后更新**: 2025-12-25
