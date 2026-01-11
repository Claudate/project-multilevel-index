# VSCode扩展手动安装指南

如果自动安装不成功，请按照这个详细步骤手动安装。

---

## 🎯 问题诊断

你现在看到的情况：**Extensions面板为空，没有看到任何扩展**

可能的原因：
1. ❌ 扩展未成功安装
2. ❌ 安装到了错误的位置
3. ❌ VSCode需要重启
4. ❌ 使用的不是标准VSCode

---

## 📦 方法1: 使用安装脚本（推荐）

### Windows
```bash
cd vscode-extension
install.bat
```

### Mac/Linux
```bash
cd vscode-extension
chmod +x install.sh
./install.sh
```

---

## 🔧 方法2: 命令行安装（推荐）

### 步骤1: 进入扩展目录
```bash
cd h:\Project\Claud_skill\project-multilevel-index\vscode-extension
```

### 步骤2: 验证.vsix文件存在
```bash
dir project-multilevel-index-0.1.0.vsix

# 应该看到文件大小约355KB
```

### 步骤3: 关闭所有VSCode窗口
```
完全退出VSCode（不只是关闭窗口）
- Windows: 右键任务栏VSCode图标 → 关闭所有窗口
- 或使用任务管理器确保没有Code.exe进程
```

### 步骤4: 安装扩展
```bash
code --install-extension project-multilevel-index-0.1.0.vsix

# 等待输出，应该看到：
# Installing extensions...
# Extension 'project-multilevel-index' v0.1.0 was successfully installed.
```

### 步骤5: 验证安装
```bash
# 等待2-3秒
timeout /t 3

# 检查扩展列表
code --list-extensions

# 在输出中查找：
# claudate.project-multilevel-index
```

### 步骤6: 重启VSCode并测试
```bash
# 1. 打开VSCode
code .

# 2. 打开Extensions面板
#    点击左侧Extensions图标 (或按 Ctrl+Shift+X)

# 3. 在搜索框输入: @installed

# 4. 应该看到 "Project Multilevel Index"
```

---

## 🛠️ 方法3: GUI手动安装

### 步骤1: 使用VSCode GUI安装

1. **打开VSCode**

2. **打开Extensions面板**
   - 点击左侧Extensions图标
   - 或按 `Ctrl+Shift+X`

3. **打开菜单**
   - 点击Extensions面板右上角的"..."菜单

4. **选择安装选项**
   - 点击 "Install from VSIX..."

5. **选择文件**
   - 浏览到: `h:\Project\Claud_skill\project-multilevel-index\vscode-extension\`
   - 选择: `project-multilevel-index-0.1.0.vsix`
   - 点击"安装"

6. **等待安装完成**
   - 右下角会显示安装进度
   - 完成后会显示"Successfully installed..."

7. **重新加载窗口**
   - 按 `Ctrl+Shift+P`
   - 输入: `Developer: Reload Window`
   - 回车

---

## 📁 方法4: 手动解压安装

如果以上方法都失败，尝试完全手动安装：

### Windows

```bash
# 1. 找到VSCode扩展目录
explorer %USERPROFILE%\.vscode\extensions

# 2. 创建扩展文件夹
mkdir %USERPROFILE%\.vscode\extensions\claudate.project-multilevel-index-0.1.0

# 3. 解压.vsix文件
# 方法A: 改名为.zip然后解压
cd vscode-extension
copy project-multilevel-index-0.1.0.vsix project-multilevel-index-0.1.0.zip
# 使用Windows资源管理器解压到上面创建的文件夹

# 方法B: 使用7-Zip
7z x project-multilevel-index-0.1.0.vsix -o"%USERPROFILE%\.vscode\extensions\claudate.project-multilevel-index-0.1.0"

# 4. 解压后的目录结构应该是：
# .vscode\extensions\claudate.project-multilevel-index-0.1.0\extension\...
# 需要把extension文件夹里的内容移到上一级

cd %USERPROFILE%\.vscode\extensions\claudate.project-multilevel-index-0.1.0
move extension\* .
rmdir extension

# 5. 重启VSCode
```

### Mac/Linux

```bash
# 1. 创建扩展目录
mkdir -p ~/.vscode/extensions/claudate.project-multilevel-index-0.1.0

# 2. 解压.vsix文件
cd vscode-extension
unzip -q project-multilevel-index-0.1.0.vsix -d ~/.vscode/extensions/claudate.project-multilevel-index-0.1.0

# 3. 调整目录结构
cd ~/.vscode/extensions/claudate.project-multilevel-index-0.1.0
mv extension/* .
rmdir extension

# 4. 重启VSCode
```

---

## ✅ 验证安装成功

安装后，按以下步骤验证：

### 1. 检查Extensions面板
```
Ctrl+Shift+X → 搜索: @installed
应该看到: Project Multilevel Index
```

### 2. 检查命令
```
Ctrl+Shift+P → 输入: Project Index
应该看到4个命令：
- Project Index: Initialize Index System
- Project Index: Update All Indexes
- Project Index: Check Index Consistency
- Project Index: Toggle Auto Update
```

### 3. 测试功能
```
1. 打开一个代码项目文件夹
   File → Open Folder

2. 运行初始化命令
   Ctrl+Shift+P → Project Index: Initialize Index System

3. 应该看到：
   - 进度通知
   - 生成的PROJECT_INDEX.md
   - 各文件夹的FOLDER_INDEX.md
   - 代码文件顶部的注释
```

---

## 🔍 检查扩展目录

如果还是找不到，手动检查扩展是否真的安装了：

### Windows
```bash
# 打开扩展目录
explorer %USERPROFILE%\.vscode\extensions

# 查找包含 "project-multilevel-index" 的文件夹
dir %USERPROFILE%\.vscode\extensions | findstr project
```

### Mac/Linux
```bash
# 列出扩展
ls -la ~/.vscode/extensions | grep project
```

应该看到类似：
```
claudate.project-multilevel-index-0.1.0/
```

---

## 🚨 常见问题

### Q1: 安装时提示"command not found: code"
```
原因: code命令未添加到PATH

解决方案:
1. 打开VSCode
2. Ctrl+Shift+P
3. 输入: Shell Command: Install 'code' command in PATH
4. 重启终端
```

### Q2: 安装成功但Extensions面板为空
```
原因: 可能是VSCode缓存问题

解决方案:
1. 完全关闭VSCode
2. 删除缓存:
   Windows: del /s /q %APPDATA%\Code\Cache\*
   Mac: rm -rf ~/Library/Application\ Support/Code/Cache/*
3. 重启VSCode
```

### Q3: 看到扩展但显示"已禁用"
```
解决方案:
1. 在Extensions面板找到扩展
2. 点击"Enable"按钮
3. 重新加载窗口
```

### Q4: 使用Cursor/Windsurf/Kiro等编辑器
```
这些编辑器有自己的扩展目录：

Cursor:
- Windows: %USERPROFILE%\.cursor\extensions
- Mac: ~/.cursor/extensions

Windsurf:
- 类似VSCode

Kiro:
- 使用Open VSX Registry
```

---

## 📞 仍然无法安装？

如果以上所有方法都失败：

### 1. 收集诊断信息
```bash
# VSCode版本
code --version

# 扩展目录
dir %USERPROFILE%\.vscode\extensions

# 尝试安装并保存输出
code --install-extension project-multilevel-index-0.1.0.vsix > install_log.txt 2>&1
```

### 2. 检查.vsix文件
```bash
# 检查文件大小
dir project-multilevel-index-0.1.0.vsix

# 应该是约355KB
# 如果大小不对，重新打包：
npm run build
vsce package
```

### 3. 使用开发模式测试
```bash
# 方法：使用Extension Development Host
cd vscode-extension
code .

# 按F5启动调试
# 会打开新的VSCode窗口，扩展自动加载
# 在新窗口中测试功能
```

### 4. 提交Issue
如果还是无法解决，请在GitHub提交Issue：
https://github.com/Claudate/project-multilevel-index/issues

提供：
- VSCode版本 (`code --version`)
- 操作系统
- 安装日志 (install_log.txt)
- Extensions目录截图

---

## 🎯 最简单的测试方法

如果你只是想快速测试扩展功能：

```bash
# 1. 进入扩展目录
cd vscode-extension

# 2. 用VSCode打开
code .

# 3. 按F5 (启动Extension Development Host)

# 4. 在新打开的窗口中：
#    File → Open Folder → 选择测试项目
#    Ctrl+Shift+P → Project Index: Initialize

# 这个方法不需要安装，直接运行扩展代码
```

---

**更新时间**: 2025-12-25
