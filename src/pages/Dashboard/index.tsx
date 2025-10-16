import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { useApp } from '../../context/AppContext';
import { useNotificationService } from '../../services/notificationService';
import { formatCurrency } from '../../utils/helpers';
import { 
  TrendingUp, 
  Package, 
  Truck, 
  MapPin, 
  FileText, 
  DollarSign, 
  Clock, 
  Shield,
  RefreshCw,
  ArrowRight,
  Calendar,
  Target,
  Bell,
  Settings,
  Search,
  Filter,
  Download,
  User,
  BarChart3,
  File,
  Keyboard,
  Eye,
  Star,
  Heart,
  Mail,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  Wifi,
  Battery,
  Volume2,
  Sun,
  Globe,
  Check,
  AlertCircle,
  Info,
  X,
  HardDrive,
  Database,
  Cpu
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { sourceRecords, user } = useApp();
  const { showSuccessNotification } = useNotificationService();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'overview' | 'activities' | 'analytics' | 'tools' | 'notifications' | 'settings') || 'overview';
  const [activeSection, setActiveSection] = useState<'overview' | 'activities' | 'analytics' | 'tools' | 'notifications' | 'settings'>(initialTab);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 67,
    storage: 23,
    network: 89
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'success', message: 'New record added successfully', time: '2m ago', read: false },
    { id: '2', type: 'warning', message: 'Low stock alert for Area AC001', time: '15m ago', read: false },
    { id: '3', type: 'info', message: 'System backup completed', time: '1h ago', read: true },
    { id: '4', type: 'error', message: 'Failed to sync with server', time: '2h ago', read: true },
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        storage: Math.max(10, Math.min(50, prev.storage + (Math.random() - 0.5) * 5)),
        network: Math.max(70, Math.min(100, prev.network + (Math.random() - 0.5) * 6))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate real stats from data
  const calculatedStats = {
    totalRecords: sourceRecords.length,
    totalGoodsIn: sourceRecords.reduce((sum, record) => sum + record.quantitySold, 0),
    totalCost: sourceRecords.reduce((sum, record) => sum + record.totalCost, 0),
    totalPackagingCost: sourceRecords.reduce((sum, record) => sum + (record.totalPackagingCost || 0), 0),
  };

  // Calculate pickup point statistics
  const pickupPointStats = [
    { point: 'AC001', records: sourceRecords.filter(r => r.areaCode === 'AC001').length, goods: sourceRecords.filter(r => r.areaCode === 'AC001').reduce((sum, r) => sum + r.quantitySold, 0) },
    { point: 'AC002', records: sourceRecords.filter(r => r.areaCode === 'AC002').length, goods: sourceRecords.filter(r => r.areaCode === 'AC002').reduce((sum, r) => sum + r.quantitySold, 0) },
    { point: 'AC003', records: sourceRecords.filter(r => r.areaCode === 'AC003').length, goods: sourceRecords.filter(r => r.areaCode === 'AC003').reduce((sum, r) => sum + r.quantitySold, 0) },
    { point: 'AC004', records: sourceRecords.filter(r => r.areaCode === 'AC004').length, goods: sourceRecords.filter(r => r.areaCode === 'AC004').reduce((sum, r) => sum + r.quantitySold, 0) },
  ];

  // Simplified stats cards with blue, green, red, purple palette
  const statsCards = user?.role === 'admin' ? [
    {
      title: 'Total Records',
      value: calculatedStats.totalRecords.toString(),
      icon: FileText,
      color: 'gradient-blue',
      textColor: 'text-gradient-blue',
      trend: '+12%',
      trendColor: 'text-blue-600',
      description: 'Records this month',
      bgPattern: 'from-blue-400/20 to-blue-600/20'
    },
    {
      title: 'Total Goods In',
      value: `${calculatedStats.totalGoodsIn}kg`,
      icon: Package,
      color: 'gradient-emerald',
      textColor: 'text-gradient-emerald',
      trend: '+8%',
      trendColor: 'text-green-600',
      description: 'Goods processed',
      bgPattern: 'from-emerald-400/20 to-emerald-600/20'
    },
    {
      title: 'Total Investment',
      value: formatCurrency(calculatedStats.totalCost),
      icon: DollarSign,
      color: 'gradient-purple',
      textColor: 'text-gradient-purple',
      trend: '+15%',
      trendColor: 'text-purple-600',
      description: 'Total capital',
      bgPattern: 'from-purple-400/20 to-purple-600/20'
    },
    {
      title: 'Packaging Costs',
      value: formatCurrency(calculatedStats.totalPackagingCost),
      icon: Package,
      color: 'gradient-red',
      textColor: 'text-gradient-red',
      trend: '+5%',
      trendColor: 'text-red-600',
      description: 'Packaging expenses',
      bgPattern: 'from-red-400/20 to-red-600/20'
    }
  ] : [
    {
      title: 'My Records',
      value: calculatedStats.totalRecords.toString(),
      icon: FileText,
      color: 'gradient-teal',
      textColor: 'text-gradient-teal',
      trend: '+12%',
      trendColor: 'text-blue-600',
      description: 'Records this month',
      bgPattern: 'from-teal-400/20 to-teal-600/20'
    },
    {
      title: 'Goods Processed',
      value: `${calculatedStats.totalGoodsIn}kg`,
      icon: Package,
      color: 'gradient-lime',
      textColor: 'text-gradient-lime',
      trend: '+8%',
      trendColor: 'text-green-600',
      description: 'Goods processed',
      bgPattern: 'from-lime-400/20 to-lime-600/20'
    },
    {
      title: 'Total Value',
      value: formatCurrency(calculatedStats.totalCost),
      icon: DollarSign,
      color: 'gradient-green-purple',
      textColor: 'text-gradient-green-purple',
      trend: '+15%',
      trendColor: 'text-purple-600',
      description: 'Total value',
      bgPattern: 'from-green-400/20 to-purple-400/20'
    },
    {
      title: 'Efficiency',
      value: '92%',
      icon: Target,
      color: 'gradient-mint',
      textColor: 'text-gradient-mint',
      trend: '+3%',
      trendColor: 'text-orange-600',
      description: 'Performance score',
      bgPattern: 'from-mint-400/20 to-mint-600/20'
    }
  ];

  // Mock recent activity data
  const recentActivity = [
    { id: '1', type: 'record', action: 'Added new source record', time: '2 minutes ago', icon: Package, color: 'text-green-600', user: 'John Doe', details: 'AC001 - 50kg miraa' },
    { id: '2', type: 'transport', action: 'Updated transport log', time: '15 minutes ago', icon: Truck, color: 'text-blue-600', user: 'Jane Smith', details: 'Trip TR-001 completed' },
    { id: '3', type: 'destination', action: 'Recorded delivery', time: '1 hour ago', icon: MapPin, color: 'text-purple-600', user: 'Bob Johnson', details: 'Nairobi delivery' },
    { id: '4', type: 'system', action: 'System backup completed', time: '2 hours ago', icon: Shield, color: 'text-gray-600', user: 'System', details: 'Daily backup' },
    { id: '5', type: 'alert', action: 'Low stock alert', time: '3 hours ago', icon: AlertCircle, color: 'text-yellow-600', user: 'System', details: 'Area AC002' },
  ];

  // Quick actions with simplified blue, green, red, purple palette
  const quickActions = [
    {
      title: 'Record Goods In',
      description: 'Add new source records',
      icon: Package,
      color: 'gradient-emerald',
      textColor: 'text-gradient-emerald',
      action: () => navigate('/source-records'),
      shortcut: 'Ctrl+N',
      category: 'primary',
      badge: 'New',
      bgPattern: 'from-emerald-400/20 to-emerald-600/20'
    },
    {
      title: 'Track Transport',
      description: 'Update transport logs',
      icon: Truck,
      color: 'gradient-blue',
      textColor: 'text-gradient-blue',
      action: () => navigate('/transport-log'),
      shortcut: 'Ctrl+T',
      category: 'primary',
      badge: 'Active',
      bgPattern: 'from-blue-400/20 to-blue-600/20'
    },
    {
      title: 'Record Delivery',
      description: 'Log destination records',
      icon: MapPin,
      color: 'gradient-purple',
      textColor: 'text-gradient-purple',
      action: () => navigate('/destination-records'),
      shortcut: 'Ctrl+D',
      category: 'primary',
      badge: 'Hot',
      bgPattern: 'from-purple-400/20 to-purple-600/20'
    },
    {
      title: 'View Reports',
      description: 'Check performance metrics',
      icon: BarChart3,
      color: 'gradient-red',
      textColor: 'text-gradient-red',
      action: () => navigate('/profit-reports'),
      shortcut: 'Ctrl+R',
      category: 'secondary',
      badge: null,
      bgPattern: 'from-red-400/20 to-red-600/20'
    },
    {
      title: 'Search Records',
      description: 'Find specific records',
      icon: Search,
      color: 'gradient-teal',
      textColor: 'text-gradient-teal',
      action: () => showSuccessNotification('Info', 'Search functionality coming soon'),
      shortcut: 'Ctrl+F',
      category: 'secondary',
      badge: null,
      bgPattern: 'from-teal-400/20 to-teal-600/20'
    },
    {
      title: 'Export Data',
      description: 'Download records',
      icon: Download,
      color: 'gradient-lime',
      textColor: 'text-gradient-lime',
      action: () => showSuccessNotification('Info', 'Export functionality coming soon'),
      shortcut: 'Ctrl+E',
      category: 'secondary',
      badge: null,
      bgPattern: 'from-lime-400/20 to-lime-600/20'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessNotification('Success', 'Dashboard refreshed successfully');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccessNotification('Success', `${format.toUpperCase()} export completed`);
    } catch (error) {
      showSuccessNotification('Error', `Failed to export ${format.toUpperCase()}`);
    }
  };

  const toggleFavorite = (actionTitle: string) => {
    setFavorites(prev => 
      prev.includes(actionTitle) 
        ? prev.filter(fav => fav !== actionTitle)
        : [...prev, actionTitle]
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const selectSection = (section: typeof activeSection) => {
    setActiveSection(section);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', section);
      return next;
    });
    // Optional lightweight feedback so the user knows the tab changed
    // Avoid spamming when repeatedly clicking the same tab
    showSuccessNotification('Switched', `${section.charAt(0).toUpperCase()}${section.slice(1)} view`);
    // Scroll to top for clarity on section change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep state in sync if user navigates browser history changing the tab param
  React.useEffect(() => {
    const urlTab = (searchParams.get('tab') as typeof activeSection) || 'overview';
    if (urlTab !== activeSection) {
      setActiveSection(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Status Bar */}
      <div className="space-y-4">
        {/* Status Bar */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {unreadNotifications} notifications
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">85%</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient-blue-green">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your miraa transport operations today
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Last updated: {currentTime.toLocaleString()}</span>
              <span>•</span>
              <span>System Status: <span className="text-green-600 font-medium">Healthy</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-glass flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20"
              type="button"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => selectSection('overview')}
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === 'overview' 
                    ? 'btn-emerald text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={activeSection === 'overview'}
              >
                Overview
              </button>
              <button
                onClick={() => selectSection('activities')}
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === 'activities' 
                    ? 'btn-emerald text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={activeSection === 'activities'}
              >
                Activities
              </button>
              <button
                onClick={() => selectSection('analytics')}
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === 'analytics' 
                    ? 'btn-emerald text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={activeSection === 'analytics'}
              >
                Analytics
              </button>
              <button
                onClick={() => selectSection('tools')}
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === 'tools' 
                    ? 'btn-emerald text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={activeSection === 'tools'}
              >
                Tools
              </button>
              <button
                onClick={() => selectSection('notifications')}
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                  activeSection === 'notifications' 
                    ? 'btn-emerald text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={activeSection === 'notifications'}
              >
                Notifications
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button
                onClick={() => selectSection('settings')}
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === 'settings' 
                    ? 'btn-emerald text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={activeSection === 'settings'}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Vibrant Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} variant="glass" className="group cursor-pointer hover-lift relative overflow-hidden">
            {/* Vibrant Background Pattern */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgPattern} opacity-30`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/20 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                    <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className={`flex items-center text-sm ${stat.trendColor}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  vs last week
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Sections */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card variant="blue" className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Quick Actions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Access your most used features</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Keyboard className="h-4 w-4" />
                <span>Use shortcuts for faster access</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`group p-6 rounded-xl border transition-all duration-200 hover:-translate-y-1 text-left relative overflow-hidden ${
                    action.category === 'primary' 
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg' 
                      : 'bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50 hover:shadow-md'
                  }`}
                >
                  {/* Vibrant Background Pattern */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.bgPattern} opacity-20`}>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/30 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-white/20 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {action.badge && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            action.badge === 'New' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                            action.badge === 'Active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                            action.badge === 'Hot' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                          }`}>
                            {action.badge}
                          </span>
                        )}
                        <div className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          {action.shortcut}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(action.title);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(action.title) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    </div>
                    <h4 className={`font-semibold ${action.textColor} mb-1`}>
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="purple" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Activity</h3>
              <button className="text-sm text-bright-green hover:text-green-600 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeSection === 'activities' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Timeline */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Activity Timeline</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${quickActions[index % quickActions.length].color} flex items-center justify-center`}>
                      <activity.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Efficiency Rate</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overall performance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">92%</p>
                  <p className="text-xs text-green-600">+5% this week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Avg. Processing Time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Per record</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">4.2m</p>
                  <p className="text-xs text-blue-600">-0.3m improvement</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeSection === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pickup Point Performance */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Pickup Point Performance</h3>
            <div className="space-y-4">
              {pickupPointStats.map((stat) => (
                <div key={stat.point} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-bright-green to-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{stat.point}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Area {stat.point}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.records} records</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stat.goods}kg</p>
                    <p className="text-xs text-gray-500">total goods</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Data Visualization */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Data Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Records This Month</span>
                  <span className="text-sm text-blue-600 dark:text-blue-300">+12%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Goods Processed</span>
                  <span className="text-sm text-green-600 dark:text-green-300">+8%</span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeSection === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Export Tools */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Export Data</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Export your records in various formats
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => handleExport('csv')}
                className="w-full btn-blue text-left flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </button>
              <button 
                onClick={() => handleExport('excel')}
                className="w-full btn-emerald text-left flex items-center"
              >
                <File className="h-4 w-4 mr-2" />
                Export as Excel
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                className="w-full btn-purple text-left flex items-center"
              >
                <File className="h-4 w-4 mr-2" />
                Export as PDF
              </button>
            </div>
          </Card>

          {/* Search Tools */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Search & Filter</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Find specific records quickly
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/source-records')}
                className="w-full btn-teal text-left flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </button>
              <button 
                onClick={() => setActiveSection('analytics')}
                className="w-full btn-lime text-left flex items-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Date Range Search
              </button>
              <button 
                onClick={() => navigate('/destination-records')}
                className="w-full btn-purple text-left flex items-center"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Location Search
              </button>
            </div>
          </Card>

          {/* System Tools */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Tools</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage your account and preferences
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/settings-card')}
                className="w-full btn-blue text-left flex items-center"
              >
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </button>
              <button 
                onClick={() => setActiveSection('notifications')}
                className="w-full btn-emerald text-left flex items-center"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </button>
              <button 
                onClick={() => navigate('/settings-card')}
                className="w-full btn-red text-left flex items-center"
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* User-specific actions */}
      {user?.role === 'user' && (
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Actions</h3>
            <div className="text-sm text-gray-500">
              Quick access to your daily tasks
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/source-records')}
              className="group p-6 border-2 border-bright-green border-dashed rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 hover:-translate-y-1 text-left"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-bright-green to-green-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Source Records</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Record goods received</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-bright-green">
                <ArrowRight className="h-4 w-4 mr-1" />
                Get Started
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/transport-log')}
              className="group p-6 border-2 border-blue-500 border-dashed rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:-translate-y-1 text-left"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Transport Log</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track vehicles and drivers</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <ArrowRight className="h-4 w-4 mr-1" />
                Track Now
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/destination-records')}
              className="group p-6 border-2 border-purple-500 border-dashed rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 hover:-translate-y-1 text-left"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Destination Records</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Record deliveries</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-purple-600">
                <ArrowRight className="h-4 w-4 mr-1" />
                Record Delivery
              </div>
            </button>
          </div>
        </Card>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <Card variant="glass" className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stay updated with system alerts</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    notifications.forEach(n => markNotificationAsRead(n.id));
                    showSuccessNotification('Success', 'All notifications marked as read');
                  }}
                  className="btn-blue text-sm"
                >
                  Mark All Read
                </button>
                <button 
                  onClick={() => setActiveSection('settings')}
                  className="btn-emerald text-sm flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                      notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      {notification.type === 'success' && <Check className="h-4 w-4 text-green-600" />}
                      {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {notification.type === 'error' && <X className="h-4 w-4 text-red-600" />}
                      {notification.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notification Settings */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive real-time alerts</p>
                  </div>
                </div>
                <button 
                  onClick={() => showSuccessNotification('Success', 'Push notifications toggled')}
                  className="w-12 h-6 bg-emerald-500 rounded-full relative transition-colors"
                >
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily summaries</p>
                  </div>
                </div>
                <button 
                  onClick={() => showSuccessNotification('Success', 'Email notifications toggled')}
                  className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative transition-colors"
                >
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Sound Alerts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Audio notifications</p>
                  </div>
                </div>
                <button 
                  onClick={() => showSuccessNotification('Success', 'Sound alerts toggled')}
                  className="w-12 h-6 bg-emerald-500 rounded-full relative transition-colors"
                >
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Cpu className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">CPU Usage</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Processing power</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{systemStatus.cpu.toFixed(0)}%</p>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${systemStatus.cpu}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <HardDrive className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Memory Usage</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">RAM utilization</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{systemStatus.memory.toFixed(0)}%</p>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${systemStatus.memory}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Storage</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Disk space</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{systemStatus.storage.toFixed(0)}%</p>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${systemStatus.storage}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Wifi className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Network</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connection speed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{systemStatus.network.toFixed(0)}%</p>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${systemStatus.network}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* User Preferences */}
          <Card variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">User Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Toggle theme</p>
                  </div>
                </div>
                <button className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Language</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">English (US)</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Timezone</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">EAT (UTC+3)</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Currency</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kenyan Shilling (KES)</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};