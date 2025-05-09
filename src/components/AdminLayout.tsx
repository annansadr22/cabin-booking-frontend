
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, Calendar, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-nxtwave-secondary text-white' : 'hover:bg-gray-100';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-nxtwave-primary">
            NxtWave <span className="text-sm font-normal bg-gray-200 px-2 py-1 rounded ml-2">Admin</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {admin?.username}</span>
            <button 
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-nxtwave-primary"
            >
              <LogOut size={16} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <Link 
              to="/admin/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/admin/dashboard')}`}
            >
              <Home size={16} className="mr-1" />
              Dashboard
            </Link>
            <Link 
              to="/admin/cabins"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/admin/cabins')}`}
            >
              <Home size={16} className="mr-1" />
              Manage Cabins
            </Link>
            <Link 
              to="/admin/bookings"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/admin/bookings')}`}
            >
              <Calendar size={16} className="mr-1" />
              Manage Bookings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} NxtWave Cabin Booking System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
