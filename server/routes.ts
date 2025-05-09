import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Get educational content for transformer models
  app.get("/api/content", (req, res) => {
    res.json(storage.getContent());
  });

  // Update progress for a user (if authentication is added later)
  app.post("/api/progress", (req, res) => {
    const { progress } = req.body;
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Invalid progress value" });
    }
    
    // In a real app, we would save to a specific user
    // For now, just return success
    res.json({ success: true, progress });
  });

  // Get quiz questions
  app.get("/api/quiz", (req, res) => {
    res.json(storage.getQuizQuestions());
  });

  const httpServer = createServer(app);
  return httpServer;
}
