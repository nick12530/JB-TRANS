import React, { useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { useApp } from '../../context/AppContext';

export const TrackPage: React.FC = () => {
  const { packages } = useApp();
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    if (!q.trim()) return [] as typeof packages;
    const query = q.trim().toLowerCase();
    return packages.filter(p =>
      p.trackingNumber.toLowerCase().includes(query) ||
      p.recipientName.toLowerCase().includes(query) ||
      p.senderName.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [q, packages]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Track Package</h1>
      <Card padding="lg" variant="enhanced">
        <FormInput label="Search by Tracking, Recipient or Sender" value={q} onChange={(v)=>setQ(String(v))} placeholder="e.g. TRK123456" />
        <div className="mt-6 space-y-3">
          {results.map(pkg => (
            <div key={pkg.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{pkg.trackingNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{pkg.recipientName} • {pkg.destination}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pkg.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                  pkg.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                }`}>
                  {pkg.status}
                </span>
              </div>
            </div>
          ))}
          {q && results.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No results</p>
          )}
        </div>
      </Card>
    </div>
  );
}
