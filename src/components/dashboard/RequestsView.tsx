import React from 'react';
import { Check, X } from 'lucide-react';
import type { TenantRequest as ApiTenantRequest } from '../../services/api';

interface RequestsViewProps {
  requests: ApiTenantRequest[];
  loading: boolean;
  error: string | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const RequestsView: React.FC<RequestsViewProps> = ({ requests, loading, error, onApprove, onReject }) => {
  const handleApprove = onApprove ?? (() => {});
  const handleReject = onReject ?? (() => {});
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error) return <p className="p-4 text-red-600 bg-red-100 rounded-lg">Error: {error}</p>;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Tenant Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests available.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{req.tenantName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{req.propertyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{req.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(req.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : req.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestsView;
