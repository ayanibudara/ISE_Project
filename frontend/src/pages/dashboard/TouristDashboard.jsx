import { useAuth } from '../../contexts/AuthContext';

const TouristDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tourist Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.firstName}! Discover exciting destinations and plan your next adventure.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Trips</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">12</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Upcoming Trips</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">3</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Bookings</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">8</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Reviews Given</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">4.8</dd>
        </div>
      </div>

      {/* Upcoming Trips */}
      <h2 className="mt-10 text-lg font-medium leading-6 text-gray-900">Upcoming Trips</h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Trip Card 1 */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="" 
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Beach Paradise Tour</h3>
                <p className="text-sm text-gray-500">Starting on Aug 23, 2023</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Confirmed
              </span>
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Guide:</p>
                <p className="text-sm font-medium text-gray-900">John Smith</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration:</p>
                <p className="text-sm font-medium text-gray-900">7 days</p>
              </div>
            </div>
            <div className="mt-5">
              <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;
