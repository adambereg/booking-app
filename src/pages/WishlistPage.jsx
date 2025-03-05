import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import PropertyCard from '../components/PropertyCard'
import { HeartIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

function WishlistPage() {
  const { supabase, session } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [wishlists, setWishlists] = useState([])
  const [selectedWishlist, setSelectedWishlist] = useState(null)
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false)
  const [newWishlistName, setNewWishlistName] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [wishlistToDelete, setWishlistToDelete] = useState(null)

  useEffect(() => {
    const loadWishlists = async () => {
      setIsLoading(true)
      
      try {
        // In a real app, you would fetch this data from Supabase
        // For now, we'll use mock data
        const mockWishlists = [
          {
            id: 1,
            name: 'Избранное',
            properties: [
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
              }
            ]
          },
          {
            id: 2,
            name: 'Для отпуска',
            properties: [
              {
                id: 3,
                title: 'Стильная студия рядом с метро',
                location: 'Ленинский район, Новосибирск',
                type: 'Студия целиком',
                price: 1800,
                rating: 4.7,
                images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
              }
            ]
          },
          {
            id: 3,
            name: 'Рабочие поездки',
            properties: []
          }
        ]
        
        setWishlists(mockWishlists)
        setSelectedWishlist(mockWishlists[0])
      } catch (error) {
        console.error('Error loading wishlists:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadWishlists()
  }, [supabase, session])

  const handleCreateWishlist = () => {
    if (newWishlistName.trim() === '') return
    
    // Create a new wishlist
    const newWishlist = {
      id: wishlists.length + 1,
      name: newWishlistName,
      properties: []
    }
    
    // Add the new wishlist to the list
    setWishlists([...wishlists, newWishlist])
    
    // Select the new wishlist
    setSelectedWishlist(newWishlist)
    
    // Reset the form
    setNewWishlistName('')
    setIsCreatingWishlist(false)
  }

  const handleDeleteWishlist = (wishlist) => {
    setWishlistToDelete(wishlist)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteWishlist = () => {
    // Remove the wishlist from the list
    const updatedWishlists = wishlists.filter(w => w.id !== wishlistToDelete.id)
    setWishlists(updatedWishlists)
    
    // If the deleted wishlist was selected, select the first one in the list
    if (selectedWishlist?.id === wishlistToDelete.id) {
      setSelectedWishlist(updatedWishlists.length > 0 ? updatedWishlists[0] : null)
    }
    
    // Close the modal
    setIsDeleteModalOpen(false)
    setWishlistToDelete(null)
  }

  const handleRemoveProperty = (propertyId) => {
    // Remove the property from the selected wishlist
    const updatedWishlists = wishlists.map(wishlist => {
      if (wishlist.id === selectedWishlist.id) {
        return {
          ...wishlist,
          properties: wishlist.properties.filter(property => property.id !== propertyId)
        }
      }
      return wishlist
    })
    
    setWishlists(updatedWishlists)
    
    // Update the selected wishlist
    setSelectedWishlist(updatedWishlists.find(w => w.id === selectedWishlist.id))
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
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Мои списки желаний</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Списки</h2>
              <button
                onClick={() => setIsCreatingWishlist(true)}
                className="text-primary hover:text-primary-dark"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            
            {isCreatingWishlist && (
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
            )}
            
            <ul className="space-y-2">
              {wishlists.map((wishlist) => (
                <li key={wishlist.id}>
                  <button
                    onClick={() => setSelectedWishlist(wishlist)}
                    className={`flex justify-between items-center w-full p-2 rounded-md ${
                      selectedWishlist?.id === wishlist.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <HeartIcon className={`h-5 w-5 mr-2 ${
                        selectedWishlist?.id === wishlist.id ? 'text-white' : 'text-neutral-500'
                      }`} />
                      <span>{wishlist.name}</span>
                    </div>
                    <span className="text-sm">
                      {wishlist.properties.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {selectedWishlist ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">
                  {selectedWishlist.name}
                </h2>
                <button
                  onClick={() => handleDeleteWishlist(selectedWishlist)}
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Удалить список
                </button>
              </div>
              
              {selectedWishlist.properties.length === 0 ? (
                <div className="card p-6 text-center">
                  <HeartSolidIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    В этом списке пока нет объектов
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    Добавляйте понравившиеся объекты в список желаний, нажимая на значок сердечка на странице объекта.
                  </p>
                  <Link to="/search" className="btn-primary">
                    Найти жильё
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedWishlist.properties.map((property) => (
                    <div key={property.id} className="relative">
                      <PropertyCard property={property} />
                      <button
                        onClick={() => handleRemoveProperty(property.id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-neutral-100"
                      >
                        <HeartSolidIcon className="h-5 w-5 text-primary" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card p-6 text-center">
              <HeartSolidIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                У вас пока нет списков желаний
              </h3>
              <p className="text-neutral-700 mb-4">
                Создайте свой первый список желаний, чтобы сохранять понравившиеся объекты.
              </p>
              <button
                onClick={() => setIsCreatingWishlist(true)}
                className="btn-primary"
              >
                Создать список
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Wishlist Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Удалить список "{wishlistToDelete?.name}"?
            </h3>
            <p className="text-neutral-700 mb-6">
              Вы уверены, что хотите удалить этот список? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setWishlistToDelete(null)
                }}
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
              >
                Отмена
              </button>
              <button
                onClick={confirmDeleteWishlist}
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

export default WishlistPage