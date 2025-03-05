import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { MapPinIcon, UserIcon, HomeIcon, CalendarIcon, CheckIcon } from '@heroicons/react/24/outline'
import DatePickerWrapper from '../components/DatePickerWrapper'
import 'react-datepicker/dist/react-datepicker.css'
import ru from 'date-fns/locale/ru'

function PropertyDetailsPage() {
  const { id } = useParams()
  const { supabase, session } = useSupabase()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false)
  const [wishlists, setWishlists] = useState([])
  const [newWishlistName, setNewWishlistName] = useState('')
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch this data from Supabase
    // For now, we'll use mock data
    const mockProperty = {
      id: 1,
      title: 'Уютная квартира в центре Новосибирска',
      description: 'Светлая и просторная квартира в самом центре города. В пешей доступности площадь Ленина, ТРЦ "Аура", множество кафе и ресторанов. Идеально подходит для деловых поездок или отдыха. В квартире есть все необходимое для комфортного проживания.',
      location: 'Центральный район, Новосибирск',
      type: 'Квартира целиком',
      price: 2500,
      rating: 4.9,
      reviews: 124,
      host: {
        id: 1,
        name: 'Анна Иванова',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        isSuperhost: true,
        joinedDate: 'Январь 2018'
      },
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1594540637720-9b14714212bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      ],
      amenities: [
        'Wi-Fi',
        'Кухня',
        'Бесплатная парковка',
        'Кондиционер',
        'Стиральная машина',
        'Сушильная машина',
        'Телевизор',
        'Фен',
        'Утюг',
        'Рабочая зона',
        'Микроволновая печь',
        'Холодильник'
      ],
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      maxGuests: 4,
      coordinates: {
        latitude: 55.0282,
        longitude: 82.9234
      }
    }

    // Mock wishlists
    const mockWishlists = [
      { id: 1, name: 'Избранное', properties: [2, 3] },
      { id: 2, name: 'Для отпуска', properties: [3] },
      { id: 3, name: 'Рабочие поездки', properties: [] }
    ]

    setProperty(mockProperty)
    setWishlists(mockWishlists)
    
    // Check if this property is in any wishlist
    const isInWishlist = mockWishlists.some(wishlist => 
      wishlist.properties.includes(Number(id))
    )
    setIsFavorite(isInWishlist)
    
    setIsLoading(false)
  }, [id])

  const handleBooking = () => {
    if (!session) {
      navigate('/auth/login')
      return
    }
    
    if (!checkIn || !checkOut) {
      alert('Пожалуйста, выберите даты заезда и выезда')
      return
    }
    
    navigate(`/user/booking/${id}?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&guests=${guests}`)
  }

  const toggleFavorite = () => {
    if (!session) {
      navigate('/auth/login')
      return
    }
    
    if (isFavorite) {
      // If already a favorite, remove from all wishlists
      setWishlists(wishlists.map(wishlist => ({
        ...wishlist,
        properties: wishlist.properties.filter(propId => propId !== Number(id))
      })))
      setIsFavorite(false)
    } else {
      // If not a favorite, open wishlist modal
      setWishlistModalOpen(true)
    }
  }

  const handleAddToWishlist = (wishlistId) => {
    // Add property to selected wishlist
    setWishlists(wishlists.map(wishlist => {
      if (wishlist.id === wishlistId) {
        return {
          ...wishlist,
          properties: [...wishlist.properties, Number(id)]
        }
      }
      return wishlist
    }))
    
    setIsFavorite(true)
    setWishlistModalOpen(false)
  }

  const handleCreateWishlist = () => {
    if (newWishlistName.trim() === '') return
    
    // Create new wishlist with this property
    const newWishlist = {
      id: wishlists.length + 1,
      name: newWishlistName,
      properties: [Number(id)]
    }
    
    setWishlists([...wishlists, newWishlist])
    setIsFavorite(true)
    setNewWishlistName('')
    setIsCreatingWishlist(false)
    setWishlistModalOpen(false)
  }

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !property) return 0
    
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    return property.price * nights
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Объект не найден</h1>
          <Link to="/search" className="btn-primary">
            Вернуться к поиску
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Property title and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2 md:mb-0">{property.title}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleFavorite}
            className="flex items-center text-neutral-700 hover:text-primary"
          >
            {isFavorite ? (
              <HeartIcon className="h-6 w-6 text-primary" />
            ) : (
              <HeartOutlineIcon className="h-6 w-6" />
            )}
            <span className="ml-2">Сохранить</span>
          </button>
        </div>
      </div>

      {/* Property rating and location */}
      <div className="flex flex-col sm:flex-row sm:items-center text-neutral-700 mb-6">
        <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
          <StarIcon className="h-5 w-5 text-primary" />
          <span className="ml-1 font-medium">{property.rating}</span>
          <span className="mx-1">·</span>
          <Link to={`/properties/${id}/reviews`} className="underline">
            {property.reviews} отзывов
          </Link>
        </div>
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5" />
          <span className="ml-1">{property.location}</span>
        </div>
      </div>

      {/* Property images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
        <div className="md:col-span-1 h-[400px] md:h-[500px]">
          <img
            src={property.images[activeImage]}
            alt={property.title}
            className="w-full h-full object-cover rounded-tl-xl rounded-bl-xl"
          />
        </div>
        <div className="hidden md:grid md:grid-cols-2 gap-2 h-[500px]">
          {property.images.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} - ${index + 2}`}
              className={`w-full h-full object-cover ${
                index === 0 ? 'rounded-tr-xl' : index === 2 ? 'rounded-br-xl' : ''
              }`}
              onClick={() => setActiveImage(index + 1)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail images (mobile only) */}
      <div className="flex md:hidden space-x-2 mb-8 overflow-x-auto">
        {property.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${property.title} - ${index + 1}`}
            className={`h-16 w-24 object-cover rounded-md ${
              activeImage === index ? 'border-2 border-primary' : ''
            }`}
            onClick={() => setActiveImage(index)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Host info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-1">
                {property.type}, хозяин: {property.host.name}
              </h2>
              <p className="text-neutral-700">
                {property.bedrooms} {property.bedrooms === 1 ? 'спальня' : 
                 property.bedrooms >= 2 && property.bedrooms <= 4 ? 'спальни' : 'спален'} · 
                {property.beds} {property.beds === 1 ? 'кровать' : 
                 property.beds >= 2 && property.beds <= 4 ? 'кровати' : 'кроватей'} · 
                {property.bathrooms} {property.bathrooms === 1 ? 'ванная' : 'ванных'} · 
                До {property.maxGuests} {property.maxGuests === 1 ? 'гостя' : 
                 property.maxGuests >= 2 && property.maxGuests <= 4 ? 'гостей' : 'гостей'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={property.host.image}
                  alt={property.host.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                {property.host.isSuperhost && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                    <StarIcon className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Property description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Об этом жилье</h2>
            <p className="text-neutral-700 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Что есть в жилье</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-neutral-700 mr-3" />
                  <span className="text-neutral-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Расположение</h2>
            <div className="h-[300px] rounded-lg overflow-hidden bg-neutral-200 flex items-center justify-center">
              <div className="text-neutral-600 text-center p-4">
                <MapPinIcon className="h-10 w-10 mx-auto mb-2" />
                <p className="text-lg font-medium">Карта</p>
                <p className="text-sm">Интерактивная карта доступна в полной версии приложения</p>
              </div>
            </div>
            <p className="mt-2 text-neutral-700">{property.location}</p>
          </div>
          
          {/* Reviews summary */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                <span className="flex items-center">
                  <StarIcon className="h-5 w-5 text-primary mr-2" />
                  {property.rating} · {property.reviews} отзывов
                </span>
              </h2>
              <Link to={`/properties/${id}/reviews`} className="text-primary hover:text-primary-dark">
                Смотреть все отзывы
              </Link>
            </div>
            
            {/* Preview of reviews would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start mb-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Михаил"
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-medium text-neutral-900">Михаил</h3>
                    <p className="text-sm text-neutral-500">Май 2025</p>
                  </div>
                </div>
                <p className="text-neutral-700 line-clamp-3">
                  Отличная квартира! Очень чисто, уютно и комфортно. Расположение идеальное - в самом центре, рядом много кафе и ресторанов.
                </p>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start mb-2">
                  <img
                    src="https://randomuser.me/api/portraits/women/26.jpg"
                    alt="Елена"
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-medium text-neutral-900">Елена</h3>
                    <p className="text-sm text-neutral-500">Апрель 2025</p>
                  </div>
                </div>
                <p className="text-neutral-700 line-clamp-3">
                  Хорошая квартира с удобным расположением. Есть все необходимое для комфортного проживания. Единственный минус - немного шумно из-за близости к дороге.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 card p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-2xl font-bold text-neutral-900">{property.price} ₽</span>
                <span className="text-neutral-700"> сутки</span>
              </div>
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-primary" />
                <span className="ml-1 font-medium">{property.rating}</span>
                <span className="mx-1 text-neutral-500">·</span>
                <Link to={`/properties/${id}/reviews`} className="text-neutral-500 underline">
                  {property.reviews} отзывов
                </Link>
              </div>
            </div>

            <div className="border border-neutral-300 rounded-lg mb-4">
              <div className="grid grid-cols-2 divide-x divide-neutral-300">
                <div className="p-3">
                  <label htmlFor="check-in" className="block text-xs font-medium text-neutral-700 mb-1">
                    ЗАЕЗД
                  </label>
                  <DatePickerWrapper
                    id="check-in"
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Выберите"
                    className="w-full border-none p-0 focus:ring-0 text-neutral-900"
                    dateFormat="dd.MM.yyyy"
                    isClearable
                    showPopperArrow={false}
                  />
                </div>
                <div className="p-3">
                  <label htmlFor="check-out" className="block text-xs font-medium text-neutral-700 mb-1">
                    ВЫЕЗД
                  </label>
                  <DatePickerWrapper
                    id="check-out"
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    placeholderText="Выберите"
                    className="w-full border-none p-0 focus:ring-0 text-neutral-900"
                    dateFormat="dd.MM.yyyy"
                    isClearable
                    showPopperArrow={false}
                    disabled={!checkIn}
                  />
                </div>
              </div>
              <div className="border-t border-neutral-300 p-3">
                <label htmlFor="guests" className="block text-xs font-medium text-neutral-700 mb-1">
                  ГОСТИ
                </label>
                <select
                  id="guests"
                  className="w-full border-none p-0 focus:ring-0 text-neutral-900"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'гость' : num >= 2 && num <= 4 ? 'гостя' : 'гостей'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4"
            >
              Забронировать
            </button>

            <p className="text-center text-neutral-500 mb-6">Пока с вас не будут списаны деньги</p>

            {checkIn && checkOut && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-700 underline">
                    {property.price} ₽ x {Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))} ночей
                  </span>
                  <span className="text-neutral-700">
                    {calculateTotalPrice()} ₽
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700 underline">Сбор за уборку</span>
                  <span className="text-neutral-700">1000 ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700 underline">Сервисный сбор</span>
                  <span className="text-neutral-700">500 ₽</span>
                </div>
                <div className="pt-4 border-t border-neutral-300 flex justify-between font-bold">
                  <span>Итого</span>
                  <span>{calculateTotalPrice() + 1000 + 500} ₽</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Wishlist Modal */}
      {wishlistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Сохранить в список</h3>
            
            {isCreatingWishlist ? (
              <div className="mb-4">
                <input
                  type="text"
                  className="input-field mb-2"
                  placeholder="Название списка"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateWishlist}
                    className="btn-primary text-sm py-1 px-3"
                  >
                    Создать
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingWishlist(false)
                      setNewWishlistName('')
                    }}
                    className="btn-secondary text-sm py-1 px-3"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="space-y-2 mb-4">
                  {wishlists.map((wishlist) => (
                    <li key={wishlist.id}>
                      <button
                        onClick={() => handleAddToWishlist(wishlist.id)}
                        className="flex justify-between items-center w-full p-2 rounded-md hover:bg-neutral-100"
                      >
                        <span>{wishlist.name}</span>
                        <span className="text-sm text-neutral-500">
                          {wishlist.properties.length} объектов
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setIsCreatingWishlist(true)}
                  className="w-full text-left text-primary hover:text-primary-dark py-2"
                >
                  + Создать новый список
                </button>
              </>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setWishlistModalOpen(false)
                  setIsCreatingWishlist(false)
                  setNewWishlistName('')
                }}
                className="btn-secondary"
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

export default PropertyDetailsPage