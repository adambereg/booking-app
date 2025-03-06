import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

function HostPropertiesPage() {
  const { supabase } = useSupabase()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            storage_path
          ),
          property_amenities (
            amenity
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      // Здесь можно добавить уведомление об ошибке
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return

    try {
      // Удаляем изображения из Storage
      for (const image of propertyToDelete.property_images) {
        await supabase.storage
          .from('property-images')
          .remove([image.storage_path])
      }

      // Удаляем запись из базы данных
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id)

      if (error) throw error

      setProperties(properties.filter(p => p.id !== propertyToDelete.id))
      setShowDeleteModal(false)
      setPropertyToDelete(null)
      // Здесь можно добавить уведомление об успешном удалении
    } catch (error) {
      console.error('Error deleting property:', error)
      // Здесь можно добавить уведомление об ошибке
    }
  }

  const handleStatusToggle = async (property) => {
    const newStatus = property.status === 'active' ? 'inactive' : 'active'

    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', property.id)

      if (error) throw error

      setProperties(properties.map(p => 
        p.id === property.id ? { ...p, status: newStatus } : p
      ))
      // Здесь можно добавить уведомление об успешном обновлении
    } catch (error) {
      console.error('Error updating property status:', error)
      // Здесь можно добавить уведомление об ошибке
    }
  }

  const filteredProperties = statusFilter === 'all'
    ? properties
    : properties.filter(p => p.status === statusFilter)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои объекты</h1>
        <Link
          to="/host/properties/add"
          className="btn-primary"
        >
          Добавить объект
        </Link>
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field"
        >
          <option value="all">Все объекты</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="draft">Черновики</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="spinner"></div>
          <p className="mt-2 text-neutral-600">Загрузка объектов...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-600">У вас пока нет объектов</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div
              key={property.id}
              className="card overflow-hidden"
            >
              <div className="relative aspect-video">
                {property.property_images?.[0] ? (
                  <img
                    src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/property-images/${property.property_images[0].storage_path}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400">Нет фото</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${property.status === 'active' ? 'bg-green-100 text-green-800' : 
                      property.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                      'bg-neutral-100 text-neutral-800'}
                  `}>
                    {property.status === 'active' ? 'Активно' : 
                     property.status === 'inactive' ? 'Неактивно' : 
                     'Черновик'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium mb-2">{property.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  {property.address}
                </p>
                <div className="text-lg font-medium mb-4">
                  {property.price.toLocaleString('ru-RU')} ₽/ночь
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <Link
                      to={`/properties/${property.id}`}
                      className="btn-icon"
                      title="Просмотреть"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/host/properties/edit/${property.id}`}
                      className="btn-icon"
                      title="Редактировать"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(property)}
                      className="btn-icon text-red-600 hover:text-red-700"
                      title="Удалить"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(property)}
                    className={`btn-secondary text-sm ${
                      property.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {property.status === 'active' ? 'Деактивировать' : 'Активировать'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Подтверждение удаления</h3>
            <p className="text-neutral-600 mb-6">
              Вы уверены, что хотите удалить объект "{propertyToDelete?.title}"? 
              Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn-primary bg-red-600 hover:bg-red-700"
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