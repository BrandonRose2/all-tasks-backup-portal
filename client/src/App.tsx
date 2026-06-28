import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PinLock from "./components/PinLock";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Apps from "./pages/Apps";
import GitHubRepos from "./pages/GitHubRepos";
import Admin from "./pages/Admin";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/apps"} component={Apps} />
      <Route path={"/github"} component={GitHubRepos} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <PinLock>
            <Router />
          </PinLock>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
