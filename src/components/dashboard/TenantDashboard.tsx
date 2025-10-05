import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Settings, 
  Bell, 
  Calendar, 
  Heart, 
  HelpCircle,
  Menu,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';
import { Payment, MaintenanceRequest } from '../../types/dashboard';
import { fetchPayments, fetchMaintenanceRequests } from '../../services/api';

// Subcomponents
const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <button
        type="button"
        className="md:hidden text-gray-500 hover:text-gray-600"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <p className="text-xs text-gray-500">Tenant</p>
          </div>
          <img
            className="ml-2 h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
        </div>
      </div>
    </div>
  </header>
);

const SummaryCard = ({ 
  title, 
  value, 
  icon: Icon,
  color = 'indigo'
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
}) => {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <motion.div 
      className="bg-white overflow-hidden shadow rounded-lg"
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentsList = ({ payments }: { payments: Payment[] }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Payment History</h3>
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Make a Payment
      </button>
    </div>
    <div className="border-t border-gray-200">
      <ul className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <li key={payment.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-900">{payment.description}</div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
              <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const MaintenanceRequestsList = ({ requests }: { requests: MaintenanceRequest[] }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Maintenance Requests</h3>
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        New Request
      </button>
    </div>
    <div className="border-t border-gray-200">
      <ul className="divide-y divide-gray-200">
        {requests.map((request) => (
          <li key={request.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.title}</div>
                  <div className="text-sm text-gray-500">{request.description}</div>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    request.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : request.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <div className="text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

type DashboardView = 'dashboard' | 'payments' | 'maintenance' | 'documents' | 'messages' | 'bookings' | 'favorites' | 'profile' | 'help' | 'logout';

export const TenantDashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState({
    payments: true,
    maintenance: true,
  });
  const [error, setError] = useState({
    payments: '',
    maintenance: '',
  });

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsData, maintenanceData] = await Promise.all([
          fetchPayments(),
          fetchMaintenanceRequests(),
        ]);
        setPayments(paymentsData);
        setMaintenanceRequests(maintenanceData);
      } catch (err) {
        setError({
          payments: 'Failed to load payments',
          maintenance: 'Failed to load maintenance requests',
        });
      } finally {
        setLoading({
          payments: false,
          maintenance: false,
        });
      }
    };

    loadData();
  }, []);

  const { logout } = useAuth();

  // Navigation items
  const navigation = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      view: 'dashboard' as const, 
      action: () => setCurrentView('dashboard') 
    },
    { 
      name: 'Payments', 
      icon: DollarSign, 
      view: 'payments' as const, 
      action: () => setCurrentView('payments') 
    },
    { 
      name: 'Maintenance', 
      icon: AlertCircle, 
      view: 'maintenance' as const, 
      action: () => setCurrentView('maintenance') 
    },
    { 
      name: 'Documents', 
      icon: FileText, 
      view: 'documents' as const, 
      action: () => setCurrentView('documents') 
    },
    { 
      name: 'Messages', 
      icon: MessageSquare, 
      view: 'messages' as const, 
      action: () => setCurrentView('messages') 
    },
    { 
      name: 'Bookings', 
      icon: Calendar, 
      view: 'bookings' as const, 
      action: () => setCurrentView('bookings') 
    },
    { 
      name: 'Favorites', 
      icon: Heart, 
      view: 'favorites' as const, 
      action: () => setCurrentView('favorites') 
    },
    { 
      name: 'Profile', 
      icon: Settings, 
      view: 'profile' as const, 
      action: () => setCurrentView('profile') 
    },
    { 
      name: 'Help', 
      icon: HelpCircle, 
      view: 'help' as const, 
      action: () => setCurrentView('help') 
    },
    { 
      name: 'Logout', 
      icon: ({ className }: { className?: string }) => (
        <svg 
          className={className} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
      ), 
      view: 'logout' as const,
      action: logout
    },
  ];

  // Calculate summary metrics
  const totalDue = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingRequests = maintenanceRequests.filter(
    r => r.status === 'open' || r.status === 'in_progress'
  ).length;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'tween', ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg"
            >
              <div className="flex items-center justify-between h-16 px-4 bg-indigo-600">
                <div className="flex items-center">
                  <span className="text-white text-xl font-semibold">Tenant Portal</span>
                </div>
                <button
                  type="button"
                  className="text-white hover:text-gray-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col h-[calc(100%-4rem)]">
                <div className="flex-1">
                  {navigation.slice(0, -1).map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setCurrentView(item.view);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-6 py-3 text-sm font-medium w-full text-left ${
                        currentView === item.view
                          ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-auto">
                  <button
                    onClick={logout}
                    className="flex items-center px-6 py-3 text-sm font-medium w-full text-left text-red-600 hover:bg-red-50"
                  >
                    <svg 
                      className="mr-3 h-5 w-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 bg-indigo-600">
            <span className="text-white text-xl font-semibold">Tenant Portal</span>
          </div>
          <div className="flex flex-col h-full">
            <nav className="flex-1 overflow-y-auto">
              {navigation.slice(0, -1).map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center px-6 py-3 text-sm font-medium w-full text-left ${
                    currentView === item.view
                      ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.name === 'Messages' && (
                    <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="border-t border-gray-200">
              <button
                onClick={logout}
                className="flex items-center px-6 py-3 text-sm font-medium w-full text-left text-red-600 hover:bg-red-50"
              >
                <svg 
                  className="mr-3 h-5 w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                {navigation.find(item => item.view === currentView)?.name || 'Dashboard'}
              </h1>
              
              {currentView === 'dashboard' && (
                <div className="mt-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <SummaryCard 
                      title="Total Due" 
                      value={`$${totalDue.toFixed(2)}`} 
                      icon={DollarSign} 
                      color="indigo"
                    />
                    <SummaryCard 
                      title="Next Payment" 
                      value="Nov 1, 2023" 
                      icon={Calendar} 
                      color="green"
                    />
                    <SummaryCard 
                      title="Maintenance Requests" 
                      value={`${pendingRequests} Pending`} 
                      icon={AlertCircle} 
                      color="yellow"
                    />
                    <SummaryCard 
                      title="Unread Messages" 
                      value="3 New" 
                      icon={MessageSquare} 
                      color="red"
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PaymentsList payments={payments.slice(0, 3)} />
                    <MaintenanceRequestsList requests={maintenanceRequests.slice(0, 3)} />
                  </div>
                </div>
              )}

              {currentView === 'payments' && (
                <div className="mt-6">
                  <PaymentsList payments={payments} />
                </div>
              )}

              {currentView === 'maintenance' && (
                <div className="mt-6">
                  <MaintenanceRequestsList requests={maintenanceRequests} />
                </div>
              )}

              {currentView === 'documents' && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900">Documents</h2>
                  <p className="mt-2 text-gray-600">Your lease documents will appear here.</p>
                </div>
              )}

              {/* Add other views as needed */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
