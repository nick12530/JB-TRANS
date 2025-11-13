import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  MapPin,
  Users,
  BarChart3,
  Activity,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Navigation,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { packages, pickupStations, users, areaCodes, destinationRecords } = useApp();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalPackages = packages.length;
  const registeredPackages = packages.filter(p => p.status === 'registered').length;
  const inTransitPackages = packages.filter(p => p.status === 'in-transit').length;
  const deliveredPackages = packages.filter(p => p.status === 'delivered').length;
  const totalStations = pickupStations.length;
  const activeStations = pickupStations.filter(s => s.status === 'active').length;
  const totalAreaCodes = areaCodes.length;
  const activeAreaCodes = areaCodes.filter(a => a.status === 'active').length;
  const totalDestinationRecords = destinationRecords.length;
  
  // Calculate destination totals
  const destinationTotals = useMemo(() => {
    const totals: Record<string, { boxes: number; smallSacks: number; basins: number }> = {};
    for (const record of destinationRecords) {
      if (!totals[record.destination]) {
        totals[record.destination] = { boxes: 0, smallSacks: 0, basins: 0 };
      }
      totals[record.destination].boxes += record.boxes;
      totals[record.destination].smallSacks += record.smallSacks;
      totals[record.destination].basins += record.basins;
    }
    return totals;
  }, [destinationRecords]);

  // Calculate station totals
  const totalStationCapacity = pickupStations.reduce((sum, station) => sum + (station.capacity || 0), 0);
  const totalCurrentInventory = pickupStations.reduce((sum, station) => sum + (station.currentInventory || 0), 0);
  const totalAvailableCapacity = totalStationCapacity - totalCurrentInventory;
  const utilizationRate = totalStationCapacity > 0 ? Math.round((totalCurrentInventory / totalStationCapacity) * 100) : 0;

  // Packaging aggregates parsed from notes: "boxes:X|basins:Y|smallSacks:Z"
  const packagingTotals = useMemo(() => {
    let boxes = 0, basins = 0, smallSacks = 0;
    for (const p of packages || []) {
      if (!p || !p.notes) continue;
      const parts = String(p.notes).split('|');
      for (const part of parts) {
        const [k, v] = (part || '').split(':');
        const val = Number(v);
        const safeVal = Number.isFinite(val) ? val : 0;
        if (k === 'boxes') boxes += safeVal;
        if (k === 'basins') basins += safeVal;
        if (k === 'smallSacks') smallSacks += safeVal;
      }
    }
    return { boxes, basins, smallSacks };
  }, [packages]);

  // Daily totals per station for boxes, basins, small sacks
  const dailyStationTotals = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const totals: Record<string, { boxes: number; basins: number; smallSacks: number }> = {};
    for (const s of pickupStations) {
      totals[s.name] = { boxes: 0, basins: 0, smallSacks: 0 };
    }
    for (const p of packages || []) {
      if (!p || !p.registeredAt || !String(p.registeredAt).startsWith(today)) continue;
      const stationName = p.station;
      const target = totals[stationName] || (totals[stationName] = { boxes: 0, basins: 0, smallSacks: 0 });
      if (!p.notes) continue;
      const parts = String(p.notes).split('|');
      for (const part of parts) {
        const [k, v] = (part || '').split(':');
        const val = Number(v);
        const safeVal = Number.isFinite(val) ? val : 0;
        if (k === 'boxes') target.boxes += safeVal;
        if (k === 'basins') target.basins += safeVal;
        if (k === 'smallSacks') target.smallSacks += safeVal;
      }
    }
    // Return array in station order
    return (pickupStations || []).map(s => ({ station: s.name, ...totals[s.name] }));
  }, [packages, pickupStations]);

  // Station code utilization based on fixed ranges and trackingNumber format Station-<code>
  const STATIONS = [
    { name: 'Embu', min: 1, max: 300 },
    { name: 'Ugweri', min: 301, max: 600 },
    { name: 'Meka', min: 601, max: 900 },
    { name: 'Ena', min: 901, max: 1000 },
    { name: 'Gachuriri', min: 1001, max: 1100 },
  ] as const;

  const stationUtilization = useMemo(() => {
    return STATIONS.map(s => {
      const usedCodes = new Set<number>();
      let todayCount = 0;
      const today = new Date().toISOString().slice(0,10);
      for (const p of packages || []) {
        if (!p) continue;
        // Expect trackingNumber like "Embu-25"
        const tn = String(p.trackingNumber || '');
        const dash = tn.lastIndexOf('-');
        if (dash === -1) continue;
        const stationName = tn.slice(0, dash);
        const codeNum = Number(tn.slice(dash + 1));
        if (stationName === s.name && Number.isFinite(codeNum) && codeNum >= s.min && codeNum <= s.max) {
          usedCodes.add(codeNum);
          if (String(p.registeredAt || '').startsWith(today)) todayCount += 1;
        }
      }
      const rangeSize = Math.max(1, s.max - s.min + 1);
      const percentRaw = (usedCodes.size / rangeSize) * 100;
      const percent = Math.max(0, Math.min(100, Math.round(percentRaw)));
      return { ...s, used: usedCodes.size, percent, todayCount };
    });
  }, [packages]);

  // Recent registrations feed
  const recentPackages = useMemo(() => {
    return [...packages]
      .sort((a,b) => String(b.registeredAt).localeCompare(String(a.registeredAt)))
      .slice(0,8);
  }, [packages]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Packages',
      value: totalPackages.toString(),
      icon: Package,
      color: 'bg-navy-500',
      trend: '+12%',
      trendColor: 'text-navy-700',
      description: 'All registered packages',
      bgPattern: 'from-navy-400/20 to-navy-600/20'
    },
    {
      title: 'Active Users',
      value: `${activeUsers}/${totalUsers}`,
      icon: Users,
      color: 'bg-eco-500',
      trend: '+3',
      trendColor: 'text-eco-700',
      description: 'Active staff members',
      bgPattern: 'from-eco-400/20 to-eco-600/20'
    },
    {
      title: 'Pickup Stations',
      value: `${activeStations}/${totalStations}`,
      icon: MapPin,
      color: 'bg-signal-400',
      trend: '+1',
      trendColor: 'text-signal-600',
      description: 'Active stations',
      bgPattern: 'from-signal-300/20 to-signal-500/20'
    },
    {
      title: 'Area Codes',
      value: `${activeAreaCodes}/${totalAreaCodes}`,
      icon: BarChart3,
      color: 'bg-mint-400',
      trend: 'Active',
      trendColor: 'text-mint-700',
      description: 'Configured codes',
      bgPattern: 'from-mint-200/20 to-mint-400/20'
    }
  ];

  const statusStats = [
    {
      status: 'registered',
      count: registeredPackages,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      percentage: totalPackages > 0 ? Math.round((registeredPackages / totalPackages) * 100) : 0
    },
    {
      status: 'in-transit',
      count: inTransitPackages,
      icon: Activity,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      percentage: totalPackages > 0 ? Math.round((inTransitPackages / totalPackages) * 100) : 0
    },
    {
      status: 'delivered',
      count: deliveredPackages,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      percentage: totalPackages > 0 ? Math.round((deliveredPackages / totalPackages) * 100) : 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Real-time statistics and system overview
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} variant="enhanced" padding="sm" className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${stat.bgPattern} rounded-bl-full opacity-50`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color} text-white`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className={`text-xs sm:text-sm font-semibold ${stat.trendColor}`}>
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Package Status Overview */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Package Status Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statusStats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${stat.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize">
                  {stat.status}
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                  {stat.count}
                </p>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  ({stat.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Totals per Station */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Today totals per station
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                <th className="py-2 pr-4">Station</th>
                <th className="py-2 pr-4">Boxes</th>
                <th className="py-2 pr-4">Basins</th>
                <th className="py-2 pr-4">Small Sacks</th>
                <th className="py-2 pr-4">Total Items</th>
              </tr>
            </thead>
            <tbody>
              {dailyStationTotals.map(r => (
                <tr key={r.station} className="border-t border-gray-200 dark:border-gray-700 text-sm">
                  <td className="py-2 pr-4 font-medium">{r.station}</td>
                  <td className="py-2 pr-4">{r.boxes}</td>
                  <td className="py-2 pr-4">{r.basins}</td>
                  <td className="py-2 pr-4">{r.smallSacks}</td>
                  <td className="py-2 pr-4 font-semibold">{r.boxes + r.basins + r.smallSacks}</td>
                </tr>
              ))}
              {dailyStationTotals.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">No entries for today</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Packaging Totals */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Aggregated Packaging Totals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-navy-50 dark:bg-navy-900/20 border border-navy-200 dark:border-navy-800">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Boxes</div>
            <div className="text-2xl font-bold text-navy-700 dark:text-navy-300">{packagingTotals.boxes}</div>
          </div>
          <div className="p-4 rounded-lg bg-mint-50 dark:bg-mint-900/20 border border-mint-200 dark:border-mint-800">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Basins</div>
            <div className="text-2xl font-bold text-mint-700 dark:text-mint-300">{packagingTotals.basins}</div>
          </div>
          <div className="p-4 rounded-lg bg-signal-50 dark:bg-signal-900/20 border border-signal-200 dark:border-signal-800">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Small Sacks</div>
            <div className="text-2xl font-bold text-signal-700 dark:text-signal-300">{packagingTotals.smallSacks}</div>
          </div>
        </div>
      </Card>

      {/* Station Code Utilization */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Station Code Utilization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stationUtilization.map((s) => (
            <div key={s.name} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{s.min}-{s.max}</div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-eco-500" style={{ width: `${s.percent}%` }} />
              </div>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Used: <span className="font-semibold">{s.used}</span> • <span className="font-semibold">{s.percent}%</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Today: {s.todayCount}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Registrations */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Recent Registrations
        </h2>
        <div className="space-y-3">
          {recentPackages.map(p => (
            <button
              key={p.id}
              onClick={() => navigate('/registrations')}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors text-left"
            >
              <div className="min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{p.trackingNumber}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{p.recipientName} • {p.destination}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 ml-3 whitespace-nowrap">
                {p.registeredAt ? new Date(p.registeredAt).toLocaleString() : 'N/A'}
              </div>
            </button>
          ))}
          {recentPackages.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">No recent registrations</p>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Button variant="default" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/users')}>
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Button>
          <Button variant="default" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/stations')}>
            <MapPin className="h-5 w-5" />
            <span>Manage Stations</span>
          </Button>
          <Button variant="default" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/packages')}>
            <Package className="h-5 w-5" />
            <span>Packages</span>
          </Button>
          <Button variant="default" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/reports')}>
            <BarChart3 className="h-5 w-5" />
            <span>View Reports</span>
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/destinations')}>
            <Navigation className="h-5 w-5" />
            <span>Destinations</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/area-codes')}>
            <Settings className="h-5 w-5" />
            <span>Area Codes</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/register-package')}>
            <Package className="h-5 w-5" />
            <span>Register Package</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/settings')}>
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
        </div>
      </Card>

      {/* Destination Records Overview */}
      <Card variant="enhanced" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            Destination Records Overview
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/destinations')}>
            <Navigation className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="mb-4 p-4 bg-gradient-to-r from-navy-50 to-eco-50 dark:from-navy-900/30 dark:to-eco-900/10 rounded-lg border border-navy-200 dark:border-navy-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Records</div>
          <div className="text-3xl font-bold text-navy-700 dark:text-navy-300">{totalDestinationRecords}</div>
        </div>
        {Object.keys(destinationTotals).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4">Destination</th>
                  <th className="py-2 pr-4 text-center">Total Boxes</th>
                  <th className="py-2 pr-4 text-center">Total Small Sacks</th>
                  <th className="py-2 pr-4 text-center">Total Basins</th>
                  <th className="py-2 pr-4 text-center">Total Items</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(destinationTotals)
                  .sort((a, b) => {
                    const totalA = a[1].boxes + a[1].smallSacks + a[1].basins;
                    const totalB = b[1].boxes + b[1].smallSacks + b[1].basins;
                    return totalB - totalA;
                  })
                  .slice(0, 10)
                  .map(([destination, totals]) => {
                    const totalItems = totals.boxes + totals.smallSacks + totals.basins;
                    return (
                      <tr key={destination} className="border-b border-gray-200 dark:border-gray-700 text-sm">
                        <td className="py-2 pr-4 font-medium text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-eco-600" />
                            {destination}
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-center">
                          <span className="px-2 py-1 rounded bg-navy-100 dark:bg-navy-900/30 text-navy-800 dark:text-navy-200 font-semibold">
                            {totals.boxes}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-center">
                          <span className="px-2 py-1 rounded bg-eco-100 dark:bg-eco-900/30 text-eco-800 dark:text-eco-200 font-semibold">
                            {totals.smallSacks}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-center">
                          <span className="px-2 py-1 rounded bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-200 font-semibold">
                            {totals.basins}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-center font-bold text-gray-900 dark:text-gray-100">
                          {totalItems}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {Object.keys(destinationTotals).length > 10 && (
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Showing top 10 destinations. <button onClick={() => navigate('/destinations')} className="text-eco-600 hover:underline">View all</button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">No destination records yet</p>
        )}
      </Card>

      {/* Station Totals Overview */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Station Capacity Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-navy-50 dark:bg-navy-900/20 border border-navy-200 dark:border-navy-800">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-navy-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                Total Stations
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl sm:text-3xl font-bold text-navy-600">
                {totalStations}
              </p>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Active: {activeStations}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-eco-50 dark:bg-eco-900/20 border border-eco-200 dark:border-eco-800">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                Total Capacity
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl sm:text-3xl font-bold text-eco-600">
                {totalStationCapacity}
              </p>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Units
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-signal-50 dark:bg-signal-900/20 border border-signal-200 dark:border-signal-800">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-signal-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                Current Inventory
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl sm:text-3xl font-bold text-signal-600">
                {totalCurrentInventory}
              </p>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                ({utilizationRate}%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-mint-50 dark:bg-mint-900/20 border border-mint-200 dark:border-mint-800">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-mint-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                Available Space
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl sm:text-3xl font-bold text-mint-600">
                {totalAvailableCapacity}
              </p>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Units
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

