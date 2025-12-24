/**
 * File scanner utility
 */
export interface ScanOptions {
    exclude?: string[];
    useGitignore?: boolean;
    maxDepth?: number;
}
export declare class FileScanner {
    private ig;
    /**
     * Scan directory for code files
     */
    scanDirectory(rootPath: string, options?: ScanOptions): Promise<string[]>;
    /**
     * Load .gitignore file
     */
    private loadGitignore;
    /**
     * Get all folders containing code files
     */
    getFolders(files: string[]): Promise<Map<string, string[]>>;
}
//# sourceMappingURL=file-scanner.d.ts.map