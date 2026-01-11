# VSCode扩展故障排查指南

如果安装后在VSCode中看不到扩展，请按以下步骤排查。

---

## 🔍 快速诊断

### 步骤1: 检查扩展是否已安装

**方法1: 通过Extensions面板**
```
1. 打开VSCode
2. 点击左侧Extensions图标 (或按 Ctrl+Shift+X)
3. 在搜索框输入: @installed project
4. 查找 "Project Multilevel Index"
```

**方法2: 通过命令面板**
```
1. 按 Ctrl+Shift+P 打开命令面板
2. 输入: Extensions: Show Installed Extensions
3. 查找 "Project Multilevel Index"
```

**方法3: 检查扩展目录**
```bash
# Windows
dir %USERPROFILE%\.vscode\extensions | findstr project-multilevel-index

# Mac/Linux
ls ~/.vscode/extensions | grep project-multilevel-index
```

---

## ❌ 问题1: 扩展未出现在列表中

### 原因A: 安装失败

**症状**: 安装时没有看到成功提示

**解决方案**:
```bash
# 重新安装，注意观察输出
cd vscode-extension
code --install-extension project-multilevel-index-0.1.0.vsix

# 应该看到类似输出:
# Installing extensions...
# Extension 'project-multilevel-index' v0.1.0 was successfully installed.
```

### 原因B: VSCode版本过低

**症状**: 安装时提示版本不兼容

**解决方案**:
```bash
# 检查VSCode版本
code --version

# 需要版本 >= 1.85.0
# 如果版本低，请更新VSCode
```

### 原因C: 使用了VSCode的分支版本

**症状**: 使用Cursor/Windsurf/Kiro等

**解决方案**:
```bash
# Cursor
cursor --install-extension project-multilevel-index-0.1.0.vsix

# 或手动安装:
# 1. 复制.vsix文件到扩展目录
# 2. 重启编辑器
```

---

## ❌ 问题2: 扩展已安装但命令不显示

### 原因A: 扩展未激活

**症状**:
- 扩展出现在已安装列表
- 但命令面板中找不到命令

**解决方案**:
```bash
# 1. 打开一个文件夹
File → Open Folder → 选择任意项目

# 2. 重新加载窗口
Ctrl+Shift+P → Developer: Reload Window

# 3. 检查扩展状态
Ctrl+Shift+P → Developer: Show Running Extensions
# 查找 "project-multilevel-index"
```

### 原因B: 激活事件未触发

**症状**: 扩展显示为"未激活"

**解决方案**:
```bash
# 扩展配置为 "onStartupFinished" 激活
# 应该在VSCode启动后自动激活

# 如果没有激活:
1. 确保打开了工作区文件夹（不是单个文件）
2. 重启VSCode
3. 查看Output面板是否有错误
```

---

## ❌ 问题3: 看到扩展但功能不工作

### 检查扩展日志

```bash
# 1. 打开Output面板
View → Output (或 Ctrl+Shift+U)

# 2. 在下拉菜单选择 "ProjectIndex"

# 3. 查看是否有错误信息
# 应该看到:
# "Activating Project Multilevel Index extension..."
# "✅ Extension activated successfully"
```

### 检查开发者工具

```bash
# 打开开发者工具
Help → Toggle Developer Tools

# 查看Console标签
# 查找与 "project-multilevel-index" 相关的错误
```

---

## ❌ 问题4: 安装后需要重启

某些情况下，VSCode需要重启才能识别新安装的扩展。

**解决方案**:
```bash
# 方法1: 重新加载窗口（推荐）
Ctrl+Shift+P → Developer: Reload Window

# 方法2: 完全重启VSCode
关闭VSCode → 重新打开
```

---

## 📋 完整的安装验证清单

按顺序检查以下各项：

### 1. 安装验证
- [ ] .vsix文件存在且大小正常（~355KB）
- [ ] 安装命令执行成功，有成功提示
- [ ] 扩展出现在Extensions列表中

### 2. 激活验证
- [ ] 打开了工作区文件夹（不是单个文件）
- [ ] 重新加载了窗口
- [ ] Output面板显示激活成功

### 3. 功能验证
- [ ] 按Ctrl+Shift+P能看到"Project Index"命令
- [ ] 共有4个命令:
  - Initialize Index System
  - Update All Indexes
  - Check Index Consistency
  - Toggle Auto Update

### 4. 测试验证
- [ ] 运行"Initialize Index System"命令
- [ ] 看到进度通知
- [ ] 项目中生成了索引文件

---

## 🔧 手动安装方法

如果自动安装失败，可以尝试手动安装：

### Windows
```bash
# 1. 找到VSCode扩展目录
%USERPROFILE%\.vscode\extensions

# 2. 解压.vsix文件
# .vsix本质是zip文件
rename project-multilevel-index-0.1.0.vsix project-multilevel-index-0.1.0.zip
# 解压到: claudate.project-multilevel-index-0.1.0

# 3. 重启VSCode
```

### Mac/Linux
```bash
# 1. 解压
unzip project-multilevel-index-0.1.0.vsix -d ~/.vscode/extensions/claudate.project-multilevel-index-0.1.0

# 2. 重启VSCode
```

---

## 🐛 常见错误信息

### 错误1: "Extension is not compatible"
```
原因: VSCode版本太低
解决: 升级VSCode到1.85.0或更高版本
```

### 错误2: "Unable to install extension"
```
原因: 权限问题或文件损坏
解决:
1. 以管理员身份运行VSCode
2. 重新下载.vsix文件
3. 检查文件大小是否为355KB
```

### 错误3: "Extension activation failed"
```
原因: 代码错误或依赖缺失
解决:
1. 查看Output面板的详细错误
2. 查看Developer Tools的Console
3. 提交issue到GitHub
```

---

## 📞 获取帮助

如果以上方法都无法解决问题：

### 1. 收集信息
```bash
# VSCode版本
Help → About

# 操作系统版本
# Windows: Win+R → winver
# Mac: Apple Menu → About This Mac
# Linux: lsb_release -a

# 扩展列表
Ctrl+Shift+P → Developer: Show Running Extensions

# 错误日志
Output面板 → ProjectIndex频道
Developer Tools → Console
```

### 2. 报告问题
访问: https://github.com/Claudate/project-multilevel-index/issues

提供:
- VSCode版本
- 操作系统
- 错误信息截图
- Output面板日志
- Console错误信息

---

## ✅ 验证扩展正常工作

运行这个简单测试：

```bash
# 1. 打开任意代码项目
# 2. 按 Ctrl+Shift+P
# 3. 输入: Project Index: Initialize
# 4. 执行命令

# 预期结果:
# - 看到进度通知
# - 项目中生成 PROJECT_INDEX.md
# - 各文件夹生成 FOLDER_INDEX.md
# - 代码文件顶部添加了注释
```

如果能完成以上测试，说明扩展工作正常！🎉

---

## 🔄 重新安装

如果一切都失败了，尝试完全重新安装：

```bash
# 1. 卸载扩展
# Extensions面板 → 找到扩展 → 右键 → Uninstall

# 2. 删除扩展目录
# Windows: 删除 %USERPROFILE%\.vscode\extensions\claudate.project-multilevel-index-*
# Mac/Linux: rm -rf ~/.vscode/extensions/claudate.project-multilevel-index-*

# 3. 重启VSCode

# 4. 重新安装
code --install-extension project-multilevel-index-0.1.0.vsix

# 5. 重启VSCode
```

---

**最后更新**: 2025-12-25
