import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Building2, 
  Users, 
  ClipboardList, 
  CreditCard, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown,
  Plus,
  Menu,
  X,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  MessageCircle
} from 'lucide-react';
import { dashboardApi } from '../../services/api';

// Types
type DashboardView = 'overview' | 'properties' | 'requests' | 'payments' | 'profile';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  image: string;
}

interface TenantRequest {
  id: string;
  tenant: string;
  property: string;
  status: 'pending' | 'in-progress' | 'resolved';
  date: string;
  description: string;
}

interface Payment {
  id: string;
  tenant: string;
  property: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

const LandlordDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mock data - replace with actual API calls
  const properties: Property[] = [
    { id: '1', title: 'Luxury Apartment', location: '123 Main St', price: 2500, status: 'occupied', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' },
    { id: '2', title: 'Downtown Loft', location: '456 Center Ave', price: 3200, status: 'vacant', image: 'https://images.unsplash.com/photo-1484154218962-a197dfb06b49' },
    { id: '3', title: 'Garden Villa', location: '789 Park Rd', price: 2800, status: 'occupied', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914' },
  ];

  const requests: TenantRequest[] = [
    { id: 'REQ-001', tenant: 'John Doe', property: 'Luxury Apartment', status: 'pending', date: '2023-10-15', description: 'Kitchen sink is leaking' },
    { id: 'REQ-002', tenant: 'Jane Smith', property: 'Garden Villa', status: 'in-progress', date: '2023-10-10', description: 'AC not working' },
  ];

  const payments: Payment[] = [
    { id: 'PAY-001', tenant: 'John Doe', property: 'Luxury Apartment', amount: 2500, date: '2023-10-01', status: 'paid' },
    { id: 'PAY-002', tenant: 'Jane Smith', property: 'Garden Villa', amount: 2800, date: '2023-10-01', status: 'pending' },
  ];

  const navigation = [
    { name: 'Overview', icon: Home, view: 'overview' as const },
    { name: 'Properties', icon: Building2, view: 'properties' as const },
    { name: 'Tenant Requests', icon: Users, view: 'requests' as const },
    { name: 'Payments', icon: CreditCard, view: 'payments' as const },
    { name: 'Profile', icon: Settings, view: 'profile' as const },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'properties':
        return <PropertiesView properties={properties} />;
      case 'requests':
        return <RequestsView requests={requests} />;
      case 'payments':
        return <PaymentsView payments={payments} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileSidebarOpen(false)}></div>
            <div className="relative flex flex-col w-64 bg-white">
              <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-bold text-indigo-600">LandlordPro</h1>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-100">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setCurrentView(item.view);
                      setMobileSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                      currentView === item.view
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 mt-4 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                >
                  <span className="w-5 h-5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  Logout
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 bg-indigo-600">
            <h1 className="text-xl font-bold text-white">LandlordPro</h1>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === item.view
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <span className="w-5 h-5 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="p-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="ml-2 text-lg font-medium text-gray-900 lg:ml-0">
                {navigation.find((item) => item.view === currentView)?.name}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search..."
                />
              </div>
              <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                <span className="sr-only">View notifications</span>
                <div className="relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
              </button>
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 overflow-hidden bg-gray-200 rounded-full">
                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.67 0 8.997 1.701 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <ChevronDown className="hidden ml-2 w-4 h-4 text-gray-500 lg:block" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components
const OverviewView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<{
    totalProperties: number;
    activeTenants: number;
    pendingRequests: number;
    monthlyIncome: number;
    incomeData: Array<{ month: string; income: number }>;
    occupancyData: Array<{ month: string; occupancyRate: number }>;
    recentActivity: Array<{
      id: string;
      title: string;
      description: string;
      timestamp: string | Date;
      type: string;
    }>;
  } | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getLandlordOverview();
        setOverviewData({
          totalProperties: data.totalProperties || 0,
          activeTenants: data.activeTenants || 0,
          pendingRequests: data.pendingRequests || 0,
          monthlyIncome: data.monthlyIncome || 0,
          incomeData: data.incomeData || [],
          occupancyData: data.occupancyData || [],
          recentActivity: data.recentActivity || []
        });
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Format date with time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format date without time
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'request':
        return <ClipboardList className="w-5 h-5 text-yellow-600" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  if (loading && !overviewData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  const { 
    totalProperties = 0, 
    activeTenants = 0, 
    pendingRequests = 0, 
    monthlyIncome = 0,
    incomeData = [],
    occupancyData = [],
    recentActivity = [] 
  } = overviewData || {};


  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalProperties}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Active Tenants</p>
              <p className="text-2xl font-semibold text-gray-900">
                {activeTenants}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ClipboardList className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pendingRequests}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Monthly Income</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(monthlyIncome)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 mb-8 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Rent Income (Last 6 Months)</h3>
          <div className="h-64">
            {incomeData.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-end gap-2">
                  {incomeData.map((item, index) => {
                    const maxIncome = Math.max(...incomeData.map(i => i.income), 1);
                    const height = (item.income / maxIncome) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 rounded-t"
                          style={{
                            height: `${height}%`,
                            minHeight: '10px',
                          }}
                        ></div>
                        <div className="mt-2 text-xs text-gray-500">
                          {item.month.split(' ')[0]}
                        </div>
                        <div className="text-xs font-medium text-indigo-600">
                          {formatCurrency(item.income)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No income data available
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Occupancy Rate</h3>
          <div className="h-64">
            {occupancyData.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-end gap-2">
                  {occupancyData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-100 hover:bg-green-200 transition-colors duration-200 rounded-t"
                        style={{
                          height: `${item.occupancyRate}%`,
                          minHeight: '10px',
                        }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">
                        {item.month.split(' ')[0]}
                      </div>
                      <div className="text-xs font-medium text-green-600">
                        {item.occupancyRate}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No occupancy data available
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    activity.type === 'payment' ? 'bg-green-100' :
                    activity.type === 'request' ? 'bg-yellow-100' :
                    activity.type === 'message' ? 'bg-blue-100' : 'bg-indigo-100'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PropertiesViewProps {
  properties: Property[];
}

const PropertiesView: React.FC<PropertiesViewProps> = ({ properties }) => {
  const [showAddProperty, setShowAddProperty] = useState(false);
  
  return (
    <div>
      <div className="flex flex-col justify-between mb-6 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
        <button
          onClick={() => setShowAddProperty(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property.id} className="overflow-hidden bg-white rounded-lg shadow">
            <div className="h-48 bg-gray-200">
              <img
                src={`${property.image}?id=${property.id}`}
                alt={property.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  property.status === 'occupied' 
                    ? 'bg-green-100 text-green-800' 
                    : property.status === 'maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{property.location}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">${property.price.toLocaleString()}/mo</p>
              <div className="flex justify-between mt-4">
                <button className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Property</h3>
                <button
                  onClick={() => setShowAddProperty(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="property-name" className="block text-sm font-medium text-gray-700">
                      Property Name
                    </label>
                    <input
                      type="text"
                      id="property-name"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Downtown Loft"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="rent-amount" className="block text-sm font-medium text-gray-700">
                        Monthly Rent ($)
                      </label>
                      <input
                        type="number"
                        id="rent-amount"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                        Bedrooms
                      </label>
                      <select
                        id="bedrooms"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {[1, 2, 3, 4, '5+'].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Photo</label>
                    <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddProperty(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Property
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RequestsViewProps {
  requests: TenantRequest[];
}

const RequestsView: React.FC<RequestsViewProps> = ({ requests }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  
  const filteredRequests = statusFilter === 'all' 
    ? requests 
    : requests.filter(req => req.status === statusFilter);
    
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col justify-between mb-6 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tenant Requests</h2>
        <div className="flex items-center mt-4 sm:mt-0">
          <div className="relative">
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  <div className="flex items-center">
                    Request ID
                    <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.tenant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.property}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(request.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button className="text-indigo-600 hover:text-indigo-900">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm text-center text-gray-500">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface PaymentsViewProps {
  payments: Payment[];
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ payments }) => {
  const totalCollected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Rent Payments</h2>
      
      {/* Summary Card */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Total Collected This Month</p>
            <p className="text-2xl font-semibold text-gray-900">${totalCollected.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Payments Table */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {payment.tenant}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {payment.property}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
            <p className="mt-1 text-sm text-gray-500">Update your personal information and contact details.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue="John"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue="Doe"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue="john.doe@example.com"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue="(555) 123-4567"
                  />
                </div>

                {isEditing && (
                  <div className="sm:col-span-6">
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Change Password */}
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
            <p className="mt-1 text-sm text-gray-500">Update your account password.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    name="current-password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bank Details */}
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Bank Account</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your bank account details for rent payments.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 bg-white rounded-lg shadow">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Chase Bank</p>
                  <p className="text-sm text-gray-500">**** **** **** 4242</p>
                </div>
                <button className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Add New Bank Account</h4>
                <p className="mt-1 text-sm text-gray-500">Enter your bank account details below.</p>
                
                <form className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="account-holder" className="block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      id="account-holder"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="account-number"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="routing-number" className="block text-sm font-medium text-gray-700">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        id="routing-number"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="123456789"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="account-type" className="block text-sm font-medium text-gray-700">
                        Account Type
                      </label>
                      <select
                        id="account-type"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option>Checking</option>
                        <option>Savings</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 mt-6 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Bank Account
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
