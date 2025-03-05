import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { BellIcon, CheckIcon, XMarkIcon, EnvelopeIcon, CalendarIcon, HomeIcon, StarIcon } from '@heroicons/react/24/outline'
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

function NotificationsPage() {
  const { supabase, session } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true)
      
      try {
        // In a real app, you would fetch this data from Supabase
        // For now, we'll use mock data
        const mockNotifications = [
          {
            id: 1,
            type: 'booking_confirmed',
            title: 'Бронирование подтверждено',
            message: 'Ваше бронирование квартиры "Уютная квартира в центре" подтверждено. Заезд 15 июня 2025 г.',
            date: new Date(2025, 4, 10),
            isRead: false,
            data: {
              bookingId: 1,
              propertyId: 1
            }
          },
          {
            id: 2,
            type: 'message',
            title: 'Новое сообщение',
            message: 'Анна Иванова: Здравствуйте! Жду вас 15 июня. Если у вас есть вопросы, пожалуйста, напишите мне.',
            date: new Date(2025, 4, 10),
            isRead: true,
            data: {
              conversationId: 1,
              senderId: 1
            }
          },
          {
            id: 3,
            type: 'review_reminder',
            title: 'Оставьте отзыв',
            message: 'Как прошло ваше проживание в "Стильная студия рядом с метро"? Поделитесь своими впечатлениями!',
            date: new Date(2025, 3, 25),
            isRead: false,
            data: {
              propertyId: 3,
              bookingId: 3
            }
          },
          {
            id: 4,
            type: 'booking_upcoming',
            title: 'Скоро заезд',
            message: 'Напоминаем, что ваше проживание в "Современные апартаменты с видом на Обь" начинается через 3 дня.',
            date: new Date(2025, 3, 20),
            isRead: true,
            data: {
              bookingId: 2,
              propertyId: 2
            }
          },
          {
            id: 5,
            type: 'system',
            title: 'Обновление профиля',
            message: 'Пожалуйста, обновите информацию в вашем профиле для улучшения качества обслуживания.',
            date: new Date(2025, 3, 15),
            isRead: true,
            data: {}
          }
        ]
        
        setNotifications(mockNotifications)
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadNotifications()
  }, [supabase, session])

  const handleMarkAsRead = (notificationId) => {
    // Update the notification as read
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    ))
  }

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })))
  }

  const handleDeleteNotification = (notificationId) => {
    // Remove the notification from the list
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  // Filter notifications based on the selected filter
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(notification => !notification.isRead)
      : notifications.filter(notification => notification.type === filter)

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
      case 'booking_upcoming':
        return <CalendarIcon className="h-6 w-6 text-blue-500" />
      case 'message':
        return <EnvelopeIcon className="h-6 w-6 text-green-500" />
      case 'review_reminder':
        return <StarIcon className="h-6 w-6 text-yellow-500" />
      case 'system':
        return <BellIcon className="h-6 w-6 text-purple-500" />
      default:
        return <BellIcon className="h-6 w-6 text-neutral-500" />
    }
  }

  // Get notification link based on type and data
  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'booking_confirmed':
      case 'booking_upcoming':
        return `/user/bookings`
      case 'message':
        return `/user/messages`
      case 'review_reminder':
        return `/properties/${notification.data.propertyId}/reviews`
      case 'system':
        return `/user/profile`
      default:
        return '#'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2 sm:mb-0">Уведомления</h1>
        
        {notifications.some(notification => !notification.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Отметить все как прочитанные
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'unread'
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Непрочитанные
        </button>
        <button
          onClick={() => setFilter('booking_confirmed')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'booking_confirmed'
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Бронирования
        </button>
        <button
          onClick={() => setFilter('message')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'message'
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Сообщения
        </button>
        <button
          onClick={() => setFilter('system')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'system'
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Системные
        </button>
      </div>
      
      {filteredNotifications.length === 0 ? (
        <div className="card p-6 text-center">
          <BellIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-neutral-900 mb-2">
            {filter === 'all' 
              ? 'У вас пока нет уведомлений' 
              : filter === 'unread' 
                ? 'У вас нет непрочитанных уведомлений' 
                : 'У вас нет уведомлений этого типа'}
          </h2>
          <p className="text-neutral-700">
            Здесь будут отображаться важные уведомления о ваших бронированиях, сообщениях и других событиях.
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-neutral-200">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 flex ${!notification.isRead ? 'bg-blue-50' : ''}`}
            >
              <div className="flex-shrink-0 mr-4">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-medium text-neutral-900">{notification.title}</h3>
                  <span className="text-sm text-neutral-500">
                    {formatDistanceToNow(notification.date, { addSuffix: true, locale: ru })}
                  </span>
                </div>
                <p className="text-neutral-700 mt-1">{notification.message}</p>
                <div className="mt-2 flex justify-between items-center">
                  <Link 
                    to={getNotificationLink(notification)}
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Подробнее
                  </Link>
                  <div className="flex space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Отметить как прочитанное"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Удалить"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage