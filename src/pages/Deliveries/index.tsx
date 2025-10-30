import React, { useMemo } from 'react';
import { Card } from '../../components/Card';
import { useApp } from '../../context/AppContext';

export const DeliveriesPage: React.FC = () => {
  const { user, packages } = useApp();
  const myPkgs = useMemo(() => packages.filter(p => p.recipientPhone === user?.phoneNumber || p.recipientName === user?.name), [packages, user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Deliveries</h1>
      <Card padding="lg" variant="enhanced">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                <th className="py-2 pr-4">Tracking</th>
                <th className="py-2 pr-4">Station</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Registered</th>
              </tr>
            </thead>
            <tbody>
              {myPkgs.map(p => (
                <tr key={p.id} className="border-t border-gray-200 dark:border-gray-700 text-sm">
                  <td className="py-2 pr-4">{p.trackingNumber}</td>
                  <td className="py-2 pr-4">{p.station}</td>
                  <td className="py-2 pr-4 capitalize">{p.status}</td>
                  <td className="py-2 pr-4">{p.registeredAt ? new Date(p.registeredAt).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
              {myPkgs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">No deliveries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
