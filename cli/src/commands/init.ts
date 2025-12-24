/**
 * Initialize index system command
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { Analyzer } from '../core/analyzer.js';
import { Generator } from '../core/generator.js';
import { FileScanner } from '../utils/file-scanner.js';

export interface InitOptions {
  path?: string;
  exclude?: string[];
  maxDepth?: number;
  maxNodes?: number;
}

export async function initCommand(options: InitOptions = {}) {
  const rootPath = path.resolve(options.path || process.cwd());

  console.log(chalk.bold.cyan('\n🎼 Fractal Multi-level Index System\n'));
  console.log(chalk.gray(`Project root: ${rootPath}\n`));

  const spinner = ora('Scanning project files...').start();

  try {
    // Step 1: Scan files
    const scanner = new FileScanner();
    const files = await scanner.scanDirectory(rootPath, {
      exclude: options.exclude,
      maxDepth: options.maxDepth
    });

    spinner.succeed(chalk.green(`Found ${files.length} code files`));

    if (files.length === 0) {
      console.log(chalk.yellow('\n⚠️  No code files found. Nothing to index.'));
      return;
    }

    // Step 2: Analyze files
    spinner.start('Analyzing dependencies and exports...');
    const analyzer = new Analyzer();
    const analyses = await Promise.all(
      files.map(async (file) => ({
        filePath: file,
        analysis: await analyzer.analyzeFile(file)
      }))
    );

    spinner.succeed(chalk.green(`Analyzed ${analyses.length} files`));

    // Step 3: Generate file headers
    spinner.start('Generating file headers...');
    const generator = new Generator();
    let headerCount = 0;

    for (const { filePath, analysis } of analyses) {
      const header = await generator.generateFileHeader(filePath, analysis);
      const content = await fs.readFile(filePath, 'utf8');

      // Check if file already has a header
      const hasHeader = content.match(/^(\/\*\*|"""|\#!|\/\/!|<?php\s*\/\*\*)/);

      if (!hasHeader) {
        // Prepend header
        await fs.writeFile(filePath, header + '\n\n' + content, 'utf8');
        headerCount++;
      } else {
        // Replace existing header
        const headerEnd = findHeaderEnd(content);
        if (headerEnd > 0) {
          const newContent = header + '\n' + content.substring(headerEnd);
          await fs.writeFile(filePath, newContent, 'utf8');
          headerCount++;
        }
      }
    }

    spinner.succeed(chalk.green(`Generated ${headerCount} file headers`));

    // Step 4: Generate folder indexes
    spinner.start('Generating folder indexes...');
    const folders = await scanner.getFolders(files);
    let folderIndexCount = 0;

    for (const [folderPath, folderFiles] of folders.entries()) {
      const folderAnalyses = folderFiles.map(file => {
        const item = analyses.find(a => a.filePath === file);
        return {
          filePath: file,
          analysis: item!.analysis
        };
      });

      const folderIndex = await generator.generateFolderIndex(folderPath, folderAnalyses);
      const indexPath = path.join(folderPath, 'FOLDER_INDEX.md');

      await fs.writeFile(indexPath, folderIndex, 'utf8');
      folderIndexCount++;
    }

    spinner.succeed(chalk.green(`Generated ${folderIndexCount} folder indexes`));

    // Step 5: Generate project index
    spinner.start('Generating project index...');

    const folderStructure = new Map<string, number>();
    for (const [folderPath, folderFiles] of folders.entries()) {
      const relativePath = path.relative(rootPath, folderPath);
      folderStructure.set(relativePath || '.', folderFiles.length);
    }

    const dependencyGraph = await generator.generateDependencyGraph(
      analyses,
      options.maxNodes || 50
    );

    const projectIndex = await generator.generateProjectIndex(
      rootPath,
      folderStructure,
      dependencyGraph
    );

    const projectIndexPath = path.join(rootPath, 'PROJECT_INDEX.md');
    await fs.writeFile(projectIndexPath, projectIndex, 'utf8');

    spinner.succeed(chalk.green('Generated PROJECT_INDEX.md'));

    // Success message
    console.log(chalk.bold.green('\n✅ Index system initialized successfully!\n'));
    console.log(chalk.gray('Files generated:'));
    console.log(chalk.gray(`  - ${headerCount} file headers`));
    console.log(chalk.gray(`  - ${folderIndexCount} FOLDER_INDEX.md files`));
    console.log(chalk.gray(`  - 1 PROJECT_INDEX.md file\n`));
    console.log(chalk.cyan(`📖 View the project index at: ${projectIndexPath}\n`));

  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize index system'));
    console.error(chalk.red('\nError:'), error);
    process.exit(1);
  }
}

/**
 * Find the end position of existing header comment
 */
function findHeaderEnd(content: string): number {
  // Block comment: /** ... */
  if (content.startsWith('/**')) {
    const match = content.match(/^\/\*\*[\s\S]*?\*\//);
    if (match) {
      return match[0].length;
    }
  }

  // Python docstring: """ ... """
  if (content.startsWith('"""')) {
    const match = content.match(/^"""[\s\S]*?"""/);
    if (match) {
      return match[0].length;
    }
  }

  // Rust doc comment: //! ...
  if (content.startsWith('//!')) {
    const lines = content.split('\n');
    let endLine = 0;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith('//!')) {
        endLine = i;
        break;
      }
    }
    return lines.slice(0, endLine).join('\n').length;
  }

  // PHP comment
  if (content.startsWith('<?php')) {
    const match = content.match(/^<\?php\s*\/\*\*[\s\S]*?\*\//);
    if (match) {
      return match[0].length;
    }
  }

  return 0;
}
