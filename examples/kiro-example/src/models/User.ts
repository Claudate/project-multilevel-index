/**
 * Input: None
 * Output: User, CreateUserDTO
 * Pos: Data Layer - Data models
 *
 * 🔄 Self-reference: When this file changes, update this header
 */

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
}
