import React, { useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';

const STATIONS = [
  { name: 'Embu', min: 1, max: 300 },
  { name: 'Ugweri', min: 301, max: 600 },
  { name: 'Meka', min: 601, max: 900 },
  { name: 'Ena', min: 901, max: 1000 },
  { name: 'Gachuriri', min: 1001, max: 1100 },
] as const;

export const ReportsPage: React.FC = () => {
  const { packages } = useApp();
  const [dateQ, setDateQ] = useState(''); // YYYY-MM-DD filter optional

  const filtered = useMemo(() => {
    if (!dateQ) return packages;
    return packages.filter(p => String(p.registeredAt || '').startsWith(dateQ));
  }, [packages, dateQ]);

  const packagingTotals = useMemo(() => {
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

  const perStation = useMemo(() => {
    return STATIONS.map(s => {
      let count = 0, boxes = 0, basins = 0, smallSacks = 0;
      for (const p of filtered) {
        const tn = String(p.trackingNumber || '');
        const dash = tn.lastIndexOf('-');
        if (dash === -1) continue;
        const stationName = tn.slice(0, dash);
        const code = Number(tn.slice(dash + 1));
        if (stationName === s.name && Number.isFinite(code) && code >= s.min && code <= s.max) {
          count += 1;
          if (p.notes) {
            for (const part of String(p.notes).split('|')) {
              const [k, v] = (part || '').split(':');
              const n = Number(v); const val = Number.isFinite(n) ? n : 0;
              if (k === 'boxes') boxes += val;
              if (k === 'basins') basins += val;
              if (k === 'smallSacks') smallSacks += val;
            }
          }
        }
      }
      return { name: s.name, count, boxes, basins, smallSacks };
    });
  }, [filtered]);

  const perDay = useMemo(() => {
    const map = new Map<string, { count: number; boxes: number; basins: number; smallSacks: number }>();
    for (const p of filtered) {
      const day = String(p.registeredAt || '').slice(0,10);
      if (!map.has(day)) map.set(day, { count: 0, boxes: 0, basins: 0, smallSacks: 0 });
      const agg = map.get(day)!;
      agg.count += 1;
      if (p.notes) {
        for (const part of String(p.notes).split('|')) {
          const [k, v] = (part || '').split(':');
          const n = Number(v); const val = Number.isFinite(n) ? n : 0;
          if (k === 'boxes') agg.boxes += val;
          if (k === 'basins') agg.basins += val;
          if (k === 'smallSacks') agg.smallSacks += val;
        }
      }
    }
    return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  }, [filtered]);

  const exportTotalsCSV = () => {
    const rows = [['metric','value'],['packages',String(packagingTotals.count)],['boxes',String(packagingTotals.boxes)],['basins',String(packagingTotals.basins)],['smallSacks',String(packagingTotals.smallSacks)]];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'totals.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const exportPerStationCSV = () => {
    const rows = [['station','packages','boxes','basins','smallSacks'], ...perStation.map(s=>[s.name,String(s.count),String(s.boxes),String(s.basins),String(s.smallSacks)])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'per-station.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const exportPerDayCSV = () => {
    const rows = [['date','packages','boxes','basins','smallSacks'], ...perDay.map(([d,a])=>[d,String(a.count),String(a.boxes),String(a.basins),String(a.smallSacks)])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'per-day.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>

      <Card padding="lg" variant="enhanced">
        <FormInput label="Filter by date" type="date" value={dateQ} onChange={(v)=>setDateQ(String(v))} />
        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">Packages</div>
            <div className="text-xl font-bold">{packagingTotals.count}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Boxes</div>
            <div className="text-xl font-bold">{packagingTotals.boxes}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Basins</div>
            <div className="text-xl font-bold">{packagingTotals.basins}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Small Sacks</div>
            <div className="text-xl font-bold">{packagingTotals.smallSacks}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportTotalsCSV}>Export Totals</Button>
          <Button variant="outline" onClick={exportPerStationCSV}>Export Per Station</Button>
          <Button variant="outline" onClick={exportPerDayCSV}>Export Per Day</Button>
        </div>
      </Card>

      <Card padding="lg" variant="enhanced">
        <h2 className="text-lg font-semibold mb-3">By Station</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {perStation.map(s => (
            <div key={s.name} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Packages</div><div className="text-right font-semibold">{s.count}</div>
                <div className="text-gray-500">Boxes</div><div className="text-right font-semibold">{s.boxes}</div>
                <div className="text-gray-500">Basins</div><div className="text-right font-semibold">{s.basins}</div>
                <div className="text-gray-500">Small Sacks</div><div className="text-right font-semibold">{s.smallSacks}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg" variant="enhanced">
        <h2 className="text-lg font-semibold mb-3">By Day</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Packages</th>
                <th className="py-2 pr-4">Boxes</th>
                <th className="py-2 pr-4">Basins</th>
                <th className="py-2 pr-4">Small Sacks</th>
              </tr>
            </thead>
            <tbody>
              {perDay.map(([day, agg]) => (
                <tr key={day} className="border-t border-gray-200 dark:border-gray-700 text-sm">
                  <td className="py-2 pr-4">{day}</td>
                  <td className="py-2 pr-4">{agg.count}</td>
                  <td className="py-2 pr-4">{agg.boxes}</td>
                  <td className="py-2 pr-4">{agg.basins}</td>
                  <td className="py-2 pr-4">{agg.smallSacks}</td>
                </tr>
              ))}
              {perDay.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
