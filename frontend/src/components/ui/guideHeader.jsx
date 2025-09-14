import React from 'react'
import { Bell, MessageSquare } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-800">
          Tourist Guide Dashboard
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <MessageSquare className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          JD
        </div>
      </div>
    </header>
  )
}