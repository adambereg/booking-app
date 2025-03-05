import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { CurrencyDollarIcon, UserGroupIcon, HomeIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

function HostDashboardPage() {
  const { supabase, session } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      try {
        // Check if we have a demo user
        const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
        
        if (isDemoMode) {
          // Load demo user data
          const demoUserData = JSON.parse(localStorage.getItem('novodom_demo_user'))
          setUserName(demoUserData.firstName || 'Пользователь')
        } else if (session) {
          // Fetch profile data from Supabase
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .single()
            
          if (error) {
            console.error('Error fetching profile:', error)
          } else if (data) {
            setUserName(data.first_name || session.user.email.split('@')[0])
          }
        }
        
        // In a real app, you would fetch this data from Supabase
        // For now, we'll use mock data
        const mockStats = {
          totalEarnings: 124500,
          totalProperties: 3,
          totalBookings: 18,
          occupancyRate: 78
        }

        const mockRecentBookings = [
          {
            id: 1,
            property: {
              id: 1,
              title: 'Уютная квартира в центре',
              image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            },
            guest: {
              name: 'Михаил Петров',
              image: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            checkIn: new Date(2025, 5, 15),
            checkOut: new Date(2025, 5, 20),
            totalPrice: 12500,
            status: 'confirmed'
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
              image: 'https://randomuser.me/api/portraits/women/26.jpg'
            },
            checkIn: new Date(2025, 6, 10),
            checkOut: new Date(2025, 6, 15),
            totalPrice: 16000,
            status: 'confirmed'
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
              image: 'https://randomuser.me/api/portraits/men/67.jpg'
            },
            checkIn: new Date(2025, 7, 5),
            checkOut: new Date(2025, 7, 10),
            totalPrice: 9000,
            status: 'pending'
          }
        ]

        const mockMonthlyRevenue = [
          { month: 'Январь', revenue: 15000 },
          { month: 'Февраль', revenue: 18000 },
          { month: 'Март', revenue: 22000 },
          { month: 'Апрель', revenue: 19500 },
          { month: 'Май', revenue: 25000 },
          { month: 'Июнь', revenue: 30000 }
        ]

        setStats(mockStats)
        setRecentBookings(mockRecentBookings)
        setMonthlyRevenue(mockMonthlyRevenue)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDashboardData()
  }, [session, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 md:mb-0">Панель управления</h1>
          {userName && (
            <p className="text-neutral-700">Добро пожаловать, {userName}!</p>
          )}
        </div>
        <Link to="/host/properties/add" className="btn-primary">
          Добавить новое жильё
        </Link>
      </div>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-light bg-opacity-20">
              <CurrencyDollarIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Общий доход</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalEarnings} ₽</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-light bg-opacity-20">
              <HomeIcon className="h-6 w-6 text-secondary" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Объекты</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Бронирования</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Заполняемость</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.occupancyRate}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* График доходности */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Доходность по месяцам</h2>
        <div className="h-64">
          <div className="flex h-48 items-end space-x-2">
            {monthlyRevenue.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-md" 
                  style={{ 
                    height: `${(item.revenue / Math.max(...monthlyRevenue.map(i => i.revenue))) * 100}%`,
                    minHeight: '10%'
                  }}
                ></div>
                <div className="text-xs text-neutral-500 mt-2">{item.month}</div>
                <div className="text-xs font-medium">{item.revenue} ₽</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Недавние бронирования */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-neutral-900">Недавние бронирования</h2>
          <Link to="/host/bookings" className="text-primary hover:text-primary-dark text-sm font-medium">
            Смотреть все
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Объект
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Гость
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Даты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={booking.property.image}
                          alt={booking.property.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {booking.property.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={booking.guest.image}
                          alt={booking.guest.name}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-neutral-900">
                          {booking.guest.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {format(booking.checkIn, 'd MMM', { locale: ru })} - {format(booking.checkOut, 'd MMM yyyy', { locale: ru })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">
                      {booking.totalPrice} ₽
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Подтверждено' : 
                       booking.status === 'pending' ? 'Ожидает' : 'Отменено'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Быстрые ссылки */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Быстрые ссылки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/host/properties"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <h3 className="font-medium text-neutral-900 mb-1">Управление объектами</h3>
            <p className="text-sm text-neutral-700">Просмотр и редактирование ваших объектов</p>
          </Link>
          
          <Link
            to="/host/bookings"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <h3 className="font-medium text-neutral-900 mb-1">Управление бронированиями</h3>
            <p className="text-sm text-neutral-700">Просмотр и обработка запросов на бронирование</p>
          </Link>
          
          <Link
            to="/host/properties/add"
            className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <h3 className="font-medium text-neutral-900 mb-1">Добавить новый объект</h3>
            <p className="text-sm text-neutral-700">Разместить новое жильё для аренды</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HostDashboardPage