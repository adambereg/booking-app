import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function DashboardLayout({ userRole }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 bg-neutral-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout