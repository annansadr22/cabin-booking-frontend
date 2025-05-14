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
            Your Workspace, Your Schedule. Reserve Your Preferred Cabin Instantly.
          </p>
          <div className="space-x-4">
            <Link
              to="/user/login"
              className="bg-white text-nxtwave-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              User Login
            </Link>
            <Link
              to="/admin/login"
              className="bg-nxtwave-dark text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors shadow-lg"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to book your getaway?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Join us and enjoy seamless cabin booking with just a few clicks.
          </p>
          <div className="space-x-4">
            <Link to="/user/login" className="nxtwave-btn px-8 py-3 text-lg">
              Login Now
            </Link>
            <Link
              to="/user/register"
              className="bg-white border border-nxtwave-primary text-nxtwave-primary px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors"
            >
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
