/**
 * Header and index generator
 * Standalone version for CLI (VSCode-independent)
 */
import { FileAnalysis } from './analyzer.js';
export declare class Generator {
    /**
     * Generate file header comment
     */
    generateFileHeader(filePath: string, analysis: FileAnalysis): Promise<string>;
    /**
     * Generate block comment (JS/TS/Java/C#/Swift)
     */
    private generateBlockComment;
    /**
     * Generate docstring (Python/Ruby)
     */
    private generateDocstring;
    /**
     * Generate //! style comment (Rust)
     */
    private generateLineComment;
    /**
     * Generate Go package comment
     */
    private generateGoComment;
    /**
     * Generate PHP comment
     */
    private generatePhpComment;
    /**
     * Generate FOLDER_INDEX.md content
     */
    generateFolderIndex(folderPath: string, files: Array<{
        filePath: string;
        analysis: FileAnalysis;
    }>): Promise<string>;
    /**
     * Summarize file based on analysis
     */
    private summarizeFile;
    /**
     * Infer folder purpose from name
     */
    private inferFolderPurpose;
    /**
     * Generate PROJECT_INDEX.md content
     */
    generateProjectIndex(workspaceRoot: string, folderStructure: Map<string, number>, dependencyGraph: string): Promise<string>;
    /**
     * Build directory tree visualization
     */
    private buildDirectoryTree;
    /**
     * Generate Mermaid dependency graph
     */
    generateDependencyGraph(files: Array<{
        filePath: string;
        analysis: FileAnalysis;
    }>, maxNodes?: number): Promise<string>;
    /**
     * Sanitize node ID for Mermaid
     */
    private sanitizeNodeId;
    /**
     * Extract module name from import path
     */
    private extractModuleName;
}
//# sourceMappingURL=generator.d.ts.map