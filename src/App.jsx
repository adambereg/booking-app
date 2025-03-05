import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSupabase } from './contexts/SupabaseContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import PropertyReviewsPage from './pages/PropertyReviewsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingPage from './pages/BookingPage'
import UserProfilePage from './pages/UserProfilePage'
import UserBookingsPage from './pages/UserBookingsPage'
import WishlistPage from './pages/WishlistPage'
import NotificationsPage from './pages/NotificationsPage'
import HostDashboardPage from './pages/HostDashboardPage'
import HostPropertiesPage from './pages/HostPropertiesPage'
import HostBookingsPage from './pages/HostBookingsPage'
import HostCalendarPage from './pages/HostCalendarPage'
import AddPropertyPage from './pages/AddPropertyPage'
import EditPropertyPage from './pages/EditPropertyPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import BecomeHostPage from './pages/BecomeHostPage'

function App() {
  const { session, isLoading } = useSupabase()
  const [userRole, setUserRole] = useState(null)
  
  useEffect(() => {
    if (session?.user) {
      // In a real app, you would fetch the user role from your database
      // For now, we'll simulate this
      const fetchUserRole = async () => {
        // This would be a real API call in production
        // For demo purposes, we'll just set a role based on the email
        const email = session.user.email
        if (email?.includes('admin')) {
          setUserRole('admin')
        } else if (email?.includes('host')) {
          setUserRole('host')
        } else {
          setUserRole('guest')
        }
      }
      
      fetchUserRole()
    } else {
      // Check for demo user
      const demoUser = localStorage.getItem('novodom_demo_user')
      if (demoUser) {
        try {
          const userData = JSON.parse(demoUser)
          setUserRole(userData.role || 'guest')
        } catch (e) {
          setUserRole(null)
          localStorage.removeItem('novodom_demo_user')
        }
      } else {
        setUserRole(null)
      }
    }
  }, [session])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check if we have a demo user
  const isDemoMode = !session && localStorage.getItem('novodom_demo_user')
  const isAuthenticated = session || isDemoMode

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="properties/:id" element={<PropertyDetailsPage />} />
        <Route path="properties/:id/reviews" element={<PropertyReviewsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
      </Route>

      {/* Protected user routes */}
      <Route 
        path="/user" 
        element={
          isAuthenticated ? <DashboardLayout userRole={userRole} /> : <Navigate to="/auth/login" />
        }
      >
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="bookings" element={<UserBookingsPage />} />
        <Route path="booking/:propertyId" element={<BookingPage />} />
        <Route path="become-host" element={<BecomeHostPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Host routes */}
      <Route 
        path="/host" 
        element={
          isAuthenticated && (userRole === 'host' || userRole === 'admin') 
            ? <DashboardLayout userRole={userRole} /> 
            : isAuthenticated 
              ? <Navigate to="/user/become-host" />
              : <Navigate to="/auth/login" />
        }
      >
        <Route index element={<HostDashboardPage />} />
        <Route path="properties" element={<HostPropertiesPage />} />
        <Route path="properties/add" element={<AddPropertyPage />} />
        <Route path="properties/edit/:id" element={<EditPropertyPage />} />
        <Route path="bookings" element={<HostBookingsPage />} />
        <Route path="calendar" element={<HostCalendarPage />} />
      </Route>

      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          isAuthenticated && userRole === 'admin' 
            ? <DashboardLayout userRole={userRole} /> 
            : <Navigate to="/auth/login" />
        }
      >
        <Route index element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App