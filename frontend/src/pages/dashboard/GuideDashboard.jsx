import { useAuth } from '../../contexts/AuthContext';

const GuideDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.firstName}! Manage your tours and connect with tourists.
        </p>
      </div>
    </div>
  );
};

export default GuideDashboard;
