import { Fragment, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = authState;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: (
      <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ), current: false },
  ];

  // Add role-specific navigation items
  if (user?.role === 'Tourist') {
    navigation.push(
      { name: 'Explore', href: '/explore', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ), current: false },
      { name: 'My Trips', href: '/my-trips', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ), current: false },
      { name: 'Bookings', href: '/bookings', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ), current: false },
      { name: 'Profile', href: '/dashboard/tourist/profile', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ), current: false }
    );
  } else if (user?.role === 'Guide') {
    // Update Dashboard href for guides
    navigation[0].href = '/dashboard/guide';
    
    navigation.push(
      { name: 'My Tours', href: '/my-tours', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ), current: false },
      { name: 'Schedule', href: '/schedule', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ), current: false },
      { name: 'Reviews', href: '/reviews', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ), current: false },
      { name: 'My Profile', href: '/dashboard/guide/profile', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ), current: false }
    );
  } else if (user?.role === 'ServiceProvider') {
    navigation.push(
      { name: 'My Services', href: '/my-services', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ), current: false },
      { name: 'Bookings', href: '/service-bookings', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ), current: false },
      { name: 'Analytics', href: '/analytics', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), current: false },
      { name: 'Profile', href: '/dashboard/service-provider/profile', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ), current: false }
    );
  } else if (user?.role === 'Admin') {
    // Update Dashboard href for admins
    navigation[0].href = '/dashboard/admin';
    
    navigation.push(
      { name: 'User Management', href: '/dashboard/admin', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ), current: false },
      { name: 'Advertising', href: '/dashboard/admin/advertising', icon: (
        <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ), current: false }
    );
  }

  // Common navigation items (exclude for Admin)
  if (user?.role !== 'Admin') {
    navigation.push(
    { name: 'Messages', href: '/messages', icon: (
      <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ), current: false },
    { name: 'Settings', href: '/settings', icon: (
      <svg className="mr-4 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ), current: false }
    );
  }

  // Set current page based on location
  navigation.forEach(item => {
    item.current = location.pathname === item.href;
  });

  // Function to get page title based on current location
  const getPageTitle = () => {
    const currentPage = navigation.find(item => item.current);
    if (currentPage) {
      return currentPage.name;
    }
    
    // Fallback titles based on pathname
    const path = location.pathname;
    if (path.includes('/admin')) {
      if (path.includes('/advertising')) return 'Advertising Management';
      return 'Admin Dashboard';
    } else if (path.includes('/guide')) {
      if (path.includes('/profile')) return 'Guide Profile';
      return 'Guide Dashboard';
    } else if (path.includes('/tourist')) {
      if (path.includes('/profile')) return 'Tourist Profile';
      return 'Tourist Dashboard';
    } else if (path.includes('/service-provider')) {
      if (path.includes('/profile')) return 'Service Provider Profile';
      return 'Service Provider Dashboard';
    }
    
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-5 pb-4 shadow-2xl">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-600/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 hover:bg-slate-500/50 transition-colors duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </Transition.Child>
              <div className="flex flex-shrink-0 items-center px-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">TMS</h1>
                    <p className="text-xs text-slate-300">Tourism Management</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 h-0 flex-1 overflow-y-auto px-3">
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        item.current
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg backdrop-blur-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 transition-colors duration-200 ${
                        item.current 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                          : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>
                {/* Mobile sidebar logout button */}
                <div className="mt-8 px-4">
                  <button
                    onClick={handleLogout}
                    className="group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-red-300 hover:text-white hover:bg-red-500/20 hover:backdrop-blur-sm transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg mr-3 bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" />
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-72 flex-col">
          <div className="flex h-0 flex-1 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
            <div className="flex h-20 flex-shrink-0 items-center px-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">TMS</h1>
                  <p className="text-sm text-slate-300">Tourism Management System</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto py-6">
              <nav className="flex-1 space-y-3 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg backdrop-blur-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-md'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-4 transition-colors duration-200 ${
                      item.current 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-medium tracking-wide">{item.name}</span>
                    {item.current && (
                      <div className="ml-auto">
                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                      </div>
                    )}
                  </Link>
                ))}
              </nav>
              {/* Desktop sidebar logout button */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-red-300 hover:text-white hover:bg-red-500/20 hover:backdrop-blur-sm transition-all duration-200"
                >
                  <div className="p-2 rounded-lg mr-4 bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-medium tracking-wide">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-gradient-to-r from-white to-slate-50 border-b border-slate-200/60 shadow-lg backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="ml-4 md:ml-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {getPageTitle()}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative mx-4">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full rounded-lg border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white/70 backdrop-blur-sm shadow-sm"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <button className="rounded-full bg-white/70 p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm backdrop-blur-sm transition-colors duration-200">
                <span className="sr-only">View notifications</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-4 flex-shrink-0">
                <div>
                  <Menu.Button className="flex items-center space-x-3 rounded-lg bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white/90">
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium text-slate-700">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-white">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white/95 py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm border border-slate-200">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                          } block px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 mx-2 rounded-lg`}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Your Profile</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={`${
                            active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                          } block px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 mx-2 rounded-lg`}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <div className="border-t border-slate-200 my-1"></div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-red-50 text-red-700' : 'text-red-600'
                          } block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 mx-2 rounded-lg`}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign out</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
