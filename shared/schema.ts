import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).default("user"),
});

export const broadcastSchema = z.object({
  message: z.string().min(1, "Message is required"),
  channel_id: z.string().optional(),
});

export const moderationSchema = z.object({
  action: z.enum(["warn", "kick", "ban"]),
  user_id: z.string(),
  reason: z.string().min(1, "Reason is required"),
  rule_violations: z.array(z.string()).optional(),
  delete_days: z.number().min(0).max(7).optional(),
});

export const qotdSchema = z.object({
  question: z.string().min(1, "Question is required"),
  channel_id: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  channel_id: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type BroadcastRequest = z.infer<typeof broadcastSchema>;
export type ModerationRequest = z.infer<typeof moderationSchema>;
export type QOTDRequest = z.infer<typeof qotdSchema>;
export type AnnouncementRequest = z.infer<typeof announcementSchema>;

export interface BotStatus {
  online: boolean;
  serverCount: number;
  userCount: number;
  uptime: string;
  lastSeen: string;
  guilds?: Array<{
    id: string;
    name: string;
    memberCount: number;
  }>;
}

export interface MonroeCommand {
  name: string;
  description: string;
  category: "moderation" | "roblox" | "applications" | "utils" | "admin";
  usageCount?: number;
}

export interface RobloxProfile {
  robloxId: string;
  username: string;
  displayName: string;
  avatar?: string;
  groupRole?: string;
  groupRank?: number;
}

export interface ApplicationStats {
  total: number;
  staff: number;
  security: number;
  recent: Array<{
    type: "staff" | "security";
    username: string;
    timestamp: string;
  }>;
}

export interface ModerationLog {
  id: string;
  action: "warn" | "kick" | "ban";
  target: {
    id: string;
    username: string;
  };
  moderator: {
    id: string;
    username: string;
  };
  reason: string;
  timestamp: string;
}

export interface DashboardStats {
  botStatus: BotStatus;
  commands: MonroeCommand[];
  applicationStats: ApplicationStats;
  moderationLogs: ModerationLog[];
  robloxStats: {
    verifiedUsers: number;
    groupMembers: number;
  };
}
