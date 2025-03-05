import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

function BookingCalendar({ bookings = [], properties = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(currentDate))
  const [calendarDays, setCalendarDays] = useState([])
  const [viewMode, setViewMode] = useState('month') // 'month' or 'day'
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  // Generate days for the calendar
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
    setCalendarDays(daysInMonth)
  }, [currentMonth])
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }
  
  const goToToday = () => {
    setCurrentMonth(startOfMonth(new Date()))
  }
  
  // Get bookings for a specific day and property
  const getBookingsForDay = (propertyId, day) => {
    return bookings.filter(booking => {
      const bookingStart = new Date(booking.checkIn)
      const bookingEnd = new Date(booking.checkOut)
      return booking.property.id === propertyId && 
             day >= bookingStart && 
             day <= bookingEnd
    })
  }
  
  // Get property availability for a specific day
  const getPropertyAvailability = (propertyId, day) => {
    const propertyBookings = bookings.filter(booking => 
      booking.property.id === propertyId
    )
    
    const isBooked = propertyBookings.some(booking => {
      const bookingStart = new Date(booking.checkIn)
      const bookingEnd = new Date(booking.checkOut)
      return day >= bookingStart && day <= bookingEnd
    })
    
    return isBooked ? 0 : 1
  }
  
  // Format day of week
  const formatDayOfWeek = (day) => {
    return format(day, 'EEE', { locale: ru }).toUpperCase()
  }
  
  // Get day class based on weekend/weekday
  const getDayClass = (day) => {
    if (isWeekend(day)) {
      return 'bg-neutral-50'
    }
    return ''
  }
  
  // Get booking cell color based on status
  const getBookingCellColor = (booking) => {
    switch(booking.status) {
      case 'confirmed':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      default:
        return 'bg-primary text-white';
    }
  }
  
  // Handle booking click
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking)
  }
  
  // Close booking details modal
  const closeBookingDetails = () => {
    setSelectedBooking(null)
  }
  
  // Check if day is today
  const isToday = (day) => {
    return isSameDay(day, new Date())
  }

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${viewMode === 'day' ? 'bg-primary text-white' : 'bg-white text-neutral-700 border border-neutral-300'}`}
            onClick={() => setViewMode('day')}
          >
            День
          </button>
          <button
            className={`px-4 py-2 rounded-md ${viewMode === 'month' ? 'bg-primary text-white' : 'bg-white text-neutral-700 border border-neutral-300'}`}
            onClick={() => setViewMode('month')}
          >
            Месяц
          </button>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-neutral-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-neutral-700" />
          </button>
          
          <h2 className="text-xl font-bold text-neutral-900 mx-4 capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-neutral-100"
          >
            <ChevronRightIcon className="h-5 w-5 text-neutral-700" />
          </button>
        </div>
        
        <button
          onClick={goToToday}
          className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
        >
          Сегодня
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-neutral-200 p-2 bg-neutral-50 w-40">Объект</th>
              {calendarDays.map((day) => (
                <th 
                  key={day.toString()} 
                  className={`border border-neutral-200 p-2 min-w-[60px] ${getDayClass(day)} ${isToday(day) ? 'bg-blue-50' : ''}`}
                >
                  <div className="text-center">
                    <div className="text-xs text-neutral-500">{formatDayOfWeek(day)}</div>
                    <div className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="border border-neutral-200 p-2 font-medium">
                  <Link to={`/properties/${property.id}`} className="hover:text-primary">
                    {property.title}
                  </Link>
                </td>
                {calendarDays.map((day) => {
                  const isAvailable = getPropertyAvailability(property.id, day)
                  const dayBookings = getBookingsForDay(property.id, day)
                  
                  return (
                    <td 
                      key={day.toString()} 
                      className={`border border-neutral-200 p-1 text-center ${getDayClass(day)} ${isToday(day) ? 'bg-blue-50' : ''}`}
                    >
                      {dayBookings.length > 0 ? (
                        <button
                          onClick={() => handleBookingClick(dayBookings[0])}
                          className={`w-full text-xs p-1 rounded cursor-pointer ${getBookingCellColor(dayBookings[0])}`}
                        >
                          {dayBookings[0].guest.name.split(' ')[0]}
                        </button>
                      ) : (
                        <div className={`text-sm ${isAvailable === 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {isAvailable}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-neutral-900">Детали бронирования</h3>
              <button 
                onClick={closeBookingDetails}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 flex items-center">
              <img 
                src={selectedBooking.property.image} 
                alt={selectedBooking.property.title}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <h4 className="font-medium text-neutral-900">{selectedBooking.property.title}</h4>
                <p className="text-sm text-neutral-700">
                  {format(new Date(selectedBooking.checkIn), 'd MMMM yyyy', { locale: ru })} - {format(new Date(selectedBooking.checkOut), 'd MMMM yyyy', { locale: ru })}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-neutral-900 mb-2">Информация о госте</h4>
              <div className="flex items-center mb-2">
                <img 
                  src={selectedBooking.guest.image} 
                  alt={selectedBooking.guest.name}
                  className="w-10 h-10 object-cover rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{selectedBooking.guest.name}</p>
                  <p className="text-sm text-neutral-500">{selectedBooking.guest.email}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-700">Телефон: {selectedBooking.guest.phone}</p>
              <p className="text-sm text-neutral-700">Гостей: {selectedBooking.guests}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-neutral-900 mb-2">Детали оплаты</h4>
              <p className="text-neutral-700">Общая сумма: <span className="font-medium">{selectedBooking.totalPrice} ₽</span></p>
              <p className="text-neutral-700">Статус: 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedBooking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedBooking.status === 'confirmed' ? 'Подтверждено' : 
                   selectedBooking.status === 'pending' ? 'Ожидает' : 
                   selectedBooking.status === 'cancelled' ? 'Отменено' : 'Завершено'}
                </span>
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeBookingDetails}
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
              >
                Закрыть
              </button>
              <Link
                to={`/host/bookings`}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Управление бронированием
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar