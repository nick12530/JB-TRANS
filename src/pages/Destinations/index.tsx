import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { useApp } from '../../context/AppContext';
import { DestinationRecord } from '../../types';
import { MapPin, Plus, Calendar, Trash2, Settings, BarChart3, Edit2, X } from 'lucide-react';

export const DestinationsPage: React.FC = () => {
  const { destinationRecords, setDestinationRecords, destinations, setDestinations, user } = useApp();
  const isAdmin = user?.role === 'admin';
  
  // Record form state
  const [form, setForm] = useState<{
    date: string;
    destination: string;
    boxes: number;
    smallSacks: number;
    basins: number;
  }>({
    date: new Date().toISOString().split('T')[0],
    destination: '',
    boxes: 0,
    smallSacks: 0,
    basins: 0,
  });
  const [formErrors, setFormErrors] = useState<{
    date?: string;
    destination?: string;
    boxes?: string;
    smallSacks?: string;
    basins?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filter state
  const [filterDate, setFilterDate] = useState('');
  const [filterDestination, setFilterDestination] = useState('all');
  const [statsDateRange, setStatsDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Destination management state (admin only)
  const [newDestination, setNewDestination] = useState('');
  const [editingDestination, setEditingDestination] = useState<string | null>(null);
  const [editDestinationValue, setEditDestinationValue] = useState('');

  const filtered = useMemo(() => {
    return destinationRecords.filter(record => {
      const matchDate = !filterDate || record.date === filterDate;
      const matchDestination = filterDestination === 'all' || record.destination === filterDestination;
      return matchDate && matchDestination;
    });
  }, [destinationRecords, filterDate, filterDestination]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, record) => ({
        boxes: acc.boxes + record.boxes,
        smallSacks: acc.smallSacks + record.smallSacks,
        basins: acc.basins + record.basins,
      }),
      { boxes: 0, smallSacks: 0, basins: 0 }
    );
  }, [filtered]);

  // Admin stats calculations
  const statsData = useMemo(() => {
    const rangeRecords = destinationRecords.filter(r => {
      if (!statsDateRange.start || !statsDateRange.end) return true;
      return r.date >= statsDateRange.start && r.date <= statsDateRange.end;
    });

    const byDestination: Record<string, { boxes: number; smallSacks: number; basins: number; count: number }> = {};
    const byDate: Record<string, { boxes: number; smallSacks: number; basins: number; count: number }> = {};
    
    rangeRecords.forEach(record => {
      // By destination
      if (!byDestination[record.destination]) {
        byDestination[record.destination] = { boxes: 0, smallSacks: 0, basins: 0, count: 0 };
      }
      byDestination[record.destination].boxes += record.boxes;
      byDestination[record.destination].smallSacks += record.smallSacks;
      byDestination[record.destination].basins += record.basins;
      byDestination[record.destination].count += 1;

      // By date
      if (!byDate[record.date]) {
        byDate[record.date] = { boxes: 0, smallSacks: 0, basins: 0, count: 0 };
      }
      byDate[record.date].boxes += record.boxes;
      byDate[record.date].smallSacks += record.smallSacks;
      byDate[record.date].basins += record.basins;
      byDate[record.date].count += 1;
    });

    const totalStats = rangeRecords.reduce(
      (acc, r) => ({
        boxes: acc.boxes + r.boxes,
        smallSacks: acc.smallSacks + r.smallSacks,
        basins: acc.basins + r.basins,
        count: acc.count + 1,
      }),
      { boxes: 0, smallSacks: 0, basins: 0, count: 0 }
    );

    const topDestinations = Object.entries(byDestination)
      .map(([dest, stats]) => ({
        destination: dest,
        ...stats,
        total: stats.boxes + stats.smallSacks + stats.basins,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const recentDates = Object.entries(byDate)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7)
      .map(([date, stats]) => ({ date, ...stats, total: stats.boxes + stats.smallSacks + stats.basins }));

    return {
      total: totalStats,
      byDestination,
      topDestinations,
      recentDates,
      averagePerDay: rangeRecords.length > 0 ? {
        boxes: Math.round(totalStats.boxes / Math.max(1, Object.keys(byDate).length)),
        smallSacks: Math.round(totalStats.smallSacks / Math.max(1, Object.keys(byDate).length)),
        basins: Math.round(totalStats.basins / Math.max(1, Object.keys(byDate).length)),
      } : { boxes: 0, smallSacks: 0, basins: 0 },
    };
  }, [destinationRecords, statsDateRange]);

  const addRecord = () => {
    setSuccessMessage('');
    setFormErrors({});

    const errors: typeof formErrors = {};

    if (!form.date) {
      errors.date = 'Date is required';
    }

    if (!form.destination) {
      errors.destination = 'Destination is required';
    }

    if (form.boxes < 0) {
      errors.boxes = 'Boxes cannot be negative';
    }

    if (form.smallSacks < 0) {
      errors.smallSacks = 'Small sacks cannot be negative';
    }

    if (form.basins < 0) {
      errors.basins = 'Basins cannot be negative';
    }

    if (form.boxes === 0 && form.smallSacks === 0 && form.basins === 0) {
      errors.boxes = 'At least one quantity must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newRecord: DestinationRecord = {
      id: Date.now().toString(),
      date: form.date,
      destination: form.destination,
      boxes: form.boxes,
      smallSacks: form.smallSacks,
      basins: form.basins,
      createdAt: new Date().toISOString(),
      createdBy: user?.name,
    };

    setDestinationRecords([newRecord, ...destinationRecords]);
    setForm({
      date: new Date().toISOString().split('T')[0],
      destination: '',
      boxes: 0,
      smallSacks: 0,
      basins: 0,
    });
    setSuccessMessage(`Record for ${form.destination} on ${form.date} has been added successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const deleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setDestinationRecords(destinationRecords.filter(r => r.id !== id));
    }
  };

  // Destination management functions (admin only)
  const addDestination = () => {
    if (!newDestination.trim()) return;
    const trimmed = newDestination.trim().toUpperCase();
    if (destinations.includes(trimmed)) {
      alert('This destination already exists');
      return;
    }
    setDestinations([...destinations, trimmed].sort());
    setNewDestination('');
  };

  const startEditDestination = (dest: string) => {
    setEditingDestination(dest);
    setEditDestinationValue(dest);
  };

  const saveEditDestination = () => {
    if (!editingDestination || !editDestinationValue.trim()) return;
    const trimmed = editDestinationValue.trim().toUpperCase();
    if (trimmed !== editingDestination && destinations.includes(trimmed)) {
      alert('This destination already exists');
      return;
    }
    setDestinations(destinations.map(d => d === editingDestination ? trimmed : d).sort());
    // Update all records with the old destination name
    setDestinationRecords(destinationRecords.map(r => 
      r.destination === editingDestination ? { ...r, destination: trimmed } : r
    ));
    setEditingDestination(null);
    setEditDestinationValue('');
  };

  const deleteDestination = (dest: string) => {
    if (confirm(`Are you sure you want to delete "${dest}"? This will not delete records, but you won't be able to select this destination for new records.`)) {
      setDestinations(destinations.filter(d => d !== dest));
    }
  };

  const destinationOptions = [
    { value: 'all', label: 'All Destinations' },
    ...destinations.map(d => ({ value: d, label: d })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Destination Records</h1>
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-eco-100 dark:bg-eco-900/30 rounded-lg border border-eco-300 dark:border-eco-700">
            <Settings className="h-4 w-4 text-eco-600 dark:text-eco-400" />
            <span className="text-sm font-semibold text-eco-700 dark:text-eco-300">Admin Mode</span>
          </div>
        )}
      </div>

      {/* Admin: Destination Management */}
      {isAdmin && (
        <Card padding="lg" variant="enhanced">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
            <Settings className="h-5 w-5 mr-2" />
            Destination Management
          </h2>
          <div className="mb-4 flex gap-2">
            <FormInput
              label="Add New Destination"
              value={newDestination}
              onChange={(v) => setNewDestination(String(v))}
              placeholder="Enter destination name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDestination();
                }
              }}
              className="flex-1"
            />
            <div className="flex items-end">
              <Button onClick={addDestination} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {destinations.map(dest => (
              <div
                key={dest}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {editingDestination === dest ? (
                  <>
                    <FormInput
                      label=""
                      value={editDestinationValue}
                      onChange={(v) => setEditDestinationValue(String(v))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveEditDestination();
                        } else if (e.key === 'Escape') {
                          setEditingDestination(null);
                          setEditDestinationValue('');
                        }
                      }}
                      className="flex-1 mr-2"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" onClick={saveEditDestination}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingDestination(null);
                        setEditDestinationValue('');
                      }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-1">
                      <MapPin className="h-4 w-4 text-eco-600" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{dest}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditDestination(dest)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDestination(dest)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Admin: Enhanced Stats Section */}
      {isAdmin && (
        <Card padding="lg" variant="enhanced">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
            <BarChart3 className="h-5 w-5 mr-2" />
            Statistics & Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormInput
              label="Start Date"
              type="date"
              value={statsDateRange.start}
              onChange={(v) => setStatsDateRange({ ...statsDateRange, start: String(v) })}
            />
            <FormInput
              label="End Date"
              type="date"
              value={statsDateRange.end}
              onChange={(v) => setStatsDateRange({ ...statsDateRange, end: String(v) })}
            />
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-navy-50 dark:bg-navy-900/20 border border-navy-200 dark:border-navy-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Records</div>
              <div className="text-2xl font-bold text-navy-700 dark:text-navy-300">{statsData.total.count}</div>
            </div>
            <div className="p-4 rounded-lg bg-eco-50 dark:bg-eco-900/20 border border-eco-200 dark:border-eco-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Boxes</div>
              <div className="text-2xl font-bold text-eco-700 dark:text-eco-300">{statsData.total.boxes}</div>
            </div>
            <div className="p-4 rounded-lg bg-mint-50 dark:bg-mint-900/20 border border-mint-200 dark:border-mint-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Small Sacks</div>
              <div className="text-2xl font-bold text-mint-700 dark:text-mint-300">{statsData.total.smallSacks}</div>
            </div>
            <div className="p-4 rounded-lg bg-signal-50 dark:bg-signal-900/20 border border-signal-200 dark:border-signal-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Basins</div>
              <div className="text-2xl font-bold text-signal-700 dark:text-signal-300">{statsData.total.basins}</div>
            </div>
          </div>

          {/* Average Per Day */}
          <div className="mb-6 p-4 bg-gradient-to-r from-navy-50 to-eco-50 dark:from-navy-900/30 dark:to-eco-900/10 rounded-lg border border-navy-200 dark:border-navy-700">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Average Per Day</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Boxes</div>
                <div className="text-xl font-bold text-navy-700 dark:text-navy-300">{statsData.averagePerDay.boxes}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Small Sacks</div>
                <div className="text-xl font-bold text-eco-600 dark:text-eco-400">{statsData.averagePerDay.smallSacks}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Basins</div>
                <div className="text-xl font-bold text-mint-600 dark:text-mint-400">{statsData.averagePerDay.basins}</div>
              </div>
            </div>
          </div>

          {/* Top Destinations */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-gray-100">Top 10 Destinations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 pr-4">Destination</th>
                    <th className="py-2 pr-4 text-center">Records</th>
                    <th className="py-2 pr-4 text-center">Boxes</th>
                    <th className="py-2 pr-4 text-center">Small Sacks</th>
                    <th className="py-2 pr-4 text-center">Basins</th>
                    <th className="py-2 pr-4 text-center">Total Items</th>
                  </tr>
                </thead>
                <tbody>
                  {statsData.topDestinations.map((item, idx) => (
                    <tr key={item.destination} className="border-b border-gray-200 dark:border-gray-700 text-sm">
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">#{idx + 1}</span>
                          <MapPin className="h-4 w-4 text-eco-600" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{item.destination}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-center">{item.count}</td>
                      <td className="py-2 pr-4 text-center">
                        <span className="px-2 py-1 rounded bg-navy-100 dark:bg-navy-900/30 text-navy-800 dark:text-navy-200 font-semibold">
                          {item.boxes}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-center">
                        <span className="px-2 py-1 rounded bg-eco-100 dark:bg-eco-900/30 text-eco-800 dark:text-eco-200 font-semibold">
                          {item.smallSacks}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-center">
                        <span className="px-2 py-1 rounded bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-200 font-semibold">
                          {item.basins}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-center font-bold text-gray-900 dark:text-gray-100">{item.total}</td>
                    </tr>
                  ))}
                  {statsData.topDestinations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-400">
                        No data for selected date range
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Days Activity */}
          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-gray-100">Recent 7 Days Activity</h3>
            <div className="space-y-2">
              {statsData.recentDates.map(item => (
                <div
                  key={item.date}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Boxes: <b className="text-navy-700 dark:text-navy-300">{item.boxes}</b>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Sacks: <b className="text-eco-600 dark:text-eco-400">{item.smallSacks}</b>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Basins: <b className="text-mint-600 dark:text-mint-400">{item.basins}</b>
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Total: {item.total}
                    </span>
                  </div>
                </div>
              ))}
              {statsData.recentDates.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No activity in recent days</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Add Record Form */}
      <Card padding="lg" variant="enhanced">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Plus className="h-5 w-5 mr-2" />
          Add Destination Record
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FormInput
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => {
              setForm({ ...form, date: String(v) });
              if (formErrors.date) {
                setFormErrors({ ...formErrors, date: undefined });
              }
            }}
            error={formErrors.date}
            required
          />
          <FormSelect
            label="Destination"
            value={form.destination}
            onChange={(v) => {
              setForm({ ...form, destination: String(v) });
              if (formErrors.destination) {
                setFormErrors({ ...formErrors, destination: undefined });
              }
            }}
            options={destinations.map(d => ({ value: d, label: d }))}
            error={formErrors.destination}
            required
            placeholder="Select destination"
          />
          <FormInput
            label="Boxes"
            type="number"
            value={form.boxes}
            onChange={(v) => {
              setForm({ ...form, boxes: Number(v) || 0 });
              if (formErrors.boxes) {
                setFormErrors({ ...formErrors, boxes: undefined });
              }
            }}
            error={formErrors.boxes}
            min={0}
            placeholder="0"
          />
          <FormInput
            label="Small Sacks"
            type="number"
            value={form.smallSacks}
            onChange={(v) => {
              setForm({ ...form, smallSacks: Number(v) || 0 });
              if (formErrors.smallSacks) {
                setFormErrors({ ...formErrors, smallSacks: undefined });
              }
            }}
            error={formErrors.smallSacks}
            min={0}
            placeholder="0"
          />
          <FormInput
            label="Basins"
            type="number"
            value={form.basins}
            onChange={(v) => {
              setForm({ ...form, basins: Number(v) || 0 });
              if (formErrors.basins) {
                setFormErrors({ ...formErrors, basins: undefined });
              }
            }}
            error={formErrors.basins}
            min={0}
            placeholder="0"
          />
        </div>
        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg">
            {successMessage}
          </div>
        )}
        <div className="mt-4">
          <Button onClick={addRecord} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>
      </Card>

      {/* Filters and Totals */}
      <Card padding="lg" variant="enhanced">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormInput
            label="Filter by Date"
            type="date"
            value={filterDate}
            onChange={(v) => setFilterDate(String(v))}
            placeholder="Select date"
          />
          <FormSelect
            label="Filter by Destination"
            value={filterDestination}
            onChange={(v) => setFilterDestination(String(v))}
            options={destinationOptions}
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setFilterDate('');
                setFilterDestination('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center p-4 bg-gradient-to-r from-navy-50 to-eco-50 dark:from-navy-900/30 dark:to-eco-900/10 rounded-lg border border-navy-200 dark:border-navy-700">
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Boxes</div>
            <div className="text-2xl font-bold text-navy-700 dark:text-navy-300">{totals.boxes}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Small Sacks</div>
            <div className="text-2xl font-bold text-eco-600 dark:text-eco-400">{totals.smallSacks}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Basins</div>
            <div className="text-2xl font-bold text-mint-600 dark:text-mint-400">{totals.basins}</div>
          </div>
        </div>
      </Card>

      {/* Records Table */}
      <Card padding="lg" variant="enhanced">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Calendar className="h-5 w-5 mr-2" />
          Records ({filtered.length})
        </h2>
        <div className="overflow-x-auto">
          {/* Mobile View */}
          <div className="md:hidden space-y-2">
            {filtered.map(record => (
              <div
                key={record.id}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-eco-600" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{record.destination}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="px-2 py-1 rounded bg-navy-100 dark:bg-navy-900/30 text-navy-800 dark:text-navy-200">
                    Boxes: <b>{record.boxes}</b>
                  </div>
                  <div className="px-2 py-1 rounded bg-eco-100 dark:bg-eco-900/30 text-eco-800 dark:text-eco-200">
                    Sacks: <b>{record.smallSacks}</b>
                  </div>
                  <div className="px-2 py-1 rounded bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-200">
                    Basins: <b>{record.basins}</b>
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Created by: {record.createdBy || 'System'}
                  </div>
                )}
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteRecord(record.id)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">No records found</p>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Destination</th>
                  <th className="py-3 pr-4 text-center">Boxes</th>
                  <th className="py-3 pr-4 text-center">Small Sacks</th>
                  <th className="py-3 pr-4 text-center">Basins</th>
                  {isAdmin && <th className="py-3 pr-4">Created By</th>}
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(record => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-eco-600" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{record.destination}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="px-2 py-1 rounded bg-navy-100 dark:bg-navy-900/30 text-navy-800 dark:text-navy-200 font-semibold">
                        {record.boxes}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="px-2 py-1 rounded bg-eco-100 dark:bg-eco-900/30 text-eco-800 dark:text-eco-200 font-semibold">
                        {record.smallSacks}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="px-2 py-1 rounded bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-200 font-semibold">
                        {record.basins}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                        {record.createdBy || 'System'}
                      </td>
                    )}
                    <td className="py-3 pr-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteRecord(record.id)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="py-6 text-center text-gray-500 dark:text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};
