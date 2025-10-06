import React from 'react';
import { CreditCard, ClipboardList, MessageCircle, Bell, Building2, Users } from 'lucide-react';

interface IncomeDataItem {
  month: string;
  income: number;
}

interface OccupancyDataItem {
  month: string;
  occupancyRate: number;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: string;
  timestamp: string;
}

interface DashboardOverviewProps {
  overviewData: {
    totalProperties: number;
    activeTenants: number;
    pendingRequests: number;
    monthlyIncome: number;
    incomeData: IncomeDataItem[];
    occupancyData: OccupancyDataItem[];
    recentActivity: ActivityItem[];
  } | null;
  loading: boolean;
  error: string | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ overviewData, loading, error }) => {
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

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

  if (loading && !overviewData)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
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

  const {
    totalProperties = 0,
    activeTenants = 0,
    pendingRequests = 0,
    monthlyIncome = 0,
    incomeData = [],
    occupancyData = [],
    recentActivity = [],
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
              <p className="text-2xl font-semibold text-gray-900">{totalProperties}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{activeTenants}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{pendingRequests}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(monthlyIncome)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 mb-8 lg:grid-cols-2">
        {/* Income Chart */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Rent Income (Last 6 Months)</h3>
          <div className="h-64">
            {incomeData.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-end gap-2">
                  {incomeData.map((item, index) => {
                    const maxIncome = Math.max(...incomeData.map((i) => i.income), 1);
                    const height = (item.income / maxIncome) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 rounded-t"
                          style={{ height: `${height}%`, minHeight: '10px' }}
                        ></div>
                        <div className="mt-2 text-xs text-gray-500">{item.month.split(' ')[0]}</div>
                        <div className="text-xs font-medium text-indigo-600">{formatCurrency(item.income)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No income data available</div>
            )}
          </div>
        </div>

        {/* Occupancy Chart */}
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
                        style={{ height: `${item.occupancyRate}%`, minHeight: '10px' }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">{item.month.split(' ')[0]}</div>
                      <div className="text-xs font-medium text-green-600">{item.occupancyRate}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No occupancy data available</div>
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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      activity.type === 'payment'
                        ? 'bg-green-100'
                        : activity.type === 'request'
                        ? 'bg-yellow-100'
                        : activity.type === 'message'
                        ? 'bg-blue-100'
                        : 'bg-indigo-100'
                    }`}
                  >
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

export default DashboardOverview;
