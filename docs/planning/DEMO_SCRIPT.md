# 演示脚本 - 分形多级索引系统

本脚本用于录制演示 GIF/视频,展示索引系统的核心功能。

---

## 准备工作

### 工具要求
- **录屏工具**:
  - macOS: QuickTime / ScreenFlow
  - Windows: OBS Studio / ScreenToGif
  - Linux: Kazam / SimpleScreenRecorder
- **GIF 转换**:
  - [LICEcap](https://www.cockos.com/licecap/)
  - [Gifski](https://gif.ski/)
  - [FFmpeg](https://ffmpeg.org/)

### 环境准备
1. 清理终端历史: `clear`
2. 设置合适的终端字体大小 (16pt+)
3. 使用清爽的配色方案
4. 关闭不必要的通知

---

## 演示 1: Claude Code - 初始化索引 (30秒)

### 场景
展示如何在一个新项目中初始化索引系统

### 步骤

**[00:00-00:05] 展示项目结构**
```bash
# 显示示例项目
cd examples/cursor-example
tree -L 2 src/
```

**输出**:
```
src/
├── controllers
│   ├── auth.controller.ts
│   └── user.controller.ts
├── models
│   └── User.ts
├── services
│   ├── auth.service.ts
│   └── user.service.ts
└── utils
    └── logger.ts
```

**[00:05-00:10] 启动 Claude Code 并初始化**
```bash
# 在 Claude Code 中执行
/project-multilevel-index:init-index
```

**[00:10-00:20] 显示进度**
- Claude 扫描项目
- 显示发现的文件数
- 显示生成进度

**[00:20-00:25] 展示生成的文件**
```bash
# 显示生成的索引文件
tree -L 3
```

**输出**:
```
.
├── PROJECT_INDEX.md ← 新生成
├── src/
│   ├── controllers/
│   │   ├── FOLDER_INDEX.md ← 新生成
│   │   ├── auth.controller.ts (已添加文件头)
│   │   └── user.controller.ts (已添加文件头)
...
```

**[00:25-00:30] 快速查看 PROJECT_INDEX.md**
```bash
# 显示依赖图部分
head -n 50 PROJECT_INDEX.md
```

---

## 演示 2: Cursor - 自动更新索引 (45秒)

### 场景
演示修改代码后索引自动更新

### 步骤

**[00:00-00:05] 打开 Cursor 编辑器**
```bash
cursor examples/cursor-example
```

**[00:05-00:15] 修改代码**

打开 `src/services/user.service.ts`

在文件顶部添加:
```typescript
import { EmailService } from './email.service';
```

保存文件

**[00:15-00:25] 触发 AI 更新**

在 Cursor Chat 中输入:
```
请检查并更新索引系统
```

**[00:25-00:35] 显示 AI 响应**

AI 应该:
1. 检测到结构性变更
2. 更新 user.service.ts 文件头
3. 更新 FOLDER_INDEX.md
4. 更新 PROJECT_INDEX.md

**[00:35-00:40] 查看变更**
```bash
# 显示文件头变更
git diff src/services/user.service.ts
```

**输出**:
```diff
 /**
- * Input: User, CreateUserDTO from models/User, Logger from utils/logger
+ * Input: User, CreateUserDTO from models/User, Logger from utils/logger, EmailService from ./email.service
  * Output: UserService class, createUser/findById/findAll methods
  * Pos: Service Layer - User domain service
  */
```

**[00:40-00:45] 查看依赖图更新**
```bash
# 显示 PROJECT_INDEX.md 的依赖图部分
grep -A 20 "```mermaid" PROJECT_INDEX.md
```

---

## 演示 3: 多平台对比 (20秒)

### 场景
快速对比 Cursor/Windsurf/Kiro 的配置差异

### 步骤

**[00:00-00:07] Cursor**
```bash
# 显示 Cursor 配置
tree -L 2 examples/cursor-example/.cursor/
```

**输出**:
```
.cursor/
├── index-config.json
└── rules/
    └── doc-maintenance.md
```

**[00:07-00:14] Windsurf**
```bash
# 显示 Windsurf 配置
tree -L 2 examples/windsurf-example/.windsurf/
```

**输出**:
```
.windsurf/
├── index-config.json
└── rules/
    └── doc-maintenance.md
```

**[00:14-00:20] 对比**

并排显示配置文件内容 (高亮差异部分):
- `.cursor/` vs `.windsurf/` vs `.kiro/`
- `.cursorrules` vs `.windsurfrules` vs `.kirorules`

---

## 演示 4: 依赖关系可视化 (30秒)

### 场景
展示 Mermaid 依赖图的可视化效果

### 步骤

**[00:00-00:05] 打开 PROJECT_INDEX.md**
```bash
# 在支持 Mermaid 的编辑器中打开
code PROJECT_INDEX.md
```

**[00:05-00:15] 显示 Mermaid 图**

在 VSCode/GitHub/Obsidian 中展示渲染后的依赖图

**高亮显示**:
- 不同颜色的节点 (Controllers/Services/Models/Utils)
- 依赖箭头方向
- 分层结构

**[00:15-00:25] 演示交互**
- 点击节点查看文件
- 悬停显示完整路径
- 放大/缩小

**[00:25-00:30] 对比文本 vs 可视化**

并排显示:
- 左侧: 文本形式的依赖列表
- 右侧: Mermaid 可视化图

---

## 演示 5: 检查一致性 (25秒)

### 场景
演示索引一致性检查功能

### 步骤

**[00:00-00:05] 故意破坏索引**
```bash
# 删除一个 FOLDER_INDEX.md
rm src/services/FOLDER_INDEX.md
```

**[00:05-00:10] 运行检查**
```bash
# 在 Claude Code 中执行
/project-multilevel-index:check-index
```

**[00:10-00:20] 显示检查报告**

**输出**:
```
索引一致性检查报告
==================

✅ 文件头完整性: 6/6
❌ 文件夹索引: 3/4 (1 个缺失)
  - src/services/FOLDER_INDEX.md 缺失
✅ 依赖关系: 正常
⚠️ 索引结构: 发现问题

建议:
1. 运行 /project-multilevel-index:update-index 修复
```

**[00:20-00:25] 修复问题**
```bash
# 执行修复
/project-multilevel-index:update-index
```

---

## 演示 6: 国际化切换 (15秒)

### 场景
演示中英文切换功能

### 步骤

**[00:00-00:05] 查看当前语言**
```bash
# 显示当前 PROJECT_INDEX.md (中文)
head -n 20 PROJECT_INDEX.md
```

**[00:05-00:10] 切换为英文**
```bash
# 在 Claude Code 中执行
/project-multilevel-index:set-language en-US
/project-multilevel-index:update-index
```

**[00:10-00:15] 显示英文版本**
```bash
# 显示更新后的 PROJECT_INDEX.md (英文)
head -n 20 PROJECT_INDEX.md
```

**对比**:
```diff
- # 项目索引
+ # Project Index

- ## 项目概览
+ ## Project Overview

- ## 依赖关系图
+ ## Dependency Graph
```

---

## GIF 制作指南

### 推荐工具
- **ScreenToGif** (Windows): 直接录制为 GIF
- **Gifski** (macOS/Linux): 高质量视频转 GIF
- **FFmpeg**: 命令行转换

### FFmpeg 转换命令

**录制为 MP4**:
```bash
ffmpeg -i screen-recording.mov -vf "fps=10,scale=1280:-1:flags=lanczos" -c:v libx264 demo.mp4
```

**转换为 GIF**:
```bash
ffmpeg -i demo.mp4 -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demo.gif
```

**优化 GIF 大小**:
```bash
gifsicle -O3 --colors 128 demo.gif -o demo-optimized.gif
```

### 最佳实践

**画面设置**:
- 分辨率: 1280x720 (录制) → 800x450 (GIF)
- 帧率: 10-15 FPS (GIF)
- 时长: 15-45秒 (单个演示)

**文字清晰**:
- 使用大字体 (16pt+)
- 高对比度配色
- 简化输出内容

**文件大小**:
- 目标: <5MB (GitHub README 友好)
- 使用优化工具压缩
- 必要时降低分辨率/帧率

---

## 演示视频结构

### 完整演示视频 (2-3分钟)

**开场 (10秒)**
- 显示项目 Logo
- 标题: "分形多级索引系统演示"
- 字幕: "受《哥德尔、埃舍尔、巴赫》启发"

**第一部分: 核心概念 (30秒)**
- 展示三级结构图
- 动画演示自指性
- 展示分形特性

**第二部分: 实际操作 (90秒)**
- 演示 1: 初始化索引 (30秒)
- 演示 2: 自动更新 (30秒)
- 演示 4: 可视化 (30秒)

**第三部分: 高级功能 (30秒)**
- 演示 5: 一致性检查 (15秒)
- 演示 6: 国际化 (15秒)

**结尾 (10秒)**
- 项目链接
- Star/Fork 提示
- 感谢观看

---

## 截图清单

为 README 和文档准备的静态截图:

### 必需截图

1. **初始化成功**
   - 文件: `screenshots/init-success.png`
   - 内容: 显示初始化完成的输出

2. **PROJECT_INDEX 预览**
   - 文件: `screenshots/project-index.png`
   - 内容: PROJECT_INDEX.md 在 GitHub 上的渲染效果

3. **Mermaid 依赖图**
   - 文件: `screenshots/dependency-graph.png`
   - 内容: 彩色的 Mermaid 依赖关系图

4. **文件头注释**
   - 文件: `screenshots/file-header.png`
   - 内容: 代码文件中的 Input/Output/Pos 注释

5. **FOLDER_INDEX**
   - 文件: `screenshots/folder-index.png`
   - 内容: FOLDER_INDEX.md 的内容

6. **一致性检查报告**
   - 文件: `screenshots/check-report.png`
   - 内容: 检查命令的输出报告

7. **多平台对比**
   - 文件: `screenshots/multi-platform.png`
   - 内容: Cursor/Windsurf/Kiro 配置并排对比

8. **中英文对比**
   - 文件: `screenshots/i18n-comparison.png`
   - 内容: 同一文档的中英文版本对比

---

## 发布清单

准备好演示材料后,完成以下任务:

- [ ] 录制所有演示 GIF (6个)
- [ ] 制作完整演示视频 (1个)
- [ ] 拍摄所有必需截图 (8个)
- [ ] 优化 GIF 大小 (<5MB)
- [ ] 上传到 `assets/` 目录
- [ ] 在 README 中嵌入 GIF
- [ ] 在 YouTube/Bilibili 发布视频
- [ ] 在 README 中添加视频链接

---

**下一步**: 开始录制第一个演示!
