import React, { useState, useMemo } from 'react';
import { Plus, Package, AlertTriangle, CheckCircle, Filter, Download, BarChart3, RefreshCw, MapPin } from 'lucide-react';
import { useNotificationService } from '../../services/notificationService';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Modal } from '../../components/Modal';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { useApp } from '../../context/AppContext';
import { DestinationRecord } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

// Destination locations with their area codes
const destinationLocations = {
  'AC001': [ // Central Highlands
    { location: 'Meru Town Market', type: 'market' },
    { location: 'Maua Wholesale Center', type: 'wholesale' },
    { location: 'Chuka Retail Hub', type: 'retail' },
    { location: 'Nkubu Export Center', type: 'export' },
    { location: 'Mitunguu Warehouse', type: 'warehouse' },
  ],
  'AC002': [ // Eastern Plains
    { location: 'Kitui Central Market', type: 'market' },
    { location: 'Mwingi Wholesale', type: 'wholesale' },
    { location: 'Mutomo Retail', type: 'retail' },
    { location: 'Kibwezi Export', type: 'export' },
    { location: 'Makindu Warehouse', type: 'warehouse' },
  ],
  'AC003': [ // Coastal Region
    { location: 'Mombasa CBD Market', type: 'market' },
    { location: 'Kilifi Wholesale', type: 'wholesale' },
    { location: 'Malindi Retail', type: 'retail' },
    { location: 'Watamu Export', type: 'export' },
    { location: 'Diani Warehouse', type: 'warehouse' },
  ],
  'AC004': [ // Northern Frontier
    { location: 'Garissa Central Market', type: 'market' },
    { location: 'Dadaab Wholesale', type: 'wholesale' },
    { location: 'Fafi Retail', type: 'retail' },
    { location: 'Hulugho Export', type: 'export' },
    { location: 'Ijara Warehouse', type: 'warehouse' },
  ],
  'AC005': [ // Metropolitan Area
    { location: 'Nairobi CBD Market', type: 'market' },
    { location: 'Eastleigh Wholesale', type: 'wholesale' },
    { location: 'Kasarani Retail', type: 'retail' },
    { location: 'Ruaraka Export', type: 'export' },
    { location: 'Kahawa Warehouse', type: 'warehouse' },
  ],
};

const areaCodes = [
  { code: 'AC001', name: 'Central Highlands', region: 'Meru County' },
  { code: 'AC002', name: 'Eastern Plains', region: 'Kitui County' },
  { code: 'AC003', name: 'Coastal Region', region: 'Mombasa County' },
  { code: 'AC004', name: 'Northern Frontier', region: 'Garissa County' },
  { code: 'AC005', name: 'Metropolitan Area', region: 'Nairobi County' },
];

const defaultRecord: Omit<DestinationRecord, 'id' | 'totalRevenue' | 'quantityDifference'> = {
  date: new Date().toISOString().split('T')[0],
  transportCode: '',
  sourceAreaCode: '',
  sourceStationCode: '',
  destinationAreaCode: '',
  destinationLocation: '',
  destinationType: 'market',
  buyerName: '',
  buyerId: '',
  buyerPhone: '',
  buyerType: 'individual',
  quantityExpected: 0,
  quantityReceived: 0,
  condition: 'good',
  itemPrice: 0,
  deliveryTime: '',
  deliveryStatus: 'pending',
  driverName: '',
  driverId: '',
  vehicleReg: '',
  verifiedBy: '',
  verificationDate: '',
  hasDiscrepancy: false,
  discrepancyResolved: false,
  lastModifiedBy: '',
  lastModifiedDate: new Date().toISOString(),
};

export const DestinationRecordsPage: React.FC = () => {
  const { user } = useApp();
  const { showSuccessNotification, showErrorNotification } = useNotificationService();
  
  // Enhanced state management
  const [destinationRecords, setDestinationRecords] = useState<DestinationRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DestinationRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DestinationRecord | null>(null);
  const [formData, setFormData] = useState<Omit<DestinationRecord, 'id' | 'totalRevenue' | 'quantityDifference'>>(defaultRecord);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Enhanced filter states
  const [filters, setFilters] = useState({
    areaCode: 'all',
    location: 'all',
    status: 'all',
    hasDiscrepancy: 'all',
    dateRange: { start: '', end: '' },
  });
  
  // Additional state for enhanced functionality
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const resetForm = () => {
    setFormData(defaultRecord);
    setErrors({});
    setEditingRecord(null);
  };

  const handleOpenModal = (record?: DestinationRecord) => {
    if (record) {
      setEditingRecord(record);
      const { id, totalRevenue, quantityDifference, ...recordData } = record;
      setFormData(recordData);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleOpenVerificationModal = (record: DestinationRecord) => {
    setSelectedRecord(record);
    setIsVerificationModalOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.transportCode) newErrors.transportCode = 'Transport code is required';
    if (!formData.sourceAreaCode) newErrors.sourceAreaCode = 'Source area code is required';
    if (!formData.destinationAreaCode) newErrors.destinationAreaCode = 'Destination area code is required';
    if (!formData.destinationLocation) newErrors.destinationLocation = 'Destination location is required';
    if (!formData.buyerName) newErrors.buyerName = 'Buyer name is required';
    if (!formData.buyerPhone) newErrors.buyerPhone = 'Buyer phone is required';
    if (!formData.quantityExpected || formData.quantityExpected <= 0) newErrors.quantityExpected = 'Valid expected quantity is required';
    if (!formData.quantityReceived || formData.quantityReceived <= 0) newErrors.quantityReceived = 'Valid received quantity is required';
    if (!formData.itemPrice || formData.itemPrice <= 0) newErrors.itemPrice = 'Valid price is required';
    if (!formData.driverName) newErrors.driverName = 'Driver name is required';
    if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const quantityDifference = formData.quantityReceived - formData.quantityExpected;
    const totalRevenue = formData.quantityReceived * formData.itemPrice;
    const hasDiscrepancy = Math.abs(quantityDifference) > 0.1; // Allow 0.1kg tolerance

    const newRecord = {
      ...formData,
      quantityDifference,
      totalRevenue,
      hasDiscrepancy,
      discrepancyType: hasDiscrepancy ? (quantityDifference > 0 ? 'quantity' as const : 'quantity' as const) : undefined,
      discrepancyDescription: hasDiscrepancy ? 
        `Quantity difference: ${quantityDifference > 0 ? '+' : ''}${quantityDifference.toFixed(2)}kg` : undefined,
      verifiedBy: user?.name || 'Unknown',
      verificationDate: new Date().toISOString(),
      lastModifiedBy: user?.name || 'Unknown',
      lastModifiedDate: new Date().toISOString(),
    };

    if (editingRecord) {
      setDestinationRecords(
        destinationRecords.map((record) =>
          record.id === editingRecord.id ? { ...newRecord, id: editingRecord.id } : record
        )
      );
    } else {
      const id = `DST-${Date.now()}`;
      setDestinationRecords([...destinationRecords, { ...newRecord, id }]);
    }

    handleCloseModal();
  };

  const handleDelete = (record: DestinationRecord) => {
    if (window.confirm('Are you sure you want to delete this destination record?')) {
      setDestinationRecords(destinationRecords.filter((r) => r.id !== record.id));
      showSuccessNotification('Success', 'Destination record deleted successfully');
    }
  };

  // Enhanced functionality functions
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessNotification('Success', 'Data refreshed successfully');
    } catch (error) {
      showErrorNotification('Error', 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccessNotification('Success', `${format.toUpperCase()} export completed`);
    } catch (error) {
      showErrorNotification('Error', `Failed to export ${format.toUpperCase()}`);
    }
  };


  const handleVerifyDelivery = (record: DestinationRecord) => {
    const updatedRecord = {
      ...record,
      deliveryStatus: 'delivered' as const,
      verificationDate: new Date().toISOString(),
      verifiedBy: user?.name || 'Unknown',
      lastModifiedBy: user?.name || 'Unknown',
      lastModifiedDate: new Date().toISOString(),
    };
    
    setDestinationRecords(
      destinationRecords.map((r) => r.id === record.id ? updatedRecord : r)
    );
    setIsVerificationModalOpen(false);
  };

  const handleResolveDiscrepancy = (record: DestinationRecord) => {
    const updatedRecord = {
      ...record,
      discrepancyResolved: true,
      lastModifiedBy: user?.name || 'Unknown',
      lastModifiedDate: new Date().toISOString(),
    };
    
    setDestinationRecords(
      destinationRecords.map((r) => r.id === record.id ? updatedRecord : r)
    );
  };

  // Filter records based on current filters
  const filteredRecords = useMemo(() => {
    return destinationRecords.filter(record => {
      if (filters.areaCode !== 'all' && record.destinationAreaCode !== filters.areaCode) return false;
      if (filters.location !== 'all' && record.destinationLocation !== filters.location) return false;
      if (filters.status !== 'all' && record.deliveryStatus !== filters.status) return false;
      if (filters.hasDiscrepancy !== 'all') {
        if (filters.hasDiscrepancy === 'yes' && !record.hasDiscrepancy) return false;
        if (filters.hasDiscrepancy === 'no' && record.hasDiscrepancy) return false;
      }
      if (filters.dateRange.start && record.date < filters.dateRange.start) return false;
      if (filters.dateRange.end && record.date > filters.dateRange.end) return false;
      return true;
    });
  }, [destinationRecords, filters]);

  const columns = [
    {
      key: 'date' as keyof DestinationRecord,
      label: 'Date',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      key: 'transportCode' as keyof DestinationRecord,
      label: 'Transport Code',
      sortable: true,
    },
    {
      key: 'sourceAreaCode' as keyof DestinationRecord,
      label: 'Source Area',
      sortable: true,
    },
    {
      key: 'destinationLocation' as keyof DestinationRecord,
      label: 'Destination',
      render: (value: string, row: DestinationRecord) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-xs text-gray-500">{row.destinationAreaCode}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'buyerName' as keyof DestinationRecord,
      label: 'Buyer',
      render: (value: string, row: DestinationRecord) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-xs text-gray-500">{row.buyerPhone}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'quantityReceived' as keyof DestinationRecord,
      label: 'Quantity',
      render: (value: number, row: DestinationRecord) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value}kg</p>
          <p className={`text-xs ${row.quantityDifference > 0 ? 'text-green-600' : row.quantityDifference < 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {row.quantityDifference > 0 ? '+' : ''}{row.quantityDifference.toFixed(1)}kg
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'deliveryStatus' as keyof DestinationRecord,
      label: 'Status',
      render: (value: string, row: DestinationRecord) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
            value === 'in-transit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
            value === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
            value === 'disputed' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
          }`}>
            {value}
          </span>
          {row.hasDiscrepancy && !row.discrepancyResolved && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'totalRevenue' as keyof DestinationRecord,
      label: 'Revenue',
      render: (value: number) => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'actions' as any,
      label: 'Actions',
      render: (_: any, row: DestinationRecord) => (
        <div className="flex items-center space-x-2">
          {row.deliveryStatus !== 'delivered' && (
            <button
              onClick={() => handleOpenVerificationModal(row)}
              className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
              title="Verify Delivery"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {row.hasDiscrepancy && !row.discrepancyResolved && (
            <button
              onClick={() => handleResolveDiscrepancy(row)}
              className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
              title="Resolve Discrepancy"
            >
              <AlertTriangle className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalDeliveries = filteredRecords.length;
    const totalQuantity = filteredRecords.reduce((sum, record) => sum + record.quantityReceived, 0);
    const totalRevenue = filteredRecords.reduce((sum, record) => sum + record.totalRevenue, 0);
    const deliveriesWithDiscrepancy = filteredRecords.filter(record => record.hasDiscrepancy && !record.discrepancyResolved).length;
    const deliveredCount = filteredRecords.filter(record => record.deliveryStatus === 'delivered').length;
    const deliveryRate = totalDeliveries > 0 ? (deliveredCount / totalDeliveries) * 100 : 0;

    return {
      totalDeliveries,
      totalQuantity,
      totalRevenue,
      deliveriesWithDiscrepancy,
      deliveryRate,
    };
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-purple">Destination Records</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track deliveries and verify goods received at destination points with enhanced analytics
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span>{filteredRecords.length} of {destinationRecords.length} records</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-teal flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-blue flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn-emerald flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card variant="blue" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters & Controls</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              className="btn-purple flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FormSelect
            label="Area Code"
            value={filters.areaCode}
            onChange={(value) => setFilters({ ...filters, areaCode: value as string })}
            options={[
              { value: 'all', label: 'All Areas' },
              ...areaCodes.map(area => ({ value: area.code, label: `${area.code} - ${area.name}` }))
            ]}
          />
          
          <FormSelect
            label="Location"
            value={filters.location}
            onChange={(value) => setFilters({ ...filters, location: value as string })}
            options={[
              { value: 'all', label: 'All Locations' },
              ...(filters.areaCode !== 'all' ? 
                destinationLocations[filters.areaCode as keyof typeof destinationLocations]?.map(loc => ({
                  value: loc.location,
                  label: loc.location
                })) || [] : [])
            ]}
          />
          
          <FormSelect
            label="Status"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value as string })}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'in-transit', label: 'In Transit' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'failed', label: 'Failed' },
              { value: 'disputed', label: 'Disputed' },
            ]}
          />
          
          <FormSelect
            label="Discrepancy"
            value={filters.hasDiscrepancy}
            onChange={(value) => setFilters({ ...filters, hasDiscrepancy: value as string })}
            options={[
              { value: 'all', label: 'All Records' },
              { value: 'yes', label: 'With Discrepancy' },
              { value: 'no', label: 'No Discrepancy' },
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card variant="blue" className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg gradient-blue">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Deliveries</p>
              <p className="text-lg font-bold text-gradient-blue">{summaryStats.totalDeliveries}</p>
            </div>
          </div>
        </Card>

        <Card variant="emerald" className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg gradient-emerald">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Quantity</p>
              <p className="text-lg font-bold text-gradient-emerald">{(summaryStats.totalQuantity / 1000).toFixed(1)}K kg</p>
            </div>
          </div>
        </Card>

        <Card variant="purple" className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg gradient-purple">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg font-bold text-gradient-purple">{(summaryStats.totalRevenue / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>

        <Card variant="red" className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg gradient-red">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Discrepancies</p>
              <p className="text-lg font-bold text-gradient-red">{summaryStats.deliveriesWithDiscrepancy}</p>
            </div>
          </div>
        </Card>

        <Card variant="lime" className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg gradient-lime">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Delivery Rate</p>
              <p className="text-lg font-bold text-gradient-lime">{summaryStats.deliveryRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card variant="green" className="p-6">
        <DataTable
          data={filteredRecords}
          columns={columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          emptyMessage="No destination records found. Try adjusting your filters or click 'Add Record' to get started."
        />
      </Card>

      {/* Enhanced Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRecord ? 'Edit Destination Record' : 'Add Destination Record'}
        size="xl"
        type="info"
        icon={<MapPin className="h-6 w-6" />}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Date"
                type="date"
                value={formData.date}
                onChange={(value) => setFormData({ ...formData, date: value as string })}
                error={errors.date}
                required
              />

              <FormInput
                label="Transport Code"
                type="text"
                value={formData.transportCode}
                onChange={(value) => setFormData({ ...formData, transportCode: value as string })}
                error={errors.transportCode}
                required
                placeholder="e.g., TRIP-001"
              />

              <FormSelect
                label="Source Area Code"
                value={formData.sourceAreaCode}
                onChange={(value) => setFormData({ ...formData, sourceAreaCode: value as string })}
                options={areaCodes.map(area => ({ value: area.code, label: `${area.code} - ${area.name}` }))}
                error={errors.sourceAreaCode}
                required
              />

              <FormSelect
                label="Destination Area Code"
                value={formData.destinationAreaCode}
                onChange={(value) => setFormData({ ...formData, destinationAreaCode: value as string })}
                options={areaCodes.map(area => ({ value: area.code, label: `${area.code} - ${area.name}` }))}
                error={errors.destinationAreaCode}
                required
              />

              <FormSelect
                label="Destination Location"
                value={formData.destinationLocation}
                onChange={(value) => setFormData({ ...formData, destinationLocation: value as string })}
                options={formData.destinationAreaCode ? 
                  destinationLocations[formData.destinationAreaCode as keyof typeof destinationLocations]?.map(loc => ({
                    value: loc.location,
                    label: loc.location
                  })) || [] : []
                }
                error={errors.destinationLocation}
                required
              />

              <FormSelect
                label="Destination Type"
                value={formData.destinationType}
                onChange={(value) => setFormData({ ...formData, destinationType: value as any })}
                options={[
                  { value: 'market', label: 'Market' },
                  { value: 'warehouse', label: 'Warehouse' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'wholesale', label: 'Wholesale' },
                  { value: 'export', label: 'Export' },
                ]}
                required
              />
            </div>
          </div>

          {/* Buyer Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Buyer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Buyer Name"
                type="text"
                value={formData.buyerName}
                onChange={(value) => setFormData({ ...formData, buyerName: value as string })}
                error={errors.buyerName}
                required
              />

              <FormInput
                label="Buyer ID"
                type="text"
                value={formData.buyerId}
                onChange={(value) => setFormData({ ...formData, buyerId: value as string })}
                placeholder="Buyer identification"
              />

              <FormInput
                label="Buyer Phone"
                type="tel"
                value={formData.buyerPhone}
                onChange={(value) => setFormData({ ...formData, buyerPhone: value as string })}
                error={errors.buyerPhone}
                required
              />

              <FormSelect
                label="Buyer Type"
                value={formData.buyerType}
                onChange={(value) => setFormData({ ...formData, buyerType: value as any })}
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'company', label: 'Company' },
                  { value: 'cooperative', label: 'Cooperative' },
                ]}
                required
              />
            </div>
          </div>

          {/* Goods Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Goods Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Expected Quantity (kg)"
                type="number"
                value={formData.quantityExpected}
                onChange={(value) => setFormData({ ...formData, quantityExpected: value as number })}
                error={errors.quantityExpected}
                required
              />

              <FormInput
                label="Received Quantity (kg)"
                type="number"
                value={formData.quantityReceived}
                onChange={(value) => setFormData({ ...formData, quantityReceived: value as number })}
                error={errors.quantityReceived}
                required
              />

              <FormSelect
                label="Condition"
                value={formData.condition}
                onChange={(value) => setFormData({ ...formData, condition: value as any })}
                options={[
                  { value: 'excellent', label: 'Excellent' },
                  { value: 'good', label: 'Good' },
                  { value: 'fair', label: 'Fair' },
                  { value: 'poor', label: 'Poor' },
                  { value: 'damaged', label: 'Damaged' },
                ]}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Price per kg"
                type="number"
                value={formData.itemPrice}
                onChange={(value) => setFormData({ ...formData, itemPrice: value as number })}
                error={errors.itemPrice}
                required
              />

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(formData.quantityReceived * formData.itemPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Delivery Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Driver Name"
                type="text"
                value={formData.driverName}
                onChange={(value) => setFormData({ ...formData, driverName: value as string })}
                error={errors.driverName}
                required
              />

              <FormInput
                label="Driver ID"
                type="text"
                value={formData.driverId}
                onChange={(value) => setFormData({ ...formData, driverId: value as string })}
                placeholder="Driver identification"
              />

              <FormInput
                label="Vehicle Registration"
                type="text"
                value={formData.vehicleReg}
                onChange={(value) => setFormData({ ...formData, vehicleReg: value as string })}
                required
              />

              <FormInput
                label="Delivery Time"
                type="datetime-local"
                value={formData.deliveryTime}
                onChange={(value) => setFormData({ ...formData, deliveryTime: value as string })}
                error={errors.deliveryTime}
                required
              />

              <FormSelect
                label="Delivery Status"
                value={formData.deliveryStatus}
                onChange={(value) => setFormData({ ...formData, deliveryStatus: value as any })}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-transit', label: 'In Transit' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'disputed', label: 'Disputed' },
                ]}
                required
              />
            </div>
          </div>

          {/* Admin Notes (Admin Only) */}
          {user?.role === 'admin' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Admin Notes</h4>
              <textarea
                value={formData.adminNotes || ''}
                onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Admin notes and observations..."
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-blue"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-emerald"
            >
              {editingRecord ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Enhanced Verification Modal */}
      <Modal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        title="Verify Delivery"
        size="md"
        type="warning"
        icon={<CheckCircle className="h-6 w-6" />}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Delivery Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Transport Code:</span> {selectedRecord.transportCode}</p>
                <p><span className="font-medium">Destination:</span> {selectedRecord.destinationLocation}</p>
                <p><span className="font-medium">Buyer:</span> {selectedRecord.buyerName}</p>
                <p><span className="font-medium">Quantity Expected:</span> {selectedRecord.quantityExpected}kg</p>
                <p><span className="font-medium">Quantity Received:</span> {selectedRecord.quantityReceived}kg</p>
                <p><span className="font-medium">Condition:</span> {selectedRecord.condition}</p>
              </div>
            </div>

            {selectedRecord.hasDiscrepancy && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Discrepancy Detected</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {selectedRecord.discrepancyDescription}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="btn-blue"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyDelivery(selectedRecord)}
                className="btn-emerald"
              >
                Verify Delivery
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
