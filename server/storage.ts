import { users, type User, type InsertUser, type CreateUserRequest } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

const USERS_FILE = path.join(process.cwd(), 'server/data/users.json');
const SALT_ROUNDS = 12;

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: CreateUserRequest): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;
  updateUserLastLogin(id: number): Promise<void>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export class FileStorage implements IStorage {
  private async readUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      const users = JSON.parse(data);
      // Convert date strings back to Date objects
      return users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      }));
    } catch (error) {
      // If file doesn't exist, create it with default admin user
      const defaultAdmin: User = {
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', SALT_ROUNDS),
        role: 'admin',
        createdAt: new Date(),
        lastLogin: null,
      };
      await this.writeUsers([defaultAdmin]);
      return [defaultAdmin];
    }
  }

  private async writeUsers(users: User[]): Promise<void> {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  async getUser(id: number): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find(user => user.username === username);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const users = await this.readUsers();
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    const newUser: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      username: userData.username,
      password: hashedPassword,
      role: userData.role,
      createdAt: new Date(),
      lastLogin: null,
    };

    users.push(newUser);
    await this.writeUsers(users);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.readUsers();
  }

  async deleteUser(id: number): Promise<boolean> {
    const users = await this.readUsers();
    const initialLength = users.length;
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length < initialLength) {
      await this.writeUsers(filteredUsers);
      return true;
    }
    return false;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    const users = await this.readUsers();
    const user = users.find(u => u.id === id);
    if (user) {
      user.lastLogin = new Date();
      await this.writeUsers(users);
    }
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const storage = new FileStorage();
