import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'

function LoginPage() {
  const { signIn } = useSupabase()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signIn({ email, password })
      
      if (error) throw error
      
      navigate('/')
    } catch (error) {
      console.error('Login error:', error.message)
      setError(error.message || 'Произошла ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes, let's add a function to simulate login
  const handleDemoLogin = (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    // Simulate successful login after a short delay
    setTimeout(() => {
      // Create a fake session in localStorage to simulate login
      localStorage.setItem('novodom_demo_user', JSON.stringify({
        email: email || 'demo@example.com',
        role: email?.includes('host') ? 'host' : 'guest'
      }))
      
      setIsLoading(false)
      navigate('/')
      // Force page reload to update the UI
      window.location.reload()
    }, 1000)
  }

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
        Вход в аккаунт
      </h2>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Или{' '}
        <Link to="/auth/register" className="font-medium text-primary hover:text-primary-dark">
          создайте новый аккаунт
        </Link>
      </p>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
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
              placeholder="Например: user@example.com"
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
              autoComplete="current-password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
              Запомнить меня
            </label>
          </div>

          <div className="text-sm">
            <Link to="#" className="font-medium text-primary hover:text-primary-dark">
              Забыли пароль?
            </Link>
          </div>
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
                Вход...
              </span>
            ) : (
              'Войти'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Или продолжить с демо-аккаунтом</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleDemoLogin}
            className="w-full flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Демо-режим (без регистрации)
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage