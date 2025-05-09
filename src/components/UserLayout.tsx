
import { useUserAuth } from "@/contexts/UserAuthContext";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, LogOut } from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: UserLayoutProps) => {
  const { user, logout } = useUserAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-nxtwave-secondary text-white' : 'hover:bg-gray-100';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/user/dashboard" className="text-2xl font-bold text-nxtwave-primary">
            NxtWave
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.username}</span>
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
              to="/user/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/user/dashboard')}`}
            >
              <Home size={16} className="mr-1" />
              Dashboard
            </Link>
            <Link 
              to="/user/cabins"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/user/cabins')}`}
            >
              <Home size={16} className="mr-1" />
              Cabins
            </Link>
            <Link 
              to="/user/bookings"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/user/bookings')}`}
            >
              <Calendar size={16} className="mr-1" />
              My Bookings
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
