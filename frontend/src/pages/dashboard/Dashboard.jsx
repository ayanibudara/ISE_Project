import { useAuth } from '../../contexts/AuthContext';
import TouristDashboard from './TouristDashboard';
import GuideDashboard from './GuideDashboard';
import ServiceProviderDashboard from './ServiceProviderDashboard';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Dashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="mt-2">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'Tourist':
        return <TouristDashboard user={user} />;
      case 'Guide':
        return <GuideDashboard user={user} />;
      case 'ServiceProvider':
        return <ServiceProviderDashboard user={user} />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Unknown user role</h2>
            <p className="mt-2">Please contact support.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
