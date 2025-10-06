import React from 'react';

interface Payment {
  id: string;
  tenantName: string;
  propertyName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface PaymentsViewProps {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ payments, loading, error }) => {
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error) return <p className="p-4 text-red-600 bg-red-100 rounded-lg">Error: {error}</p>;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Payments</h2>
      {payments.length === 0 ? (
        <p className="text-gray-500">No payment records found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.tenantName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.propertyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status}
                    </span>
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

export default PaymentsView;
