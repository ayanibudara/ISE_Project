import { useAuth } from '../../contexts/AuthContext';

const ServiceProviderDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Service Provider Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.businessName || user?.firstName}! Manage your services and bookings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Services</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">6</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Bookings This Month</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">24</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Rating</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">4.7</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Revenue</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">$5,840</dd>
        </div>
      </div>

      {/* Service Performance */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Service Performance</h3>
            <div className="mt-5">
              <div className="overflow-hidden rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Luxury Hotel Accommodation</div>
                  <div className="text-sm text-gray-500">45% of total revenue</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="relative h-4 w-full rounded-full bg-gray-200">
                      <div className="absolute h-4 rounded-full bg-primary-600" style={{ width: '45%' }}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">45%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Airport Transfer</div>
                  <div className="text-sm text-gray-500">25% of total revenue</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="relative h-4 w-full rounded-full bg-gray-200">
                      <div className="absolute h-4 rounded-full bg-primary-600" style={{ width: '25%' }}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">25%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Restaurant Services</div>
                  <div className="text-sm text-gray-500">20% of total revenue</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="relative h-4 w-full rounded-full bg-gray-200">
                      <div className="absolute h-4 rounded-full bg-primary-600" style={{ width: '20%' }}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">20%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Tour Packages</div>
                  <div className="text-sm text-gray-500">10% of total revenue</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="relative h-4 w-full rounded-full bg-gray-200">
                      <div className="absolute h-4 rounded-full bg-primary-600" style={{ width: '10%' }}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Bookings</h3>
            <ul className="mt-5 divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Luxury Suite Booking</p>
                    <p className="text-sm text-gray-500">James Wilson • Aug 15, 2023</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Confirmed
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Airport Transfer</p>
                    <p className="text-sm text-gray-500">Emily Clark • Aug 16, 2023</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Restaurant Reservation</p>
                    <p className="text-sm text-gray-500">Michael Brown • Aug 18, 2023</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Confirmed
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
