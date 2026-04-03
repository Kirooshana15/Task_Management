import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import RequestsList from "@/pages/RequestsList";
import ReviewPanel from "@/pages/ReviewPanel";
import WorkItems from "@/pages/WorkItems";
import DeveloperBoard from "@/pages/DeveloperBoard";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1D2D44]">
        <div className="w-8 h-8 border-4 border-[#D4D4CE]/20 border-t-[#D4D4CE] rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) return <LoginPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={user.role === "developer" ? <Navigate to="/developer" replace /> : <Dashboard />} />
        <Route path="/requests" element={user.role !== "developer" ? <RequestsList /> : <Navigate to="/developer" replace />} />
        <Route path="/review" element={user.role !== "developer" ? <ReviewPanel /> : <Navigate to="/developer" replace />} />
        <Route path="/work-items" element={user.role !== "developer" ? <WorkItems /> : <Navigate to="/developer" replace />} />
        <Route path="/developer" element={user.role === "developer" ? <DeveloperBoard /> : <Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="serviceflow-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
