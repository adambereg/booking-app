import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

function EditPropertyPage() {
  const { id } = useParams()
  const { supabase, session } = useSupabase()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Property details
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [beds, setBeds] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [maxGuests, setMaxGuests] = useState('')
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const [isActive, setIsActive] = useState(true)
  
  // Property types
  const propertyTypes = [
    { id: 'house', name: 'House' },
    { id: 'apartment', name: 'Apartment' },
    { id: 'villa', name: 'Villa' },
    { id: 'cabin', name: 'Cabin' },
    { id: 'condo', name: 'Condo' },
    { id: 'loft', name: 'Loft' },
    { id: 'townhouse', name: 'Townhouse' },
    { id: 'other', name: 'Other' }
  ]
  
  // Available amenities
  const availableAmenities = [
    'Wifi',
    'Kitchen',
    'Free parking',
    'Pool',
    'Hot tub',
    'Air conditioning',
    'Heating',
    'Washer',
    'Dryer',
    'TV',
    'Cable TV',
    'Fireplace',
    'Gym',
    'Elevator',
    'Wheelchair accessible',
    'Breakfast',
    'Pets allowed',
    'Smoking allowed',
    'Beach access',
    'Ocean view',
    'Mountain view',
    'BBQ grill',
    'Balcony',
    'Garden',
    'Patio'
  ]

  useEffect(() => {
    // In a real app, you would fetch the property data from Supabase
    // For now, we'll use mock data
    const mockProperty = {
      id: 1,
      title: 'Luxury Beach Villa with Ocean Views',
      description: 'Experience the ultimate beachfront luxury in this stunning villa overlooking the Pacific Ocean. This spacious property features floor-to-ceiling windows, a private infinity pool, and direct beach access. Perfect for family vacations or a romantic getaway.',
      propertyType: 'villa',
      address: '123 Ocean Drive',
      city: 'Malibu',
      state: 'California',
      zipCode: '90265',
      country: 'United States',
      price: 350,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
      maxGuests: 10,
      amenities: [
        'Wifi',
        'Kitchen',
        'Free parking',
        'Pool',
        'Hot tub',
        'Air conditioning',
        'Washer',
        'Dryer',
        'TV',
        'Beach access',
        'Ocean view',
        'BBQ grill'
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          name: 'villa-exterior.jpg'
        },
        {
          url: 'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          name: 'villa-living-room.jpg'
        },
        {
          url: 'https://images.unsplash.com/photo-1594540637720-9b14714212bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          name: 'villa-bedroom.jpg'
        },
        {
          url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          name: 'villa-bathroom.jpg'
        },
        {
          url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          name: 'villa-pool.jpg'
        }
      ],
      isActive: true
    }

    // Set the form values
    setTitle(mockProperty.title)
    setDescription(mockProperty.description)
    setPropertyType(mockProperty.propertyType)
    setAddress(mockProperty.address)
    setCity(mockProperty.city)
    setState(mockProperty.state)
    setZipCode(mockProperty.zipCode)
    setCountry(mockProperty.country)
    setPrice(mockProperty.price.toString())
    setBedrooms(mockProperty.bedrooms.toString())
    setBeds(mockProperty.beds.toString())
    setBathrooms(mockProperty.bathrooms.toString())
    setMaxGuests(mockProperty.maxGuests.toString())
    setAmenities(mockProperty.amenities)
    setImages(mockProperty.images)
    setIsActive(mockProperty.isActive)
    
    setIsLoading(false)
  }, [id])

  const handleAmenityToggle = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // In a real app, you would upload these to Supabase storage
    // For now, we'll just create object URLs
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }))
    
    setImages([...images, ...newImages])
  }

  const handleRemoveImage = (index) => {
    const newImages = [...images]
    
    // Revoke the object URL to avoid memory leaks
    if (newImages[index].file) {
      URL.revokeObjectURL(newImages[index].url)
    }
    
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
    
    // In a real app, you would update the property in Supabase
    // For now, we'll simulate a successful update
    
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/host/properties')
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
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Edit Property</h1>
      
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-neutral-400'}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              currentStep >= 1 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Basic Info</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-primary' : 'bg-neutral-200'}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-neutral-400'}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              currentStep >= 2 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Details</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-primary' : 'bg-neutral-200'}`}></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-neutral-400'}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              currentStep >= 3 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Photos</span>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="input-field"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Cozy Apartment in Downtown"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    className="input-field"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe your property, highlight special features, and what makes it unique"
                  />
                </div>
                
                <div>
                  <label htmlFor="property-type" className="block text-sm font-medium text-neutral-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    id="property-type"
                    className="input-field"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    required
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Location *</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        className="input-field"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                          City
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
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          className="input-field"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="zip-code" className="block text-sm font-medium text-neutral-700 mb-1">
                          ZIP / Postal Code
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
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          className="input-field"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <input
                      id="is-active"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label htmlFor="is-active" className="ml-2 block text-sm text-neutral-700">
                      Property is active and available for booking
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                >
                  Next: Property Details
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Property Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                    Price per night (USD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-neutral-500">$</span>
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
                      Bedrooms *
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
                      Beds *
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
                      Bathrooms *
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
                      Max Guests *
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
                    Amenities
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
                  Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                >
                  Next: Photos
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Photos */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Property Photos</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Property Photos *
                  </label>
                  <p className="text-sm text-neutral-500 mb-4">
                    Add at least 5 photos of your property. High-quality images increase bookings!
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Property ${index + 1}`}
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
                      <span className="mt-2 text-sm text-neutral-500">Add photo</span>
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
                      Please add at least one photo of your property.
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
                  Back
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
                      Saving changes...
                    </span>
                  ) : (
                    'Save Changes'
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

export default EditPropertyPage