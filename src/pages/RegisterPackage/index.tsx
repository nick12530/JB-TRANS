import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { Package } from '../../types';

const STATIONS = [
  { id: 'embu', name: 'Embu', min: 1, max: 300 },
  { id: 'ugweri', name: 'Ugweri', min: 301, max: 600 },
  { id: 'meka', name: 'Meka', min: 601, max: 900 },
  { id: 'ena', name: 'Ena', min: 901, max: 1000 },
  { id: 'gachuriri', name: 'Gachuriri', min: 1001, max: 1100 },
] as const;

type StationId = typeof STATIONS[number]['id'];

export const RegisterPackagePage: React.FC = () => {
  const { user, setPackages, packages } = useApp();

  const [station, setStation] = useState<StationId>('embu');
  const [code, setCode] = useState<number>(1);
  const [boxes, setBoxes] = useState<number>(0);
  const [basins, setBasins] = useState<number>(0);
  const [smallSacks, setSmallSacks] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [recordedBy, setRecordedBy] = useState<string>(user?.name || '');
  const [broughtBy, setBroughtBy] = useState<string>('');

  useEffect(() => {
    setRecordedBy(user?.name || '');
  }, [user?.name]);

  const stationMeta = useMemo(() => STATIONS.find(s => s.id === station)!, [station]);
  const codeValid = useMemo(() => code >= stationMeta.min && code <= stationMeta.max, [code, stationMeta]);
  const canSave = codeValid && (boxes > 0 || basins > 0 || smallSacks > 0) && recordedBy.trim().length > 0 && broughtBy.trim().length > 0;

  // Auto-fill next available code
  const nextAvailableCode = useMemo(() => {
    const stationPkgs = packages.filter(p => p.station === stationMeta.name);
    const usedCodes = new Set(stationPkgs.map(p => {
      const tn = String(p.trackingNumber || '');
      const dash = tn.lastIndexOf('-');
      if (dash === -1) return null;
      const codeNum = Number(tn.slice(dash + 1));
      return Number.isFinite(codeNum) ? codeNum : null;
    }).filter(v => v !== null));
    
    for (let c = stationMeta.min; c <= stationMeta.max; c++) {
      if (!usedCodes.has(c)) return c;
    }
    return null;
  }, [stationMeta, packages]);

  const fillNextCode = () => {
    if (nextAvailableCode) setCode(nextAvailableCode);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const newPkg: Package = {
        id: Date.now().toString(),
        trackingNumber: `${stationMeta.name}-${code}`,
        areaCode: String(code),
        senderName: broughtBy || 'Brought By',
        senderPhone: '',
        recipientName: recordedBy || 'Recorded By',
        recipientPhone: '',
        destination: stationMeta.name,
        weight: 0,
        status: 'registered',
        registeredBy: recordedBy || user?.name || 'system',
        registeredAt: new Date().toISOString(),
        station: stationMeta.name,
        notes: `boxes:${boxes}|basins:${basins}|smallSacks:${smallSacks}`,
      };
      setPackages([newPkg, ...packages]);
      setLastSaved(`${stationMeta.name}-${code}`);
      setCode(nextAvailableCode || code);
      setBoxes(0);
      setBasins(0);
      setSmallSacks(0);
      if (!user?.name) setRecordedBy('');
      setBroughtBy('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Register Incoming Goods</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Record incoming packages quickly. Fields adapt to station ranges and prevent duplicates.</p>
      </div>
      <Card padding="lg" variant="enhanced">
        {/* Bigger, stacked fields on phones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-base sm:text-sm">
          <FormSelect
            label="Station"
            value={station}
            onChange={(v)=>setStation(v as StationId)}
            options={STATIONS.map(s=>({ value: s.id, label: `${s.name} (${s.min}-${s.max})` }))}
          />
          <div>
            <div className="flex items-end gap-2">
              <FormInput
                label={`Code (${stationMeta.min}-${stationMeta.max})`}
                type="number"
                value={code}
                onChange={(v)=>setCode(typeof v==='number'? v : Number(v))}
                className="flex-1"
                info={`Use a free code for ${stationMeta.name}.`}
                min={stationMeta.min}
                max={stationMeta.max}
                step={1}
              />
              {nextAvailableCode && (
                <Button variant="outline" size="sm" onClick={fillNextCode} className="mb-0">
                  Auto: {nextAvailableCode}
                </Button>
              )}
            </div>
            {!codeValid && (
              <p className="mt-2 text-xs sm:text-sm text-red-600">Code must be between {stationMeta.min} and {stationMeta.max} for {stationMeta.name}.</p>
            )}
          </div>
          <FormInput
            label="Brought By"
            value={broughtBy}
            onChange={(v)=>setBroughtBy(String(v))}
            placeholder="Person who brought the goods"
            info="Record the person who delivered the goods."
            required
          />

          <FormInput label="Boxes" type="number" value={boxes} onChange={(v)=>setBoxes(typeof v==='number'? v : Number(v))} step={1} min={0} placeholder="0" className="text-base sm:text-sm" />
          <FormInput label="Basins" type="number" value={basins} onChange={(v)=>setBasins(typeof v==='number'? v : Number(v))} step={1} min={0} placeholder="0" className="text-base sm:text-sm" />
          <FormInput label="Small Sacks" type="number" value={smallSacks} onChange={(v)=>setSmallSacks(typeof v==='number'? v : Number(v))} step={1} min={0} placeholder="0" className="text-base sm:text-sm" />

          {/* Recorded By at the end for confirmation before saving */}
          <FormInput
            label="Recorded By"
            value={recordedBy}
            onChange={(v)=>setRecordedBy(String(v))}
            placeholder={user?.name ? user.name : 'Enter your name'}
            info="Confirm your name before saving."
            required
            className="md:col-span-2"
          />
        </div>
        
        {lastSaved && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">✓ Saved successfully: {lastSaved}</p>
          </div>
        )}

        <div className="mt-8 sticky bottom-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur rounded-b-lg -mx-8 px-4 sm:px-8 py-3 sm:py-4 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => {
            setBoxes(0);
            setBasins(0);
            setSmallSacks(0);
            setLastSaved(null);
            setBroughtBy('');
          }} disabled={saving}>
            Clear
          </Button>
          <Button onClick={handleSave} disabled={!canSave || saving} className="min-w-[160px]">
            {saving ? 'Saving...' : 'Save Package'}
          </Button>
        </div>
      </Card>

      {/* Recent packages for this station */}
      <Card padding="lg" variant="enhanced">
        <h2 className="text-lg font-semibold mb-3">Recent Packages - {stationMeta.name}</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {packages.filter(p => p.station === stationMeta.name).slice(0, 10).map(p => {
            const q = p.notes ? p.notes.split('|').reduce((acc, part) => {
              const [k, v] = part.split(':');
              acc[k] = Number(v);
              return acc;
            }, {} as Record<string, number>) : {};
            return (
              <div key={p.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{p.trackingNumber}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{p.recipientName}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {q.boxes || 0} boxes, {q.basins || 0} basins, {q.smallSacks || 0} sacks
                </div>
              </div>
            );
          })}
          {packages.filter(p => p.station === stationMeta.name).length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No packages registered yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}
