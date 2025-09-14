import React, { useState } from 'react'
import { Calendar, Phone, MapPin, User, Clock } from 'lucide-react'

// Sample data for tours
const initialTours = [
  {
    id: 1,
    touristName: 'Sarah Johnson',
    destination: 'Grand Canyon National Park',
    contactNumber: '+1 (555) 987-6543',
    startDate: new Date(2023, 6, 15),
    endDate: new Date(2023, 6, 18),
    status: 'confirmed',
  },
  {
    id: 2,
    touristName: 'Michael Brown',
    destination: 'Yellowstone National Park',
    contactNumber: '+1 (555) 234-5678',
    startDate: new Date(2023, 7, 3),
    endDate: new Date(2023, 7, 7),
    status: 'pending',
  },
  {
    id: 3,
    touristName: 'Emily Davis',
    destination: 'New York City Tour',
    contactNumber: '+1 (555) 345-6789',
    startDate: new Date(2023, 7, 20),
    endDate: new Date(2023, 7, 22),
    status: 'confirmed',
  },
]

export function UpcomingTours() {
  const [tours, setTours] = useState(initialTours)
  const [filter, setFilter] = useState('all')

  const filteredTours =
    filter === 'all' ? tours : tours.filter((tour) => tour.status === filter)

  const formatDateRange = (start, end) => {
    const startStr = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    const endStr = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return `${startStr} - ${endStr}`
  }

  const updateTourStatus = (id, status) => {
    setTours(
      tours.map((tour) =>
        tour.id === id
          ? {
              ...tour,
              status,
            }
          : tour
      )
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Upcoming Tours</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 rounded-md ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Pending
          </button>
        </div>
      </div>

      {filteredTours.length > 0 ? (
        <div className="space-y-4">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-medium text-gray-800">
                    {tour.destination}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDateRange(tour.startDate, tour.endDate)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {tour.status === 'confirmed' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Confirmed
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">Tourist:</span>
                    <span className="ml-2">{tour.touristName}</span>
                  </div>
                  <div className="flex items-center text-gray-700 mt-2">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="font-medium">Contact:</span>
                    <span className="ml-2">{tour.contactNumber}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  {tour.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateTourStatus(tour.id, 'confirmed')}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateTourStatus(tour.id, 'cancelled')}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <p className="text-gray-500">No tours found matching your filter.</p>
        </div>
      )}
    </div>
  )
}