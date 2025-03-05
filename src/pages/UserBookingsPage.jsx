import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'

function UserBookingsPage() {
  const { supabase, session } = useSupabase()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this data from Supabase
    // For now, we'll use mock data
    const mockBookings = [
      {
        id: 1,
        property: {
          id: 1,
          title: 'Уютная квартира в центре Новосибирска',
          location: 'Центральный район, Новосибирск',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        checkIn: new Date(2025, 5, 15),
        checkOut: new Date(2025, 5, 20),
        guests: 2,
        totalPrice: 15000,
        status: 'upcoming'
      },
      {
        id: 2,
        property: {
          id: 2,
          title: 'Современные апартаменты с видом на Обь',
          location: 'Октябрьский район, Новосибирск',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        checkIn: new Date(2025, 7, 10),
        checkOut: new Date(2025, 7, 15),
        guests: 3,
        totalPrice: 19000,
        status: 'upcoming'
      },
      {
        id: 3,
        property: {
          id: 3,
          title: 'Стильная студия рядом с метро',
          location: 'Ленинский район, Новосибирск',
          image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        checkIn: new Date(2024, 11, 5),
        checkOut: new Date(2024, 11, 10),
        guests: 1,
        totalPrice: 10500,
        status: 'completed'
      }
    ]

    setBookings(mockBookings)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming')
  const pastBookings = bookings.filter(booking => booking.status === 'completed')

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Ваши бронирования</h1>
      
      {bookings.length === 0 ? (
        <div className="card p-6 text-center">
          <h2 className="text-xl font-medium text-neutral-900 mb-2">У вас пока нет бронирований</h2>
          <p className="text-neutral-700 mb-4">Начните искать и бронировать жильё для вашей следующей поездки!</p>
          <Link to="/search" className="btn-primary">
            Найти жильё
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming bookings */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Предстоящие поездки</h2>
            
            {upcomingBookings.length === 0 ? (
              <p className="text-neutral-700">У вас нет предстоящих поездок.</p>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="card p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <img
                          src={booking.property.image}
                          alt={booking.property.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-3/4 md:pl-6">
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">
                          {booking.property.title}
                        </h3>
                        
                        <div className="flex items-center text-neutral-700 mb-2">
                          <MapPinIcon className="h-5 w-5 mr-1" />
                          <span>{booking.property.location}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-neutral-700">
                            <CalendarIcon className="h-5 w-5 mr-1" />
                            <span>
                              {format(booking.checkIn, 'd MMMM yyyy', { locale: ru })} - {format(booking.checkOut, 'd MMMM yyyy', { locale: ru })}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-neutral-700">
                            <UserIcon className="h-5 w-5 mr-1" />
                            <span>{booking.guests} {booking.guests === 1 ? 'гость' : booking.guests >= 2 && booking.guests <= 4 ? 'гостя' : 'гостей'}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-neutral-900">{booking.totalPrice} ₽</span>
                            <span className="text-neutral-700"> всего</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              to={`/properties/${booking.property.id}`}
                              className="btn-secondary"
                            >
                              Посмотреть жильё
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Past bookings */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Прошлые поездки</h2>
            
            {pastBookings.length === 0 ? (
              <p className="text-neutral-700">У вас нет прошлых поездок.</p>
            ) : (
              <div className="space-y-4">
                {pastBookings.map(booking => (
                  <div key={booking.id} className="card p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <img
                          src={booking.property.image}
                          alt={booking.property.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-3/4 md:pl-6">
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">
                          {booking.property.title}
                        </h3>
                        
                        <div className="flex items-center text-neutral-700 mb-2">
                          <MapPinIcon className="h-5 w-5 mr-1" />
                          <span>{booking.property.location}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-neutral-700">
                            <CalendarIcon className="h-5 w-5 mr-1" />
                            <span>
                              {format(booking.checkIn, 'd MMMM yyyy', { locale: ru })} - {format(booking.checkOut, 'd MMMM yyyy', { locale: ru })}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-neutral-700">
                            <UserIcon className="h-5 w-5 mr-1" />
                            <span>{booking.guests} {booking.guests === 1 ? 'гость' : booking.guests >= 2 && booking.guests <= 4 ? 'гостя' : 'гостей'}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-neutral-900">{booking.totalPrice} ₽</span>
                            <span className="text-neutral-700"> всего</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              to={`/properties/${booking.property.id}`}
                              className="btn-secondary"
                            >
                              Посмотреть жильё
                            </Link>
                            <button className="btn-primary">
                              Оставить отзыв
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserBookingsPage