import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CheckIcon, XMarkIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

function HostBookingsPage() {
  const { supabase, session } = useSupabase()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)

  useEffect(() => {
    // В реальном приложении вы бы получали эти данные из Supabase
    // Для демонстрации используем моковые данные
    const mockBookings = [
      {
        id: 1,
        property: {
          id: 1,
          title: 'Уютная квартира в центре',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        guest: {
          name: 'Михаил Петров',
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          email: 'mikhail.petrov@example.com',
          phone: '+7 (999) 123-4567'
        },
        checkIn: new Date(2025, 5, 15),
        checkOut: new Date(2025, 5, 20),
        guests: 2,
        totalPrice: 12500,
        status: 'pending',
        createdAt: new Date(2025, 4, 10)
      },
      {
        id: 2,
        property: {
          id: 2,
          title: 'Современные апартаменты с видом на Обь',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        guest: {
          name: 'Елена Смирнова',
          image: 'https://randomuser.me/api/portraits/women/26.jpg',
          email: 'elena.smirnova@example.com',
          phone: '+7 (999) 987-6543'
        },
        checkIn: new Date(2025, 6, 10),
        checkOut: new Date(2025, 6, 15),
        guests: 3,
        totalPrice: 16000,
        status: 'confirmed',
        createdAt: new Date(2025, 5, 5)
      },
      {
        id: 3,
        property: {
          id: 3,
          title: 'Стильная студия рядом с метро',
          image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        guest: {
          name: 'Дмитрий Иванов',
          image: 'https://randomuser.me/api/portraits/men/67.jpg',
          email: 'dmitry.ivanov@example.com',
          phone: '+7 (999) 456-7890'
        },
        checkIn: new Date(2025, 7, 5),
        checkOut: new Date(2025, 7, 10),
        guests: 1,
        totalPrice: 9000,
        status: 'confirmed',
        createdAt: new Date(2025, 6, 1)
      },
      {
        id: 4,
        property: {
          id: 1,
          title: 'Уютная квартира в центре',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        guest: {
          name: 'Анна Козлова',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          email: 'anna.kozlova@example.com',
          phone: '+7 (999) 234-5678'
        },
        checkIn: new Date(2024, 11, 20),
        checkOut: new Date(2024, 11, 27),
        guests: 2,
        totalPrice: 17500,
        status: 'completed',
        createdAt: new Date(2024, 10, 15)
      },
      {
        id: 5,
        property: {
          id: 2,
          title: 'Современные апартаменты с видом на Обь',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        guest: {
          name: 'Роберт Тейлор',
          image: 'https://randomuser.me/api/portraits/men/22.jpg',
          email: 'robert.taylor@example.com',
          phone: '+7 (999) 876-5432'
        },
        checkIn: new Date(2025, 3, 5),
        checkOut: new Date(2025, 3, 10),
        guests: 4,
        totalPrice: 16000,
        status: 'cancelled',
        createdAt: new Date(2025, 2, 1)
      }
    ]

    setBookings(mockBookings)
    setIsLoading(false)
  }, [])

  const handleAcceptBooking = (bookingId) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
    ))
  }

  const handleDeclineBooking = (bookingId) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    ))
  }

  const handleContactGuest = (guest) => {
    setSelectedGuest(guest)
    setContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setContactModalOpen(false)
    setSelectedGuest(null)
  }

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true
    return booking.status === activeTab
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Управление бронированиями</h1>
      
      {/* Вкладки */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Все бронирования
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Ожидающие
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'confirmed'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Подтвержденные
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Завершенные
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cancelled'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Отмененные
          </button>
        </nav>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="card p-6 text-center">
          <h2 className="text-xl font-medium text-neutral-900 mb-2">Бронирования не найдены</h2>
          <p className="text-neutral-700">
            {activeTab === 'all' 
              ? "У вас пока нет бронирований." 
              : `У вас нет ${activeTab === 'pending' ? 'ожидающих' : 
                  activeTab === 'confirmed' ? 'подтвержденных' : 
                  activeTab === 'completed' ? 'завершенных' : 'отмененных'} бронирований.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <img
                    src={booking.property.image}
                    alt={booking.property.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-3/4 md:pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1">
                        {booking.property.title}
                      </h3>
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Подтверждено' : 
                           booking.status === 'pending' ? 'Ожидает' : 
                           booking.status === 'completed' ? 'Завершено' : 'Отменено'}
                        </span>
                        <span className="ml-2 text-sm text-neutral-500">
                          Забронировано {format(booking.createdAt, 'd MMMM yyyy', { locale: ru })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <p className="text-lg font-bold text-neutral-900">{booking.totalPrice} ₽</p>
                      <p className="text-sm text-neutral-500">Всего</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-1">Информация о госте</h4>
                      <div className="flex items-center">
                        <img
                          src={booking.guest.image}
                          alt={booking.guest.name}
                          className="h-8 w-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className="text-neutral-900 font-medium">{booking.guest.name}</p>
                          <p className="text-sm text-neutral-500">{booking.guest.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-1">Детали проживания</h4>
                      <p className="text-neutral-900">
                        {format(booking.checkIn, 'd MMMM yyyy', { locale: ru })} - {format(booking.checkOut, 'd MMMM yyyy', { locale: ru })}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {booking.guests} {booking.guests === 1 ? 'гость' : 
                         booking.guests >= 2 && booking.guests <= 4 ? 'гостя' : 'гостей'}
                      </p>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleDeclineBooking(booking.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Отклонить
                      </button>
                      <button
                        onClick={() => handleAcceptBooking(booking.id)}
                        className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Принять
                      </button>
                    </div>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <div className="flex justify-end">
                      <button 
                        className="btn-primary"
                        onClick={() => handleContactGuest(booking.guest)}
                      >
                        Связаться с гостем
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Модальное окно для связи с гостем */}
      {contactModalOpen && selectedGuest && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Контактная информация гостя</h3>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <img
                  src={selectedGuest.image}
                  alt={selectedGuest.name}
                  className="h-12 w-12 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="text-lg font-medium text-neutral-900">{selectedGuest.name}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-500 mr-2" />
                  <a href={`mailto:${selectedGuest.email}`} className="text-primary hover:text-primary-dark">
                    {selectedGuest.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-neutral-500 mr-2" />
                  <a href={`tel:${selectedGuest.phone}`} className="text-primary hover:text-primary-dark">
                    {selectedGuest.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseContactModal}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HostBookingsPage