import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, TenantRequest, Payment, getProperties } from '../../services/api';

import DashboardOverview from './DashboardOverview';
import PropertiesView from './PropertiesView';
import RequestsView from './RequestsView';
import PaymentsView from './PaymentsView';
import ProfileView from './ProfileView';
import { Home, Building2, Users, CreditCard, Settings, Menu, Bell, Search } from 'lucide-react';

const LandlordDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'requests' | 'payments' | 'profile'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<TenantRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const props = await getProperties();
        setProperties(props);
        // Backend doesn't expose /dashboard/payments or /dashboard/tenant-requests yet
        setRequests([]);
        setPayments([]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute dashboard stats
  const overviewData = {
    totalProperties: properties.length,
    activeTenants: requests.length, // adjust if you have active tenants count
    pendingRequests: requests.length,
    monthlyIncome: payments.reduce((sum, p) => sum + p.amount, 0),
    incomeData: [], // optional, implement later
    occupancyData: [], // optional, implement later
    recentActivity: [], // optional, implement later
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r bg-white">
        <div className="h-16 flex items-center px-6 bg-indigo-600 text-white text-xl font-semibold">
          LandlordPro
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { key: 'overview', name: 'Overview', icon: Home },
            { key: 'properties', name: 'Properties', icon: Building2 },
            { key: 'requests', name: 'Requests', icon: Users },
            { key: 'payments', name: 'Payments', icon: CreditCard },
            { key: 'profile', name: 'Profile', icon: Settings },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`w-full flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === item.key
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t text-xs text-gray-500">© {new Date().getFullYear()} LandlordPro</div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded hover:bg-gray-100">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-gray-100 rounded px-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                className="bg-transparent px-2 py-1 text-sm outline-none"
                placeholder="Search..."
              />
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'overview' && (
            <DashboardOverview overviewData={overviewData} loading={loading} error={error} />
          )}
          {activeTab === 'properties' && (
            <PropertiesView
              properties={properties}
              loading={loading}
              error={error}
              onAddProperty={() => navigate('/properties/new')}
              onEditProperty={(id: string) => navigate(`/properties/${id}/edit`)}
            />
          )}
          {activeTab === 'requests' && (
            <RequestsView requests={requests} loading={loading} error={error} />
          )}
          {activeTab === 'payments' && (
            <PaymentsView payments={payments} loading={loading} error={error} />
          )}
          {activeTab === 'profile' && (
            <ProfileView
              name="John Doe"
              email="john@example.com"
              onUpdateProfile={(data) => console.log('Profile updated', data)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default LandlordDashboard;
