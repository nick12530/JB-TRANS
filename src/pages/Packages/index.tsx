import React, { useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';

export const PackagesPage: React.FC = () => {
  const { packages, pickupStations } = useApp();
  const [q, setQ] = useState('');
  const [station, setStation] = useState<string>('all');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return packages.filter(p => {
      const matchQ = !query || p.trackingNumber.toLowerCase().includes(query) || p.recipientName.toLowerCase().includes(query) || p.senderName.toLowerCase().includes(query);
      const matchStation = station === 'all' || p.station === station;
      return matchQ && matchStation;
    });
  }, [packages, q, station]);

  const totals = useMemo(() => {
    let boxes = 0, basins = 0, smallSacks = 0;
    for (const p of filtered) {
      if (!p.notes) continue;
      for (const part of String(p.notes).split('|')) {
        const [k, v] = (part || '').split(':');
        const n = Number(v); const val = Number.isFinite(n) ? n : 0;
        if (k === 'boxes') boxes += val;
        if (k === 'basins') basins += val;
        if (k === 'smallSacks') smallSacks += val;
      }
    }
    return { count: filtered.length, boxes, basins, smallSacks };
  }, [filtered]);

  // Status/actions removed per request

  const exportCSV = () => {
    const rows = [
      ['id','trackingNumber','station','recipientName','destination','registeredAt','boxes','basins','smallSacks']
    ];
    for (const p of filtered) {
      let b=0,bs=0,ss=0;
      if (p.notes) {
        for (const part of String(p.notes).split('|')) {
          const [k, v] = (part || '').split(':');
          const n = Number(v); const val = Number.isFinite(n) ? n : 0;
          if (k === 'boxes') b += val;
          if (k === 'basins') bs += val;
          if (k === 'smallSacks') ss += val;
        }
      }
      rows.push([p.id,p.trackingNumber,p.station,p.recipientName,p.destination,p.registeredAt || '',String(b),String(bs),String(ss)]);
    }
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'packages.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Package Management</h1>
      <Card padding="lg" variant="enhanced">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Search" value={q} onChange={(v)=>setQ(String(v))} placeholder="Tracking, recipient, sender" />
          <FormSelect label="Station" value={station} onChange={(v)=>setStation(String(v))} options={[{value:'all',label:'All Stations'}, ...pickupStations.map(s=>({value:s.name,label:s.name}))]} />
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={exportCSV}>Export CSV</Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">Packages</div>
            <div className="text-xl font-bold">{totals.count}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Boxes</div>
            <div className="text-xl font-bold">{totals.boxes}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Basins</div>
            <div className="text-xl font-bold">{totals.basins}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Small Sacks</div>
            <div className="text-xl font-bold">{totals.smallSacks}</div>
          </div>
        </div>
        {/* Status bulk actions removed */}
      </Card>

      <Card padding="lg" variant="enhanced">
        {/* Mobile stacked list */}
        <div className="md:hidden space-y-2">
          {filtered.map(p => {
            let b=0,bs=0,ss=0;
            if (p.notes) {
              for (const part of String(p.notes).split('|')) {
                const [k, v] = (part || '').split(':');
                const n = Number(v); const val = Number.isFinite(n) ? n : 0;
                if (k === 'boxes') b += val;
                if (k === 'basins') bs += val;
                if (k === 'smallSacks') ss += val;
              }
            }
            return (
              <div key={p.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[70%]">{p.trackingNumber}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.registeredAt || '').toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                </div>
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 truncate">{p.station} • {p.destination}</div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Boxes: <b>{b}</b></span>
                  <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Basins: <b>{bs}</b></span>
                  <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Sacks: <b>{ss}</b></span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No packages</p>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[720px] md:min-w-full text-xs md:text-sm">
            <thead>
              <tr className="text-left text-xs md:text-sm text-gray-600 dark:text-gray-300 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <th className="py-2 pr-4">Tracking</th>
                <th className="py-2 pr-4">Station</th>
                <th className="py-2 pr-4">Recipient</th>
                <th className="py-2 pr-4">Destination</th>
                <th className="py-2 pr-4">Boxes</th>
                <th className="py-2 pr-4">Basins</th>
                <th className="py-2 pr-4">Small Sacks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                let b=0,bs=0,ss=0;
                if (p.notes) {
                  for (const part of String(p.notes).split('|')) {
                    const [k, v] = (part || '').split(':');
                    const n = Number(v); const val = Number.isFinite(n) ? n : 0;
                    if (k === 'boxes') b += val;
                    if (k === 'basins') bs += val;
                    if (k === 'smallSacks') ss += val;
                  }
                }
                return (
                  <tr key={p.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-2 pr-4">{p.trackingNumber}</td>
                    <td className="py-2 pr-4">{p.station}</td>
                    <td className="py-2 pr-4">{p.recipientName}</td>
                    <td className="py-2 pr-4">{p.destination}</td>
                    <td className="py-2 pr-4">{b}</td>
                    <td className="py-2 pr-4">{bs}</td>
                    <td className="py-2 pr-4">{ss}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500 dark:text-gray-400">No packages</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
