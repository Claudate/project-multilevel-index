/**
 * Input: fs, path
 * Output: None
 * Pos: Application code
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

const fs = require('fs').promises;
const path = require('path');

// Test configuration
const TEST_PROJECT_DIR = path.join(__dirname, '..', 'examples', 'cursor-example');
const TEMP_TEST_DIR = path.join(__dirname, 'test-temp');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Test results
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Test helper functions
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

async function test(name, fn) {
  testsRun++;
  try {
    await fn();
    testsPassed++;
    logSuccess(`PASS: ${name}`);
  } catch (error) {
    testsFailed++;
    logError(`FAIL: ${name}`);
    console.error(`  Error: ${error.message}`);
  }
}

async function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  }
}

async function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Test Suite 1: File Scanning
 */
async function testFileScanning() {
  log('\n📋 Test Suite 1: File Scanning', colors.yellow);

  await test('Should find all TypeScript files in test project', async () => {
    const files = await getAllCodeFiles(TEST_PROJECT_DIR);
    const tsFiles = files.filter(f => f.endsWith('.ts'));
    assertTrue(tsFiles.length >= 6, `Expected at least 6 TS files, found ${tsFiles.length}`);
  });

  await test('Should exclude node_modules', async () => {
    const files = await getAllCodeFiles(TEST_PROJECT_DIR);
    const nodeModulesFiles = files.filter(f => f.includes('node_modules'));
    assertEqual(nodeModulesFiles.length, 0, 'Should not include node_modules files');
  });

  await test('Should exclude .git folder', async () => {
    const files = await getAllCodeFiles(TEST_PROJECT_DIR);
    const gitFiles = files.filter(f => f.includes('.git'));
    assertEqual(gitFiles.length, 0, 'Should not include .git files');
  });
}

/**
 * Test Suite 2: Code Analysis
 */
async function testCodeAnalysis() {
  log('\n🔍 Test Suite 2: Code Analysis', colors.yellow);

  await test('Should analyze TypeScript imports', async () => {
    const testFile = path.join(TEST_PROJECT_DIR, 'src', 'services', 'user.service.ts');
    const exists = await fileExists(testFile);
    assertTrue(exists, `Test file should exist: ${testFile}`);

    const content = await fs.readFile(testFile, 'utf8');
    const hasImport = /import.*from/i.test(content);
    assertTrue(hasImport, 'File should contain imports');
  });

  await test('Should analyze TypeScript exports', async () => {
    const testFile = path.join(TEST_PROJECT_DIR, 'src', 'models', 'User.ts');
    const content = await fs.readFile(testFile, 'utf8');
    const hasExport = /export/i.test(content);
    assertTrue(hasExport, 'File should contain exports');
  });
}

/**
 * Test Suite 3: Index Generation (Simulated)
 */
async function testIndexGeneration() {
  log('\n📝 Test Suite 3: Index Generation', colors.yellow);

  await test('Should check for PROJECT_INDEX.md existence', async () => {
    const projectIndexPath = path.join(TEST_PROJECT_DIR, 'PROJECT_INDEX.md');
    const exists = await fileExists(projectIndexPath);
    logInfo(`PROJECT_INDEX.md exists: ${exists}`);
    // Note: This might not exist yet if not initialized
  });

  await test('Should check folder structure', async () => {
    const folders = await getAllFolders(TEST_PROJECT_DIR);
    const srcFolder = folders.find(f => f.endsWith('src'));
    assertTrue(srcFolder !== undefined, 'Should find src folder');
  });
}

/**
 * Test Suite 4: File Header Format
 */
async function testFileHeaderFormat() {
  log('\n📄 Test Suite 4: File Header Format', colors.yellow);

  await test('Should generate valid TypeScript header format', async () => {
    const header = generateBlockComment('moduleA, moduleB', 'ClassA, functionB', 'Service layer');
    assertTrue(header.includes('/**'), 'Should start with /**');
    assertTrue(header.includes('Input:'), 'Should include Input field');
    assertTrue(header.includes('Output:'), 'Should include Output field');
    assertTrue(header.includes('Pos:'), 'Should include Pos field');
    assertTrue(header.includes('*/'), 'Should end with */');
  });

  await test('Should generate valid Python header format', async () => {
    const header = generateDocstring('os, sys', 'main', 'Entry point');
    assertTrue(header.includes('"""'), 'Should use triple quotes');
    assertTrue(header.includes('Input:'), 'Should include Input field');
  });
}

/**
 * Test Suite 5: Configuration
 */
