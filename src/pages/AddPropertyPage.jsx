import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

function AddPropertyPage() {
  const { supabase } = useSupabase()
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
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }))
    setImages([...images, ...newImages])
  }

  const handleRemoveImage = (index) => {
    const newImages = [...images]
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

    try {
      // 1. Создаем запись в таблице properties
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert([{
          title,
          description,
          property_type: propertyType,
          address,
          district,
          city,
          zip_code: zipCode,
          price: parseFloat(price),
          bedrooms: parseInt(bedrooms),
          beds: parseInt(beds),
          bathrooms: parseInt(bathrooms),
          max_guests: parseInt(maxGuests),
          status: 'draft'
        }])
        .select()
        .single()

      if (propertyError) throw propertyError

      // 2. Загружаем изображения в storage
      const imagePromises = images.map(async (image, index) => {
        const fileExt = image.file.name.split('.').pop()
        const filePath = `${property.id}/${index}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, image.file)

        if (uploadError) throw uploadError

        // 3. Создаем запись в таблице property_images
        const { error: imageError } = await supabase
          .from('property_images')
          .insert([{
            property_id: property.id,
            storage_path: filePath,
            position: index
          }])

        if (imageError) throw imageError
      })

      await Promise.all(imagePromises)

      // 4. Добавляем удобства
      if (amenities.length > 0) {
        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(
            amenities.map(amenity => ({
              property_id: property.id,
              amenity
            }))
          )

        if (amenitiesError) throw amenitiesError
      }

      // Успешно завершено
      navigate('/host/properties')
    } catch (error) {
      console.error('Error creating property:', error)
      // Здесь можно добавить уведомление об ошибке
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                        <label htmlFor="zip-code" className="block text-sm font-medium text-neutral-700 mb-1">
                          Почтовый индекс
                        </label>
                        <input
                          type="text"
                          id="zip-code"
                          className="input-field"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="630000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary"
                >
                  Далее
                </button>
              </div>
            </div>
          )}
          
          {/* Шаг 2: Детали */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Детали объекта</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                    Цена за ночь (₽) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="input-field"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="100"
                    placeholder="2000"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-neutral-700 mb-1">
                      Количество спален *
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      className="input-field"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      required
                      min="0"
                      placeholder="2"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="beds" className="block text-sm font-medium text-neutral-700 mb-1">
                      Количество кроватей *
                    </label>
                    <input
                      type="number"
                      id="beds"
                      className="input-field"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      required
                      min="1"
                      placeholder="3"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-neutral-700 mb-1">
                      Количество ванных *
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      className="input-field"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      required
                      min="0"
                      placeholder="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="max-guests" className="block text-sm font-medium text-neutral-700 mb-1">
                      Максимум гостей *
                    </label>
                    <input
                      type="number"
                      id="max-guests"
                      className="input-field"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                      required
                      min="1"
                      placeholder="4"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Удобства
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableAmenities.map(amenity => (
                      <label
                        key={amenity}
                        className={`
                          flex items-center p-3 rounded-lg border cursor-pointer
                          ${amenities.includes(amenity)
                            ? 'border-primary bg-primary/5'
                            : 'border-neutral-200 hover:border-neutral-300'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                        <span className={`text-sm ${
                          amenities.includes(amenity)
                            ? 'text-primary'
                            : 'text-neutral-700'
                        }`}>
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn-secondary"
                >
                  Назад
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary"
                >
                  Далее
                </button>
              </div>
            </div>
          )}
          
          {/* Шаг 3: Фотографии */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Фотографии</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Загрузите фотографии вашего объекта
                  </label>
                  <div className="mt-2">
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <PlusIcon className="mx-auto h-12 w-12 text-neutral-400" />
                        <div className="flex text-sm text-neutral-600">
                          <label
                            htmlFor="images"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                          >
                            <span>Загрузить файлы</span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              className="sr-only"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">или перетащите их сюда</p>
                        </div>
                        <p className="text-xs text-neutral-500">
                          PNG, JPG, GIF до 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4 text-neutral-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn-secondary"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить объект'}
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