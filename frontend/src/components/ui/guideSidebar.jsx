import React from 'react'
import { UserCircle, Calendar, MapPin, LogOut } from 'lucide-react'

export function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCircle,
    },
    {
      id: 'availability',
      label: 'Availability',
      icon: Calendar,
    },
    {
      id: 'tours',
      label: 'Upcoming Tours',
      icon: MapPin,
    },
  ]

  return (
    <aside className="bg-white w-20 md:w-64 shadow-md flex-shrink-0 border-r border-gray-200">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start py-6 px-4 border-b border-gray-200">
          <span className="hidden md:block text-xl font-bold text-blue-600">
            GuideHub
          </span>
          <span className="block md:hidden text-xl font-bold text-blue-600">
            GH
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left ${activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden md:block ml-3">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center px-4 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-md">
            <LogOut className="h-5 w-5" />
            <span className="hidden md:block ml-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}