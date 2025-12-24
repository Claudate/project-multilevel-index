/**
 * Code analyzer for extracting dependencies and exports
 * Standalone version for CLI (VSCode-independent)
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
export class Analyzer {
    /**
     * Analyze a file and extract dependencies/exports
     */
    async analyzeFile(filePath) {
        const ext = path.extname(filePath);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            switch (ext) {
                case '.ts':
                case '.tsx':
                case '.js':
                case '.jsx':
                case '.mjs':
                case '.cjs':
                    return await this.analyzeJavaScript(content, filePath);
                case '.py':
                    return this.analyzePython(content, filePath);
                case '.java':
                case '.kt':
                    return this.analyzeJava(content, filePath);
                case '.rs':
                    return this.analyzeRust(content, filePath);
                case '.go':
                    return this.analyzeGo(content, filePath);
                default:
                    return this.analyzeGeneric(content, filePath);
            }
        }
        catch (error) {
            console.warn(`Failed to analyze file ${filePath}:`, error);
            return {
                inputs: [],
                outputs: [],
                position: this.inferPosition(filePath)
            };
        }
    }
    /**
     * Analyze JavaScript/TypeScript using Babel parser
     */
    async analyzeJavaScript(code, filePath) {
        const inputs = new Set();
        const outputs = new Set();
        try {
            // Parse with all TypeScript and JSX features
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx', 'decorators-legacy']
            });
            traverse(ast, {
                // Import declarations
                ImportDeclaration: (path) => {
                    const source = path.node.source.value;
                    inputs.add(source);
                },
                // Require calls
                CallExpression: (path) => {
                    if (path.node.callee.type === 'Identifier' &&
                        path.node.callee.name === 'require' &&
                        path.node.arguments.length > 0 &&
                        path.node.arguments[0].type === 'StringLiteral') {
                        inputs.add(path.node.arguments[0].value);
                    }
                },
                // Export declarations
                ExportNamedDeclaration: (path) => {
                    if (path.node.declaration) {
                        const decl = path.node.declaration;
                        // export function foo()
                        if (decl.type === 'FunctionDeclaration' && decl.id) {
                            outputs.add(decl.id.name);
                        }
                        // export class Foo
                        if (decl.type === 'ClassDeclaration' && decl.id) {
                            outputs.add(decl.id.name);
                        }
                        // export interface Foo
                        if (decl.type === 'TSInterfaceDeclaration' && decl.id) {
                            outputs.add(decl.id.name);
                        }
                        // export type Foo
                        if (decl.type === 'TSTypeAliasDeclaration' && decl.id) {
                            outputs.add(decl.id.name);
                        }
                        // export const/let/var
                        if (decl.type === 'VariableDeclaration') {
                            for (const declarator of decl.declarations) {
                                if (declarator.id.type === 'Identifier') {
                                    outputs.add(declarator.id.name);
                                }
                            }
                        }
                    }
                    // export { foo, bar }
                    if (path.node.specifiers) {
                        for (const spec of path.node.specifiers) {
                            if (spec.type === 'ExportSpecifier' && spec.exported.type === 'Identifier') {
                                outputs.add(spec.exported.name);
                            }
                        }
                    }
                },
                // Export default
                ExportDefaultDeclaration: (path) => {
                    const decl = path.node.declaration;
                    if (decl.type === 'Identifier') {
                        outputs.add(`default (${decl.name})`);
                    }
                    else if (decl.type === 'FunctionDeclaration' && decl.id) {
                        outputs.add(`default (${decl.id.name})`);
                    }
                    else if (decl.type === 'ClassDeclaration' && decl.id) {
                        outputs.add(`default (${decl.id.name})`);
                    }
                    else {
                        outputs.add('default');
                    }
                }
            });
        }
        catch (error) {
            console.warn(`Babel parse failed for ${filePath}, falling back to regex`);
            return this.analyzeGeneric(code, filePath);
        }
        return {
            inputs: Array.from(inputs),
            outputs: Array.from(outputs),
            position: this.inferPosition(filePath)
        };
    }
    /**
     * Analyze Python using regex patterns
     */
    analyzePython(code, filePath) {
        const inputs = new Set();
        const outputs = new Set();
        // Match: import foo, from foo import bar
        const importRegex = /^(?:from\s+(\S+)\s+)?import\s+(.+?)(?:\s+as\s+\S+)?$/gm;
        let match;
        while ((match = importRegex.exec(code)) !== null) {
            if (match[1]) {
                inputs.add(match[1]);
            }
            const modules = match[2].split(',').map(m => m.trim());
            modules.forEach(m => {
                if (!m.startsWith('*')) {
                    const moduleName = m.split(' as ')[0].trim();
                    if (match[1]) {
                        inputs.add(`${match[1]}.${moduleName}`);
                    }
                    else {
                        inputs.add(moduleName);
                    }
                }
            });
        }
        // Match: def function_name, class ClassName
        const defRegex = /^(?:async\s+)?def\s+(\w+)/gm;
        while ((match = defRegex.exec(code)) !== null) {
            if (!match[1].startsWith('_')) { // Skip private functions
                outputs.add(match[1]);
            }
        }
        const classRegex = /^class\s+(\w+)/gm;
        while ((match = classRegex.exec(code)) !== null) {
            outputs.add(match[1]);
        }
        return {
            inputs: Array.from(inputs),
            outputs: Array.from(outputs),
            position: this.inferPosition(filePath)
        };
    }
    /**
     * Analyze Java/Kotlin using regex patterns
     */
    analyzeJava(code, filePath) {
        const inputs = new Set();
        const outputs = new Set();
        // Match: import statements
        const importRegex = /^import\s+(?:static\s+)?(.+?);/gm;
        let match;
        while ((match = importRegex.exec(code)) !== null) {
            inputs.add(match[1]);
        }
        // Match: public class/interface/enum
        const classRegex = /public\s+(?:class|interface|enum)\s+(\w+)/g;
        while ((match = classRegex.exec(code)) !== null) {
            outputs.add(match[1]);
        }
        // Match: public methods
        const methodRegex = /public\s+(?:static\s+)?(?:\w+\s+)*(\w+)\s*\(/g;
        while ((match = methodRegex.exec(code)) !== null) {
            if (match[1] !== 'class' && match[1] !== 'interface') {
                outputs.add(match[1]);
            }
        }
        return {
            inputs: Array.from(inputs),
            outputs: Array.from(outputs),
            position: this.inferPosition(filePath)
        };
    }
    /**
     * Analyze Rust using regex patterns
     */
    analyzeRust(code, filePath) {
        const inputs = new Set();
        const outputs = new Set();
        // Match: use statements
        const useRegex = /^use\s+(.+?);/gm;
        let match;
        while ((match = useRegex.exec(code)) !== null) {
            inputs.add(match[1]);
        }
        // Match: pub fn, pub struct, pub enum
        const pubRegex = /pub\s+(?:fn|struct|enum|trait)\s+(\w+)/g;
        while ((match = pubRegex.exec(code)) !== null) {
            outputs.add(match[1]);
        }
        return {
            inputs: Array.from(inputs),
            outputs: Array.from(outputs),
            position: this.inferPosition(filePath)
        };
    }
    /**
     * Analyze Go using regex patterns
     */
    analyzeGo(code, filePath) {
        const inputs = new Set();
        const outputs = new Set();
        // Match: import statements
        const importRegex = /^import\s+(?:"(.+?)"|(?:\([\s\S]*?"(.+?)"[\s\S]*?\)))/gm;
        let match;
        while ((match = importRegex.exec(code)) !== null) {
            inputs.add(match[1] || match[2]);
        }
        // Match: func (uppercase = exported)
        const funcRegex = /^func\s+([A-Z]\w*)/gm;
        while ((match = funcRegex.exec(code)) !== null) {
            outputs.add(match[1]);
        }
        // Match: type (uppercase = exported)
        const typeRegex = /^type\s+([A-Z]\w*)/gm;
        while ((match = typeRegex.exec(code)) !== null) {
            outputs.add(match[1]);
        }
        return {
            inputs: Array.from(inputs),
            outputs: Array.from(outputs),
            position: this.inferPosition(filePath)
        };
    }
    /**
     * Generic analysis using simple regex patterns
     */
    analyzeGeneric(code, filePath) {
        const inputs = new Set();
        const outputs = new Set();
        // Generic import patterns
        const importPatterns = [
            /\bimport\s+(.+?)(?:;|\n)/g,
            /\brequire\s*\(\s*['"](.*?)['"]\s*\)/g,
            /\bfrom\s+['"](.*?)['"]/g,
            /^#include\s*[<"](.*?)[>"]/gm
        ];
        for (const pattern of importPatterns) {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                if (match[1]) {
                    inputs.add(match[1].trim());
                }
            }
        }
        // Generic export/public patterns
        const exportPatterns = [
            /\bexport\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g,
            /\bpublic\s+(?:class|function|interface)\s+(\w+)/g,
            /\bclass\s+(\w+)/g,
            /\bfunction\s+(\w+)/g,
            /\bdef\s+(\w+)/g
        ];
        for (const pattern of exportPatterns) {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                if (match[1]) {
                    outputs.add(match[1]);
                }
            }
        }
        return {
            inputs: Array.from(inputs).slice(0, 10), // Limit to avoid noise
            outputs: Array.from(outputs).slice(0, 10),
            position: this.inferPosition(filePath)
        };
    }
    /**
     * Infer system position based on file path
     */
    inferPosition(filePath) {
        const normalized = filePath.replace(/\\/g, '/').toLowerCase();
        // Common architectural patterns
        const patterns = [
            { pattern: /\/controllers?\//, position: 'API Layer - HTTP request handler' },
            { pattern: /\/routes?\//, position: 'API Layer - Route definitions' },
            { pattern: /\/services?\//, position: 'Service Layer - Business logic' },
            { pattern: /\/models?\//, position: 'Data Layer - Data models' },
            { pattern: /\/repositories?\//, position: 'Data Layer - Data access' },
            { pattern: /\/entities?\//, position: 'Data Layer - Entity definitions' },
            { pattern: /\/utils?\//, position: 'Utility Layer - Helper functions' },
            { pattern: /\/helpers?\//, position: 'Utility Layer - Helper functions' },
            { pattern: /\/middleware\//, position: 'Middleware Layer - Request processing' },
            { pattern: /\/components?\//, position: 'UI Layer - UI components' },
            { pattern: /\/views?\//, position: 'UI Layer - View templates' },
            { pattern: /\/pages?\//, position: 'UI Layer - Page components' },
            { pattern: /\/config\//, position: 'Configuration - App settings' },
            { pattern: /\/tests?\//, position: 'Test Layer - Unit/Integration tests' },
            { pattern: /\/lib\//, position: 'Library - Shared code' },
            { pattern: /\/core\//, position: 'Core - Fundamental logic' }
        ];
        for (const { pattern, position } of patterns) {
            if (pattern.test(normalized)) {
                return position;
            }
        }
        return 'Application code';
    }
}
//# sourceMappingURL=analyzer.js.map