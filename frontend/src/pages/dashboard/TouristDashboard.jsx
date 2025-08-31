import { useAuth } from '../../contexts/AuthContext';

const TouristDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">

        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.firstName}! Discover exciting destinations and plan your next adventure.
        </p>
      </div>
    </div>
  );
};

export default TouristDashboard;
