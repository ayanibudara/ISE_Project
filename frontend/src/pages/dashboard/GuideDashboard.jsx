import { useAuth } from '../../contexts/AuthContext';

const GuideDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guide Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.firstName}! Manage your tours and connect with tourists.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Tours</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">4</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Tourists Guided</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">42</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Rating</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">4.8</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Earnings</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">$3,245</dd>
        </div>
      </div>

      {/* Upcoming Tours */}
      <h2 className="mt-10 text-lg font-medium leading-6 text-gray-900">Upcoming Tours</h2>
      <div className="mt-5 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tour Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tourists</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  <div>
                    <div className="font-medium text-gray-900">City Historical Tour</div>
                    <div className="text-gray-500">Downtown Area</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div>Aug 18, 2023</div>
                <div className="text-gray-400">9:00 AM</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">8</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Confirmed
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">View details</a>
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  <div>
                    <div className="font-medium text-gray-900">Hiking Adventure</div>
                    <div className="text-gray-500">Mountain Trail</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div>Aug 25, 2023</div>
                <div className="text-gray-400">8:00 AM</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">12</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">View details</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Latest Reviews */}
      <h2 className="mt-10 text-lg font-medium leading-6 text-gray-900">Latest Reviews</h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Sarah Wilson</h3>
                <div className="mt-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg key={rating} className={`h-5 w-5 ${rating < 4 ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                "Great tour overall, very informative and engaging. Would have appreciated a bit more time at some of the key attractions."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
