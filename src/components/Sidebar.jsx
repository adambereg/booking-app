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
  BellIcon
} from '@heroicons/react/24/outline'

function Sidebar({ userRole }) {
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

  return (
    <div className="w-64 bg-white shadow-sm hidden md:block">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 text-base font-normal text-neutral-900 rounded-lg hover:bg-neutral-100"
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
  )
}

export default Sidebar