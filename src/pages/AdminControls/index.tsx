import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { useApp } from '../../context/AppContext';
import { useNotificationService } from '../../services/notificationService';
import { 
  Settings, 
  Users, 
  Database, 
  Shield, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  Server,
  HardDrive,
  Save,
  X,
  Plus,
  BarChart3
} from 'lucide-react';

interface SystemBackup {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'full' | 'incremental' | 'manual';
  status: 'completed' | 'failed' | 'in-progress';
}

interface UserSession {
  id: string;
  userId: string;
  userName: string;
  role: string;
  loginTime: string;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

interface SystemConfig {
  maintenanceMode: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: number;
  maxFileSize: number;
  systemLogs: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

export const AdminControlsPage: React.FC = () => {
  const { user, sourceRecords, transportLogs } = useApp();
  const { showSuccessNotification, showErrorNotification, showWarningNotification } = useNotificationService();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system' | 'backup' | 'security'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'backup' | 'config' | 'user'>('config');
  
  // System configuration
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    maxFileSize: 10,
    systemLogs: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  // Mock data for demonstration
  const [backups, setBackups] = useState<SystemBackup[]>([
    {
      id: '1',
      name: 'Full Backup - 2024-01-20',
      size: '2.4 MB',
      createdAt: '2024-01-20 14:30:00',
      type: 'full',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Incremental Backup - 2024-01-19',
      size: '156 KB',
      createdAt: '2024-01-19 14:30:00',
      type: 'incremental',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Manual Backup - 2024-01-18',
      size: '1.8 MB',
      createdAt: '2024-01-18 10:15:00',
      type: 'manual',
      status: 'completed'
    }
  ]);

  const [activeSessions, setActiveSessions] = useState<UserSession[]>([
    {
      id: '1',
      userId: 'admin',
      userName: 'Admin User',
      role: 'admin',
      loginTime: '2024-01-20 09:00:00',
      lastActivity: '2024-01-20 15:30:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      isActive: true
    },
    {
      id: '2',
      userId: 'user1',
      userName: 'John Kimani',
      role: 'user',
      loginTime: '2024-01-20 08:30:00',
      lastActivity: '2024-01-20 14:45:00',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Android 10; Mobile)',
      isActive: true
    }
  ]);

  // System metrics
  const systemMetrics = {
    totalUsers: 12,
    activeUsers: activeSessions.filter(s => s.isActive).length,
    totalRecords: sourceRecords.length,
    systemUptime: '99.9%',
    storageUsed: '2.4 MB',
    lastBackup: backups[0]?.createdAt || 'Never',
    systemLoad: 'Low',
    memoryUsage: '45%',
    cpuUsage: '23%'
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card variant="enhanced" className="text-center p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only accessible to administrators.</p>
        </Card>
      </div>
    );
  }

