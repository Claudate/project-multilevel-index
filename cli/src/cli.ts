#!/usr/bin/env node
/**
 * CLI entry point for codex
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('codex')
  .description('Fractal Multi-level Index System - CLI Tool')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize index system for a project')
  .option('-p, --path <path>', 'Project root path', process.cwd())
  .option('-e, --exclude <patterns...>', 'Additional exclude patterns')
  .option('--max-depth <number>', 'Maximum directory depth to scan', '10')
  .option('--max-nodes <number>', 'Maximum nodes in dependency graph', '50')
  .action(async (options) => {
    await initCommand({
      path: options.path,
      exclude: options.exclude,
      maxDepth: parseInt(options.maxDepth),
      maxNodes: parseInt(options.maxNodes)
    });
  });

program
  .command('update')
  .description('Update existing indexes')
  .option('-p, --path <path>', 'Project root path', process.cwd())
  .action(async (options) => {
    console.log(chalk.yellow('\n⚠️  Update command not yet implemented\n'));
    console.log(chalk.gray('Coming soon! For now, use `codex init` to regenerate indexes.\n'));
  });

program
  .command('check')
  .description('Check index consistency')
  .option('-p, --path <path>', 'Project root path', process.cwd())
  .action(async (options) => {
    console.log(chalk.yellow('\n⚠️  Check command not yet implemented\n'));
    console.log(chalk.gray('Coming soon! For now, manually review PROJECT_INDEX.md.\n'));
  });

// Show help by default
if (process.argv.length === 2) {
  program.help();
}

program.parse();
