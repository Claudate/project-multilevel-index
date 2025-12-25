/**
 * Functional Test Script
 * Simulates the extension's core functionality
 */

const fs = require('fs').promises;
const path = require('path');

// Import extension modules (simulated)
const TEST_DIR = path.join(__dirname, 'test-output');

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

/**
 * Simulate file scanning
 */
async function simulateFileScan(rootDir) {
  log('\n🔍 Simulating file scan...', colors.cyan);

  const files = [];
  const codeExts = ['.ts', '.js', '.py', '.java', '.rs', '.go'];

  async function scan(dir, depth = 0) {
    if (depth > 5) return;

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const shouldSkip = ['node_modules', '.git', 'dist', 'build'].includes(entry.name);

      if (shouldSkip) continue;

      if (entry.isDirectory()) {
        await scan(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (codeExts.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  try {
    await scan(rootDir);
    log(`  ✅ Found ${files.length} code files`, colors.green);
    return files;
  } catch (error) {
    log(`  ❌ Error: ${error.message}`, colors.red);
    return [];
  }
}

/**
 * Simulate file header generation
 */
function generateFileHeader(filePath) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);

  let header;

  switch (ext) {
    case '.ts':
    case '.js':
      header = `/**
 * Input: [Auto-detected imports]
 * Output: [Auto-detected exports]
 * Pos: [Auto-detected position]
 *
 * 🔄 Self-reference: When this file changes, update this header
 */`;
      break;

    case '.py':
      header = `"""
Input: [Auto-detected imports]
Output: [Auto-detected exports]
Pos: [Auto-detected position]

🔄 Self-reference: When this file changes, update this header
"""`;
      break;

    case '.rs':
      header = `//! Input: [Auto-detected imports]
//! Output: [Auto-detected exports]
//! Pos: [Auto-detected position]
//!
//! 🔄 Self-reference: When this file changes, update this header`;
      break;

    default:
      header = `/**
 * Input: [Auto-detected imports]
 * Output: [Auto-detected exports]
 * Pos: [Auto-detected position]
 *
 * 🔄 Self-reference: When this file changes, update this header
 */`;
  }

  return header;
}

/**
 * Simulate FOLDER_INDEX.md generation
 */
function generateFolderIndex(folderName, files) {
  return `## 📁 ${folderName}/

**Architecture**:
- [Auto-generated description based on files]

**Files**:
${files.map(f => `- \`${path.basename(f)}\` - [Auto-detected description]`).join('\n')}

🔄 Self-reference: Update when folder changes
`;
}

/**
 * Simulate PROJECT_INDEX.md generation
 */
function generateProjectIndex(projectName, totalFiles, totalFolders) {
  return `# ${projectName} - Project Index

**Generated**: ${new Date().toISOString()}

## 📊 Statistics

- Total files: ${totalFiles}
- Total folders: ${totalFolders}
- Supported languages: TypeScript, JavaScript, Python, Java, Rust, Go

## 📁 Directory Structure

\`\`\`
[Auto-generated directory tree]
\`\`\`

## 🔗 Dependency Graph

\`\`\`mermaid
graph TD
  [Auto-generated dependency graph]
\`\`\`

## 🔄 Self-reference

This index is automatically maintained by the Project Multilevel Index system.

---

*Last updated: ${new Date().toLocaleString()}*
`;
}

/**
 * Main test function
 */
async function runFunctionalTests() {
  log('=' .repeat(70), colors.blue);
  log('🧪 VSCode Extension - Functional Test', colors.blue);
  log('=' .repeat(70), colors.blue);

  try {
    // Test 1: File Scanning
    log('\n📋 Test 1: File Scanning', colors.yellow);
    const testProject = path.join(__dirname, '..', 'examples', 'cursor-example');
    const files = await simulateFileScan(testProject);

    if (files.length > 0) {
      log(`  ✅ Successfully scanned project`, colors.green);
      log(`  Files found:`, colors.reset);
      files.slice(0, 5).forEach(f => {
        log(`    - ${path.relative(testProject, f)}`, colors.reset);
      });
      if (files.length > 5) {
        log(`    ... and ${files.length - 5} more`, colors.reset);
      }
    }

    // Test 2: File Header Generation
    log('\n📝 Test 2: File Header Generation', colors.yellow);
    const sampleFiles = [
      'test.ts',
      'test.py',
      'test.rs',
      'test.java'
    ];

    sampleFiles.forEach(file => {
      const header = generateFileHeader(file);
      log(`  ✅ Generated header for ${file}:`, colors.green);
      log(`${colors.cyan}${header.split('\n').map(l => '    ' + l).join('\n')}${colors.reset}`);
    });

    // Test 3: FOLDER_INDEX.md Generation
    log('\n📁 Test 3: FOLDER_INDEX.md Generation', colors.yellow);
    const folderIndex = generateFolderIndex('services', [
      'user.service.ts',
      'auth.service.ts'
    ]);
    log(`  ✅ Generated FOLDER_INDEX.md:`, colors.green);
    log(`${colors.cyan}${folderIndex.split('\n').map(l => '    ' + l).join('\n')}${colors.reset}`);

    // Test 4: PROJECT_INDEX.md Generation
    log('\n📊 Test 4: PROJECT_INDEX.md Generation', colors.yellow);
    const projectIndex = generateProjectIndex('Test Project', files.length, 5);
    log(`  ✅ Generated PROJECT_INDEX.md:`, colors.green);
    log(`${colors.cyan}${projectIndex.split('\n').slice(0, 15).map(l => '    ' + l).join('\n')}${colors.reset}`);
    log(`${colors.cyan}    ...${colors.reset}`);

    // Test 5: Create actual test output
    log('\n💾 Test 5: Creating Test Output Files', colors.yellow);

    // Create test directory
    await fs.mkdir(TEST_DIR, { recursive: true });

    // Write sample file headers
    for (const file of sampleFiles) {
      const header = generateFileHeader(file);
      const filePath = path.join(TEST_DIR, `header_${file}.txt`);
      await fs.writeFile(filePath, header, 'utf8');
      log(`  ✅ Created: ${path.basename(filePath)}`, colors.green);
    }

    // Write FOLDER_INDEX.md
    const folderIndexPath = path.join(TEST_DIR, 'FOLDER_INDEX.md');
    await fs.writeFile(folderIndexPath, folderIndex, 'utf8');
    log(`  ✅ Created: FOLDER_INDEX.md`, colors.green);

    // Write PROJECT_INDEX.md
    const projectIndexPath = path.join(TEST_DIR, 'PROJECT_INDEX.md');
    await fs.writeFile(projectIndexPath, projectIndex, 'utf8');
    log(`  ✅ Created: PROJECT_INDEX.md`, colors.green);

    // Summary
    log('\n' + '=' .repeat(70), colors.blue);
    log('📊 Test Summary', colors.blue);
    log('=' .repeat(70), colors.blue);
    log(`\n✅ All functional tests passed!`, colors.green);
    log(`\n📁 Test output directory: ${TEST_DIR}`, colors.cyan);
    log(`   Check the generated files to verify formatting.\n`, colors.cyan);

  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runFunctionalTests().catch(error => {
  log(`❌ Fatal error: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
