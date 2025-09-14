import React, { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { ProfileSection } from './components/ProfileSection'
import { AvailabilityCalendar } from './components/AvailabilityCalendar'
import { UpcomingTours } from './components/UpcomingTours'

export function App() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'availability' && <AvailabilityCalendar />}
          {activeTab === 'tours' && <UpcomingTours />}
        </main>
      </div>
    </div>
  )
}