import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Calendar,
  User,
  DollarSign,
  ClipboardCheck,
  Edit3,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { format, differenceInDays, addDays } from "date-fns";

export default function GuideSchedulingForm() {
  const [isEditing, setIsEditing] = useState(true)
  const [totalDays, setTotalDays] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [animateSubmit, setAnimateSubmit] = useState(false)
  
  const [guides, setGuides] = useState([
    {
      id: '1',
      name: 'John Smith',
      expertise: 'Mountain Trekking',
      availability: true,
      rating: 4.9,
      experience: '8+ years',
      avatar: '🏔️',
      location: 'Colorado Rockies',
      reviews: 127,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      expertise: 'Historical Tours',
      availability: true,
      rating: 4.8,
      experience: '6+ years',
      avatar: '🏛️',
      location: 'European Cities',
      reviews: 89,
    },
    {
      id: '3',
      name: 'Michael Chen',
      expertise: 'Wildlife Safari',
      availability: false,
      rating: 4.7,
      experience: '10+ years',
      avatar: '🦁',
      location: 'African Savanna',
      reviews: 203,
    },
    {
      id: '4',
      name: 'Emma Davis',
      expertise: 'Urban Exploration',
      availability: true,
      rating: 4.9,
      experience: '5+ years',
      avatar: '🏙️',
      location: 'Global Cities',
      reviews: 156,
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
  const watchGuideId = watch('guideId')

  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      const days = differenceInDays(new Date(watchEndDate), new Date(watchStartDate)) + 1
      setTotalDays(days > 0 ? days : 0)
    }
  }, [watchStartDate, watchEndDate])

  useEffect(() => {
    setTotalPayment(totalDays * (watchPaymentPerDay || 0))
  }, [totalDays, watchPaymentPerDay])

  useEffect(() => {
    const guide = guides.find(g => g.id === watchGuideId)
    setSelectedGuide(guide || null)
  }, [watchGuideId, guides])

  const onSubmit = (data) => {
    setAnimateSubmit(true)
    setTimeout(() => {
      console.log('Form submitted:', data, {
        totalDays,
        totalPayment,
        selectedGuide,
      })
      setIsEditing(false)
      setAnimateSubmit(false)
    }, 1500)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Premium Guide Booking
          </h1>
          <p className="text-xl text-purple-200 opacity-80">
            Experience the world with our expert guides
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-300" />
                      Start Date
                    </label>
                    <div className="relative">
                      <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: 'Start date is required' }}
                        render={({ field }) => (
                          <input
                            type="date"
                            className="w-full px-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-purple-500/40 focus:border-purple-400 transition-all duration-300 disabled:bg-white/5 group-hover:bg-white/15"
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                            disabled={!isEditing}
                          />
                        )}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-2 text-sm text-red-300 animate-pulse">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-300" />
                      End Date
                    </label>
                    <div className="relative">
                      <Controller
                        name="endDate"
                        control={control}
                        rules={{ required: 'End date is required' }}
                        render={({ field }) => (
                          <input
                            type="date"
                            className="w-full px-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-purple-500/40 focus:border-purple-400 transition-all duration-300 disabled:bg-white/5 group-hover:bg-white/15"
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                            disabled={!isEditing}
                          />
                        )}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="mt-2 text-sm text-red-300 animate-pulse">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-300" />
                    Trip Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Duration:</span>
                      <span className="text-white font-semibold text-xl">
                        {totalDays} {totalDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Total Cost:</span>
                      <span className="text-green-400 font-bold text-2xl">
                        ${totalPayment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-lg font-semibold text-white mb-6 flex items-center">
                  <User className="h-6 w-6 mr-2 text-purple-300" />
                  Choose Your Expert Guide
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      className={`relative group cursor-pointer transition-all duration-300 transform ${
                        watchGuideId === guide.id
                          ? 'scale-105 ring-4 ring-purple-400/60'
                          : 'hover:scale-105 hover:ring-2 hover:ring-white/40'
                      } ${
                        !guide.availability ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (isEditing && guide.availability) {
                          setValue('guideId', guide.id)
                        }
                      }}
                    >
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                        <div className="text-center">
                          <div className="text-4xl mb-3">{guide.avatar}</div>
                          <h4 className="text-white font-bold text-lg mb-1">{guide.name}</h4>
                          <p className="text-purple-200 text-sm mb-3">{guide.expertise}</p>
                          
                          <div className="flex items-center justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(guide.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                            <span className="text-white text-sm ml-1">({guide.reviews})</span>
                          </div>
                          
                          <div className="text-xs text-purple-200 space-y-1">
                            <div className="flex items-center justify-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {guide.location}
                            </div>
                            <div>{guide.experience}</div>
                          </div>
                          
                          <div className="mt-3">
                            {guide.availability ? (
                              <div className="flex items-center justify-center text-green-400 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Available
                              </div>
                            ) : (
                              <div className="flex items-center justify-center text-red-400 text-sm">
                                <XCircle className="h-4 w-4 mr-1" />
                                Unavailable
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {watchGuideId === guide.id && (
                          <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-2">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <input type="hidden" {...register('guideId', { required: 'Please select a guide' })} />
                {errors.guideId && (
                  <p className="text-red-300 text-center animate-pulse">{errors.guideId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="group">
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-purple-300" />
                    Daily Rate ($)
                  </label>
                  <input
                    type="number"
                    {...register('paymentPerDay', {
                      required: 'Payment amount is required',
                      min: { value: 1, message: 'Payment must be greater than 0' },
                    })}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-purple-500/40 focus:border-purple-400 transition-all duration-300 disabled:bg-white/5 group-hover:bg-white/15"
                    disabled={!isEditing}
                  />
                  {errors.paymentPerDay && (
                    <p className="mt-2 text-sm text-red-300 animate-pulse">
                      {errors.paymentPerDay.message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-end">
                  <div className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="text-center">
                      <div className="text-sm text-green-200 mb-2">Total Investment</div>
                      <div className="text-4xl font-bold text-green-400 mb-2">
                        ${totalPayment.toFixed(2)}
                      </div>
                      <div className="text-xs text-green-200">
                        {totalDays} days × ${watchPaymentPerDay || 0} per day
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                {isEditing ? (
                  <button
                    type="submit"
                    disabled={animateSubmit}
                    className={`group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white text-lg shadow-2xl transition-all duration-300 transform ${
                      animateSubmit 
                        ? 'scale-110 animate-pulse' 
                        : 'hover:scale-105 hover:shadow-purple-500/25'
                    } focus:outline-none focus:ring-4 focus:ring-purple-500/40`}
                  >
                    <span className="flex items-center">
                      {animateSubmit ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                          Confirm Premium Booking
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="group relative px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-white text-lg shadow-2xl hover:scale-105 hover:shadow-green-500/25 focus:outline-none focus:ring-4 focus:ring-green-500/40 transition-all duration-300 transform"
                  >
                    <span className="flex items-center">
                      <Edit3 className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Modify Booking
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        
        {!isEditing && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-flex items-center px-8 py-4 bg-green-500/20 backdrop-blur-xl rounded-2xl border border-green-400/30">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <span className="text-green-400 font-semibold">
                Booking confirmed! You'll receive a confirmation email shortly.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}