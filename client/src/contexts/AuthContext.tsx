import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: number;
  username: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulate authentication API
const fakeAuthApi = {
  login: async (username: string, password: string): Promise<User> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock successful login
        resolve({ id: 1, username, email: 'user@example.com' });
      }, 500);
    });
  },
  
  register: async (username: string, email: string, password: string): Promise<User> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock successful registration
        resolve({ id: 1, username, email });
      }, 500);
    });
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user', e);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await fakeAuthApi.login(username, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await fakeAuthApi.register(username, email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}