  const handleSystemConfigChange = async (key: keyof SystemConfig, value: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSystemConfig(prev => ({ ...prev, [key]: value }));
      
      if (key === 'maintenanceMode') {
        showWarningNotification(
          value ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled',
          value 
            ? 'System is now in maintenance mode. Users will see a maintenance page.' 
            : 'System is now accessible to all users.'
        );
      } else {
        showSuccessNotification('Configuration Updated', 'System configuration has been saved successfully.');
      }
    } catch (error) {
      showErrorNotification('Update Failed', 'Failed to update system configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate backup process
      
      const newBackup: SystemBackup = {
        id: Date.now().toString(),
        name: `Manual Backup - ${new Date().toLocaleDateString()}`,
        size: '1.2 MB',
        createdAt: new Date().toLocaleString(),
        type: 'manual',
        status: 'completed'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      showSuccessNotification('Backup Created', 'System backup has been created successfully.');
      setShowModal(false);
    } catch (error) {
      showErrorNotification('Backup Failed', 'Failed to create system backup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
      showSuccessNotification('Session Terminated', 'User session has been terminated successfully.');
    } catch (error) {
      showErrorNotification('Termination Failed', 'Failed to terminate user session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const exportData = {
        sourceRecords,
        transportLogs,
        systemConfig,
        backups,
        activeSessions,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mwalimu-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccessNotification('Data Exported', 'System data has been exported successfully.');
    } catch (error) {
      showErrorNotification('Export Failed', 'Failed to export system data.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System Config', icon: Settings },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Controls</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              System administration and configuration management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">System Online</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Uptime: {systemMetrics.systemUptime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card variant="enhanced">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Admin Panel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                System administration tools
              </p>
            </div>
            
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 hover-lift ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-bright-green to-green-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="enhanced">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{systemMetrics.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </Card>

                <Card variant="enhanced">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{systemMetrics.activeUsers}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </Card>

                <Card variant="enhanced">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{systemMetrics.totalRecords}</p>
                    </div>
                    <Database className="h-8 w-8 text-purple-500" />
                  </div>
                </Card>

                <Card variant="enhanced">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{systemMetrics.systemUptime}</p>
                    </div>
                    <Server className="h-8 w-8 text-orange-500" />
                  </div>
                </Card>
              </div>

              {/* System Status */}
              <Card variant="enhanced">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">System Load</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{systemMetrics.systemLoad}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <HardDrive className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Memory Usage</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{systemMetrics.memoryUsage}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">CPU Usage</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{systemMetrics.cpuUsage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <Card variant="enhanced">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Active Sessions</h3>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add User</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Login Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Last Activity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">IP Address</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSessions.map((session) => (
                        <tr key={session.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{session.userName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{session.userId}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.role === 'admin' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                            }`}>
                              {session.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{session.loginTime}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{session.lastActivity}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{session.ipAddress}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleTerminateSession(session.id)}
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* System Configuration Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <Card variant="enhanced">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">System Configuration</h3>
                
                <div className="space-y-6">
                  {/* Maintenance Mode */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Maintenance Mode</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable maintenance mode to restrict user access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemConfig.maintenanceMode}
                        onChange={(e) => handleSystemConfigChange('maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                    </label>
                  </div>

                  {/* Auto Backup */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Automatic Backup</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable automatic system backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemConfig.autoBackup}
                        onChange={(e) => handleSystemConfigChange('autoBackup', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                    </label>
                  </div>

                  {/* Backup Frequency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      label="Backup Frequency"
                      value={systemConfig.backupFrequency}
                      onChange={(value) => handleSystemConfigChange('backupFrequency', value)}
                      options={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                      ]}
                    />

                    <FormInput
                      label="Data Retention (days)"
                      type="number"
                      value={systemConfig.dataRetention.toString()}
                      onChange={(value) => handleSystemConfigChange('dataRetention', parseInt(value as string))}
                    />
                  </div>

                  {/* Session Timeout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Session Timeout (minutes)"
                      type="number"
                      value={systemConfig.sessionTimeout.toString()}
                      onChange={(value) => handleSystemConfigChange('sessionTimeout', parseInt(value as string))}
                    />

                    <FormInput
                      label="Max File Size (MB)"
                      type="number"
                      value={systemConfig.maxFileSize.toString()}
                      onChange={(value) => handleSystemConfigChange('maxFileSize', parseInt(value as string))}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Backup & Restore Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <Card variant="enhanced">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Backup Management</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setModalType('backup');
                        setShowModal(true);
                      }}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Backup</span>
                    </button>
                    <button
                      onClick={handleExportData}
                      disabled={isLoading}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Data</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          backup.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                          backup.status === 'failed' ? 'bg-red-100 dark:bg-red-900/20' :
                          'bg-yellow-100 dark:bg-yellow-900/20'
                        }`}>
                          <Database className={`h-5 w-5 ${
                            backup.status === 'completed' ? 'text-green-600' :
                            backup.status === 'failed' ? 'text-red-600' :
                            'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{backup.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {backup.size} • {backup.type} • {backup.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          backup.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                          backup.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                        }`}>
                          {backup.status}
                        </span>
                        <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card variant="enhanced">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemConfig.twoFactorAuth}
                        onChange={(e) => handleSystemConfigChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                    </label>
                  </div>

                  {/* System Logs */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">System Logging</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable detailed system activity logging</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemConfig.systemLogs}
                        onChange={(e) => handleSystemConfigChange('systemLogs', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                    </label>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Send security alerts via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemConfig.emailNotifications}
                        onChange={(e) => handleSystemConfigChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'backup' ? 'Create System Backup' : 'Add New User'}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {modalType === 'backup' ? 'Create System Backup' : 'Add New User'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalType === 'backup' ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  This will create a complete backup of all system data including records, configurations, and user data.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateBackup}
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{isLoading ? 'Creating...' : 'Create Backup'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FormInput
                  label="Username"
                  type="text"
                  value=""
                  onChange={() => {}}
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  value=""
                  onChange={() => {}}
                  required
                />
                <FormSelect
                  label="Role"
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: 'user', label: 'User' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button className="btn-primary">
                    Add User
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};