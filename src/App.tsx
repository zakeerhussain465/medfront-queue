import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Queue from "./pages/Queue";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("frontDeskAuth") === "true";
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/queue" element={
            <ProtectedRoute>
              <Queue />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-background">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Patients</h1>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
