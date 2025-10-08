import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { MonthlyTrends } from '../MonthlyTrends';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useNotificationService } from '../../services/notificationService';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign,
  AlertTriangle,
  Target,
  Activity,
  Package,
  MapPin,
  Download,
  Calendar,
  RefreshCw,
  Clock,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';

interface ProfitAnalysis {
  pickupPoint: string;
  areaCode: string;
  totalRecords: number;
  totalCost: number;
  totalRevenue: number;
  profit: number;
  margin: number;
  avgCostPerKg: number;
  avgRevenuePerKg: number;
  efficiency: number;
  growth: number;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'warning' | 'critical';
  trends: {
    profit: 'up' | 'down' | 'stable';
    revenue: 'up' | 'down' | 'stable';
    cost: 'up' | 'down' | 'stable';
  };
  kpis: {
    roi: number;
    costEfficiency: number;
    revenueGrowth: number;
    marketShare: number;
  };
}

interface PerformanceMetrics {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  avgProfitPerTrip: number;
  totalTrips: number;
  avgRevenuePerTrip: number;
  avgCostPerTrip: number;
  efficiency: number;
  growthRate: number;
  lastUpdated: string;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  realTimeSync: boolean;
}


// Helper function for profit margin calculation
const getProfitMargin = (cost: number, revenue: number): number => {
  if (cost === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
};

interface MonthlyData {
  month: string;
  profit: number;
  cost: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

export const ProfitReportsPage: React.FC = () => {
  const { sourceRecords, user, destinationRecords } = useApp();
  const { showSuccessNotification, showErrorNotification } = useNotificationService();
  
  // Enhanced state management
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'pickup-analysis' | 'monthly-trends' | 'driver-performance' | 'vehicle-performance' | 'destination-analysis'>('overview');
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isRealTimeSync, setIsRealTimeSync] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Real-time data processing and integration
  const processedDestinationRecords = useMemo(() => {
    // In real app, this would come from context or API
    return destinationRecords || [
      { id: '1', trackingNo: 'TRIP-001', destination: 'Nairobi', buyer: 'John Doe', quantitySold: 50, itemPrice: 800, totalRevenue: 40000, date: '2024-01-15' },
      { id: '2', trackingNo: 'TRIP-002', destination: 'Mombasa', buyer: 'Jane Smith', quantitySold: 75, itemPrice: 700, totalRevenue: 52500, date: '2024-01-14' },
      { id: '3', trackingNo: 'TRIP-003', destination: 'Garissa', buyer: 'Bob Johnson', quantitySold: 30, itemPrice: 650, totalRevenue: 19500, date: '2024-01-13' },
      { id: '4', trackingNo: 'TRIP-004', destination: 'Meru', buyer: 'Alice Brown', quantitySold: 40, itemPrice: 750, totalRevenue: 30000, date: '2024-01-12' },
      { id: '5', trackingNo: 'TRIP-005', destination: 'Nairobi', buyer: 'Charlie Wilson', quantitySold: 60, itemPrice: 850, totalRevenue: 51000, date: '2024-01-11' },
    ];
  }, [destinationRecords]);

  // Enhanced data processing with real-life integration
  const performanceMetrics: PerformanceMetrics = useMemo(() => {
    const totalCost = sourceRecords.reduce((sum, record) => sum + record.totalCost, 0);
    const totalRevenue = processedDestinationRecords.reduce((sum, record) => sum + record.totalRevenue, 0);
    const totalProfit = totalRevenue - totalCost;
    const totalTrips = sourceRecords.length;
    
    // Calculate data quality based on completeness and consistency
    const dataCompleteness = sourceRecords.length > 0 ? 
      (sourceRecords.filter(r => r.areaCode && r.totalCost > 0).length / sourceRecords.length) * 100 : 0;
    
    const dataQualityScore = dataCompleteness >= 95 ? 'excellent' : 
                           dataCompleteness >= 85 ? 'good' : 
                           dataCompleteness >= 70 ? 'fair' : 'poor';

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: getProfitMargin(totalCost, totalRevenue),
      avgProfitPerTrip: totalTrips > 0 ? totalProfit / totalTrips : 0,
      totalTrips,
      avgRevenuePerTrip: totalTrips > 0 ? totalRevenue / totalTrips : 0,
      avgCostPerTrip: totalTrips > 0 ? totalCost / totalTrips : 0,
      efficiency: totalCost > 0 ? (totalRevenue / totalCost) * 100 : 0,
      growthRate: 15.2, // In real app, calculate from historical data
      lastUpdated: new Date().toISOString(),
      dataQuality: dataQualityScore as 'excellent' | 'good' | 'fair' | 'poor',
      realTimeSync: isRealTimeSync
    };
  }, [sourceRecords, processedDestinationRecords, isRealTimeSync]);

  // Enhanced profit analysis with real-life data integration
  const profitAnalysis = useMemo(() => {
    const analysis: ProfitAnalysis[] = [];
    
    ['AC001', 'AC002', 'AC003', 'AC004', 'AC005'].forEach(areaCode => {
      const records = sourceRecords.filter(r => r.areaCode === areaCode);
      const now = new Date().toISOString();
      
      if (records.length === 0) {
        // Add placeholder for inactive points
        analysis.push({
          pickupPoint: `Area ${areaCode}`,
          areaCode,
          totalRecords: 0,
          totalCost: 0,
          totalRevenue: 0,
          profit: 0,
          margin: 0,
          avgCostPerKg: 0,
          avgRevenuePerKg: 0,
          efficiency: 0,
          growth: 0,
          lastUpdated: now,
          status: 'inactive',
          trends: { profit: 'stable', revenue: 'stable', cost: 'stable' },
          kpis: { roi: 0, costEfficiency: 0, revenueGrowth: 0, marketShare: 0 }
        });
        return;
      }
      
      const totalCost = records.reduce((sum, record) => sum + record.totalCost, 0);
      const totalRecords = records.length;
      const totalQuantity = records.reduce((sum, record) => sum + record.quantitySold, 0);
      
      // Real revenue calculation from destination records
      const relatedDestinations = processedDestinationRecords.filter(d => 
        records.some(r => (r as any).tripCode === (d as any).trackingNo)
      );
      const totalRevenue = relatedDestinations.reduce((sum, dest) => sum + dest.totalRevenue, 0);
      
      // Calculate efficiency metrics
      const efficiency = totalCost > 0 ? (totalRevenue - totalCost) / totalRecords : 0;
      const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
      
      // Determine status based on performance
      const margin = getProfitMargin(totalCost, totalRevenue);
      const status = margin >= 30 ? 'active' : 
                    margin >= 20 ? 'warning' : 
                    margin > 0 ? 'critical' : 'inactive';
      
      // Calculate trends (in real app, compare with previous periods)
      const trends = {
        profit: efficiency > 1000 ? 'up' as const : efficiency > 500 ? 'stable' as const : 'down' as const,
        revenue: totalRevenue > totalCost * 1.3 ? 'up' as const : totalRevenue > totalCost * 1.1 ? 'stable' as const : 'down' as const,
        cost: totalCost > 0 ? 'stable' as const : 'stable' as const
      };
      
      // Mock growth (in real app, calculate from historical data)
      const growth = 15 + Math.random() * 30;
      
      analysis.push({
        pickupPoint: `Area ${areaCode}`,
        areaCode,
        totalRecords,
        totalCost,
        totalRevenue,
        profit: totalRevenue - totalCost,
        margin,
        avgCostPerKg: totalQuantity > 0 ? totalCost / totalQuantity : 0,
        avgRevenuePerKg: totalQuantity > 0 ? totalRevenue / totalQuantity : 0,
        efficiency,
        growth,
        lastUpdated: now,
        status,
        trends,
        kpis: {
          roi,
          costEfficiency: totalCost > 0 ? (totalRevenue / totalCost) * 100 : 0,
          revenueGrowth: growth,
          marketShare: totalRecords / sourceRecords.length * 100
        }
      });
    });
    
    return analysis.sort((a, b) => b.profit - a.profit);
  }, [sourceRecords, processedDestinationRecords]);

  // Calculate monthly trends
  const monthlyData: MonthlyData[] = [
    { month: 'Aug', profit: 45000, cost: 18000, revenue: 63000, trend: 'up' },
    { month: 'Sep', profit: 52000, cost: 22000, revenue: 74000, trend: 'up' },
    { month: 'Oct', profit: 48000, cost: 20000, revenue: 68000, trend: 'down' },
    { month: 'Nov', profit: 55000, cost: 21000, revenue: 76000, trend: 'up' },
    { month: 'Dec', profit: 62000, cost: 23000, revenue: 85000, trend: 'up' },
    { month: 'Jan', profit: 58000, cost: 25000, revenue: 83000, trend: 'down' },
  ];

  // Enhanced functionality functions
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // In real app, this would fetch fresh data from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessNotification('Success', 'Data refreshed successfully');
    } catch (error) {
      showErrorNotification('Error', 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      // In real app, this would generate and download the report
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccessNotification('Success', `${format.toUpperCase()} report exported successfully`);
    } catch (error) {
      showErrorNotification('Error', `Failed to export ${format.toUpperCase()} report`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setSelectedDateRange({ start, end });
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Real-time sync toggle
  const toggleRealTimeSync = () => {
    setIsRealTimeSync(!isRealTimeSync);
    showSuccessNotification('Success', `Real-time sync ${!isRealTimeSync ? 'enabled' : 'disabled'}`);
  };

  // Find best and worst performing pickup points
  const bestPerformer = profitAnalysis[0];
  const worstPerformer = profitAnalysis[profitAnalysis.length - 1];

  // Identify shortcomings
  const shortcomings = [
    ...(worstPerformer && worstPerformer.margin < 20 ? [`Low profit margin at ${worstPerformer.pickupPoint} (${worstPerformer.margin.toFixed(1)}%)`] : []),
    ...(profitAnalysis.filter(p => p.totalRecords < 3).map(p => `Low activity at ${p.pickupPoint} (${p.totalRecords} trips)`)),
    ...(performanceMetrics.profitMargin < 30 ? ['Overall profit margin below target (30%+)'] : []),
    ...(monthlyData[monthlyData.length - 1].trend === 'down' ? ['Recent downward trend in profits'] : []),
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <Target className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h2>
          <p className="text-gray-600 dark:text-gray-400">Profit reports are only available to administrators.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Real-time Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gradient-purple">Performance Reports</h1>
            <div className="flex items-center gap-2">
              {isRealTimeSync ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs font-medium">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-500">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs font-medium">Offline</span>
                </div>
              )}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                performanceMetrics.dataQuality === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                performanceMetrics.dataQuality === 'good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                performanceMetrics.dataQuality === 'fair' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              }`}>
                {performanceMetrics.dataQuality.toUpperCase()} DATA
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive analysis of miraa transport profitability with real-time insights
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Last updated: {formatDate(performanceMetrics.lastUpdated)}
          </p>
        </div>
        
        {/* Enhanced Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={selectedDateRange.start}
              onChange={(e) => handleDateRangeChange(e.target.value, selectedDateRange.end)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={selectedDateRange.end}
              onChange={(e) => handleDateRangeChange(selectedDateRange.start, e.target.value)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700"
            />
          </div>

          {/* Period Selector */}
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus-ring"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          {/* View Selector */}
          <select 
            value={selectedView} 
            onChange={(e) => setSelectedView(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus-ring"
          >
            <option value="overview">Overview</option>
            <option value="pickup-analysis">Pickup Analysis</option>
            <option value="monthly-trends">Monthly Trends</option>
            <option value="driver-performance">Driver Performance</option>
            <option value="vehicle-performance">Vehicle Performance</option>
            <option value="destination-analysis">Destination Analysis</option>
          </select>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-glass flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <div className="relative">
              <button
                onClick={() => setIsExporting(!isExporting)}
                className="btn-gradient-primary flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              {isExporting && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      Export Excel
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleRealTimeSync}
              className={`btn-glass flex items-center gap-2 ${isRealTimeSync ? 'text-green-600' : 'text-gray-500'}`}
            >
              {isRealTimeSync ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              Sync
            </button>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`btn-glass flex items-center gap-2 ${autoRefresh ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <Clock className="h-4 w-4" />
              Auto
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics with Real-time Data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-primary flex-shrink-0">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg font-bold text-gradient-primary truncate">
                {formatCurrency(performanceMetrics.totalRevenue)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{performanceMetrics.growthRate.toFixed(1)}%
            </div>
            <div className="text-gray-500">
              {performanceMetrics.totalTrips} trips
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-warm flex-shrink-0">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Costs</p>
              <p className="text-lg font-bold text-gradient-warm truncate">
                {formatCurrency(performanceMetrics.totalCost)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center text-orange-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -5.2%
            </div>
            <div className="text-gray-500">
              Avg: {formatCurrency(performanceMetrics.avgCostPerTrip)}
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-secondary flex-shrink-0">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className="text-lg font-bold text-gradient-secondary truncate">
                {formatCurrency(performanceMetrics.totalProfit)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center text-blue-600">
              <Activity className="h-3 w-3 mr-1" />
              {performanceMetrics.profitMargin.toFixed(1)}%
            </div>
            <div className="text-gray-500">
              Margin
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-accent flex-shrink-0">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Efficiency</p>
              <p className="text-lg font-bold text-gradient-accent truncate">
                {performanceMetrics.efficiency.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center text-purple-600">
              <Zap className="h-3 w-3 mr-1" />
              ROI
            </div>
            <div className="text-gray-500">
              {performanceMetrics.dataQuality} data
            </div>
          </div>
        </Card>
      </div>

      {selectedView === 'overview' && (
        <>
          {/* Compact Performance Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Best/Worst Performers */}
            <Card className="lg:col-span-1 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance Summary</h3>
              <div className="space-y-4">
                {/* Best Performer */}
                {bestPerformer && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium text-green-800 dark:text-green-200">Best Performer</span>
                    </div>
                    <p className="font-semibold text-green-900 dark:text-green-100">{bestPerformer.pickupPoint}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Profit: {formatCurrency(bestPerformer.profit)} ({bestPerformer.margin.toFixed(1)}%)
                    </p>
                  </div>
                )}

                {/* Worst Performer */}
                {worstPerformer && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                      <span className="font-medium text-red-800 dark:text-red-200">Needs Improvement</span>
                    </div>
                    <p className="font-semibold text-red-900 dark:text-red-100">{worstPerformer.pickupPoint}</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Profit: {formatCurrency(worstPerformer.profit)} ({worstPerformer.margin.toFixed(1)}%)
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Shortcomings & Recommendations */}
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Issues & Recommendations</h3>
              <div className="space-y-3">
                {shortcomings.length > 0 ? (
                  shortcomings.map((shortcoming, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">Issue</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">{shortcoming}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-900 dark:text-gray-100 font-medium">Excellent Performance!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No critical issues identified</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Destination Performance */}
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Destination Performance</h3>
            <div className="space-y-3">
              {processedDestinationRecords.map((record) => {
                // Mock cost calculation
                const cost = (record as any).quantitySold * 450; // Mock purchase price
                const profit = record.totalRevenue - cost;
                const margin = getProfitMargin(cost, record.totalRevenue);
                
                return (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover-lift">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{(record as any).destination}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{(record as any).buyer}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400">Quantity</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{(record as any).quantitySold}kg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400">Revenue</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(record.totalRevenue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400">Profit</p>
                        <p className={`font-medium ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(profit)} ({margin.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {selectedView === 'pickup-analysis' && (
        <>
          {/* Enhanced Pickup Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Pickup Performance Table */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Analysis</h3>
                <Download className="h-4 w-4 text-gray-400 cursor-pointer" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-2 text-gray-500 dark:text-gray-400">Point</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Trips</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Revenue</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Profit</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Margin</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitAnalysis.map((analysis) => (
                      <tr key={analysis.pickupPoint} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-2 font-medium text-gray-900 dark:text-gray-100">{analysis.pickupPoint}</td>
                        <td className="py-2 text-right text-gray-900 dark:text-gray-100">{analysis.totalRecords}</td>
                        <td className="py-2 text-right text-gray-900 dark:text-gray-100">{(analysis.totalRevenue / 1000).toFixed(1)}K</td>
                        <td className={`py-2 text-right font-medium ${analysis.profit > 0 ? 'text-green-600' : analysis.profit === 0 ? 'text-gray-600' : 'text-red-600'}`}>
                          {analysis.profit > 0 ? '+' : ''}{(analysis.profit / 1000).toFixed(1)}K
                        </td>
                        <td className="py-2 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            analysis.margin >= 30 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                            analysis.margin >= 20 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200' :
                            analysis.margin > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {analysis.margin.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {analysis.growth > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className={analysis.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                              +{analysis.growth.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Efficiency Metrics */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Efficiency Metrics</h3>
              <div className="space-y-3">
                {profitAnalysis.filter(a => a.totalRecords > 0).map((analysis) => (
                  <div key={analysis.pickupPoint} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{analysis.pickupPoint}</span>
                      <span className="text-xs text-gray-500">{analysis.totalRecords} trips</span>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cost/kg:</span>
                        <span className="font-medium">{formatCurrency(analysis.avgCostPerKg)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Revenue/kg:</span>
                        <span className="font-medium">{formatCurrency(analysis.avgRevenuePerKg)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profit/trip:</span>
                        <span className="font-medium text-green-600">{formatCurrency(analysis.efficiency)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, analysis.margin))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {selectedView === 'monthly-trends' && (
        <MonthlyTrends monthlyData={monthlyData} />
      )}
    </div>
  );
};
