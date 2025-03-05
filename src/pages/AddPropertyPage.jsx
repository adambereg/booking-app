import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

function AddPropertyPage() {
  const { supabase, session } = useSupabase()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Детали объекта
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [address, setAddress] = useState('')
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('Новосибирск')
  const [zipCode, setZipCode] = useState('')
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [beds, setBeds] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [maxGuests, setMaxGuests] = useState('')
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  
  // Типы жилья
  const propertyTypes = [
    { id: 'apartment', name: 'Квартира' },
    { id: 'studio', name: 'Студия' },
    { id: 'room', name: 'Комната' },
    { id: 'house', name: 'Дом' },
    { id: 'cottage', name: 'Коттедж' }
  ]
  
  // Районы Новосибирска
  const districts = [
    { id: 'central', name: 'Центральный' },
    { id: 'soviet', name: 'Советский' },
    { id: 'october', name: 'Октябрьский' },
    { id: 'lenin', name: 'Ленинский' },
    { id: 'kirov', name: 'Кировский' },
    { id: 'pervomaysky', name: 'Первомайский' },
    { id: 'zaeltsovsky', name: 'Заельцовский' },
    { id: 'kalinin', name: 'Калининский' },
    { id: 'dzerzhinsky', name: 'Дзержинский' },
    { id: 'zheleznodorozhny', name: 'Железнодорожный' }
  ]
  
  // Доступные удобства
  const availableAmenities = [
    'Wi-Fi',
    'Кухня',
    'Бесплатная парковка',
    'Кондиционер',
    'Отопление',
    'Стиральная машина',
    'Сушильная машина',
    'Телевизор',
    'Фен',
    'Утюг',
    'Рабочая зона',
    'Лифт',
    'Доступно для инвалидов',
    'Завтрак',
    'Можно с питомцами',
    'Можно курить',
    'Балкон',
    'Микроволновая печь',
    'Холодильник',
    'Посудомоечная машина',
    'Кофемашина',
    'Детская кроватка'
  ]

  const handleAmenityToggle = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // В реальном приложении вы бы загружали их в Supabase storage
    // Для демонстрации просто создаем URL объекты
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }))
    
    setImages([...images, ...newImages])
  }

  const handleRemoveImage = (index) => {
    const newImages = [...images]
    
    // Отзываем URL объекта, чтобы избежать утечек памяти
    URL.revokeObjectURL(newImages[index].url)
    
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // В реальном приложении вы бы создавали объект в Supabase
    // Для демонстрации просто имитируем успешное создание
    
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/host/properties')
    }, 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Добавление нового объекта</h1>
      
      {/* Шаги прогресса */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-neutral-400'}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              currentStep >= 1 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Основная информация</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-primary' : 'bg-neutral-200'}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-neutral-400'}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              currentStep >= 2 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Детали</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-primary' : 'bg-neutral-200'}`}></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-neutral-400'}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              currentStep >= 3 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Фотографии</span>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit}>
          {/* Шаг 1: Основная информация */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Основная информация</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                    Название объекта *
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="input-field"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="например, Уютная квартира в центре"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                    Описание *
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    className="input-field"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Опишите ваш объект, выделите особенности и что делает его уникальным"
                  />
                </div>
                
                <div>
                  <label htmlFor="property-type" className="block text-sm font-medium text-neutral-700 mb-1">
                    Тип жилья *
                  </label>
                  <select
                    id="property-type"
                    className="input-field"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    required
                  >
                    <option value="">Выберите тип жилья</option>
                    {propertyTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Местоположение *</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                        Адрес
                      </label>
                      <input
                        type="text"
                        id="address"
                        className="input-field"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Улица, дом, квартира"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="district" className="block text-sm font-medium text-neutral-700 mb-1">
                          Район
                        </label>
                        <select
                          id="district"
                          className="input-field"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          required
                        >
                          <option value="">Выберите район</option>
                          {districts.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                          Город
                        </label>
                        <input
                          type="text"
                          id="city"
                          className="input-field"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="zip-code" className="block text-sm font-medium text-neutral-700 mb-1">
                        Почтовый индекс
                      </label>
                      <input
                        type="text"
                        id="zip-code"
                        className="input-field"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                >
                  Далее: Детали объекта
                </button>
              </div>
            </div>
          )}
          
          {/* Шаг 2: Детали объекта */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Детали объекта</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                    Цена за сутки (₽) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-neutral-500">₽</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      className="input-field pl-7"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="1"
                      step="1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-neutral-700 mb-1">
                      Спальни *
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      className="input-field"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      required
                      min="0"
                      step="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="beds" className="block text-sm font-medium text-neutral-700 mb-1">
                      Кровати *
                    </label>
                    <input
                      type="number"
                      id="beds"
                      className="input-field"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      required
                      min="1"
                      step="1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-neutral-700 mb-1">
                      Ванные комнаты *
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      className="input-field"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      required
                      min="0.5"
                      step="0.5"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="max-guests" className="block text-sm font-medium text-neutral-700 mb-1">
                      Макс. гостей *
                    </label>
                    <input
                      type="number"
                      id="max-guests"
                      className="input-field"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                      required
                      min="1"
                      step="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Удобства
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          id={`amenity-${amenity}`}
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                          checked={amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-neutral-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handlePrevStep}
                >
                  Назад
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                >
                  Далее: Добавить фотографии
                </button>
              </div>
            </div>
          )}
          
          {/* Шаг 3: Фотографии */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Фотографии объекта</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Загрузите фотографии *
                  </label>
                  <p className="text-sm text-neutral-500 mb-4">
                    Добавьте не менее 5 фотографий вашего объекта. Качественные изображения увеличивают количество бронирований!
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Объект ${index + 1}`}
                          className="h-32 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <XMarkIcon className="h-4 w-4 text-neutral-700" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="h-32 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50">
                      <PlusIcon className="h-8 w-8 text-neutral-400" />
                      <span className="mt-2 text-sm text-neutral-500">Добавить фото</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  
                  {images.length === 0 && (
                    <p className="text-sm text-red-600">
                      Пожалуйста, добавьте хотя бы одну фотографию вашего объекта.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handlePrevStep}
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || images.length === 0}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Создание объекта...
                    </span>
                  ) : (
                    'Создать объект'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddPropertyPage