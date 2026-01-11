/**
 * Input: ../services/auth.service, ../utils/logger
 * Output: AuthController
 * Pos: API Layer - HTTP request handler
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import { AuthService } from '../services/auth.service';
import { Logger } from '../utils/logger';

export class AuthController {
  constructor(private authService: AuthService) {}

  async handleLogin(email: string, password: string): Promise<any> {
    try {
      const token = await this.authService.login(email, password);

      if (token) {
        return { status: 200, data: { token } };
      } else {
        return { status: 401, error: 'Invalid credentials' };
      }
    } catch (error) {
      Logger.error('Login failed', error as Error);
      return { status: 500, error: 'Internal server error' };
    }
  }

  async handleValidate(token: string): Promise<any> {
    try {
      const isValid = await this.authService.validateToken(token);
      return { status: 200, data: { valid: isValid } };
    } catch (error) {
      Logger.error('Token validation failed', error as Error);
      return { status: 500, error: 'Internal server error' };
    }
  }
}
