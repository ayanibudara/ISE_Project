import { useAuth } from '../../contexts/AuthContext';

const PackageProviderDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.businessName || user?.firstName}! Manage your services and bookings.
        </p>
      </div>
    </div>
  );
};

export default PackageProviderDashboard;
