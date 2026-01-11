/**
 * Input: None
 * Output: User, CreateUserDTO
 * Pos: Data Layer - Data models
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}
