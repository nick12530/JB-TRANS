import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Search, 
  Download, 
  Calendar, 
  User, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  TrendingUp,
  Shield,
  Database,
  Settings,
  Plus,
  Edit
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const AuditLogsPage: React.FC = () => {
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  // Mock audit logs data
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-01-20 15:30:45',
      userId: 'admin',
      userName: 'Admin User',
      action: 'CREATE',
      resource: 'Source Record',
      details: 'Created new pickup record for Area AC001 with 50kg miraa',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      severity: 'medium'
    },
    {
      id: '2',
      timestamp: '2024-01-20 14:25:12',
      userId: 'user1',
      userName: 'John Kimani',
      action: 'UPDATE',
      resource: 'Transport Log',
      details: 'Updated trip status from Loading to In Transit',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Android 10; Mobile)',
      status: 'success',
      severity: 'low'
    },
    {
      id: '3',
      timestamp: '2024-01-20 13:15:30',
      userId: 'admin',
      userName: 'Admin User',
      action: 'DELETE',
      resource: 'Destination Record',
      details: 'Deleted destination record for Trip #TRN001',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      severity: 'high'
    },
    {
      id: '4',
      timestamp: '2024-01-20 12:45:18',
      userId: 'user2',
      userName: 'Mary Wanjiku',
      action: 'LOGIN',
      resource: 'Authentication',
      details: 'User logged in successfully',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
      status: 'success',
      severity: 'low'
    },
    {
      id: '5',
      timestamp: '2024-01-20 11:30:55',
      userId: 'unknown',
      userName: 'Unknown User',
      action: 'LOGIN',
      resource: 'Authentication',
      details: 'Failed login attempt with invalid credentials',
      ipAddress: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'failed',
      severity: 'critical'
    },
    {
      id: '6',
      timestamp: '2024-01-20 10:20:33',
      userId: 'admin',
      userName: 'Admin User',
      action: 'CONFIG',
      resource: 'System Settings',
      details: 'Updated system configuration: enabled maintenance mode',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      severity: 'high'
    },
    {
      id: '7',
      timestamp: '2024-01-20 09:15:42',
      userId: 'user1',
      userName: 'John Kimani',
      action: 'VIEW',
      resource: 'Profit Reports',
      details: 'Viewed monthly profit analysis report',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Android 10; Mobile)',
      status: 'success',
      severity: 'low'
    },
    {
      id: '8',
      timestamp: '2024-01-20 08:45:27',
      userId: 'admin',
      userName: 'Admin User',
      action: 'BACKUP',
      resource: 'System Backup',
      details: 'Created manual system backup',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      severity: 'medium'
    }
  ];

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

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === '' || log.status === filterStatus;
      const matchesSeverity = filterSeverity === '' || log.severity === filterSeverity;
      const matchesDate = filterDate === '' || log.timestamp.startsWith(filterDate);

      return matchesSearch && matchesStatus && matchesSeverity && matchesDate;
    });
  }, [auditLogs, searchTerm, filterStatus, filterSeverity, filterDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalLogs = auditLogs.length;
    const successLogs = auditLogs.filter(log => log.status === 'success').length;
    const failedLogs = auditLogs.filter(log => log.status === 'failed').length;
    const criticalLogs = auditLogs.filter(log => log.severity === 'critical').length;
    const todayLogs = auditLogs.filter(log => log.timestamp.startsWith('2024-01-20')).length;

    return {
      totalLogs,
      successLogs,
      failedLogs,
      criticalLogs,
      todayLogs,
      successRate: totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 0
    };
  }, [auditLogs]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus className="h-4 w-4 text-green-600" />;
      case 'UPDATE': return <Edit className="h-4 w-4 text-blue-600" />;
      case 'DELETE': return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'LOGIN': return <User className="h-4 w-4 text-purple-600" />;
      case 'VIEW': return <Eye className="h-4 w-4 text-gray-600" />;
      case 'CONFIG': return <Settings className="h-4 w-4 text-orange-600" />;
      case 'BACKUP': return <Database className="h-4 w-4 text-indigo-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleSelectLog = (logId: string) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map(log => log.id));
    }
  };

  const handleExportLogs = () => {
    const logsToExport = selectedLogs.length > 0 
      ? filteredLogs.filter(log => selectedLogs.includes(log.id))
      : filteredLogs;

    const exportData = {
      auditLogs: logsToExport,
      exportDate: new Date().toISOString(),
      filters: {
        searchTerm,
        filterStatus,
        filterSeverity,
        filterDate
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Audit Logs</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              System activity tracking and compliance monitoring
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Logging Active</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.totalLogs} total entries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card variant="enhanced">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalLogs}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card variant="enhanced">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.successRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card variant="enhanced">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed Actions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.failedLogs}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card variant="enhanced">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.criticalLogs}</p>
            </div>
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card variant="enhanced">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Activity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.todayLogs}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card variant="enhanced" className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
              />
            </div>

            <FormSelect
              label=""
              value={filterStatus}
              onChange={(value) => setFilterStatus(value as string)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'success', label: 'Success' },
                { value: 'failed', label: 'Failed' },
                { value: 'warning', label: 'Warning' },
              ]}
              className="w-full sm:w-40"
            />

            <FormSelect
              label=""
              value={filterSeverity}
              onChange={(value) => setFilterSeverity(value as string)}
              options={[
                { value: '', label: 'All Severity' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
              className="w-full sm:w-40"
            />

            <FormInput
              label=""
              type="date"
              value={filterDate}
              onChange={(value) => setFilterDate(value as string)}
              className="w-full sm:w-40"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportLogs}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card variant="enhanced">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-bright-green rounded"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Resource</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Details</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Severity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => handleSelectLog(log.id)}
                      className="form-checkbox h-4 w-4 text-bright-green rounded"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{log.userName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{log.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className="font-medium text-gray-900 dark:text-gray-100">{log.action}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{log.resource}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{log.details}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                        log.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No logs found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};