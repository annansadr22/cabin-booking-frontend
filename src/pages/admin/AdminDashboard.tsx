
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { mockCabins } from "@/services/mockData";
import { mockBookings } from "@/services/mockData";
import { Home, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  
  const activeBookingsCount = mockBookings.filter(b => b.status === "active").length;
  const cabinsCount = mockCabins.length;

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-nxtwave-primary">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {admin?.username} to NxtWave Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all cabins and bookings from this central dashboard.
          </p>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-nxtwave-primary">
            <h3 className="text-lg font-medium text-gray-500">Total Cabins</h3>
            <p className="text-3xl font-bold">{cabinsCount}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-medium text-gray-500">Active Bookings</h3>
            <p className="text-3xl font-bold">{activeBookingsCount}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold">1</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-medium text-gray-500">Total Bookings</h3>
            <p className="text-3xl font-bold">{mockBookings.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/admin/cabins" 
            className="nxtwave-card hover:border-nxtwave-primary group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-nxtwave-primary">
                  Manage Cabins
                </h2>
                <p className="text-gray-600">
                  Add, edit, or delete cabins and their availability
                </p>
              </div>
              <div className="bg-nxtwave-primary bg-opacity-10 p-3 rounded-full group-hover:bg-nxtwave-primary group-hover:text-white text-nxtwave-primary">
                <Home size={24} />
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/bookings" 
            className="nxtwave-card hover:border-nxtwave-primary group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-nxtwave-primary">
                  Manage Bookings
                </h2>
                <p className="text-gray-600">
                  View and manage all user bookings across the system
                </p>
              </div>
              <div className="bg-nxtwave-primary bg-opacity-10 p-3 rounded-full group-hover:bg-nxtwave-primary group-hover:text-white text-nxtwave-primary">
                <Calendar size={24} />
              </div>
            </div>
          </Link>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-500">
              <div className="flex items-center border-b pb-2 mb-2">
                <span className="w-32">Today</span>
                <span>Admin logged in</span>
              </div>
              <div className="flex items-center border-b pb-2 mb-2">
                <span className="w-32">Today</span>
                <span>System initialized with {cabinsCount} cabins</span>
              </div>
              <div className="flex items-center">
                <span className="w-32">Today</span>
                <span>{activeBookingsCount} active bookings in the system</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
