/**
 * Input: None
 * Output: Logger
 * Pos: Utility Layer - Helper functions
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

export class Logger {
  static info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  static error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error);
  }

  static warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }
}
