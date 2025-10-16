import React, { useState } from 'react'
import { Sidebar } from '../../components/ui/guideSidebar'
import { Header } from '../../components/ui/guideHeader'
import { ProfileSection } from '../../components/ui/guideProfileSection'
import { AvailabilityCalendar } from '../../components/ui/AvailabilityCalendar'
import { UpcomingTours } from '../../components/ui/guideUpcomingTours'

//export function App() {
export default function Guidedashboard() {
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