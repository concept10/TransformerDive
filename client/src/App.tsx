import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ScrollSpyProvider } from "./contexts/ScrollSpyContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AttentionPlayground = lazy(() => import("@/pages/AttentionPlayground"));
const UserDashboard = lazy(() => import("@/pages/UserDashboard"));
const Search = lazy(() => import("@/pages/Search"));
const ApiDocs = lazy(() => import("@/pages/ApiDocs"));
const Login = lazy(() => import("@/pages/Login"));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="w-full h-[70vh] flex flex-col items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="mt-4 text-lg">Loading content...</p>
  </div>
);

// Auth protected route component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return isAuthenticated ? <Component /> : null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/playground" component={AttentionPlayground} />
        <Route path="/dashboard">
          <ProtectedRoute component={UserDashboard} />
        </Route>
        <Route path="/search" component={Search} />
        <Route path="/api-docs" component={ApiDocs} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="transformer-ui-theme">
      <AuthProvider>
        <ScrollSpyProvider>
          <MainLayout>
            <Router />
          </MainLayout>
          <Toaster />
        </ScrollSpyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
