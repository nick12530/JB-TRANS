import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap
} from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  const { sourceRecords, user } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'volume' | 'efficiency' | 'performance'>('revenue');

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-red-500">Access Denied: Admins only.</p>
      </div>
    );
  }

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const totalRecords = sourceRecords.length;
    const totalVolume = sourceRecords.reduce((sum, record) => sum + record.quantitySold, 0);
    const totalRevenue = sourceRecords.reduce((sum, record) => sum + record.totalCost, 0);
    const totalPackagingCost = sourceRecords.reduce((sum, record) => sum + (record.totalPackagingCost || 0), 0);
    
    // Area code performance
    const areaPerformance = [
      { code: 'AC001', name: 'Embu Area', volume: sourceRecords.filter(r => r.areaCode === 'AC001').reduce((sum, r) => sum + r.quantitySold, 0), revenue: sourceRecords.filter(r => r.areaCode === 'AC001').reduce((sum, r) => sum + r.totalCost, 0) },
      { code: 'AC002', name: 'Mecca Area', volume: sourceRecords.filter(r => r.areaCode === 'AC002').reduce((sum, r) => sum + r.quantitySold, 0), revenue: sourceRecords.filter(r => r.areaCode === 'AC002').reduce((sum, r) => sum + r.totalCost, 0) },
      { code: 'AC003', name: 'Ena Area', volume: sourceRecords.filter(r => r.areaCode === 'AC003').reduce((sum, r) => sum + r.quantitySold, 0), revenue: sourceRecords.filter(r => r.areaCode === 'AC003').reduce((sum, r) => sum + r.totalCost, 0) },
      { code: 'AC004', name: 'Ugweri Area', volume: sourceRecords.filter(r => r.areaCode === 'AC004').reduce((sum, r) => sum + r.quantitySold, 0), revenue: sourceRecords.filter(r => r.areaCode === 'AC004').reduce((sum, r) => sum + r.totalCost, 0) },
    ];

    // Monthly trends (mock data for demonstration)
    const monthlyTrends = [
      { month: 'Jan', volume: 1250, revenue: 625000, trips: 45 },
      { month: 'Feb', volume: 1380, revenue: 690000, trips: 52 },
      { month: 'Mar', volume: 1520, revenue: 760000, trips: 58 },
      { month: 'Apr', volume: 1680, revenue: 840000, trips: 64 },
      { month: 'May', volume: 1450, revenue: 725000, trips: 55 },
      { month: 'Jun', volume: 1620, revenue: 810000, trips: 62 },
    ];

    // Performance metrics
    const avgVolumePerTrip = totalRecords > 0 ? totalVolume / totalRecords : 0;
    const avgRevenuePerTrip = totalRecords > 0 ? totalRevenue / totalRecords : 0;
    const packagingEfficiency = totalRevenue > 0 ? ((totalRevenue - totalPackagingCost) / totalRevenue) * 100 : 0;

    // Top performing areas
    const topAreas = areaPerformance.sort((a, b) => b.revenue - a.revenue).slice(0, 3);

    return {
      totalRecords,
      totalVolume,
      totalRevenue,
      totalPackagingCost,
      areaPerformance,
      monthlyTrends,
      avgVolumePerTrip,
      avgRevenuePerTrip,
      packagingEfficiency,
      topAreas,
    };
  }, [sourceRecords]);

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive business intelligence and performance analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-bright-green focus:border-bright-green"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-bright-green focus:border-bright-green"
          >
            <option value="revenue">Revenue</option>
            <option value="volume">Volume</option>
            <option value="efficiency">Efficiency</option>
            <option value="performance">Performance</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {formatCurrency(analytics.totalRevenue)}
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.totalRevenue, analytics.totalRevenue * 0.9)}
                <span className="text-xs text-green-600 ml-1">+12.5%</span>
              </div>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Volume</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {(analytics.totalVolume / 1000).toFixed(1)}K kg
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.totalVolume, analytics.totalVolume * 0.95)}
                <span className="text-xs text-green-600 ml-1">+8.3%</span>
              </div>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trips</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {analytics.totalRecords}
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.totalRecords, analytics.totalRecords * 0.88)}
                <span className="text-xs text-green-600 ml-1">+15.2%</span>
              </div>
            </div>
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20 flex-shrink-0">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Efficiency</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {analytics.packagingEfficiency.toFixed(1)}%
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.packagingEfficiency, analytics.packagingEfficiency * 0.98)}
                <span className="text-xs text-green-600 ml-1">+2.1%</span>
              </div>
            </div>
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex-shrink-0">
              <Target className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Trends</h3>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {analytics.monthlyTrends.map((month, index) => {
              const maxRevenue = Math.max(...analytics.monthlyTrends.map(m => m.revenue));
              const percentage = (month.revenue / maxRevenue) * 100;
              
              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{month.month}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(month.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-bright-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{month.volume}kg</span>
                    <span>{month.trips} trips</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Area Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Area Performance</h3>
            <MapPin className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {analytics.areaPerformance.map((area, index) => {
              const maxRevenue = Math.max(...analytics.areaPerformance.map(a => a.revenue));
              const percentage = maxRevenue > 0 ? (area.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={area.code} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{area.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({area.code})</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(area.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{area.volume}kg</span>
                    <span>{((area.revenue / area.volume) || 0).toFixed(0)}/kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Average Metrics</h3>
            <Activity className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Volume per Trip</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {analytics.avgVolumePerTrip.toFixed(1)}kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Revenue per Trip</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(analytics.avgRevenuePerTrip)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Packaging Efficiency</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {analytics.packagingEfficiency.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Performers</h3>
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            {analytics.topAreas.map((area, index) => (
              <div key={area.code} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                    index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{area.name}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(area.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Insights</h3>
            <Zap className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Best performing area: {analytics.topAreas[0]?.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Revenue growth: +12.5% this month
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Efficiency target: 95% (Current: {analytics.packagingEfficiency.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Monitor: AC004 performance below average
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Real-time Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Trips</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending Pickups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Alerts</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
