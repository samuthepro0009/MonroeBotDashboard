import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  createUserSchema, 
  broadcastSchema, 
  moderationSchema,
  qotdSchema,
  announcementSchema,
  type User 
} from "@shared/schema";
import session from "express-session";
import { ZodError } from "zod";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    user?: User;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment monitoring
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0"
    });
  });
  // Create MemoryStore instance
  const SessionStore = MemoryStore(session);
  
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'monroe-bot-dashboard-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);

      console.log('Attempting to log in with username:', username);

      const user = await storage.getUserByUsername(username);
      console.log('Fetched user:', user);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      console.log('Password verification result:', isValidPassword);

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('Skipping last login update for now...');
      console.log('Setting session...');
      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      console.log('Preparing response...');
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      
      console.log('Sending response:', userWithoutPassword);
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User management routes
  app.get("/api/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const newUser = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Prevent deleting yourself
      if (id === req.session.userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Bot status route
  app.get("/api/bot/status", requireAuth, async (req, res) => {
    try {
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "https://monroe-bot.onrender.com";
      
      const response = await fetch(`${botApiUrl}/api/status`, {
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Try fallback to health endpoint
        const healthResponse = await fetch(`${botApiUrl}/health`);
        if (healthResponse.ok) {
          const healthText = await healthResponse.text();
          if (healthText.includes("Bot is running")) {
            return res.json({
              online: true,
              serverCount: 1,
              userCount: 100,
              uptime: "Online",
              lastSeen: new Date().toISOString(),
              message: "Monroe Bot Connected (limited data)"
            });
          }
        }
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const botStatus = await response.json();
      res.json(botStatus);
    } catch (error) {
      console.error("Bot API connection error:", error instanceof Error ? error.message : String(error));
      // Return offline status if bot API is not available
      res.json({
        online: false,
        serverCount: 0,
        userCount: 0,
        uptime: "0%",
        lastSeen: new Date().toISOString(),
        error: "Bot API unavailable"
      });
    }
  });

  // Bot commands and management routes
  app.get("/api/bot/commands", requireAuth, async (req, res) => {
    try {
      const commands = [
        { name: "management", description: "Display the Monroe Social Club management team", category: "utils" },
        { name: "warn", description: "Warn a member", category: "moderation" },
        { name: "kick", description: "Kick a member from the server", category: "moderation" },
        { name: "ban", description: "Ban a member from the server", category: "moderation" },
        { name: "verify", description: "Link your Discord account with your Roblox account", category: "roblox" },
        { name: "get_profile", description: "Get a user's Roblox profile information", category: "roblox" },
        { name: "group_info", description: "Get information about the Monroe Social Club Roblox group", category: "roblox" },
        { name: "create_applications", description: "Create the application system message", category: "applications" },
        { name: "application_stats", description: "View application statistics", category: "applications" },
        { name: "clear_applications", description: "Clear applications database", category: "admin" },
        { name: "qotd", description: "Send question of the day", category: "utils" },
        { name: "announcement", description: "Send server announcement", category: "admin" }
      ];
      res.json({ commands });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commands" });
    }
  });

  // Broadcast route
  app.post("/api/bot/broadcast", requireAuth, async (req, res) => {
    try {
      const { message, channel_id } = broadcastSchema.parse(req.body);
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "https://monroe-bot.onrender.com";
      
      console.log("Sending broadcast to bot:", { message, channel_id });
      
      const response = await fetch(`${botApiUrl}/api/broadcast`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          channel_id: channel_id,
          dashboard_user: req.session.user?.username || 'Dashboard Admin'
        }),
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Bot response:", result);
      
      res.json({
        success: true,
        message: result.message || "Broadcast sent successfully",
        data: {
          message: message,
          channel_id: channel_id,
          sent_by: req.session.user?.username || 'Dashboard Admin',
          timestamp: new Date().toISOString(),
          bot_response: result
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Broadcast error:", error);
      res.status(500).json({ message: "Failed to send broadcast message: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // Moderation route
  app.post("/api/bot/moderation", requireAuth, requireAdmin, async (req, res) => {
    try {
      const moderationData = moderationSchema.parse(req.body);
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "https://monroe-bot.onrender.com";
      
      console.log("Sending moderation action to bot:", moderationData);
      
      const response = await fetch(`${botApiUrl}/api/moderation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...moderationData,
          dashboard_user: req.session.user?.username || 'Dashboard Admin'
        }),
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Bot moderation response:", result);
      
      res.json({
        success: true,
        message: result.message || `${moderationData.action} action executed successfully`,
        data: {
          action: moderationData.action,
          user_id: moderationData.user_id,
          reason: moderationData.reason,
          delete_days: moderationData.delete_days,
          executed_by: req.session.user?.username || 'Dashboard Admin',
          timestamp: new Date().toISOString(),
          bot_response: result
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Moderation error:", error);
      res.status(500).json({ message: "Failed to execute moderation action: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // QOTD route
  app.post("/api/bot/qotd", requireAuth, requireAdmin, async (req, res) => {
    try {
      const qotdData = qotdSchema.parse(req.body);
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "https://monroe-bot.onrender.com";
      
      console.log("Sending QOTD to bot:", qotdData);
      
      const response = await fetch(`${botApiUrl}/api/qotd`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: qotdData.question,
          channel_id: qotdData.channel_id,
          dashboard_user: req.session.user?.username || 'Dashboard Admin'
        }),
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Bot QOTD response:", result);
      
      res.json({
        success: true,
        message: result.message || "QOTD sent successfully",
        data: {
          question: qotdData.question,
          channel_id: qotdData.channel_id,
          sent_by: req.session.user?.username || 'Dashboard Admin',
          timestamp: new Date().toISOString(),
          bot_response: result
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("QOTD error:", error);
      res.status(500).json({ message: "Failed to send QOTD: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // Announcement route
  app.post("/api/bot/announcement", requireAuth, requireAdmin, async (req, res) => {
    try {
      const announcementData = announcementSchema.parse(req.body);
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "https://monroe-bot.onrender.com";
      
      console.log("Sending announcement to bot:", announcementData);
      
      const response = await fetch(`${botApiUrl}/api/announcement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: announcementData.title,
          content: announcementData.content,
          channel_id: announcementData.channel_id,
          dashboard_user: req.session.user?.username || 'Dashboard Admin'
        }),
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Bot announcement response:", result);
      
      res.json({
        success: true,
        message: result.message || "Announcement sent successfully",
        data: {
          title: announcementData.title,
          content: announcementData.content,
          channel_id: announcementData.channel_id,
          sent_by: req.session.user?.username || 'Dashboard Admin',
          timestamp: new Date().toISOString(),
          bot_response: result
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Announcement error:", error);
      res.status(500).json({ message: "Failed to send announcement: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // Application stats route
  app.get("/api/bot/applications", requireAuth, requireAdmin, async (req, res) => {
    try {
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "http://localhost:3000";

      const response = await fetch(`${botApiUrl}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const applicationStats = await response.json();
      res.json(applicationStats);
    } catch (error) {
      res.json({
        total: 0,
        staff: 0,
        security: 0,
        recent: [],
        error: "Bot API unavailable"
      });
    }
  });

  // Configuration routes
  app.get("/api/bot/config", requireAuth, requireAdmin, async (req, res) => {
    try {
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "http://localhost:3000";

      const response = await fetch(`${botApiUrl}/api/config`, {
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const config = await response.json();
      res.json(config);
    } catch (error) {
      res.json({
        qotd_channels: ["qotd", "question-of-the-day", "general"],
        announcement_channels: ["announcements", "news", "updates", "general"],
        qotd_message_style: "80s Beach Vibes",
        announcement_style: "Official Monroe",
        error: "Bot API unavailable"
      });
    }
  });

  app.post("/api/bot/config", requireAuth, requireAdmin, async (req, res) => {
    try {
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "http://localhost:3000";

      const response = await fetch(`${botApiUrl}/api/config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const result = await response.json();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update configuration" });
    }
  });

  // Roblox integration route
  app.get("/api/bot/roblox/:discordId", requireAuth, async (req, res) => {
    try {
      const { discordId } = req.params;
      const apiSecret = process.env.API_SECRET || process.env.BOT_API_SECRET || "default-secret";
      const botApiUrl = process.env.BOT_API_URL || "http://localhost:3000";

      const response = await fetch(`${botApiUrl}/api/roblox/${discordId}`, {
        headers: {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Bot API responded with status ${response.status}`);
      }

      const robloxProfile = await response.json();
      res.json(robloxProfile);
    } catch (error) {
      res.status(404).json({ message: "Roblox profile not found or bot unavailable" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
