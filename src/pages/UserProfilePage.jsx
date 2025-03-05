import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline'
import { v4 as uuidv4 } from 'uuid'

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
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)

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
          setFirstName(demoUserData.firstName || 'Иван')
          setLastName(demoUserData.lastName || 'Петров')
          setPhone(demoUserData.phone || '+7 (999) 123-4567')
          setCity(demoUserData.city || 'Новосибирск')
          setState(demoUserData.state || 'Новосибирская область')
          setCountry(demoUserData.country || 'Россия')
          setBio(demoUserData.bio || 'Люблю путешествовать и открывать новые места. Предпочитаю комфортное жилье в центре города.')
          setAvatarUrl(demoUserData.avatarUrl || '')
        } else if (session) {
          setEmail(session.user.email)
          
          // Fetch profile data from Supabase
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (profileError) {
            if (profileError.code === 'PGRST116') {
              // Profile doesn't exist, create it
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                  { 
                    id: session.user.id,
                    email: session.user.email,
                    created_at: new Date()
                  }
                ])
              if (insertError) throw insertError
            } else {
              throw profileError
            }
          } else if (profile) {
            setFirstName(profile.first_name || '')
            setLastName(profile.last_name || '')
            setPhone(profile.phone || '')
            setCity(profile.city || '')
            setState(profile.state || '')
            setCountry(profile.country || '')
            setBio(profile.bio || '')
            
            // Get avatar URL if exists
            if (profile.avatar_url) {
              const { data: { publicUrl } } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(profile.avatar_url)
              setAvatarUrl(publicUrl)
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setErrorMessage('Ошибка при загрузке профиля')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserProfile()
  }, [session, supabase])

  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${session.user.id}-${uuidv4()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return { fileName, publicUrl }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')
    
    try {
      const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
      
      if (isDemoMode) {
        const demoUserData = JSON.parse(localStorage.getItem('novodom_demo_user'))
        const updatedDemoUser = {
          ...demoUserData,
          firstName,
          lastName,
          phone,
          city,
          state,
          country,
          bio,
          avatarUrl
        }
        localStorage.setItem('novodom_demo_user', JSON.stringify(updatedDemoUser))
        
        setTimeout(() => {
          setSuccessMessage('Профиль успешно обновлен!')
          setIsSaving(false)
        }, 1000)
      } else if (session) {
        let newAvatarUrl = null

        // Upload new avatar if selected
        if (avatarFile) {
          const { fileName, publicUrl } = await uploadAvatar(avatarFile)
          newAvatarUrl = fileName
          setAvatarUrl(publicUrl)
          setAvatarFile(null)
        }

        // Update profile in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone,
            city,
            state,
            country,
            bio,
            avatar_url: newAvatarUrl || undefined,
            updated_at: new Date()
          })
          .eq('id', session.user.id)
          
        if (error) throw error
        
        setSuccessMessage('Профиль успешно обновлен!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrorMessage('Произошла ошибка при обновлении профиля')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Пожалуйста, выберите изображение в формате JPEG, PNG или GIF')
      return
    }

    if (file.size > maxSize) {
      setErrorMessage('Размер файла не должен превышать 5MB')
      return
    }

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result)
      }
      reader.readAsDataURL(file)
      
      // Store file for later upload
      setAvatarFile(file)
      setErrorMessage('')
    } catch (error) {
      console.error('Error handling avatar:', error)
      setErrorMessage('Ошибка при обработке изображения')
    }
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
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                disabled
              />
              <p className="text-sm text-neutral-500 mt-1">Электронную почту изменить нельзя</p>
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
                placeholder="+7 (999) 123-4567"
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
                placeholder="Введите страну"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                Область/Край
              </label>
              <input
                type="text"
                id="state"
                className="input-field"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Введите область или край"
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
                placeholder="Введите город"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">
              О себе
            </label>
            <textarea
              id="bio"
              className="input-field min-h-[100px]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Расскажите немного о себе..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfilePage