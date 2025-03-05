import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { PencilIcon, TrashIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

function HostPropertiesPage() {
  const { supabase, session } = useSupabase()
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // В реальном приложении вы бы получали эти данные из Supabase
    // Для демонстрации используем моковые данные
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
        status: 'inactive',
        bookingsCount: 5,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      }
    ]

    setProperties(mockProperties)
    setIsLoading(false)
  }, [])

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    // В реальном приложении вы бы удаляли объект из Supabase
    // Для демонстрации просто обновляем локальное состояние
    setProperties(properties.filter(p => p.id !== propertyToDelete.id))
    setDeleteModalOpen(false)
    setPropertyToDelete(null)
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setPropertyToDelete(null)
  }

  const handleStatusToggle = (propertyId) => {
    setProperties(properties.map(property => 
      property.id === propertyId 
        ? { ...property, status: property.status === 'active' ? 'inactive' : 'active' } 
        : property
    ))
  }

  const filteredProperties = statusFilter === 'all' 
    ? properties 
    : properties.filter(property => property.status === statusFilter)

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
        <h1 className="text-2xl font-bold text-neutral-900 mb-2 md:mb-0">Ваши объекты недвижимости</h1>
        <Link to="/host/properties/add" className="btn-primary">
          Добавить новый объект
        </Link>
      </div>
      
      {/* Фильтры */}
      <div className="flex mb-6 space-x-2">
        <button 
          className={`px-4 py-2 rounded-md ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-white text-neutral-700 border border-neutral-300'}`}
          onClick={() => setStatusFilter('all')}
        >
          Все
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${statusFilter === 'active' ? 'bg-primary text-white' : 'bg-white text-neutral-700 border border-neutral-300'}`}
          onClick={() => setStatusFilter('active')}
        >
          Активные
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${statusFilter === 'inactive' ? 'bg-primary text-white' : 'bg-white text-neutral-700 border border-neutral-300'}`}
          onClick={() => setStatusFilter('inactive')}
        >
          Неактивные
        </button>
      </div>
      
      {properties.length === 0 ? (
        <div className="card p-6 text-center">
          <h2 className="text-xl font-medium text-neutral-900 mb-2">У вас пока нет объектов недвижимости</h2>
          <p className="text-neutral-700 mb-4">Начните с добавления вашего первого объекта.</p>
          <Link to="/host/properties/add" className="btn-primary">
            Добавить объект
          </Link>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="card p-6 text-center">
          <h2 className="text-xl font-medium text-neutral-900 mb-2">Нет объектов, соответствующих фильтру</h2>
          <p className="text-neutral-700 mb-4">Попробуйте изменить параметры фильтрации.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div key={property.id} className="card p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-3/4 md:pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1">
                        {property.title}
                      </h3>
                      <p className="text-neutral-700 mb-2">{property.location}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                        <span className="text-neutral-700">{property.type}</span>
                        <span className="text-neutral-700">{property.bedrooms} {property.bedrooms === 1 ? 'спальня' : property.bedrooms >= 2 && property.bedrooms <= 4 ? 'спальни' : 'спален'}</span>
                        <span className="text-neutral-700">{property.bathrooms} {property.bathrooms === 1 ? 'ванная' : 'ванных'}</span>
                        <span className="text-neutral-700">{property.price} ₽/сутки</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                        <span className="text-neutral-700">Бронирований: {property.bookingsCount}</span>
                        <span className="text-neutral-700">Рейтинг: {property.rating}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {property.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link
                      to={`/properties/${property.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Просмотр
                    </Link>
                    <Link
                      to={`/host/properties/edit/${property.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleStatusToggle(property.id)}
                      className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                        property.status === 'active'
                          ? 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50'
                          : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                      }`}
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-1" />
                      {property.status === 'active' ? 'Деактивировать' : 'Активировать'}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(property)}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Модальное окно подтверждения удаления */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Подтвердите удаление</h3>
            <p className="text-neutral-700 mb-6">
              Вы уверены, что хотите удалить "{propertyToDelete?.title}"? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HostPropertiesPage