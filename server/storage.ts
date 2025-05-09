import { 
  User, 
  InsertUser, 
  Section, 
  InsertSection, 
  QuizQuestion, 
  InsertQuizQuestion,
  UserProgress,
  InsertUserProgress
} from "@shared/schema";

// Interface with CRUD methods for storage
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content methods
  getContent(): Promise<any>;
  getSection(slug: string): Promise<Section | undefined>;
  getAllSections(): Promise<Section[]>;
  
  // Quiz methods
  getQuizQuestions(): Promise<QuizQuestion[]>;
  
  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sections: Map<string, Section>;
  private quizQuestions: QuizQuestion[];
  private userProgress: Map<number, UserProgress>;
  private currentUserId: number;
  private currentSectionId: number;
  private currentQuizId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.sections = new Map();
    this.quizQuestions = [];
    this.userProgress = new Map();
    this.currentUserId = 1;
    this.currentSectionId = 1;
    this.currentQuizId = 1;
    this.currentProgressId = 1;
    
    this.initializeContent();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Content methods
  async getContent(): Promise<any> {
    // Return educational content
    return {
      sections: Array.from(this.sections.values()).sort((a, b) => a.order - b.order),
      metadata: {
        title: "Understanding Transformer Models",
        description: "Learn about the architecture and implementation of transformer-based language models",
        lastUpdated: new Date().toISOString()
      }
    };
  }
  
  async getSection(slug: string): Promise<Section | undefined> {
    return this.sections.get(slug);
  }
  
  async getAllSections(): Promise<Section[]> {
    return Array.from(this.sections.values()).sort((a, b) => a.order - b.order);
  }
  
  // Quiz methods
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return this.quizQuestions;
  }
  
  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(userId);
  }
  
  async updateUserProgress(userId: number, progressUpdate: Partial<InsertUserProgress>): Promise<UserProgress> {
    let progress = this.userProgress.get(userId);
    
    if (!progress) {
      // Create new progress entry if it doesn't exist
      const id = this.currentProgressId++;
      progress = {
        id,
        userId,
        progress: 0,
        completedSections: [],
        quizScores: {},
        sectionProgress: {},
        lastAccessed: new Date().toISOString()
      };
    }
    
    // Update progress with new values
    const updatedProgress = {
      ...progress,
      ...progressUpdate,
      lastAccessed: new Date().toISOString()
    };
    
    this.userProgress.set(userId, updatedProgress);
    return updatedProgress;
  }
  
  // Initialize with sample content
  private initializeContent() {
    // Add sample sections
    const introSection: Section = {
      id: this.currentSectionId++,
      title: "Introduction to Transformer Models",
      slug: "introduction",
      order: 1,
      content: "Transformer models have revolutionized NLP..."
    };
    
    const architectureSection: Section = {
      id: this.currentSectionId++,
      title: "Transformer Architecture Overview",
      slug: "architecture",
      order: 2,
      content: "The Transformer architecture consists of an encoder-decoder structure..."
    };
    
    const embeddingSection: Section = {
      id: this.currentSectionId++,
      title: "Embeddings & Positional Encoding",
      slug: "embeddings",
      order: 3,
      content: "Before words can be processed by the Transformer architecture..."
    };
    
    const attentionSection: Section = {
      id: this.currentSectionId++,
      title: "Self-Attention Mechanism",
      slug: "attention",
      order: 4,
      content: "The self-attention mechanism is at the heart of the Transformer architecture..."
    };
    
    // Add sections to the map
    this.sections.set(introSection.slug, introSection);
    this.sections.set(architectureSection.slug, architectureSection);
    this.sections.set(embeddingSection.slug, embeddingSection);
    this.sections.set(attentionSection.slug, attentionSection);
    
    // Add sample quiz questions
    this.quizQuestions = [
      {
        id: this.currentQuizId++,
        question: "What's the main advantage of self-attention over recurrent neural networks?",
        options: [
          { id: "a", text: "Self-attention requires less memory" },
          { id: "b", text: "Self-attention creates smaller models" },
          { id: "c", text: "Self-attention allows parallelization of sequence processing" },
          { id: "d", text: "Self-attention automatically improves accuracy" }
        ],
        correctAnswer: "c",
        explanation: "Self-attention allows the model to process all tokens in the sequence in parallel, unlike RNNs which must process tokens sequentially."
      },
      {
        id: this.currentQuizId++,
        question: "What is the purpose of the scaling factor in the attention formula?",
        options: [
          { id: "a", text: "To reduce the model's memory usage" },
          { id: "b", text: "To stabilize gradients during training" },
          { id: "c", text: "To make the model run faster" },
          { id: "d", text: "To increase the attention span" }
        ],
        correctAnswer: "b",
        explanation: "The scaling factor prevents the dot products from growing too large in magnitude, which would push the softmax function into regions with very small gradients."
      }
    ];
  }
}

export const storage = new MemStorage();
