import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import MainLayout from "@/layouts/MainLayout";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ScrollSpyProvider } from "./contexts/ScrollSpyContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="transformer-ui-theme">
      <ScrollSpyProvider>
        <MainLayout>
          <Router />
        </MainLayout>
      </ScrollSpyProvider>
    </ThemeProvider>
  );
}

export default App;
