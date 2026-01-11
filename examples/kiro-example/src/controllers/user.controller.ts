/**
 * Input: ../services/user.service, ../utils/logger
 * Output: UserController
 * Pos: API Layer - HTTP request handler
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

import { UserService } from '../services/user.service';
import { Logger } from '../utils/logger';

export class UserController {
  private userService: UserService;
  private logger: Logger;

  constructor() {
    this.userService = new UserService();
    this.logger = new Logger('UserController');
  }

  async handleCreateUser(req: any, res: any): Promise<void> {
    this.logger.info('POST /users');

    try {
      const user = await this.userService.createUser(req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      this.logger.error('Failed to create user', error as Error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async handleGetUser(req: any, res: any): Promise<void> {
    this.logger.info(`GET /users/${req.params.id}`);

    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error) {
      this.logger.error('Failed to get user', error as Error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async handleGetAllUsers(req: any, res: any): Promise<void> {
    this.logger.info('GET /users');

    try {
      const users = await this.userService.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      this.logger.error('Failed to get users', error as Error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
