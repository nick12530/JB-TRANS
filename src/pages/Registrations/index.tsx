import React, { useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { Download, Filter } from 'lucide-react';

export const RegistrationsPage: React.FC = () => {
  const { packages, user } = useApp();
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default to last 7 days
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter packages by date range
  const filteredPackages = useMemo(() => {
    return packages.filter(p => {
      if (!p.registeredAt) return false;
      const regDate = new Date(p.registeredAt).toISOString().split('T')[0];
      return regDate >= startDate && regDate <= endDate;
    }).sort((a, b) => String(b.registeredAt).localeCompare(String(a.registeredAt)));
  }, [packages, startDate, endDate]);

  // Filter by user role if staff
  const visiblePackages = useMemo(() => {
    if (user?.role === 'admin') return filteredPackages;
    return filteredPackages.filter(p => p.registeredBy === user?.name || p.registeredBy === user?.id);
  }, [filteredPackages, user]);

  // Parse goods quantities from notes
  const parseGoods = (notes?: string) => {
    if (!notes) return { boxes: 0, basins: 0, smallSacks: 0 };
    let boxes = 0, basins = 0, smallSacks = 0;
    for (const part of notes.split('|')) {
      const [k, v] = (part || '').split(':');
      const val = Number(v);
      if (Number.isFinite(val)) {
        if (k === 'boxes') boxes = val;
        if (k === 'basins') basins = val;
        if (k === 'smallSacks') smallSacks = val;
      }
    }
    return { boxes, basins, smallSacks };
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Client Code', 'Tracking Number', 'Brought By', 'Recorded By', 'Station', 'Boxes', 'Basins', 'Small Sacks', 'Total Items'];
    const rows = visiblePackages.map(p => {
      const goods = parseGoods(p.notes);
      const total = goods.boxes + goods.basins + goods.smallSacks;
      const date = p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : '';
      const code = p.trackingNumber?.split('-')[1] || '';
      return [
        date,
        code,
        p.trackingNumber || '',
        p.senderName || '',
        p.registeredBy || '',
        p.station || '',
        String(goods.boxes),
        String(goods.basins),
        String(goods.smallSacks),
        String(total)
      ];
    });
    
    const csv = [headers, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_${startDate}_to_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Aggregate by client code
  const aggregatedByCode = useMemo(() => {
    const map = new Map<string, { code: string; broughtBy: string; boxes: number; basins: number; smallSacks: number; count: number }>();
    visiblePackages.forEach(p => {
      const code = p.trackingNumber?.split('-')[1] || 'N/A';
      const goods = parseGoods(p.notes);
      const existing = map.get(code) || { code, broughtBy: p.senderName || '', boxes: 0, basins: 0, smallSacks: 0, count: 0 };
      existing.boxes += goods.boxes;
      existing.basins += goods.basins;
      existing.smallSacks += goods.smallSacks;
      existing.count += 1;
      if (!existing.broughtBy) existing.broughtBy = p.senderName || '';
      map.set(code, existing);
    });
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [visiblePackages]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Package Registrations</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View detailed records with date filters</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Date Filters */}
      <Card variant="enhanced" padding="lg">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter by Date</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(v) => setStartDate(String(v))}
          />
          <FormInput
            label="End Date"
            type="date"
            value={endDate}
            onChange={(v) => setEndDate(String(v))}
          />
          <div className="flex items-end">
            <Button variant="outline" onClick={() => {
              const today = new Date();
              const weekAgo = new Date();
              weekAgo.setDate(today.getDate() - 7);
              setStartDate(weekAgo.toISOString().split('T')[0]);
              setEndDate(today.toISOString().split('T')[0]);
            }} className="w-full">
              Last 7 Days
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <strong>{visiblePackages.length}</strong> registration{visiblePackages.length !== 1 ? 's' : ''} from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
        </div>
      </Card>

      {/* Aggregated by Client Code */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Summary by Client Code</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Client Code</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Brought By</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Boxes</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Basins</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Small Sacks</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Total Items</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Registrations</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedByCode.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{item.code}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.broughtBy}</td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.boxes}</td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.basins}</td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.smallSacks}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">{item.boxes + item.basins + item.smallSacks}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{item.count}</td>
                </tr>
              ))}
              {aggregatedByCode.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">No registrations found for selected date range</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed Excel-like Table */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Detailed Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Client Code</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Tracking #</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Brought By</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Recorded By</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Station</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Boxes</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Basins</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">Sacks</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Total</th>
              </tr>
            </thead>
            <tbody>
              {visiblePackages.map((p) => {
                const goods = parseGoods(p.notes);
                const total = goods.boxes + goods.basins + goods.smallSacks;
                const date = p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : '';
                const code = p.trackingNumber?.split('-')[1] || '';
                return (
                  <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{date}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-gray-100">{code}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{p.trackingNumber}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{p.senderName}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{p.registeredBy}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{p.station}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-right text-gray-700 dark:text-gray-300">{goods.boxes}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-right text-gray-700 dark:text-gray-300">{goods.basins}</td>
                    <td className="py-2 px-4 border-r border-gray-200 dark:border-gray-700 text-right text-gray-700 dark:text-gray-300">{goods.smallSacks}</td>
                    <td className="py-2 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">{total}</td>
                  </tr>
                );
              })}
              {visiblePackages.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-500 dark:text-gray-400">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

