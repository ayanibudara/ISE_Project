import { useAuth } from '../../contexts/AuthContext';
import { AvailabilityCalendar } from '../../components/ui/AvailabilityCalendar';
import { UpcomingTours } from '../../components/ui/guideUpcomingTours';

const GuideDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.firstName}! Manage your tours and connect with tourists.
        </p>
      </div>

      {/* Availability Calendar Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Availability</h2>
        <div className="bg-white shadow rounded-lg p-4">
          <AvailabilityCalendar />
        </div>
      </div>

      {/* Upcoming Tours Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Tours</h2>
        <div className="bg-white shadow rounded-lg p-4">
          <UpcomingTours />
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
//correct guidedashboard