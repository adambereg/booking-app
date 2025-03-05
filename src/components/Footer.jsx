import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 tracking-wider uppercase">Поддержка</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Центр помощи
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Информация о безопасности
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Варианты отмены
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Правила проживания
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 tracking-wider uppercase">Сообщество</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Доступность
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Рекомендации
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Подарочные сертификаты
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 tracking-wider uppercase">Арендодателям</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Сдать жильё
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Ответственная аренда
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Центр ресурсов
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 tracking-wider uppercase">О нас</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Новости
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Карьера
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Инвесторам
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base text-neutral-500 hover:text-neutral-900">
                  Условия и конфиденциальность
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-base text-neutral-500 text-center">
            &copy; {new Date().getFullYear()} НовоДом, ООО. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer