import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ArtManagement from "./pages/ArtManagement";
import Profile from "./pages/Profile";
import Artwork from "./pages/Artwork";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DataTest from "./pages/DataTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* User Authentication Routes */}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />

              {/* Admin Authentication Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/forgot-password"
                element={<ForgotPassword />}
              />
              <Route path="/admin/reset-password" element={<ResetPassword />} />
              <Route
                path="/admin/register"
                element={
                  <ProtectedRoute>
                    <AdminRegister />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* Other Routes */}
              <Route path="/art-management" element={<ArtManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/artwork" element={<Artwork />} />
              <Route path="/data-test" element={<DataTest />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
