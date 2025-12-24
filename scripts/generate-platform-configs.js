#!/usr/bin/env node

/**
 * 平台配置自动生成脚本
 *
 * 功能:
 * 1. 从 universal/core/rules/ 读取核心规则
 * 2. 为各平台生成适配的配置文件
 * 3. 确保所有平台配置与核心规则保持一致
 *
 * 使用:
 * node scripts/generate-platform-configs.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const CORE_RULES_PATH = 'universal/core/rules/doc-maintenance.md';
const VERSION = '2.0.0';
const UPDATE_DATE = new Date().toISOString().split('T')[0];

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 读取核心规则文件
function readCoreRules() {
  try {
    return fs.readFileSync(CORE_RULES_PATH, 'utf8');
  } catch (error) {
    log(`❌ 无法读取核心规则文件: ${CORE_RULES_PATH}`, 'red');
    process.exit(1);
  }
}

// 生成 Kiro Steering 配置
function generateKiroSteering(targetPath) {
  const relativePathToCore = path.relative(
    path.dirname(targetPath),
    CORE_RULES_PATH
  ).replace(/\\/g, '/');

  const content = `# 分形索引系统 - Steering 配置

> **Kiro AI 编辑器专用配置** - 本文件在每次新对话时自动加载

---

## 📋 核心规则引用

本项目使用**分形多级索引系统**自动维护文档。

完整的维护规则请参考:

#[[file:${relativePathToCore}]]

---

## 🎯 核心工作流程

当你修改代码文件时,请遵循以下流程:

### 1. 检测变更类型

检查文件内容是否包含**结构性变更关键字**:
- **依赖**: \`import\`, \`require\`, \`use\`, \`from\`, \`#include\`, \`using\`
- **导出**: \`export\`, \`public\`, \`class\`, \`interface\`, \`function\`, \`def\`, \`fn\`, \`struct\`

### 2. 执行更新策略

- **结构性变更** → 执行完整更新 (文件头 + FOLDER_INDEX + PROJECT_INDEX)
- **实现变更** → 跳过更新,继续当前任务

### 3. 保持静默

- 小改动: 静默处理,不打断用户
- 大改动: 简短提示 (一行信息)

---

## 🔄 关键原则

1. **主动性**: 主动检测并执行更新,不等待用户提醒
2. **准确性**: 正确识别变更类型
3. **静默性**: 不打断用户工作流
4. **一致性**: 确保三级索引同步

---

## 📖 详细规则

所有详细的执行流程、错误处理、输出风格等,请查看:

#[[file:${relativePathToCore}]]

---

## 💡 快速参考

### 过滤规则
- 跳过: \`PROJECT_INDEX.md\`, \`FOLDER_INDEX.md\`, 索引文件
- 跳过: \`node_modules\`, \`.git\`, \`dist\`, \`build\` 等目录
- 跳过: 非代码文件 (只处理 .js .ts .py .java .rs .go 等)
- 跳过: 大于 500KB 的文件

### 三级索引结构
\`\`\`
PROJECT_INDEX.md (根索引 + Mermaid 依赖图)
├── FOLDER_INDEX.md (文件夹索引)
│   └── file.ts (文件头注释: Input/Output/Pos)
\`\`\`

### 更新时机
- ✅ 创建新文件
- ✅ 修改现有文件 (含结构性变更)
- ✅ 删除文件
- ❌ 仅修改注释或实现细节

---

**版本**: ${VERSION}
**更新日期**: ${UPDATE_DATE}
**架构**: 引用分离 (Reference Separation)
**自动生成**: 由 scripts/generate-platform-configs.js 生成
`;

  return content;
}

// 生成 Cursor Rules 配置
function generateCursorRules(targetPath) {
  const content = `# 项目约定 - 分形索引系统

> **Cursor AI 编辑器专用配置** - 本文件在每次新对话时自动加载

---

## 📚 核心职责

本项目使用**分形多级索引系统**自动维护文档。当你修改代码文件时,自动更新索引系统。

---

## 🎯 核心工作流程

### 1. 检测变更类型

检查文件是否包含**结构性变更关键字**:
- **依赖**: \`import\`, \`require\`, \`use\`, \`from\`, \`#include\`, \`using\`
- **导出**: \`export\`, \`public\`, \`class\`, \`interface\`, \`function\`, \`def\`, \`fn\`, \`struct\`

### 2. 执行更新策略

- **结构性变更** → 执行完整更新:
  - ✅ 更新文件头注释 (Input/Output/Pos)
  - ✅ 更新所在文件夹的 FOLDER_INDEX.md
  - ✅ 更新 PROJECT_INDEX.md 和依赖关系图

- **实现变更** → 跳过更新,继续当前任务

### 3. 保持静默

- 小改动: 静默处理,不打断用户
- 大改动: 简短提示 "✅ 索引已更新"

---

## 🔄 关键原则

1. **主动性**: 主动检测并执行更新,不等待用户提醒
2. **准确性**: 正确识别变更类型
3. **静默性**: 不打断用户工作流
4. **一致性**: 确保三级索引同步

---

## 💡 快速参考

### 过滤规则
- **跳过文件**: \`PROJECT_INDEX.md\`, \`FOLDER_INDEX.md\`
- **跳过目录**: \`node_modules\`, \`.git\`, \`dist\`, \`build\`, \`.next\`, \`target\`
- **支持语言**: \`.js .jsx .ts .tsx .py .java .kt .rs .go .cpp .c .h .php .rb .swift .cs\`
- **文件大小**: 跳过 > 500KB 的文件

### 三级索引结构
\`\`\`
PROJECT_INDEX.md (根索引 + Mermaid 依赖图)
├── src/FOLDER_INDEX.md (文件夹索引)
│   └── file.ts (文件头注释: Input/Output/Pos)
\`\`\`

---

## 📖 详细规则

完整的维护规则、执行流程、错误处理等详细信息,请参考:

**规则文件**: \`.cursor/rules/doc-maintenance.md\`

你可以随时阅读该文件以了解完整的实现细节。

---

## 🎨 快速命令

用户可以使用以下命令:

- **初始化索引**: "请为本项目初始化索引系统"
- **更新索引**: "请更新索引系统"
- **检查一致性**: "请检查索引一致性"
- **切换语言**: "请将索引系统切换为英文/中文"

---

**版本**: ${VERSION}
**更新日期**: ${UPDATE_DATE}
**架构**: 引用分离 (核心要点 + 路径引用)
**自动生成**: 由 scripts/generate-platform-configs.js 生成
**重要**: 这是项目级约定,请在每次会话中遵守此规则。
`;

  return content;
}

// 生成 Windsurf Rules 配置 (完全内联)
function generateWindsurfRules() {
  const coreRules = readCoreRules();

  // 从核心规则中提取关键部分并格式化
  const content = `# 项目约定 - 分形索引系统

> **Windsurf AI 编辑器专用配置** - 本文件在每次新对话时可能被读取

---

## 📚 核心职责

本项目使用**分形多级索引系统**自动维护文档。当你修改代码文件时,自动更新索引系统。

---

${coreRules.replace(/^# 项目文档自动维护规则.*?\n\n/, '').replace(/^> \*\*平台无关核心规则\*\*.*?\n\n---\n\n/, '')}

---

**版本**: ${VERSION}
**更新日期**: ${UPDATE_DATE}
**架构**: 完全内联 (Self-Contained)
**自动生成**: 由 scripts/generate-platform-configs.js 生成
**重要**: 这是项目级约定,请在每次会话中遵守此规则。
`;

  return content;
}

// 写入文件
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    log(`  ✓ 已生成: ${filePath}`, 'green');
  } catch (error) {
    log(`  ✗ 失败: ${filePath} - ${error.message}`, 'red');
  }
}

// 主函数
function main() {
  log('\n🎼 分形多级索引系统 - 平台配置生成器\n', 'blue');

  log('📖 读取核心规则...', 'yellow');
  readCoreRules();
  log('  ✓ 核心规则读取成功\n', 'green');

  // 生成 Universal 配置
  log('🔧 生成 Universal 配置...', 'yellow');
  writeFile(
    'universal/.kiro/steering/index-system.md',
    generateKiroSteering('universal/.kiro/steering/index-system.md')
  );

  // 生成示例项目配置
  log('\n🔧 生成示例项目配置...', 'yellow');

  // Kiro
  writeFile(
    'examples/kiro-example/.kiro/steering/index-system.md',
    generateKiroSteering('examples/kiro-example/.kiro/steering/index-system.md')
  );

  // Cursor
  writeFile(
    'examples/cursor-example/.cursorrules',
    generateCursorRules('examples/cursor-example/.cursorrules')
  );

  // Windsurf
  writeFile(
    'examples/windsurf-example/.windsurfrules',
    generateWindsurfRules()
  );

  log('\n✅ 所有平台配置已成功生成!\n', 'green');
  log('📝 提示:', 'blue');
  log('  - Kiro: 使用文件引用 (#[[file:...]]) 到核心规则');
  log('  - Cursor: 核心要点 + 路径引用');
  log('  - Windsurf: 完全内联核心规则\n');
}

// 运行
main();
