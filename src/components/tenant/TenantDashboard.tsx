import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FileText, Bell, Menu, AlertCircle, DollarSign } from 'lucide-react';
import { Payment, MaintenanceRequest } from '../../types/dashboard';
import { getPayments, getTenantRequests } from '../../services/api';

// --- Subcomponents ---
const TopBar = ({ onMenuClick, userName }: { onMenuClick: () => void; userName: string }) => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <button type="button" className="md:hidden text-gray-500 hover:text-gray-600" onClick={onMenuClick}>
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
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">Tenant</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
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
    red: 'bg-red-100 text-red-600',
  };
  return (
    <motion.div
      className="bg-white overflow-hidden shadow rounded-lg"
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3 rgba(0,0,0,0.1),0 4px 6px -2 rgba(0,0,0,0.05)' }}
    >
      <div className="p-5 flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentsList = ({ payments }: { payments: Payment[] }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Payment History</h3>
    </div>
    <div className="border-t border-gray-200">
      <ul className="divide-y divide-gray-200">
        {payments.map((p) => (
          <li key={p.id} className="px-6 py-4 flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">{p.propertyName}</div>
              <div className="text-sm text-gray-500">{p.description}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">${p.amount.toFixed(2)}</div>
              <div className="text-xs px-2 py-0.5 rounded-full inline-block mt-1 
                ${p.status === 'completed' ? 'bg-green-100 text-green-800' :
                  p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}">
                {p.status}
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
    </div>
    <div className="border-t border-gray-200">
      <ul className="divide-y divide-gray-200">
        {requests.map((r) => (
          <li key={r.id} className="px-6 py-4 flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">{r.title}</div>
              <div className="text-sm text-gray-500">{r.description}</div>
            </div>
            <div className="text-right">
              <div className="text-xs px-2 py-0.5 rounded-full inline-block 
                ${r.status === 'completed' ? 'bg-green-100 text-green-800' :
                  r.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'}">
                {r.status.replace('_', ' ')}
              </div>
              <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- Main TenantDashboard ---
type View = 'dashboard' | 'payments' | 'maintenance' | 'documents';

export const TenantDashboard = () => {
  const { logout, user } = useAuth(); // assuming user.name exists
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch payments and maintenance requests from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, maintenanceData] = await Promise.all([getPayments(), getTenantRequests()]);
        setPayments(paymentsData);
        setMaintenanceRequests(maintenanceData);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Derived metrics ---
  const totalDue = useMemo(() => payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0), [payments]);
  const pendingRequests = useMemo(() => maintenanceRequests.filter(r => r.status === 'open' || r.status === 'in_progress').length, [maintenanceRequests]);

  // --- Sidebar navigation ---
  const navigation: Array<{ name: string; view: View; icon: React.ElementType }> = [
    { name: 'Dashboard', view: 'dashboard', icon: Home },
    { name: 'Payments', view: 'payments', icon: DollarSign },
    { name: 'Maintenance', view: 'maintenance', icon: AlertCircle },
    { name: 'Documents', view: 'documents', icon: FileText },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 bg-indigo-600">
            <span className="text-white text-xl font-semibold">Tenant Portal</span>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center px-6 py-3 text-sm font-medium w-full text-left ${
                  currentView === item.view ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>
          <div className="border-t border-gray-200 mt-auto">
            <button onClick={logout} className="flex items-center px-6 py-3 text-sm font-medium w-full text-left text-red-600 hover:bg-red-50">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} userName={user?.name || 'Tenant'} />
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">{currentView}</h1>
            {currentView === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                  <SummaryCard title="Total Due" value={`$${totalDue.toFixed(2)}`} icon={DollarSign} color="indigo" />
                  <SummaryCard title="Pending Requests" value={`${pendingRequests}`} icon={AlertCircle} color="yellow" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <PaymentsList payments={payments.slice(0, 3)} />
                  <MaintenanceRequestsList requests={maintenanceRequests.slice(0, 3)} />
                </div>
              </>
            )}
            {currentView === 'payments' && <PaymentsList payments={payments} />}
            {currentView === 'maintenance' && <MaintenanceRequestsList requests={maintenanceRequests} />}
            {currentView === 'documents' && <div className="mt-6 p-6 bg-white rounded-lg shadow">Documents view</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
