import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import PropertyCard from '../components/PropertyCard'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import TestSupabase from '../components/TestSupabase'

function HomePage() {
  const { supabase, session } = useSupabase()
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [popularDestinations, setPopularDestinations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Check if we have a demo user
  const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
  const isAuthenticated = session || isDemoMode

  useEffect(() => {
    // In a real app, you would fetch this data from Supabase
    // For now, we'll use mock data
    const mockFeaturedProperties = [
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
      }
    ]

    const mockPopularDestinations = [
      {
        id: 1,
        name: 'Центральный район',
        image: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        properties: 243
      },
      {
        id: 2,
        name: 'Академгородок',
        image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        properties: 182
      },
      {
        id: 3,
        name: 'Октябрьский район',
        image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        properties: 176
      },
      {
        id: 4,
        name: 'Ленинский район',
        image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        properties: 154
      }
    ]

    setFeaturedProperties(mockFeaturedProperties)
    setPopularDestinations(mockPopularDestinations)
    setIsLoading(false)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1>Главная страница</h1>
      <TestSupabase />
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Новосибирск"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Найдите идеальное жильё в Новосибирске
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-white">
            Комфортные квартиры и апартаменты посуточно в любом районе города. Бронируйте онлайн без комиссии.
          </p>
          <div className="mt-10 max-w-xl">
            <form onSubmit={handleSearch} className="sm:flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Куда вы хотите поехать?"
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-6 w-6 text-neutral-500 absolute left-4 top-4" />
              </div>
              <button
                type="submit"
                className="mt-3 sm:mt-0 w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Поиск
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Рекомендуемые квартиры</h2>
          <Link to="/search" className="text-primary hover:text-primary-dark flex items-center">
            Смотреть все <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Популярные районы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <Link key={destination.id} to={`/search?location=${encodeURIComponent(destination.name)}`}>
                <div className="relative rounded-xl overflow-hidden h-64 group">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <p className="text-sm">{destination.properties} объектов</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Become a Host or Dashboard Access */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isAuthenticated ? (
          <div className="bg-neutral-900 rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Управление недвижимостью"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white">Управляйте своей недвижимостью</h2>
                <p className="mt-4 text-lg text-neutral-300">
                  Перейдите в панель управления, чтобы добавлять новые объекты, управлять бронированиями и отслеживать доходность.
                </p>
                <div className="mt-8">
                  <Link
                    to="/host/properties"
                    className="inline-block bg-white hover:bg-neutral-100 text-neutral-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Панель управления
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Стать арендодателем"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white">Сдавайте жильё на НовоДом</h2>
                <p className="mt-4 text-lg text-neutral-300">
                  Зарабатывайте на своей недвижимости, сдавая её в посуточную аренду. Мы поможем найти надёжных арендаторов.
                </p>
                <div className="mt-8">
                  <Link
                    to="/auth/login"
                    className="inline-block bg-white hover:bg-neutral-100 text-neutral-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Узнать больше
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage