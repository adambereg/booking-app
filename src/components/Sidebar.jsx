import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  CogIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  HeartIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

function Sidebar({ userRole, isMobile, isOpen, onClose }) {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  const guestLinks = [
    { name: 'Профиль', href: '/user/profile', icon: UserIcon },
    { name: 'Мои бронирования', href: '/user/bookings', icon: CalendarIcon },
    { name: 'Список желаний', href: '/user/wishlist', icon: HeartIcon },
    { name: 'Уведомления', href: '/user/notifications', icon: BellIcon },
  ]

  const hostLinks = [
    { name: 'Панель управления', href: '/host', icon: ChartBarIcon },
    { name: 'Мои объекты', href: '/host/properties', icon: BuildingOfficeIcon },
    { name: 'Бронирования', href: '/host/bookings', icon: CalendarIcon },
    { name: 'Календарь', href: '/host/calendar', icon: CalendarIcon },
  ]

  const adminLinks = [
    { name: 'Панель управления', href: '/admin', icon: ChartBarIcon },
    { name: 'Пользователи', href: '/admin/users', icon: UsersIcon },
    { name: 'Объекты', href: '/admin/properties', icon: BuildingOfficeIcon },
    { name: 'Бронирования', href: '/admin/bookings', icon: CalendarIcon },
    { name: 'Платежи', href: '/admin/payments', icon: CurrencyDollarIcon },
    { name: 'Настройки', href: '/admin/settings', icon: CogIcon },
  ]

  let links = guestLinks
  
  if (userRole === 'host') {
    links = [...guestLinks, ...hostLinks]
  } else if (userRole === 'admin') {
    links = [...guestLinks, ...hostLinks, ...adminLinks]
  }

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`
    : 'w-64 bg-white shadow-sm hidden md:block'

  const overlayClasses = isMobile && isOpen
    ? 'fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out'
    : 'hidden'

  return (
    <>
      {isMobile && <div className={overlayClasses} onClick={onClose} />}
      <div className={sidebarClasses}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          {isMobile && (
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          )}
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 text-base font-normal text-neutral-900 rounded-lg hover:bg-neutral-100"
                onClick={isMobile ? onClose : undefined}
              >
                <HomeIcon className="w-6 h-6 text-neutral-500" />
                <span className="ml-3">Главная</span>
              </Link>
            </li>
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={`flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive(link.href)
                      ? 'bg-primary text-white'
                      : 'text-neutral-900 hover:bg-neutral-100'
                  }`}
                  onClick={isMobile ? onClose : undefined}
                >
                  <link.icon className={`w-6 h-6 ${
                    isActive(link.href) ? 'text-white' : 'text-neutral-500'
                  }`} />
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar