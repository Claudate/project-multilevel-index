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
  private authService: AuthService;
  private logger: Logger;

  constructor() {
    this.authService = new AuthService();
    this.logger = new Logger('AuthController');
  }

  async handleLogin(req: any, res: any): Promise<void> {
    this.logger.info('POST /auth/login');

    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);

      if (!token) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      res.json({ success: true, data: { token } });
    } catch (error) {
      this.logger.error('Login failed', error as Error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async handleLogout(req: any, res: any): Promise<void> {
    this.logger.info('POST /auth/logout');

    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await this.authService.logout(token);
      }
      res.json({ success: true });
    } catch (error) {
      this.logger.error('Logout failed', error as Error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
