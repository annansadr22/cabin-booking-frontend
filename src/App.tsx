
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Pages
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";
import AvailableCabins from "./pages/user/AvailableCabins";
import CabinSlots from "./pages/user/CabinSlots";
import MyBookings from "./pages/user/MyBookings";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCabins from "./pages/admin/ManageCabins";
import ManageBookings from "./pages/admin/ManageBookings";

// Index and Not Found
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Authentication Providers
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserAuthProvider>
          <AdminAuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected user routes */}
              <Route element={<ProtectedRoute role="user" />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/cabins" element={<AvailableCabins />} />
                <Route path="/user/cabins/:cabinId/slots" element={<CabinSlots />} />
                <Route path="/user/bookings" element={<MyBookings />} />
              </Route>

              {/* Protected admin routes */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/cabins" element={<ManageCabins />} />
                <Route path="/admin/bookings" element={<ManageBookings />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminAuthProvider>
        </UserAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
