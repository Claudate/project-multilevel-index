/**
 * Initialize index system command
 */
export interface InitOptions {
    path?: string;
    exclude?: string[];
    maxDepth?: number;
    maxNodes?: number;
}
export declare function initCommand(options?: InitOptions): Promise<void>;
//# sourceMappingURL=init.d.ts.map