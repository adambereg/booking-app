import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { CheckIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline'

function BecomeHostPage() {
  const { supabase, session } = useSupabase()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form fields
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [hasProperty, setHasProperty] = useState(null)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      alert('Пожалуйста, примите условия, чтобы продолжить')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Check if we have a demo user
      const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
      
      if (isDemoMode) {
        // Update demo user role in localStorage
        const demoUserData = JSON.parse(localStorage.getItem('novodom_demo_user'))
        const updatedDemoUser = {
          ...demoUserData,
          role: 'host'
        }
        localStorage.setItem('novodom_demo_user', JSON.stringify(updatedDemoUser))
        
        // Simulate a delay for the operation
        setTimeout(() => {
          setIsSubmitting(false)
          
          // Redirect to host dashboard
          navigate('/host')
          
          // Force page reload to update the UI
          window.location.reload()
        }, 1500)
      } else if (session) {
        // In a real app, you would update the user role in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            is_host: true,
            updated_at: new Date()
          })
          .eq('id', session.user.id)
          
        if (error) {
          throw error
        }
        
        // Redirect to host dashboard
        navigate('/host')
      }
    } catch (error) {
      console.error('Error becoming a host:', error)
      alert('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Станьте арендодателем на НовоДом</h1>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Преимущества размещения на НовоДом</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary-light bg-opacity-20 p-4 rounded-full mb-4">
              <HomeIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Полный контроль</h3>
            <p className="text-neutral-700">Вы сами устанавливаете цены, правила проживания и доступность вашего жилья</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary-light bg-opacity-20 p-4 rounded-full mb-4">
              <CurrencyDollarIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Дополнительный доход</h3>
            <p className="text-neutral-700">Зарабатывайте на своей недвижимости, сдавая её в краткосрочную аренду</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary-light bg-opacity-20 p-4 rounded-full mb-4">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Гибкий график</h3>
            <p className="text-neutral-700">Сдавайте жильё когда вам удобно, блокируйте даты при необходимости</p>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 pt-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Как это работает</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                <span className="text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Создайте объявление</h4>
                <p className="text-neutral-700">Добавьте описание, фотографии и укажите особенности вашего жилья</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                <span className="text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Принимайте бронирования</h4>
                <p className="text-neutral-700">Подтверждайте запросы на бронирование от гостей</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                <span className="text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Принимайте гостей</h4>
                <p className="text-neutral-700">Встречайте гостей и обеспечивайте им комфортное проживание</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                <span className="text-sm font-medium">4</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Получайте оплату</h4>
                <p className="text-neutral-700">Деньги поступают на ваш счёт после заезда гостей</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Начните сдавать жильё</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                У вас уже есть недвижимость, которую вы хотите сдавать?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    hasProperty === true
                      ? 'bg-primary text-white'
                      : 'bg-white text-neutral-700 border border-neutral-300'
                  }`}
                  onClick={() => setHasProperty(true)}
                >
                  Да
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    hasProperty === false
                      ? 'bg-primary text-white'
                      : 'bg-white text-neutral-700 border border-neutral-300'
                  }`}
                  onClick={() => setHasProperty(false)}
                >
                  Нет
                </button>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-neutral-700">
                  Я принимаю <a href="#" className="text-primary hover:text-primary-dark">условия использования</a> и <a href="#" className="text-primary hover:text-primary-dark">политику конфиденциальности</a>
                </label>
                <p className="text-neutral-500">
                  Я соглашаюсь с правилами размещения объявлений и обязуюсь предоставлять достоверную информацию о своём жилье.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !acceptTerms}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Обработка...
                </span>
              ) : (
                'Стать арендодателем'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BecomeHostPage