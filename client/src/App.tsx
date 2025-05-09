import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import MainLayout from "@/layouts/MainLayout";
import { ThemeProvider } from "./components/ui/theme-provider";

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
      <MainLayout>
        <Router />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
