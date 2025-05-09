import { useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { useScrollSpyContext } from "@/contexts/ScrollSpyContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";

type NavItem = {
  id: string;
  section: string;
  name: string;
  icon: string;
};

const navigation: Record<string, NavItem[]> = {
  "Fundamentals": [
    { id: "introduction", section: "Fundamentals", name: "Introduction", icon: "ri-book-2-line" },
    { id: "architecture", section: "Fundamentals", name: "Architecture Overview", icon: "ri-stack-line" },
  ],
  "Key Components": [
    { id: "embeddings", section: "Key Components", name: "Embeddings & Positional Encoding", icon: "ri-database-2-line" },
    { id: "attention", section: "Key Components", name: "Self-Attention Mechanism", icon: "ri-focus-3-line" },
    { id: "encoder", section: "Key Components", name: "Encoder Structure", icon: "ri-code-box-line" },
    { id: "decoder", section: "Key Components", name: "Decoder Structure", icon: "ri-code-s-slash-line" },
  ],
  "Implementation": [
    { id: "code", section: "Implementation", name: "Code Implementation", icon: "ri-code-line" },
    { id: "training", section: "Implementation", name: "Training Process", icon: "ri-settings-3-line" },
  ],
  "Advanced Topics": [
    { id: "comparison", section: "Advanced Topics", name: "Model Comparisons", icon: "ri-scales-line" },
    { id: "quiz", section: "Advanced Topics", name: "Knowledge Check", icon: "ri-question-line" },
    { id: "resources", section: "Advanced Topics", name: "Further Resources", icon: "ri-book-open-line" },
  ],
};

// Application pages navigation (separate from section navigation)
const pageNavigation: NavItem[] = [
  { id: "playground", section: "Pages", name: "Attention Playground", icon: "ri-braces-line" },
  { id: "dashboard", section: "Pages", name: "User Dashboard", icon: "ri-user-line" },
  { id: "search", section: "Pages", name: "Search Content", icon: "ri-search-line" },
  { id: "api-docs", section: "Pages", name: "API Documentation", icon: "ri-file-list-3-line" },
];

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  const { activeSection, setActiveSection } = useScrollSpyContext();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [progress, setProgress] = useState(15);
  const [location, setLocation] = useLocation();

  // Close sidebar on mobile when navigation changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, location]);

  // Update active section based on hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setActiveSection(hash);
      }
    };

    // Check hash on load
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [setActiveSection]);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    window.location.hash = id;
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50 font-body text-neutral-800">
      {/* Mobile Navigation Header */}
      {isMobile && (
        <header className="bg-white py-4 px-6 border-b border-neutral-200 sticky top-0 z-50 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 text-neutral-600"
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
            <h1 className="text-xl font-semibold text-neutral-800">Transformer Models</h1>
          </div>
        </header>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "bg-white w-full md:w-72 lg:w-80 border-r border-neutral-200 fixed md:sticky top-0 h-screen overflow-y-auto z-40 transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Transformer Models</h1>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-neutral-600 md:hidden"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            )}
          </div>

          <nav>
            {Object.entries(navigation).map(([section, items]) => (
              <div key={section}>
                <p className="text-xs uppercase font-semibold text-neutral-400 mb-2 mt-6">{section}</p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm rounded-lg font-medium",
                          activeSection === item.id
                            ? "text-primary-600 bg-primary-50"
                            : "text-neutral-600 hover:bg-neutral-100"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.id);
                        }}
                      >
                        <i className={`${item.icon} mr-3`}></i>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Additional Pages Navigation */}
            <div>
              <p className="text-xs uppercase font-semibold text-neutral-400 mb-2 mt-6">Features</p>
              <ul className="space-y-1">
                {pageNavigation.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`/${item.id}`}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm rounded-lg font-medium",
                        location === `/${item.id}`
                          ? "text-primary-600 bg-primary-50"
                          : "text-neutral-600 hover:bg-neutral-100"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation(`/${item.id}`);
                        if (isMobile) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <i className={`${item.icon} mr-3`}></i>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-12">
        {/* Progress bar */}
        <div className="sticky top-0 z-10 md:top-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-none md:rounded-xl shadow-sm md:shadow border-b md:border border-neutral-200 overflow-hidden">
            <div className="w-full bg-neutral-100 h-1">
              <Progress value={progress} className="h-1" />
            </div>
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Your progress:</span>
                <span className="text-sm text-primary-600 font-semibold">{progress}%</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-primary-600 font-medium focus:outline-none hover:text-primary-700">
                  Save progress
                </button>
                <div className="border-l border-neutral-200 h-6"></div>
                <UserMenu />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

export default MainLayout;
