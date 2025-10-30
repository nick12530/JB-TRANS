import React, { useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';

const STATION_RANGES: Record<string, { min: number; max: number }> = {
  Embu: { min: 1, max: 300 },
  Ugweri: { min: 301, max: 600 },
  Meka: { min: 601, max: 900 },
  Ena: { min: 901, max: 1000 },
  Gachuriri: { min: 1001, max: 1100 },
};

export const StationsPage: React.FC = () => {
  const { pickupStations, packages } = useApp();
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'boxes'>('name');
  const [dateFilter, setDateFilter] = useState('');

  const stationPackages = useMemo(() => {
    const map: Record<string, typeof packages> = {};
    for (const s of pickupStations) map[s.name] = [];
    for (const p of packages) {
      if (!map[p.station]) map[p.station] = [] as any;
      map[p.station].push(p);
    }
    return map;
  }, [pickupStations, packages]);

  const parseQuantities = (notes?: string) => {
    let boxes = 0, basins = 0, smallSacks = 0;
    if (notes) {
      for (const part of String(notes).split('|')) {
        const [k, v] = (part || '').split(':');
        const n = Number(v); const val = Number.isFinite(n) ? n : 0;
        if (k === 'boxes') boxes += val;
        if (k === 'basins') basins += val;
        if (k === 'smallSacks') smallSacks += val;
      }
    }
    return { boxes, basins, smallSacks };
  };

  const nextCodeFor = (name: string) => {
    const range = STATION_RANGES[name as keyof typeof STATION_RANGES];
    if (!range) return undefined;
    const used = new Set<number>();
    for (const p of stationPackages[name] || []) {
      const tn = String(p.trackingNumber || '');
      const dash = tn.lastIndexOf('-');
      if (dash === -1) continue;
      const stationName = tn.slice(0, dash);
      const code = Number(tn.slice(dash + 1));
      if (stationName === name && Number.isFinite(code) && code >= range.min && code <= range.max) used.add(code);
    }
    for (let c = range.min; c <= range.max; c++) {
      if (!used.has(c)) return c;
    }
    return undefined;
  };

  const exportStationCSV = (name: string) => {
    const rows = [['id','trackingNumber','recipientName','registeredAt','boxes','basins','smallSacks']];
    for (const p of (stationPackages[name] || [])) {
      const q = parseQuantities(p.notes);
      rows.push([p.id, p.trackingNumber, p.recipientName, p.registeredAt || '', String(q.boxes), String(q.basins), String(q.smallSacks)]);
    }
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${name}-packages.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const totalsFor = (name: string) => {
    const list = stationPackages[name] || [];
    let boxes = 0, basins = 0, smallSacks = 0;
    for (const p of list) {
      const q = parseQuantities(p.notes);
      boxes += q.boxes; basins += q.basins; smallSacks += q.smallSacks;
    }
    return { count: list.length, boxes, basins, smallSacks };
  };

  const stations = useMemo(() => {
    let result = [...pickupStations];
    const query = q.trim().toLowerCase();
    if (query) {
      result = result.filter(s => s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query));
    }
    
    // Apply date filter to packages
    if (dateFilter) {
      const packagesForDate = packages.filter(p => String(p.registeredAt || '').startsWith(dateFilter));
      const hasDataOnDate = new Set(packagesForDate.map(p => p.station));
      result = result.filter(s => hasDataOnDate.has(s.name));
    }
    
    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'count') {
      result.sort((a, b) => (stationPackages[b.name]?.length || 0) - (stationPackages[a.name]?.length || 0));
    } else if (sortBy === 'boxes') {
      result.sort((a, b) => totalsFor(b.name).boxes - totalsFor(a.name).boxes);
    }
    
    return result;
  }, [pickupStations, q, dateFilter, sortBy, packages, stationPackages]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pickup Stations</h1>
      <Card padding="lg" variant="enhanced">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Search stations" value={q} onChange={(v)=>setQ(String(v))} placeholder="Name or location" />
          <FormInput label="Filter by date" type="date" value={dateFilter} onChange={(v)=>setDateFilter(String(v))} />
          <FormSelect label="Sort by" value={sortBy} onChange={(v)=>setSortBy(v as any)} options={[
            { value: 'name', label: 'Name' },
            { value: 'count', label: 'Package Count' },
            { value: 'boxes', label: 'Total Boxes' },
          ]} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map(st => {
          const t = totalsFor(st.name);
          const recent = (stationPackages[st.name] || []).slice().sort((a,b)=>String(b.registeredAt).localeCompare(String(a.registeredAt))).slice(0,5);
          const nextCode = nextCodeFor(st.name);
          return (
            <Card key={st.id} padding="lg" variant="enhanced">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{st.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{st.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                  <div className="font-semibold">{st.status}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500">Packages</div>
                  <div className="text-xl font-bold">{t.count}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Boxes</div>
                  <div className="text-xl font-bold">{t.boxes}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Basins</div>
                  <div className="text-xl font-bold">{t.basins}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Small Sacks</div>
                  <div className="text-xl font-bold">{t.smallSacks}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Next Code</div>
                  <div className="text-xl font-bold">{nextCode ?? 'Full'}</div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={()=>exportStationCSV(st.name)}>Export CSV</Button>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Recent Packages</div>
                <div className="space-y-2">
                  {recent.map(p => (
                    <div key={p.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{p.trackingNumber}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{p.recipientName}</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">{p.registeredAt ? new Date(p.registeredAt).toLocaleString() : 'N/A'}</div>
                    </div>
                  ))}
                  {recent.length === 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No recent packages</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {stations.length === 0 && (
          <Card padding="lg" variant="enhanced"><p className="text-center text-gray-500 dark:text-gray-400">No stations</p></Card>
        )}
      </div>
    </div>
  );
}
