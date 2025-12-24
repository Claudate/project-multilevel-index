/**
 * Code analyzer for extracting dependencies and exports
 * Standalone version for CLI (VSCode-independent)
 */
export interface FileAnalysis {
    inputs: string[];
    outputs: string[];
    position: string;
}
export declare class Analyzer {
    /**
     * Analyze a file and extract dependencies/exports
     */
    analyzeFile(filePath: string): Promise<FileAnalysis>;
    /**
     * Analyze JavaScript/TypeScript using Babel parser
     */
    private analyzeJavaScript;
    /**
     * Analyze Python using regex patterns
     */
    private analyzePython;
    /**
     * Analyze Java/Kotlin using regex patterns
     */
    private analyzeJava;
    /**
     * Analyze Rust using regex patterns
     */
    private analyzeRust;
    /**
     * Analyze Go using regex patterns
     */
    private analyzeGo;
    /**
     * Generic analysis using simple regex patterns
     */
    private analyzeGeneric;
    /**
     * Infer system position based on file path
     */
    private inferPosition;
}
//# sourceMappingURL=analyzer.d.ts.map