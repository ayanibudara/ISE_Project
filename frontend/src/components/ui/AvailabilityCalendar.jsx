import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

export function AvailabilityCalendar() {
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  // 👉 Replace this with your real guide ID (maybe from auth)
  const guideId = 'YOUR_GUIDE_ID_HERE'  

  // 🟢 Toggle date availability
  const toggleDateAvailability = (date) => {
    const dateStr = date.toDateString()
    const exists = availableDates.find((d) => d.toDateString() === dateStr)
    if (exists) {
      setAvailableDates(availableDates.filter((d) => d.toDateString() !== dateStr))
    } else {
      setAvailableDates([...availableDates, date])
    }
  }

  // 🟡 Highlight available dates in calendar
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      return availableDates.find(
        (d) => d.toDateString() === date.toDateString()
      )
        ? 'bg-green-200 text-green-800'
        : null
    }
  }

  // ✅ Save availability to backend
  const saveAvailability = async () => {
    const formattedDates = availableDates.map((date) => ({
      date: date.toISOString(),
      isAvailable: true,
    }))

    try {
      const res = await fetch(`http://localhost:5000/api/guides/${guideId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability: formattedDates }),
      })

      if (!res.ok) {
        throw new Error('Failed to update availability')
      }

      const data = await res.json()
      console.log('✅ Availability updated:', data)
      alert('Availability updated successfully ✅')
    } catch (err) {
      console.error('❌ Error updating availability:', err)
      alert('Failed to update availability ❌')
    }
  }

  // ✅ Load existing availability on mount (optional)
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/guides/${guideId}/availability`)
        const data = await res.json()
        if (data.availability) {
          setAvailableDates(data.availability.map((item) => new Date(item.date)))
        }
      } catch (err) {
        console.error('Error fetching availability:', err)
      }
    }

    fetchAvailability()
  }, [guideId])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Availability Calendar
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Mark Your Availability
            </h3>
            <p className="text-gray-600 mb-4">
              Click on dates to mark when you're available for tours. Green
              dates indicate your availability.
            </p>
          </div>
          <div className="calendar-container mb-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              onClickDay={toggleDateAvailability}
              tileClassName={tileClassName}
              className="border-0 shadow-none"
            />
          </div>

          {/* 🟡 Save button */}
          <button
            onClick={saveAvailability}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Availability
          </button>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Your Available Dates
          </h3>
          {availableDates.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md h-80 overflow-y-auto">
              <ul className="space-y-2">
                {availableDates
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
                    >
                      <span>
                        {date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => toggleDateAvailability(date)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-md flex items-center justify-center h-80">
              <p className="text-gray-500 text-center">
                No available dates selected. Click on the calendar to mark your
                availability.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
