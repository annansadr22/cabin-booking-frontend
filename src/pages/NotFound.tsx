
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-6xl font-bold text-nxtwave-primary mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oops! Page not found</p>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="nxtwave-btn inline-block"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
