import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CreditCardIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline'

function BookingPage() {
  const { propertyId } = useParams()
  const [searchParams] = useSearchParams()
  const { supabase, session } = useSupabase()
  const navigate = useNavigate()
  
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Payment details
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [billingZip, setBillingZip] = useState('')

  useEffect(() => {
    if (!session) {
      navigate('/auth/login')
      return
    }

    // Get dates from URL params
    const checkInParam = searchParams.get('checkIn')
    const checkOutParam = searchParams.get('checkOut')
    const guestsParam = searchParams.get('guests')
    
    if (checkInParam) setCheckIn(new Date(checkInParam))
    if (checkOutParam) setCheckOut(new Date(checkOutParam))
    if (guestsParam) setGuests(parseInt(guestsParam))

    // In a real app, you would fetch this data from Supabase
    // For now, we'll use mock data
    const mockProperty = {
      id: 1,
      title: 'Уютная квартира в центре Новосибирска',
      location: 'Центральный район, Новосибирск',
      type: 'Квартира целиком',
      price: 2500,
      rating: 4.9,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      host: {
        name: 'Анна Иванова',
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    }

    setProperty(mockProperty)
    setIsLoading(false)
  }, [propertyId, searchParams, session, navigate])

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }

  const calculateSubtotal = () => {
    return property?.price * calculateNights()
  }

  const calculateTotal = () => {
    return calculateSubtotal() + 1000 + 500
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // In a real app, you would process the payment and create a booking in Supabase
    // For now, we'll simulate a successful booking
    
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/user/bookings')
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Завершите бронирование</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Booking details */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Ваша поездка</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CalendarIcon className="h-6 w-6 text-neutral-700 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-neutral-900">Даты</h3>
                  <p className="text-neutral-700">
                    {checkIn && checkOut ? (
                      <>
                        {format(checkIn, 'd MMMM yyyy', { locale: ru })} - {format(checkOut, 'd MMMM yyyy', { locale: ru })}
                      </>
                    ) : (
                      'Даты не выбраны'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <UserIcon className="h-6 w-6 text-neutral-700 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-neutral-900">Гости</h3>
                  <p className="text-neutral-700">{guests} {guests === 1 ? 'гость' : guests >= 2 && guests <= 4 ? 'гостя' : 'гостей'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Платежная информация</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="card-name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Имя на карте
                  </label>
                  <input
                    type="text"
                    id="card-name"
                    className="input-field"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium text-neutral-700 mb-1">
                    Номер карты
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="card-number"
                      className="input-field pl-10"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      maxLength={19}
                    />
                    <CreditCardIcon className="h-5 w-5 text-neutral-500 absolute left-3 top-2.5" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry-date" className="block text-sm font-medium text-neutral-700 mb-1">
                      Срок действия
                    </label>
                    <input
                      type="text"
                      id="expiry-date"
                      className="input-field"
                      placeholder="ММ/ГГ"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                      maxLength={5}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                      Код безопасности
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      className="input-field"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      maxLength={3}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="billing-zip" className="block text-sm font-medium text-neutral-700 mb-1">
                    Почтовый индекс
                  </label>
                  <input
                    type="text"
                    id="billing-zip"
                    className="input-field"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Обработка...
                    </span>
                  ) : (
                    `Подтвердить и оплатить ${calculateTotal()} ₽`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Booking summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 card p-6">
            <div className="flex items-center pb-4 border-b border-neutral-200">
              <img
                src={property.image}
                alt={property.title}
                className="h-16 w-16 rounded-lg object-cover mr-4"
              />
              <div>
                <h3 className="font-medium text-neutral-900">{property.title}</h3>
                <p className="text-sm text-neutral-700">{property.location}</p>
              </div>
            </div>
            
            <div className="py-4 border-b border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">Детали цены</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-700">
                    {property.price} ₽ x {calculateNights()} {calculateNights() === 1 ? 'ночь' : 
                    calculateNights() >= 2 && calculateNights() <= 4 ? 'ночи' : 'ночей'}
                  </span>
                  <span className="text-neutral-700">{calculateSubtotal()} ₽</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-700">Сбор за уборку</span>
                  <span className="text-neutral-700">1000 ₽</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-700">Сервисный сбор</span>
                  <span className="text-neutral-700">500 ₽</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between font-bold">
              <span>Итого</span>
              <span>{calculateTotal()} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage