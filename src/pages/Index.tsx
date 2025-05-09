
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-nxtwave-primary to-nxtwave-accent text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Welcome to NxtWave Cabin Booking System
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience tranquility in our beautiful cabins. Book your perfect getaway today.
          </p>
          <div className="space-x-4">
            <Link to="/user/login" className="bg-white text-nxtwave-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg">
              User Login
            </Link>
            <Link to="/admin/login" className="bg-nxtwave-dark text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors shadow-lg">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose NxtWave?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="nxtwave-card text-center">
              <div className="w-16 h-16 bg-nxtwave-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Cabins</h3>
              <p className="text-gray-600">
                Choose from our selection of carefully designed cabins in scenic locations.
              </p>
            </div>
            
            <div className="nxtwave-card text-center">
              <div className="w-16 h-16 bg-nxtwave-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">
                Our booking system ensures your reservations are safe and confirmed instantly.
              </p>
            </div>
            
            <div className="nxtwave-card text-center">
              <div className="w-16 h-16 bg-nxtwave-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌲</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nature Retreats</h3>
              <p className="text-gray-600">
                Disconnect from the daily grind and reconnect with nature at our serene locations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to book your getaway?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Join our community of nature enthusiasts and book your perfect cabin today.
          </p>
          <div className="space-x-4">
            <Link to="/user/login" className="nxtwave-btn px-8 py-3 text-lg">
              Login Now
            </Link>
            <Link to="/user/register" className="bg-white border border-nxtwave-primary text-nxtwave-primary px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">NxtWave Cabin Booking</h3>
            <p className="mb-4">
              &copy; {new Date().getFullYear()} NxtWave. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
