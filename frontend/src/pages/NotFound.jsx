import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { authState } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-600">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link
            to={authState.isAuthenticated ? "/dashboard" : "/login"}
            className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {authState.isAuthenticated ? "Back to Dashboard" : "Go to Login"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
