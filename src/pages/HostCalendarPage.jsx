import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import BookingCalendar from '../components/BookingCalendar'
import { format, addDays } from 'date-fns'

function HostCalendarPage() {
  const { supabase, session } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('all')

  useEffect(() => {
    const loadCalendarData = async () => {
      setIsLoading(true)
      
      try {
        // In a real app, you would fetch this data from Supabase
        // For now, we'll use mock data
        const mockProperties = [
          {
            id: 1,
            title: 'Уютная квартира в центре',
            location: 'Центральный район, Новосибирск',
            type: 'Квартира целиком',
            price: 2500,
            bedrooms: 2,
            bathrooms: 1,
            status: 'active',
            bookingsCount: 12,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          },
          {
            id: 2,
            title: 'Современные апартаменты с видом на Обь',
            location: 'Октябрьский район, Новосибирск',
            type: 'Апартаменты целиком',
            price: 3200,
            bedrooms: 2,
            bathrooms: 2,
            status: 'active',
            bookingsCount: 8,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          },
          {
            id: 3,
            title: 'Стильная студия рядом с метро',
            location: 'Ленинский район, Новосибирск',
            type: 'Студия целиком',
            price: 1800,
            bedrooms: 1,
            bathrooms: 1,
            status: 'active',
            bookingsCount: 5,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          }
        ]

        // Create a variety of bookings with different statuses
        const today = new Date();
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
            checkIn: addDays(today, 5),
            checkOut: addDays(today, 10),
            guests: 2,
            totalPrice: 12500,
            status: 'confirmed',
            createdAt: addDays(today, -5)
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
            checkIn: addDays(today, -2),
            checkOut: addDays(today, 3),
            guests: 3,
            totalPrice: 16000,
            status: 'confirmed',
            createdAt: addDays(today, -10)
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
            checkIn: addDays(today, 15),
            checkOut: addDays(today, 20),
            guests: 1,
            totalPrice: 9000,
            status: 'pending',
            createdAt: addDays(today, -3)
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
            checkIn: addDays(today, -10),
            checkOut: addDays(today, -5),
            guests: 2,
            totalPrice: 12500,
            status: 'completed',
            createdAt: addDays(today, -15)
          },
          {
            id: 5,
            property: {
              id: 2,
              title: 'Современные апартаменты с видом на Обь',
              image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            },
            guest: {
              name: 'Сергей Новиков',
              image: 'https://randomuser.me/api/portraits/men/22.jpg',
              email: 'sergey.novikov@example.com',
              phone: '+7 (999) 876-5432'
            },
            checkIn: addDays(today, 25),
            checkOut: addDays(today, 30),
            guests: 4,
            totalPrice: 16000,
            status: 'cancelled',
            createdAt: addDays(today, -2)
          }
        ]

        setProperties(mockProperties)
        setBookings(mockBookings)
      } catch (error) {
        console.error('Error loading calendar data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCalendarData()
  }, [session, supabase])

  // Filter properties based on selection
  const filteredProperties = selectedProperty === 'all' 
    ? properties 
    : properties.filter(property => property.id.toString() === selectedProperty);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Календарь бронирований</h1>
      
      <div className="mb-6">
        <p className="text-neutral-700 mb-4">
          Управляйте доступностью ваших объектов и просматривайте бронирования в календаре.
          Нажмите на имя гостя, чтобы увидеть подробную информацию о бронировании.
        </p>
        
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="property-filter" className="font-medium text-neutral-700">
            Фильтр по объекту:
          </label>
          <select
            id="property-filter"
            className="input-field max-w-xs"
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            <option value="all">Все объекты</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <BookingCalendar 
        properties={filteredProperties}
        bookings={bookings}
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Легенда</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
            <span>Подтверждено</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
            <span>Ожидает подтверждения</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
            <span>Отменено</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
            <span>Завершено</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 border border-neutral-300 rounded mr-2 flex items-center justify-center">
              <span className="text-green-500">1</span>
            </div>
            <span>Доступно</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 border border-neutral-300 rounded mr-2 flex items-center justify-center">
              <span className="text-red-500">0</span>
            </div>
            <span>Недоступно</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Советы по управлению календарем</h2>
        <ul className="list-disc pl-5 space-y-2 text-neutral-700">
          <li>Нажмите на имя гостя в календаре, чтобы увидеть подробную информацию о бронировании</li>
          <li>Используйте фильтр по объектам, чтобы просматривать бронирования для конкретного объекта</li>
          <li>Заблаговременно блокируйте даты, когда объект недоступен для бронирования</li>
          <li>Регулярно проверяйте календарь, чтобы избежать накладок в бронированиях</li>
          <li>Своевременно подтверждайте или отклоняйте запросы на бронирование</li>
        </ul>
      </div>
    </div>
  )
}

export default HostCalendarPage