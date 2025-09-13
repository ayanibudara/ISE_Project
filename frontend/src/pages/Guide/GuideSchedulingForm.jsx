import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  CalendarIcon,
  UserIcon,
  DollarSignIcon,
  ClipboardCheckIcon,
  PencilIcon,
} from 'lucide-react'
import { format, differenceInDays, addDays } from "date-fns";


export default function GuideSchedulingForm() {
  const [isEditing, setIsEditing] = useState(true)
  const [totalDays, setTotalDays] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [guides, setGuides] = useState([
    {
      id: '1',
      name: 'John Smith',
      expertise: 'Mountain Trekking',
      availability: true,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      expertise: 'Historical Tours',
      availability: true,
    },
    {
      id: '3',
      name: 'Michael Chen',
      expertise: 'Wildlife Safari',
      availability: false,
    },
    {
      id: '4',
      name: 'Emma Davis',
      expertise: 'Urban Exploration',
      availability: true,
    },
  ])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: new Date(),
      endDate: addDays(new Date(), 5),
      guideId: '',
      paymentPerDay: 150,
    },
  })

  const watchStartDate = watch('startDate')
  const watchEndDate = watch('endDate')
  const watchPaymentPerDay = watch('paymentPerDay')

  // Calculate total days whenever start or end date changes
  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      const days = differenceInDays(new Date(watchEndDate), new Date(watchStartDate)) + 1
      setTotalDays(days > 0 ? days : 0)
    }
  }, [watchStartDate, watchEndDate])

  // Calculate total payment whenever total days or payment per day changes
  useEffect(() => {
    setTotalPayment(totalDays * (watchPaymentPerDay || 0))
  }, [totalDays, watchPaymentPerDay])

  const onSubmit = (data) => {
    console.log('Form submitted:', data, {
      totalDays,
      totalPayment,
    })
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Date Range Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: 'Start date is required',
                  }}
                  render={({ field }) => (
                    <input
                      type="date"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      value={
                        field.value
                          ? format(new Date(field.value), 'yyyy-MM-dd')
                          : ''
                      }
                      disabled={!isEditing}
                    />
                  )}
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: 'End date is required',
                  }}
                  render={({ field }) => (
                    <input
                      type="date"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      value={
                        field.value
                          ? format(new Date(field.value), 'yyyy-MM-dd')
                          : ''
                      }
                      disabled={!isEditing}
                    />
                  )}
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Total Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Days
            </label>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <span className="text-lg font-medium">
                {totalDays} {totalDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>

          {/* Guide Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Guide
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register('guideId', {
                  required: 'Please select a guide',
                })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                disabled={!isEditing}
              >
                <option value="">Select a guide...</option>
                {guides.map((guide) => (
                  <option
                    key={guide.id}
                    value={guide.id}
                    disabled={!guide.availability}
                  >
                    {guide.name} - {guide.expertise}{' '}
                    {!guide.availability && '(Unavailable)'}
                  </option>
                ))}
              </select>
            </div>
            {errors.guideId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.guideId.message}
              </p>
            )}
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Per Day ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSignIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  {...register('paymentPerDay', {
                    required: 'Payment amount is required',
                    min: {
                      value: 1,
                      message: 'Payment must be greater than 0',
                    },
                  })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={!isEditing}
                />
              </div>
              {errors.paymentPerDay && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentPerDay.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Payment ($)
              </label>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <span className="text-lg font-medium">
                  ${totalPayment.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            {isEditing ? (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                Confirm Booking
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Booking
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}