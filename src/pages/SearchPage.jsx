import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import PropertyCard from '../components/PropertyCard'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import DatePickerWrapper from '../components/DatePickerWrapper'
import 'react-datepicker/dist/react-datepicker.css'
import ru from 'date-fns/locale/ru'

function SearchPage() {
  const { supabase } = useSupabase()
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  // Search parameters
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState(searchParams.get('guests') || 1)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '')
  
  // Property types
  const propertyTypes = [
    { id: 'apartment', name: 'Квартира' },
    { id: 'studio', name: 'Студия' },
    { id: 'room', name: 'Комната' },
    { id: 'house', name: 'Дом' },
    { id: 'cottage', name: 'Коттедж' }
  ]

  useEffect(() => {
    // Parse date parameters if they exist
    const checkInParam = searchParams.get('checkIn')
    const checkOutParam = searchParams.get('checkOut')
    
    if (checkInParam) {
      setCheckIn(new Date(checkInParam))
    }
    
    if (checkOutParam) {
      setCheckOut(new Date(checkOutParam))
    }
    
    // In a real app, you would fetch this data from Supabase based on search params
    // For now, we'll use mock data
    const mockProperties = [
      {
        id: 1,
        title: 'Уютная квартира в центре',
        location: 'Центральный район, Новосибирск',
        type: 'Квартира целиком',
        price: 2500,
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
      },
      {
        id: 2,
        title: 'Современные апартаменты с видом на Обь',
        location: 'Октябрьский район, Новосибирск',
        type: 'Апартаменты целиком',
        price: 3200,
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
      },
      {
        id: 3,
        title: 'Стильная студия рядом с метро',
        location: 'Ленинский район, Новосибирск',
        type: 'Студия целиком',
        price: 1800,
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
      },
      {
        id: 4,
        title: 'Просторная квартира рядом с Академгородком',
        location: 'Советский район, Новосибирск',
        type: 'Квартира целиком',
        price: 2800,
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
      },
      {
        id: 5,
        title: 'Квартира с видом на площадь Ленина',
        location: 'Центральный район, Новосибирск',
        type: 'Квартира целиком',
        price: 2700,
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
      },
      {
        id: 6,
        title: 'Уютная студия в новостройке',
        location: 'Калининский район, Новосибирск',
        type: 'Студия целиком',
        price: 1900,
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
      },
      {
        id: 7,
        title: 'Двухкомнатная квартира рядом с парком',
        location: 'Заельцовский район, Новосибирск',
        type: 'Квартира целиком',
        price: 2600,
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1065&q=80']
      },
      {
        id: 8,
        title: 'Комфортная квартира в тихом районе',
        location: 'Кировский район, Новосибирск',
        type: 'Квартира целиком',
        price: 2200,
        rating: 4.6,
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
      }
    ]

    // Filter properties based on search parameters
    let filteredProperties = [...mockProperties]
    
    if (location) {
      filteredProperties = filteredProperties.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    if (minPrice) {
      filteredProperties = filteredProperties.filter(property => 
        property.price >= parseInt(minPrice)
      )
    }
    
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(property => 
        property.price <= parseInt(maxPrice)
      )
    }
    
    if (propertyType) {
      filteredProperties = filteredProperties.filter(property => 
        property.type.toLowerCase().includes(propertyType.toLowerCase())
      )
    }

    setProperties(filteredProperties)
    setIsLoading(false)
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    
    const params = {}
    if (location) params.location = location
    if (checkIn) params.checkIn = format(checkIn, 'yyyy-MM-dd')
    if (checkOut) params.checkOut = format(checkOut, 'yyyy-MM-dd')
    if (guests) params.guests = guests
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (propertyType) params.type = propertyType
    
    setSearchParams(params)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4 md:mb-0">
          {properties.length} {properties.length === 1 ? 'вариант' : 
           properties.length >= 2 && properties.length <= 4 ? 'варианта' : 'вариантов'} 
          {location ? ` в ${location}` : ''}
        </h1>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center text-neutral-700 hover:text-primary"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
          Фильтры
        </button>
      </div>

      {/* Search filters */}
      <div className={`bg-white rounded-xl shadow-md p-6 mb-8 ${filtersOpen ? 'block' : 'hidden'}`}>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                Район
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  placeholder="Куда вы хотите поехать?"
                  className="input-field pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-neutral-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="check-in" className="block text-sm font-medium text-neutral-700 mb-1">
                Заезд
              </label>
              <DatePickerWrapper
                id="check-in"
                selected={checkIn}
                onChange={date => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                placeholderText="Выберите дату"
                className="input-field"
                dateFormat="dd.MM.yyyy"
              />
            </div>

            <div>
              <label htmlFor="check-out" className="block text-sm font-medium text-neutral-700 mb-1">
                Выезд
              </label>
              <DatePickerWrapper
                id="check-out"
                selected={checkOut}
                onChange={date => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                placeholderText="Выберите дату"
                className="input-field"
                dateFormat="dd.MM.yyyy"
              />
            </div>

            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-neutral-700 mb-1">
                Гости
              </label>
              <select
                id="guests"
                className="input-field"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'гость' : num >= 2 && num <= 4 ? 'гостя' : 'гостей'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="min-price" className="block text-sm font-medium text-neutral-700 mb-1">
                Минимальная цена
              </label>
              <input
                type="number"
                id="min-price"
                placeholder="Мин. цена"
                className="input-field"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
            </div>

            <div>
              <label htmlFor="max-price" className="block text-sm font-medium text-neutral-700 mb-1">
                Максимальная цена
              </label>
              <input
                type="number"
                id="max-price"
                placeholder="Макс. цена"
                className="input-field"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min={minPrice || "0"}
              />
            </div>

            <div>
              <label htmlFor="property-type" className="block text-sm font-medium text-neutral-700 mb-1">
                Тип жилья
              </label>
              <select
                id="property-type"
                className="input-field"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Любой тип</option>
                {propertyTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="mr-4 btn-secondary"
              onClick={() => {
                setLocation('')
                setCheckIn(null)
                setCheckOut(null)
                setGuests(1)
                setMinPrice('')
                setMaxPrice('')
                setPropertyType('')
              }}
            >
              Очистить всё
            </button>
            <button type="submit" className="btn-primary">
              Поиск
            </button>
          </div>
        </form>
      </div>

      {/* Property results */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-neutral-900 mb-2">Ничего не найдено</h3>
          <p className="text-neutral-600">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage