import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { CurrencyDollarIcon, UserGroupIcon, HomeIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline'

function AdminDashboardPage() {
  const { supabase, session } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentProperties, setRecentProperties] = useState([])

  useEffect(() => {
    // In a real app, you would fetch this data from Supabase
    // For now, we'll use mock data
    const mockStats = {
      totalUsers: 1245,
      totalProperties: 876,
      totalBookings: 3254,
      totalRevenue: 245780,
      pendingProperties: 12,
      pendingReviews: 8
    }

    const mockRecentUsers = [
      {
        id: 1,
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        role: 'guest',
        joinedDate: new Date(2025, 4, 15),
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 2,
        name: 'Emily Wilson',
        email: 'emily.wilson@example.com',
        role: 'host',
        joinedDate: new Date(2025, 4, 14),
        image: 'https://randomuser.me/api/portraits/women/26.jpg'
      },
      {
        id: 3,
        name: 'David Chen',
        email: 'david.chen@example.com',
        role: 'guest',
        joinedDate: new Date(2025, 4, 12),
        image: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      {
        id: 4,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'host',
        joinedDate: new Date(2025, 4, 10),
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    ]

    const mockRecentProperties = [
      {
        id: 1,
        title: 'Luxury Beach Villa',
        location: 'Malibu, California',
        owner: 'Sarah Johnson',
        status: 'active',
        createdDate: new Date(2025, 4, 15),
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      },
      {
        id: 2,
        title: 'Modern Downtown Loft',
        location: 'New York, NY',
        owner: 'Emily Wilson',
        status: 'pending',
        createdDate: new Date(2025, 4, 14),
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      },
      {
        id: 3,
        title: 'Cozy Mountain Cabin',
        location: 'Aspen, Colorado',
        owner: 'David Chen',
        status: 'active',
        createdDate: new Date(2025, 4, 12),
        image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      },
      {
        id: 4,
        title: 'Seaside Cottage',
        location: 'Cape Cod, Massachusetts',
        owner: 'Michael Brown',
        status: 'pending',
        createdDate: new Date(2025, 4, 10),
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      }
    ]

    setStats(mockStats);
    setRecentUsers(mockRecentUsers);
    setRecentProperties(mockRecentProperties);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-light bg-opacity-20">
              <UserGroupIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Total Users</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-light bg-opacity-20">
              <HomeIcon className="h-6 w-6 text-secondary" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Properties</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Bookings</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Total Revenue</h2>
              <p className="text-2xl font-bold text-neutral-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <HomeIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Pending Properties</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.pendingProperties}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-neutral-500">Pending Reviews</h2>
              <p className="text-2xl font-bold text-neutral-900">{stats.pendingReviews}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Users */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-neutral-900">Recent Users</h2>
          <Link to="/admin/users" className="text-primary hover:text-primary-dark text-sm font-medium">
            View all
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.image}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'host'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {user.joinedDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    <button className="text-primary hover:text-primary-dark mr-3">
                      View
                    </button>
                    <button className="text-neutral-700 hover:text-neutral-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Properties */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-neutral-900">Recent Properties</h2>
          <Link to="/admin/properties" className="text-primary hover:text-primary-dark text-sm font-medium">
            View all
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recentProperties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={property.image}
                          alt={property.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {property.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{property.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{property.owner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {property.createdDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    <button className="text-primary hover:text-primary-dark mr-3">
                      View
                    </button>
                    {property.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-800 mr-3">
                        Approve
                      </button>
                    )}
                    <button className="text-neutral-700 hover:text-neutral-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage