import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PinLock from "./components/PinLock";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Apps from "./pages/Apps";
import GitHubRepos from "./pages/GitHubRepos";
import Admin from "./pages/Admin";
function AppRouter() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/apps"} component={Apps} />
        <Route path={"/github"} component={GitHubRepos} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <PinLock>
            <AppRouter />
          </PinLock>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
