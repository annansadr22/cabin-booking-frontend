
import { Link } from "react-router-dom";
import { UserLayout } from "@/components/UserLayout";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { Home, Calendar } from "lucide-react";

const UserDashboard = () => {
  const { user } = useUserAuth();

  return (
    <UserLayout>
      <div className="animate-fade-in">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-nxtwave-primary">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.username} to NxtWave Cabin Booking System
          </h1>
          <p className="text-gray-600 mt-2">
            Book your perfect cabin getaway and manage all your bookings in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/user/cabins" 
            className="nxtwave-card hover:border-nxtwave-primary group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-nxtwave-primary">
                  View Available Cabins
                </h2>
                <p className="text-gray-600">
                  Browse through our selection of cabins and check availability
                </p>
              </div>
              <div className="bg-nxtwave-primary bg-opacity-10 p-3 rounded-full group-hover:bg-nxtwave-primary group-hover:text-white text-nxtwave-primary">
                <Home size={24} />
              </div>
            </div>
          </Link>

          <Link 
            to="/user/bookings" 
            className="nxtwave-card hover:border-nxtwave-primary group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-nxtwave-primary">
                  My Bookings
                </h2>
                <p className="text-gray-600">
                  View and manage your current and past cabin bookings
                </p>
              </div>
              <div className="bg-nxtwave-primary bg-opacity-10 p-3 rounded-full group-hover:bg-nxtwave-primary group-hover:text-white text-nxtwave-primary">
                <Calendar size={24} />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
          <div className="bg-blue-50 border-l-4 border-nxtwave-primary rounded-md p-4">
            <h3 className="font-medium text-nxtwave-primary">Book Early!</h3>
            <p className="text-gray-700">
              Our most popular cabins book up quickly. 
              We recommend booking in advance to secure your preferred date and cabin.
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
