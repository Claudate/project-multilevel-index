/**
 * File scanner utility
 */
import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as path from 'path';
import ignore from 'ignore';
export class FileScanner {
    ig = ignore();
    /**
     * Scan directory for code files
     */
    async scanDirectory(rootPath, options = {}) {
        const { exclude = [
            '**/node_modules/**',
            '**/.git/**',
            '**/dist/**',
            '**/build/**',
            '**/.next/**',
            '**/target/**',
            '**/__pycache__/**',
            '**/venv/**'
        ], useGitignore = true, maxDepth = 10 } = options;
        // Load .gitignore if needed
        if (useGitignore) {
            await this.loadGitignore(rootPath);
        }
        // Scan for code files
        const patterns = [
            '**/*.ts',
            '**/*.tsx',
            '**/*.js',
            '**/*.jsx',
            '**/*.mjs',
            '**/*.cjs',
            '**/*.py',
            '**/*.java',
            '**/*.kt',
            '**/*.rs',
            '**/*.go',
            '**/*.c',
            '**/*.cpp',
            '**/*.h',
            '**/*.hpp',
            '**/*.cs',
            '**/*.php',
            '**/*.rb',
            '**/*.swift'
        ];
        const allFiles = [];
        for (const pattern of patterns) {
            const files = await glob(pattern, {
                cwd: rootPath,
                ignore: exclude,
                absolute: true,
                maxDepth
            });
            allFiles.push(...files);
        }
        // Filter by gitignore
        const relativePaths = allFiles.map(f => path.relative(rootPath, f));
        const filtered = this.ig.filter(relativePaths);
        return filtered.map(f => path.join(rootPath, f));
    }
    /**
     * Load .gitignore file
     */
    async loadGitignore(rootPath) {
        const gitignorePath = path.join(rootPath, '.gitignore');
        try {
            const content = await fs.readFile(gitignorePath, 'utf8');
            this.ig.add(content);
        }
        catch {
            // .gitignore doesn't exist, that's ok
        }
    }
    /**
     * Get all folders containing code files
     */
    async getFolders(files) {
        const folderMap = new Map();
        for (const file of files) {
            const folder = path.dirname(file);
            if (!folderMap.has(folder)) {
                folderMap.set(folder, []);
            }
            folderMap.get(folder).push(file);
        }
        return folderMap;
    }
}
//# sourceMappingURL=file-scanner.js.map