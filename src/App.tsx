import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import OrgDashboard from "./pages/OrgDashboard";
import PlatformAdminDashboard from "./pages/PlatformAdminDashboard";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Institution routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["institution"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/learners" element={<ProtectedRoute allowedRoles={["institution"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={["institution"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["institution"]}><AdminDashboard /></ProtectedRoute>} />

            {/* Organization routes */}
            <Route path="/organization" element={<ProtectedRoute allowedRoles={["organization"]}><OrgDashboard /></ProtectedRoute>} />
            <Route path="/organization/search" element={<ProtectedRoute allowedRoles={["organization"]}><OrgDashboard /></ProtectedRoute>} />
            <Route path="/organization/reports" element={<ProtectedRoute allowedRoles={["organization"]}><OrgDashboard /></ProtectedRoute>} />
            <Route path="/organization/settings" element={<ProtectedRoute allowedRoles={["organization"]}><OrgDashboard /></ProtectedRoute>} />

            {/* Platform admin routes */}
            <Route path="/platform-admin" element={<ProtectedRoute allowedRoles={["admin"]}><PlatformAdminDashboard /></ProtectedRoute>} />

            <Route path="/verify/:hash" element={<Verify />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
