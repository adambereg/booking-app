import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { MagnifyingGlassIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline'

function Navbar() {
  const { session, signOut } = useSupabase()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check if we have a demo user
  const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
  const isAuthenticated = session || isDemoMode
  
  // Get user role for conditional rendering
  const getUserRole = () => {
    if (session?.user) {
      const email = session.user.email
      if (email?.includes('admin')) return 'admin'
      if (email?.includes('host')) return 'host'
      return 'guest'
    }
    
    if (isDemoMode) {
      try {
        const userData = JSON.parse(localStorage.getItem('novodom_demo_user'))
        return userData.role || 'guest'
      } catch (e) {
        return 'guest'
      }
    }
    
    return null
  }
  
  const userRole = getUserRole()
  const isHost = userRole === 'host' || userRole === 'admin'

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleSignOut = async () => {
    if (isDemoMode) {
      // Remove demo user from localStorage
      localStorage.removeItem('novodom_demo_user')
      window.location.href = '/'
      return
    }
    
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="НовоДом"
              />
              <span className="ml-2 text-xl font-bold text-primary">НовоДом</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Поиск по районам"
                className="w-64 pl-10 pr-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-500 absolute left-3 top-2.5" />
            </form>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="sr-only">Открыть меню пользователя</span>
                    <UserCircleIcon className="h-8 w-8 text-neutral-700" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-dropdown bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/user/profile"
                            className={`${
                              active ? 'bg-neutral-100' : ''
                            } block px-4 py-2 text-sm text-neutral-700`}
                          >
                            Мой профиль
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/user/bookings"
                            className={`${
                              active ? 'bg-neutral-100' : ''
                            } block px-4 py-2 text-sm text-neutral-700`}
                          >
                            Мои бронирования
                          </Link>
                        )}
                      </Menu.Item>
                      {isHost ? (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/host"
                              className={`${
                                active ? 'bg-neutral-100' : ''
                              } block px-4 py-2 text-sm text-neutral-700`}
                            >
                              Панель арендодателя
                            </Link>
                          )}
                        </Menu.Item>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/user/become-host"
                              className={`${
                                active ? 'bg-neutral-100' : ''
                              } block px-4 py-2 text-sm text-neutral-700`}
                            >
                              Стать арендодателем
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`${
                              active ? 'bg-neutral-100' : ''
                            } block w-full text-left px-4 py-2 text-sm text-neutral-700`}
                          >
                            Выйти
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Открыть меню</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <form onSubmit={handleSearch} className="px-4">
              <input
                type="text"
                placeholder="Поиск по районам"
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-500 absolute left-7 top-[4.25rem]" />
            </form>
          </div>
          <div className="pt-4 pb-3 border-t border-neutral-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/user/profile"
                  className="block px-4 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
                >
                  Мой профиль
                </Link>
                <Link
                  to="/user/bookings"
                  className="block px-4 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
                >
                  Мои бронирования
                </Link>
                {isHost ? (
                  <Link
                    to="/host"
                    className="block px-4 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
                  >
                    Панель арендодателя
                  </Link>
                ) : (
                  <Link
                    to="/user/become-host"
                    className="block px-4 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
                  >
                    Стать арендодателем
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  to="/auth/login"
                  className="block text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/auth/register"
                  className="block bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar