import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { formatCurrency } from '../../utils/helpers';
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Filter,
  Download,
  RefreshCw,
  Target,
  Clock,
  Package
} from 'lucide-react';

interface AreaPerformance {
  areaCode: string;
  areaName: string;
  region: string;
  totalTrips: number;
  totalQuantity: number;
  totalRevenue: number;
  avgDeliveryTime: number;
  successRate: number;
  topStations: Array<{
    stationCode: string;
    stationName: string;
    trips: number;
    revenue: number;
  }>;
  topDropOffs: Array<{
    dropOff: string;
    trips: number;
    revenue: number;
  }>;
}

export const AreaPerformancePage: React.FC = () => {
  const { sourceRecords, user } = useApp();
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Area codes data
  const areaCodes = [
    { code: 'AC001', name: 'Central Highlands', region: 'Meru County' },
    { code: 'AC002', name: 'Eastern Plains', region: 'Kitui County' },
    { code: 'AC003', name: 'Coastal Region', region: 'Mombasa County' },
    { code: 'AC004', name: 'Northern Frontier', region: 'Garissa County' },
    { code: 'AC005', name: 'Metropolitan Area', region: 'Nairobi County' },
  ];

  // Calculate area performance
  const areaPerformance = useMemo(() => {
    const performance: AreaPerformance[] = [];
    
    areaCodes.forEach(area => {
      const records = sourceRecords.filter(record => record.areaCode === area.code);
      
      if (records.length === 0) {
        performance.push({
          areaCode: area.code,
          areaName: area.name,
          region: area.region,
          totalTrips: 0,
          totalQuantity: 0,
          totalRevenue: 0,
          avgDeliveryTime: 0,
          successRate: 0,
          topStations: [],
          topDropOffs: [],
        });
        return;
      }

      const totalQuantity = records.reduce((sum, record) => sum + record.quantitySold, 0);
      const totalRevenue = records.reduce((sum, record) => sum + record.totalCost, 0);
      
      // Mock delivery time calculation (in real app, calculate from actual delivery times)
      const avgDeliveryTime = 2.5 + Math.random() * 2; // 2.5-4.5 hours
      
      // Mock success rate calculation
      const successRate = 85 + Math.random() * 15; // 85-100%
      
      // Top stations analysis
      const stationStats = records.reduce((acc, record) => {
        const station = record.pickupStationCode;
        if (!acc[station]) {
          acc[station] = { trips: 0, revenue: 0, name: station };
        }
        acc[station].trips += 1;
        acc[station].revenue += record.totalCost;
        return acc;
      }, {} as Record<string, { trips: number; revenue: number; name: string }>);

      const topStations = Object.entries(stationStats)
        .map(([code, stats]) => ({
          stationCode: code,
          stationName: code,
          trips: stats.trips,
          revenue: stats.revenue,
        }))
        .sort((a, b) => b.trips - a.trips)
        .slice(0, 3);

      // Top drop-off points analysis
      const dropOffStats = records.reduce((acc, record) => {
        const dropOff = record.dropOffPoint;
        if (!acc[dropOff]) {
          acc[dropOff] = { trips: 0, revenue: 0 };
        }
        acc[dropOff].trips += 1;
        acc[dropOff].revenue += record.totalCost;
        return acc;
      }, {} as Record<string, { trips: number; revenue: number }>);

      const topDropOffs = Object.entries(dropOffStats)
        .map(([dropOff, stats]) => ({
          dropOff,
          trips: stats.trips,
          revenue: stats.revenue,
        }))
        .sort((a, b) => b.trips - a.trips)
        .slice(0, 5);

      performance.push({
        areaCode: area.code,
        areaName: area.name,
        region: area.region,
        totalTrips: records.length,
        totalQuantity,
        totalRevenue,
        avgDeliveryTime,
        successRate,
        topStations,
        topDropOffs,
      });
    });

    return performance.sort((a, b) => b.totalTrips - a.totalTrips);
  }, [sourceRecords]);

  // Filter performance based on selected area
  const filteredPerformance = selectedArea === 'all' 
    ? areaPerformance 
    : areaPerformance.filter(area => area.areaCode === selectedArea);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totalTrips = areaPerformance.reduce((sum, area) => sum + area.totalTrips, 0);
    const totalQuantity = areaPerformance.reduce((sum, area) => sum + area.totalQuantity, 0);
    const totalRevenue = areaPerformance.reduce((sum, area) => sum + area.totalRevenue, 0);
    const avgSuccessRate = areaPerformance.length > 0 
      ? areaPerformance.reduce((sum, area) => sum + area.successRate, 0) / areaPerformance.length 
      : 0;

    return {
      totalTrips,
      totalQuantity,
      totalRevenue,
      avgSuccessRate,
    };
  }, [areaPerformance]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <Target className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h2>
          <p className="text-gray-600 dark:text-gray-400">Area performance analysis is only available to administrators.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Area Performance Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive analysis of pickup station performance by area codes
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <select 
            value={selectedArea} 
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          >
            <option value="all">All Areas</option>
            {areaCodes.map(area => (
              <option key={area.code} value={area.code}>
                {area.code} - {area.name}
              </option>
            ))}
          </select>
          
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-500">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Trips</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{overallMetrics.totalTrips}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-500">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Quantity</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{(overallMetrics.totalQuantity / 1000).toFixed(1)}K kg</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-yellow-500">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{(overallMetrics.totalRevenue / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-500">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg Success Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{overallMetrics.avgSuccessRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Area Performance Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredPerformance.map((area) => (
          <Card key={area.areaCode} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{area.areaCode}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{area.areaName} - {area.region}</p>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Live Data</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Trips</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{area.totalTrips}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{(area.totalQuantity / 1000).toFixed(1)}K kg</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{(area.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{area.successRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Top Stations */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Top Performing Stations</h4>
              <div className="space-y-2">
                {area.topStations.map((station, index) => (
                  <div key={station.stationCode} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{station.stationCode}</span>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-gray-500">{station.trips} trips</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{(station.revenue / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Drop-off Points */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Top Drop-off Points</h4>
              <div className="space-y-2">
                {area.topDropOffs.map((dropOff, index) => (
                  <div key={dropOff.dropOff} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{dropOff.dropOff}</span>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-gray-500">{dropOff.trips} trips</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{(dropOff.revenue / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