async function testConfiguration() {
  log('\n⚙️  Test Suite 5: Configuration', colors.yellow);

  await test('Should have package.json with correct fields', async () => {
    const packagePath = path.join(__dirname, 'package.json');
    const content = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(content);

    assertEqual(pkg.name, 'project-multilevel-index', 'Package name should match');
    assertEqual(pkg.version, '0.1.0', 'Version should match');
    assertTrue(pkg.main === './dist/extension.js', 'Main entry should be correct');
  });

  await test('Should have all required commands defined', async () => {
    const packagePath = path.join(__dirname, 'package.json');
    const content = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(content);

    const commands = pkg.contributes.commands;
    assertEqual(commands.length, 4, 'Should have 4 commands');

    const commandIds = commands.map(c => c.command);
    assertTrue(commandIds.includes('project-multilevel-index.init'), 'Should have init command');
    assertTrue(commandIds.includes('project-multilevel-index.update'), 'Should have update command');
    assertTrue(commandIds.includes('project-multilevel-index.check'), 'Should have check command');
    assertTrue(commandIds.includes('project-multilevel-index.toggleAutoUpdate'), 'Should have toggle command');
  });
}

/**
 * Test Suite 6: Build Output
 */
async function testBuildOutput() {
  log('\n🔨 Test Suite 6: Build Output', colors.yellow);

  await test('Should have built extension.js', async () => {
    const distPath = path.join(__dirname, 'dist', 'extension.js');
    const exists = await fileExists(distPath);
    assertTrue(exists, 'dist/extension.js should exist');
  });

  await test('Should have source map', async () => {
    const mapPath = path.join(__dirname, 'dist', 'extension.js.map');
    const exists = await fileExists(mapPath);
    assertTrue(exists, 'dist/extension.js.map should exist');
  });

  await test('Built file should be non-empty', async () => {
    const distPath = path.join(__dirname, 'dist', 'extension.js');
    const stats = await fs.stat(distPath);
    assertTrue(stats.size > 1000000, `Built file should be > 1MB, got ${stats.size} bytes`);
  });
}

/**
 * Helper functions (simplified versions from extension)
 */
async function getAllCodeFiles(dir, depth = 0) {
  const files = [];
  const codeExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.kt', '.rs', '.go'];

  if (depth > 5) return files;

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (shouldSkipFolder(entry.name)) continue;

      if (entry.isDirectory()) {
        const subFiles = await getAllCodeFiles(fullPath, depth + 1);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (codeExts.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Ignore permission errors
  }

  return files;
}

async function getAllFolders(dir, depth = 0) {
  const folders = [];

  if (depth > 5) return folders;

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (shouldSkipFolder(entry.name)) continue;

      if (entry.isDirectory()) {
        folders.push(fullPath);
        const subFolders = await getAllFolders(fullPath, depth + 1);
        folders.push(...subFolders);
      }
    }
  } catch (error) {
    // Ignore
  }

  return folders;
}

function shouldSkipFolder(name) {
  const skip = ['node_modules', '.git', 'dist', 'build', '.next', 'target'];
  return skip.includes(name);
}

function generateBlockComment(inputs, outputs, position) {
  return `/**
 * Input: ${inputs}
 * Output: ${outputs}
 * Pos: ${position}
 *
 * 🔄 Self-reference: When this file changes, update this header
 */`;
}

function generateDocstring(inputs, outputs, position) {
  return `"""
Input: ${inputs}
Output: ${outputs}
Pos: ${position}

🔄 Self-reference: When this file changes, update this header
"""`;
}

/**
 * Main test runner
 */
async function runTests() {
  log('🧪 Running VSCode Extension Automated Tests\n', colors.blue);
  log('=' .repeat(60));

  try {
    await testFileScanning();
    await testCodeAnalysis();
    await testIndexGeneration();
    await testFileHeaderFormat();
    await testConfiguration();
    await testBuildOutput();
  } catch (error) {
    logError(`Test suite error: ${error.message}`);
  }

  // Print summary
  log('\n' + '='.repeat(60));
  log('\n📊 Test Summary', colors.blue);
  log(`Total tests: ${testsRun}`);
  logSuccess(`Passed: ${testsPassed}`);
  if (testsFailed > 0) {
    logError(`Failed: ${testsFailed}`);
  }
  log(`Success rate: ${Math.round((testsPassed / testsRun) * 100)}%\n`);

  if (testsFailed === 0) {
    logSuccess('🎉 All tests passed!');
  } else {
    logError('❌ Some tests failed. Please review the errors above.');
  }

  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
