/**
 * Input: ./user.service, ../utils/logger
 * Output: AuthService
 * Pos: Service Layer - Business logic
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import { UserService } from './user.service';
import { Logger } from '../utils/logger';

export class AuthService {
  constructor(private userService: UserService) {}

  async login(email: string, password: string): Promise<string | null> {
    Logger.info(`Login attempt for: ${email}`);

    // Simplified auth logic
    const users = await this.userService.findAll();
    const user = users.find(u => u.email === email);

    if (user) {
      // Generate fake token
      return `token_${user.id}`;
    }

    return null;
  }

  async validateToken(token: string): Promise<boolean> {
    return token.startsWith('token_');
  }
}
