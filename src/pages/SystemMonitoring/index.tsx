import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  Database, 
  Users, 
  Truck,
  MapPin,
  Package,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Eye,
  RefreshCw
} from 'lucide-react';

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  resolved: boolean;
}

interface SystemMetric {
  name: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export const SystemMonitoringPage: React.FC = () => {
  const { sourceRecords, user } = useApp();
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-red-500">Access Denied: Admins only.</p>
      </div>
    );
  }

  // Mock system alerts
  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage',
      description: 'Server memory usage is at 85%. Consider optimizing or scaling.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      source: 'Server Monitor',
      resolved: false,
    },
    {
      id: '2',
      type: 'error',
      title: 'Database Connection Timeout',
      description: 'Failed to connect to primary database. Using backup connection.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      source: 'Database Monitor',
      resolved: true,
    },
    {
      id: '3',
      type: 'info',
      title: 'Scheduled Maintenance',
      description: 'System maintenance scheduled for tonight at 2:00 AM.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: 'System Admin',
      resolved: false,
    },
    {
      id: '4',
      type: 'success',
      title: 'Backup Completed',
      description: 'Daily backup completed successfully. 2.3GB backed up.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: 'Backup Service',
      resolved: true,
    },
  ];

  // Mock system metrics
  const systemMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: '45%',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Memory Usage',
      value: '78%',
      status: 'warning',
      trend: 'up',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Disk Space',
      value: '62%',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Database Connections',
      value: '23/100',
      status: 'healthy',
      trend: 'down',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Active Users',
      value: sourceRecords.length > 0 ? Math.floor(sourceRecords.length * 0.3) : 0,
      status: 'healthy',
      trend: 'up',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'API Response Time',
      value: '120ms',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
  ];

  // Calculate operational metrics
  const operationalMetrics = useMemo(() => {
    const totalRecords = sourceRecords.length;
    const todayRecords = sourceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const today = new Date();
      return recordDate.toDateString() === today.toDateString();
    }).length;

    const activeTrips = sourceRecords.filter(record => record.status === 'in-transit').length;
    const pendingPickups = sourceRecords.filter(record => record.status === 'loaded').length;
    const completedToday = sourceRecords.filter(record => record.status === 'delivered').length;

    return {
      totalRecords,
      todayRecords,
      activeTrips,
      pendingPickups,
      completedToday,
    };
  }, [sourceRecords]);

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getAlertColor = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
    }
  };

  const getMetricStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    }
  };

  const getTrendIcon = (trend: SystemMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'stable':
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time system health monitoring and alerts
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
            </span>
          </div>
          
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-3 py-1 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</p>
              <p className="text-xl font-bold text-green-600 truncate">Healthy</p>
              <p className="text-xs text-gray-500 mt-1 truncate">All systems operational</p>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
              <p className="text-xl font-bold text-yellow-600 truncate">
                {systemAlerts.filter(alert => !alert.resolved).length}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">Requires attention</p>
            </div>
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">99.9%</p>
              <p className="text-xs text-gray-500 mt-1 truncate">Last 30 days</p>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">120ms</p>
              <p className="text-xs text-gray-500 mt-1 truncate">Average</p>
            </div>
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20 flex-shrink-0">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Metrics</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.name}</span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metric.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {formatDate(metric.lastUpdated)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Operational Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Operational Metrics</h3>
          <Activity className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{operationalMetrics.totalRecords}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Records</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{operationalMetrics.todayRecords}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Today's Records</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Truck className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{operationalMetrics.activeTrips}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Trips</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{operationalMetrics.pendingPickups}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending Pickups</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{operationalMetrics.completedToday}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Today</div>
          </div>
        </div>
      </Card>

      {/* System Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Alerts</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {systemAlerts.filter(alert => !alert.resolved).length} unresolved
            </span>
            <Shield className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${getAlertColor(alert.type)} ${
                alert.resolved ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{alert.title}</h4>
                      {alert.resolved && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 rounded-full text-xs font-medium">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Source: {alert.source}</span>
                      <span>Time: {formatDate(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
                {!alert.resolved && (
                  <button className="px-3 py-1 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Trends</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Last 24 hours</span>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Performance chart would be displayed here</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Integration with monitoring tools like Grafana or custom charts
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
