import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline'

function UserProfilePage() {
  const { supabase, session } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // User profile data
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true)
      
      try {
        // Check if we have a demo user
        const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
        
        if (isDemoMode) {
          // Load demo user data
          const demoUserData = JSON.parse(localStorage.getItem('novodom_demo_user'))
          setEmail(demoUserData.email || 'demo@example.com')
          
          // Set demo profile data
          setFirstName('Иван')
          setLastName('Петров')
          setPhone('+7 (999) 123-4567')
          setAddress('ул. Ленина, 10, кв. 42')
          setCity('Новосибирск')
          setState('Новосибирская область')
          setZipCode('630099')
          setCountry('Россия')
          setBio('Люблю путешествовать и открывать новые места. Предпочитаю комфортное жилье в центре города.')
        } else if (session) {
          // In a real app, you would fetch the user profile from Supabase
          setEmail(session.user.email)
          
          // Fetch profile data from Supabase
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (error) {
            console.error('Error fetching profile:', error)
          } else if (data) {
            // Set profile data from database
            setFirstName(data.first_name || '')
            setLastName(data.last_name || '')
            setPhone(data.phone || '')
            setAddress(data.address || '')
            setCity(data.city || '')
            setState(data.state || '')
            setZipCode(data.zip_code || '')
            setCountry(data.country || '')
            setBio(data.bio || '')
            setAvatarUrl(data.avatar_url || '')
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserProfile()
  }, [session, supabase])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')
    
    try {
      // Check if we have a demo user
      const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
      
      if (isDemoMode) {
        // Update demo user data in localStorage
        const demoUserData = JSON.parse(localStorage.getItem('novodom_demo_user'))
        const updatedDemoUser = {
          ...demoUserData,
          firstName,
          lastName,
          phone,
          address,
          city,
          state,
          zipCode,
          country,
          bio
        }
        localStorage.setItem('novodom_demo_user', JSON.stringify(updatedDemoUser))
        
        // Simulate a delay for the save operation
        setTimeout(() => {
          setSuccessMessage('Профиль успешно обновлен!')
          setIsSaving(false)
        }, 1000)
      } else if (session) {
        // In a real app, you would update the user profile in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone,
            address,
            city,
            state,
            zip_code: zipCode,
            country,
            bio,
            updated_at: new Date()
          })
          .eq('id', session.user.id)
          
        if (error) {
          throw error
        }
        
        setSuccessMessage('Профиль успешно обновлен!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrorMessage('Произошла ошибка при обновлении профиля.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // In a real app, you would upload the file to Supabase storage
    // For demo purposes, we'll just create a data URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarUrl(reader.result)
    }
    reader.readAsDataURL(file)
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
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Мой профиль</h1>
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      <div className="card p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative h-24 w-24 mb-2">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Аватар пользователя" 
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-neutral-200 flex items-center justify-center">
                <UserCircleIcon className="h-20 w-20 text-neutral-400" />
              </div>
            )}
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white p-2 rounded-full cursor-pointer">
              <CameraIcon className="h-4 w-4" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <p className="text-sm text-neutral-500">Нажмите на иконку камеры, чтобы загрузить фото</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-neutral-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                id="first-name"
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Введите ваше имя"
              />
            </div>
            
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-neutral-700 mb-1">
                Фамилия
              </label>
              <input
                type="text"
                id="last-name"
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Введите вашу фамилию"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Электронная почта
              </label>
              <input
                type="email"
                id="email"
                className="input-field bg-neutral-50"
                value={email}
                disabled
              />
              <p className="mt-1 text-xs text-neutral-500">Электронную почту изменить нельзя</p>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                Номер телефона
              </label>
              <input
                type="tel"
                id="phone"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (XXX) XXX-XXXX"
              />
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Адрес</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                Улица, дом, квартира
              </label>
              <input
                type="text"
                id="address"
                className="input-field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ул. Ленина, 10, кв. 42"
              />
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
                placeholder="Новосибирск"
              />
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                Область / Край
              </label>
              <input
                type="text"
                id="state"
                className="input-field"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Новосибирская область"
              />
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
                placeholder="630099"
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                Страна
              </label>
              <input
                type="text"
                id="country"
                className="input-field"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Россия"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">
              О себе
            </label>
            <textarea
              id="bio"
              rows={4}
              className="input-field"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Расскажите немного о себе, ваших предпочтениях при путешествиях"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
              ) : (
                'Сохранить изменения'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfilePage