import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { DataTable } from '../../components/DataTable';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  Eye,
  Activity,
  FileText,
  Download
} from 'lucide-react';

interface DiscrepancyReport {
  id: string;
  transportCode: string;
  sourceAreaCode: string;
  destinationAreaCode: string;
  driverName: string;
  driverPhone: string;
  vehicleReg: string;
  discrepancyType: 'quantity' | 'condition' | 'time' | 'location' | 'other';
  description: string;
  expectedValue: string | number;
  actualValue: string | number;
  discrepancyAmount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  investigationNotes?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export const DiscrepancyReportsPage: React.FC = () => {
  const { user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<DiscrepancyReport | null>(null);
  const [selectedReport, setSelectedReport] = useState<DiscrepancyReport | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    severity: 'all',
    status: 'all',
    dateRange: { start: '', end: '' },
  });

  // Mock discrepancy reports
  const [discrepancyReports, setDiscrepancyReports] = useState<DiscrepancyReport[]>([
    {
      id: '1',
      transportCode: 'TRIP-001',
      sourceAreaCode: 'AC001',
      destinationAreaCode: 'AC005',
      driverName: 'John Kimani',
      driverPhone: '+254 712 345678',
      vehicleReg: 'KAA 123A',
      discrepancyType: 'quantity',
      description: 'Quantity mismatch between pickup and delivery',
      expectedValue: 50,
      actualValue: 47,
      discrepancyAmount: -3,
      severity: 'medium',
      status: 'investigating',
      reportedBy: 'Sarah Mwangi',
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Admin User',
      investigationNotes: 'Driver claims no knowledge of missing goods. Checking CCTV footage.',
    },
    {
      id: '2',
      transportCode: 'TRIP-002',
      sourceAreaCode: 'AC002',
      destinationAreaCode: 'AC003',
      driverName: 'Peter Wanjiku',
      driverPhone: '+254 723 456789',
      vehicleReg: 'KBC 567B',
      discrepancyType: 'condition',
      description: 'Goods arrived in poor condition',
      expectedValue: 'Good',
      actualValue: 'Damaged',
      discrepancyAmount: 0,
      severity: 'high',
      status: 'resolved',
      reportedBy: 'Buyer Representative',
      reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Admin User',
      investigationNotes: 'Driver reported rough road conditions.',
      resolutionNotes: 'Compensation provided to buyer. Driver warned about handling.',
      resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      resolvedBy: 'Admin User',
    },
    {
      id: '3',
      transportCode: 'TRIP-003',
      sourceAreaCode: 'AC003',
      destinationAreaCode: 'AC001',
      driverName: 'Mary Njoki',
      driverPhone: '+254 734 567890',
      vehicleReg: 'KAB 789C',
      discrepancyType: 'time',
      description: 'Delivery delayed by 3 hours',
      expectedValue: '14:00',
      actualValue: '17:00',
      discrepancyAmount: 180,
      severity: 'low',
      status: 'pending',
      reportedBy: 'Destination Manager',
      reportedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]);

  const [formData, setFormData] = useState<Omit<DiscrepancyReport, 'id' | 'reportedAt'>>({
    transportCode: '',
    sourceAreaCode: '',
    destinationAreaCode: '',
    driverName: '',
    driverPhone: '',
    vehicleReg: '',
    discrepancyType: 'quantity',
    description: '',
    expectedValue: '',
    actualValue: '',
    discrepancyAmount: 0,
    severity: 'medium',
    status: 'pending',
    reportedBy: user?.name || '',
    assignedTo: '',
    investigationNotes: '',
    resolutionNotes: '',
    resolvedAt: '',
    resolvedBy: '',
  });

  const resetForm = () => {
    setFormData({
      transportCode: '',
      sourceAreaCode: '',
      destinationAreaCode: '',
      driverName: '',
      driverPhone: '',
      vehicleReg: '',
      discrepancyType: 'quantity',
      description: '',
      expectedValue: '',
      actualValue: '',
      discrepancyAmount: 0,
      severity: 'medium',
      status: 'pending',
      reportedBy: user?.name || '',
      assignedTo: '',
      investigationNotes: '',
      resolutionNotes: '',
      resolvedAt: '',
      resolvedBy: '',
    });
    setEditingReport(null);
  };

  const handleOpenModal = (report?: DiscrepancyReport) => {
    if (report) {
      setEditingReport(report);
      const { id, reportedAt, ...reportData } = report;
      setFormData(reportData);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleViewReport = (report: DiscrepancyReport) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const newReport = {
      ...formData,
      reportedAt: now,
    };

    if (editingReport) {
      setDiscrepancyReports(
        discrepancyReports.map((report) =>
          report.id === editingReport.id ? { ...newReport, id: editingReport.id } : report
        )
      );
    } else {
      const id = Date.now().toString();
      setDiscrepancyReports([...discrepancyReports, { ...newReport, id }]);
    }

    handleCloseModal();
  };

  const handleDelete = (report: DiscrepancyReport) => {
    if (window.confirm('Are you sure you want to delete this discrepancy report?')) {
      setDiscrepancyReports(discrepancyReports.filter((r) => r.id !== report.id));
    }
  };

  const handleResolve = (reportId: string) => {
    const now = new Date().toISOString();
    setDiscrepancyReports(
      discrepancyReports.map((report) =>
        report.id === reportId 
          ? { 
              ...report, 
              status: 'resolved' as const,
              resolvedAt: now,
              resolvedBy: user?.name || 'Unknown'
            } 
          : report
      )
    );
  };

  // Filter reports
  const filteredReports = useMemo(() => {
    return discrepancyReports.filter((report) => {
      const matchesSearch = filters.search === '' || 
        report.transportCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.driverName.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = filters.type === 'all' || report.discrepancyType === filters.type;
      const matchesSeverity = filters.severity === 'all' || report.severity === filters.severity;
      const matchesStatus = filters.status === 'all' || report.status === filters.status;
      
      const matchesDateRange = 
        (filters.dateRange.start === '' || report.reportedAt >= filters.dateRange.start) &&
        (filters.dateRange.end === '' || report.reportedAt <= filters.dateRange.end);

      return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesDateRange;
    });
  }, [discrepancyReports, filters]);

  const columns = [
    {
      key: 'transportCode' as keyof DiscrepancyReport,
      label: 'Transport Code',
      sortable: true,
    },
    {
      key: 'driverName' as keyof DiscrepancyReport,
      label: 'Driver',
      render: (value: string, row: DiscrepancyReport) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-xs text-gray-500">{row.vehicleReg}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'discrepancyType' as keyof DiscrepancyReport,
      label: 'Type',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'quantity' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
          value === 'condition' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
          value === 'time' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
          value === 'location' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'severity' as keyof DiscrepancyReport,
      label: 'Severity',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
          value === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status' as keyof DiscrepancyReport,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          value === 'investigating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
          value === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'reportedAt' as keyof DiscrepancyReport,
      label: 'Reported',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
  ];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalReports = discrepancyReports.length;
    const pendingReports = discrepancyReports.filter(r => r.status === 'pending').length;
    const investigatingReports = discrepancyReports.filter(r => r.status === 'investigating').length;
    const resolvedReports = discrepancyReports.filter(r => r.status === 'resolved').length;
    const criticalReports = discrepancyReports.filter(r => r.severity === 'critical').length;

    return {
      totalReports,
      pendingReports,
      investigatingReports,
      resolvedReports,
      criticalReports,
    };
  }, [discrepancyReports]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-red-500">Access Denied: Admins only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Discrepancy Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage discrepancies between pickup and delivery
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Report Discrepancy</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-500">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.totalReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-yellow-500">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.pendingReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-orange-500">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Investigating</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.investigatingReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-500">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.resolvedReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-red-500">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Critical</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.criticalReports}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-bright-green focus:border-bright-green"
            />
          </div>
          
          <FormSelect
            label="Type"
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value as string })}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'quantity', label: 'Quantity' },
              { value: 'condition', label: 'Condition' },
              { value: 'time', label: 'Time' },
              { value: 'location', label: 'Location' },
              { value: 'other', label: 'Other' },
            ]}
          />
          
          <FormSelect
            label="Severity"
            value={filters.severity}
            onChange={(value) => setFilters({ ...filters, severity: value as string })}
            options={[
              { value: 'all', label: 'All Severity' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
          />
          
          <FormSelect
            label="Status"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value as string })}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'investigating', label: 'Investigating' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'dismissed', label: 'Dismissed' },
            ]}
          />
          
          <div className="flex space-x-2">
            <FormInput
              label="Start Date"
              type="date"
              value={filters.dateRange.start}
              onChange={(value) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: value as string } })}
            />
            <FormInput
              label="End Date"
              type="date"
              value={filters.dateRange.end}
              onChange={(value) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: value as string } })}
            />
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-6">
        <DataTable
          data={filteredReports}
          columns={columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          emptyMessage="No discrepancy reports found."
          actions={[
            {
              label: 'View',
              icon: <Eye className="h-4 w-4" />,
              onClick: handleViewReport,
            },
            {
              label: 'Resolve',
              icon: <CheckCircle className="h-4 w-4" />,
              onClick: (report: DiscrepancyReport) => handleResolve(report.id),
              condition: (report: DiscrepancyReport) => report.status !== 'resolved',
            },
          ]}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingReport ? 'Edit Discrepancy Report' : 'Report Discrepancy'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Transport Code"
                type="text"
                value={formData.transportCode}
                onChange={(value) => setFormData({ ...formData, transportCode: value as string })}
                required
              />
              
              <FormSelect
                label="Discrepancy Type"
                value={formData.discrepancyType}
                onChange={(value) => setFormData({ ...formData, discrepancyType: value as any })}
                options={[
                  { value: 'quantity', label: 'Quantity Mismatch' },
                  { value: 'condition', label: 'Condition Issue' },
                  { value: 'time', label: 'Time Delay' },
                  { value: 'location', label: 'Location Error' },
                  { value: 'other', label: 'Other' },
                ]}
                required
              />
              
              <FormInput
                label="Driver Name"
                type="text"
                value={formData.driverName}
                onChange={(value) => setFormData({ ...formData, driverName: value as string })}
                required
              />
              
              <FormInput
                label="Vehicle Registration"
                type="text"
                value={formData.vehicleReg}
                onChange={(value) => setFormData({ ...formData, vehicleReg: value as string })}
                required
              />
            </div>
          </div>

          {/* Discrepancy Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Discrepancy Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Expected Value"
                type="text"
                value={formData.expectedValue}
                onChange={(value) => setFormData({ ...formData, expectedValue: value as string })}
                required
              />
              
              <FormInput
                label="Actual Value"
                type="text"
                value={formData.actualValue}
                onChange={(value) => setFormData({ ...formData, actualValue: value as string })}
                required
              />
              
              <FormSelect
                label="Severity"
                value={formData.severity}
                onChange={(value) => setFormData({ ...formData, severity: value as any })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ]}
                required
              />
              
              <FormSelect
                label="Status"
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value as any })}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'investigating', label: 'Investigating' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'dismissed', label: 'Dismissed' },
                ]}
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Describe the discrepancy in detail..."
                required
              />
            </div>
          </div>

          {/* Investigation Notes (Admin Only) */}
          {user?.role === 'admin' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Investigation</h4>
              <div className="space-y-4">
                <FormInput
                  label="Assigned To"
                  type="text"
                  value={formData.assignedTo || ''}
                  onChange={(value) => setFormData({ ...formData, assignedTo: value as string })}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investigation Notes
                  </label>
                  <textarea
                    value={formData.investigationNotes || ''}
                    onChange={(e) => setFormData({ ...formData, investigationNotes: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Investigation findings and notes..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resolution Notes
                  </label>
                  <textarea
                    value={formData.resolutionNotes || ''}
                    onChange={(e) => setFormData({ ...formData, resolutionNotes: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Resolution details and actions taken..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {editingReport ? 'Update Report' : 'Create Report'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Discrepancy Report Details"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transport Code</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedReport.transportCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Driver</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedReport.driverName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedReport.vehicleReg}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{selectedReport.discrepancyType}</p>
              </div>
            </div>

            {/* Discrepancy Details */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description</p>
              <p className="text-gray-900 dark:text-gray-100">{selectedReport.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expected</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedReport.expectedValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Actual</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedReport.actualValue}</p>
              </div>
            </div>

            {/* Investigation Details */}
            {selectedReport.investigationNotes && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Investigation Notes</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedReport.investigationNotes}</p>
              </div>
            )}

            {/* Resolution Details */}
            {selectedReport.resolutionNotes && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Resolution Notes</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedReport.resolutionNotes}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Timeline</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reported</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedReport.reportedAt)}</span>
                </div>
                {selectedReport.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedReport.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              {selectedReport.status !== 'resolved' && (
                <button
                  onClick={() => {
                    handleResolve(selectedReport.id);
                    setIsViewModalOpen(false);
                  }}
                  className="px-4 py-2 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
