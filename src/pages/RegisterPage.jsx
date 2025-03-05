import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'

function RegisterPage() {
  const { signUp } = useSupabase()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов')
      return
    }
    
    setIsLoading(true)

    try {
      const { error } = await signUp({ email, password })
      
      if (error) throw error
      
      // For demo purposes, we'll automatically sign in the user
      // In a real app with email confirmation, you would show a message to check email
      setSuccessMessage('Регистрация успешна! Теперь вы можете войти в систему.')
      setTimeout(() => {
        navigate('/auth/login')
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error.message)
      setError(error.message || 'Произошла ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
        Создание аккаунта
      </h2>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Или{' '}
        <Link to="/auth/login" className="font-medium text-primary hover:text-primary-dark">
          войдите в существующий аккаунт
        </Link>
      </p>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Электронная почта
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Пароль
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Должен содержать не менее 8 символов
          </p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700">
            Подтверждение пароля
          </label>
          <div className="mt-1">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
            Я согласен с{' '}
            <Link to="#" className="font-medium text-primary hover:text-primary-dark">
              Условиями использования
            </Link>{' '}
            и{' '}
            <Link to="#" className="font-medium text-primary hover:text-primary-dark">
              Политикой конфиденциальности
            </Link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full btn-primary py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Создание аккаунта...
              </span>
            ) : (
              'Создать аккаунт'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage