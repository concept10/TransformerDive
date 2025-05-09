import { createContext, useContext, useState, ReactNode } from 'react';

type ScrollSpyContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const ScrollSpyContext = createContext<ScrollSpyContextType | undefined>(undefined);

export function ScrollSpyProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('introduction');

  return (
    <ScrollSpyContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ScrollSpyContext.Provider>
  );
}

export function useScrollSpyContext() {
  const context = useContext(ScrollSpyContext);
  if (context === undefined) {
    throw new Error('useScrollSpyContext must be used within a ScrollSpyProvider');
  }
  return context;
}