import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Setup passport for authentication
export function setupPassport() {
  // Use local strategy for authentication
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Get user by username
      const user = await storage.getUserByUsername(username);
      
      // If user doesn't exist or password doesn't match
      if (!user || user.password !== password) {
        return done(null, false, { message: "Invalid username or password" });
      }
      
      // User authenticated successfully
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
  
  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // API Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });
  
  // Content endpoints
  app.get("/api/content", (req, res) => {
    res.json(storage.getContent());
  });
  
  app.get("/api/content/section/:slug", async (req, res) => {
    const { slug } = req.params;
    const section = await storage.getSection(slug);
    
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }
    
    res.status(200).json(section);
  });
  
  app.get("/api/content/sections", async (req, res) => {
    const sections = await storage.getAllSections();
    res.status(200).json({ sections });
  });

  // Quiz endpoints
  app.get("/api/quiz", (req, res) => {
    res.json(storage.getQuizQuestions());
  });
  
  app.post("/api/quiz/submit", isAuthenticated, (req, res) => {
    // In a real implementation, we would validate and process the quiz submission
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        error: {
          code: "invalid_request",
          message: "Invalid request body"
        }
      });
    }
    
    // Mock quiz results
    const results = {
      score: answers.length > 0 ? Math.floor(answers.length * 0.7) : 0,
      totalQuestions: answers.length,
      correctAnswers: answers.map((answer, index) => ({
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        isCorrect: Math.random() > 0.3 // Randomly mark 70% as correct for demo
      }))
    };
    
    res.status(200).json(results);
  });
  
  // Authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          error: {
            code: "username_exists",
            message: "Username already exists"
          }
        });
      }
      
      // Create user
      const user = await storage.createUser({ 
        username, 
        email, 
        password // In a real app, this would be hashed
      });
      
      // Initialize user session
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ 
            error: {
              code: "server_error",
              message: "Failed to create session"
            }
          });
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      res.status(500).json({ 
        error: {
          code: "server_error",
          message: "Failed to register user"
        }
      });
    }
  });
  
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ 
          error: {
            code: "server_error",
            message: "Login failed"
          }
        });
      }
      
      if (!user) {
        return res.status(401).json({ 
          error: {
            code: "invalid_credentials",
            message: info.message || "Invalid username or password"
          }
        });
      }
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ 
            error: {
              code: "server_error",
              message: "Failed to create session"
            }
          });
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          error: {
            code: "server_error",
            message: "Logout failed"
          }
        });
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
      });
    });
  });
  
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    // Return authenticated user
    const user = req.user as any;
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
  
  // User progress endpoints
  app.get("/api/user/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const progress = await storage.getUserProgress(userId);
      
      if (!progress) {
        // If no progress found, create initial progress
        const initialProgress = await storage.updateUserProgress(userId, {
          completedSections: [],
          sectionProgress: {}
        });
        return res.status(200).json(initialProgress);
      }
      
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ 
        error: {
          code: "server_error",
          message: "Failed to retrieve user progress"
        }
      });
    }
  });
  
  app.patch("/api/user/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const progressUpdate = req.body;
      
      const updatedProgress = await storage.updateUserProgress(userId, progressUpdate);
      
      res.status(200).json({
        ...updatedProgress,
        updated: true
      });
    } catch (error) {
      res.status(500).json({ 
        error: {
          code: "server_error",
          message: "Failed to update user progress"
        }
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
