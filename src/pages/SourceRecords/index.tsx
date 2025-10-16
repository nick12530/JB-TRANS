import React, { useState, useMemo } from 'react';
import { Plus, Package, Download, TrendingUp, TrendingDown, Calendar, BarChart3, Eye, RefreshCw } from 'lucide-react';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Modal } from '../../components/Modal';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { useApp } from '../../context/AppContext';
import { SourceRecord } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { useNotificationService } from '../../services/notificationService';

// 4 Key Area Codes with their pickup stations
const areaCodes = [
  {
    code: 'AC001',
    name: 'Embu Area',
    region: 'Embu County',
    pickupStations: [
      { code: 'ST001', name: 'Embu Town Station', location: 'Embu Town Center' },
    ]
  },
  {
    code: 'AC002', 
    name: 'Mecca Area',
    region: 'Mecca Region',
    pickupStations: [
      { code: 'ST002', name: 'Mecca Station', location: 'Mecca Center' },
    ]
  },
  {
    code: 'AC003',
    name: 'Ena Area', 
    region: 'Ena Region',
    pickupStations: [
      { code: 'ST003', name: 'Ena Station', location: 'Ena Center' },
    ]
  },
  {
    code: 'AC004',
    name: 'Ugweri Area',
    region: 'Ugweri Region', 
    pickupStations: [
      { code: 'ST004', name: 'Ugweri Station', location: 'Ugweri Center' },
    ]
  }
];

// Flatten pickup stations for easier selection
const pickupStations = areaCodes.flatMap(area => 
  area.pickupStations.map(station => ({
    value: station.code,
    label: `${station.code} - ${station.name}`,
    areaCode: area.code,
    areaName: area.name
  }))
);

// Drop-off points for each area
const dropOffPoints = {
  'AC001': ['Embu Town Center', 'Embu Market', 'Embu Industrial Area'],
  'AC002': ['Mecca Center', 'Mecca Market', 'Mecca Business District'],
  'AC003': ['Ena Center', 'Ena Market', 'Ena Commercial Area'],
  'AC004': ['Ugweri Center', 'Ugweri Market', 'Ugweri Business Hub']
};


const defaultRecord: Omit<SourceRecord, 'id' | 'totalCost' | 'totalPackagingCost'> = {
  date: new Date().toISOString().split('T')[0],
  pickupStationCode: 'ST001',
  areaCode: 'AC001',
  quantitySold: 0,
  itemPrice: 0,
  
  // Driver & Vehicle Info
  driverName: '',
  driverId: '',
  driverPhone: '',
  vehicleReg: '',
  vehicleMake: '',
  
  // Packaging Info
  packaging: {
    basins: 0,
    sacks: 0,
    boxes: 0,
  },
  packagingCosts: {
    basinCost: 0,
    sackCost: 0,
    boxCost: 0,
  },
  
  // Drop-off information
  dropOffPoint: '',
  estimatedDeliveryTime: '',
  
  assignedBy: '',
  status: 'loaded',
};

export const SourceRecordsPage: React.FC = () => {
  const { sourceRecords, setSourceRecords, user } = useApp();
  const { showSuccessNotification, showErrorNotification } = useNotificationService();
  
  // Enhanced state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SourceRecord | null>(null);
  const [formData, setFormData] = useState<Omit<SourceRecord, 'id' | 'totalCost' | 'totalPackagingCost'>>(defaultRecord);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // View state
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  const resetForm = () => {
    setFormData(defaultRecord);
    setErrors({});
    setEditingRecord(null);
  };

  const handleOpenModal = (record?: SourceRecord) => {
    if (record) {
      setEditingRecord(record);
      const { id, totalCost, ...recordData } = record;
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.pickupStationCode) newErrors.pickupStationCode = 'Pickup station is required';
    if (!formData.areaCode) newErrors.areaCode = 'Area code is required';
    if (!formData.quantitySold || formData.quantitySold <= 0) newErrors.quantitySold = 'Valid quantity is required';
    if (!formData.itemPrice || formData.itemPrice <= 0) newErrors.itemPrice = 'Valid price is required';
    if (!formData.driverName?.trim()) newErrors.driverName = 'Driver name is required';
    if (!formData.driverId?.trim()) newErrors.driverId = 'Driver ID is required';
    if (!formData.driverPhone?.trim()) newErrors.driverPhone = 'Driver phone is required';
    if (!formData.vehicleReg?.trim()) newErrors.vehicleReg = 'Vehicle registration is required';
    if (!formData.dropOffPoint?.trim()) newErrors.dropOffPoint = 'Drop-off point is required';
    if (!formData.estimatedDeliveryTime?.trim()) newErrors.estimatedDeliveryTime = 'Estimated delivery time is required';
    if (!formData.assignedBy?.trim()) newErrors.assignedBy = 'Data entry person is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const totalCost = formData.quantitySold * formData.itemPrice;
    const totalPackagingCost = 
      (formData.packaging.basins * formData.packagingCosts.basinCost) +
      (formData.packaging.sacks * formData.packagingCosts.sackCost) +
      (formData.packaging.boxes * formData.packagingCosts.boxCost);
    
    const newRecord = {
      ...formData,
      totalCost,
      totalPackagingCost,
      assignedBy: formData.assignedBy || user?.name || 'Unknown',
    };

    if (editingRecord) {
      setSourceRecords(
        sourceRecords.map((record) =>
          record.id === editingRecord.id ? { ...newRecord, id: editingRecord.id } : record
        )
      );
    } else {
      const id = `SRC-${Date.now()}`;
      setSourceRecords([...sourceRecords, { ...newRecord, id }]);
    }

    handleCloseModal();
  };

  const handleDelete = (record: SourceRecord) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setSourceRecords(sourceRecords.filter((r) => r.id !== record.id));
      showSuccessNotification('Success', 'Record deleted successfully');
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


  const handleBulkDelete = () => {
    if (selectedRecords.length === 0) {
      showErrorNotification('Error', 'No records selected');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} records?`)) {
      setSourceRecords(sourceRecords.filter(record => !selectedRecords.includes(record.id)));
      setSelectedRecords([]);
      showSuccessNotification('Success', `${selectedRecords.length} records deleted successfully`);
    }
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    if (selectedRecords.length === 0) {
      showErrorNotification('Error', 'No records selected');
      return;
    }
    
    setSourceRecords(sourceRecords.map(record => 
      selectedRecords.includes(record.id) 
        ? { ...record, status: newStatus as any }
        : record
    ));
    setSelectedRecords([]);
    showSuccessNotification('Success', `${selectedRecords.length} records updated to ${newStatus}`);
  };

  // Enhanced data processing
  const filteredRecords = useMemo(() => {
    let filtered = sourceRecords;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vehicleReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.pickupStationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.dropOffPoint.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Area filter
    if (areaFilter !== 'all') {
      filtered = filtered.filter(record => record.areaCode === areaFilter);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof SourceRecord];
      let bValue: any = b[sortBy as keyof SourceRecord];

      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [sourceRecords, searchTerm, statusFilter, areaFilter, dateRange, sortBy, sortOrder]);

  // Enhanced statistics
  const stats = useMemo(() => {
    const totalRecords = sourceRecords.length;
    const totalGoodsIn = sourceRecords.reduce((sum, record) => sum + record.quantitySold, 0);
    const totalCostValue = sourceRecords.reduce((sum, record) => sum + record.totalCost, 0);
    const totalPackagingCost = sourceRecords.reduce((sum, record) => sum + record.totalPackagingCost, 0);
    
    // Status breakdown
    const statusBreakdown = sourceRecords.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Area breakdown
    const areaBreakdown = sourceRecords.reduce((acc, record) => {
      acc[record.areaCode] = (acc[record.areaCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRecords = sourceRecords.filter(record => new Date(record.date) >= sevenDaysAgo);

    return {
      totalRecords,
      totalGoodsIn,
      totalCostValue,
      totalPackagingCost,
      statusBreakdown,
      areaBreakdown,
      recentRecords: recentRecords.length,
      avgCostPerKg: totalGoodsIn > 0 ? totalCostValue / totalGoodsIn : 0,
      avgPackagingPerRecord: totalRecords > 0 ? totalPackagingCost / totalRecords : 0
    };
  }, [sourceRecords]);

  const columns = [
    {
      key: 'date' as keyof SourceRecord,
      label: 'Date',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      key: 'pickupStationCode' as keyof SourceRecord,
      label: 'Station Code',
      sortable: true,
    },
    {
      key: 'areaCode' as keyof SourceRecord,
      label: 'Area Code',
      sortable: true,
    },
    {
      key: 'driverName' as keyof SourceRecord,
      label: 'Driver',
      sortable: true,
    },
    {
      key: 'dropOffPoint' as keyof SourceRecord,
      label: 'Drop-off Point',
      sortable: true,
    },
    {
      key: 'status' as keyof SourceRecord,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          value === 'in-transit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
        }`}>
          {value}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'packaging' as keyof SourceRecord,
      label: 'Packaging',
      render: (value: any) => {
        const { basins, sacks, boxes } = value;
        const parts = [];
        if (basins > 0) parts.push(`${basins}B`);
        if (sacks > 0) parts.push(`${sacks}S`);
        if (boxes > 0) parts.push(`${boxes}BG`);
        return parts.join(', ') || 'None';
      },
    },
    {
      key: 'quantitySold' as keyof SourceRecord,
      label: 'Quantity (kg)',
      render: (value: number) => `${value} kg`,
    },
    {
      key: 'totalCost' as keyof SourceRecord,
      label: 'Total Cost',
      render: (value: number) => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'assignedBy' as keyof SourceRecord,
      label: 'Entered By',
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-emerald">Source Records</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track miraa goods received from pickup points with enhanced analytics
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span>{filteredRecords.length} of {sourceRecords.length} records</span>
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
            onClick={() => handleOpenModal()}
            className="btn-emerald flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="emerald" className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-emerald">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-bold text-gradient-emerald">{stats.totalRecords}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">+{stats.recentRecords} this week</p>
            </div>
          </div>
        </Card>

        <Card variant="teal" className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-teal">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goods In</p>
              <p className="text-2xl font-bold text-gradient-teal">{stats.totalGoodsIn} kg</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg: {stats.avgCostPerKg.toFixed(0)}/kg</p>
            </div>
          </div>
        </Card>

        <Card variant="purple" className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-purple">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
              <p className="text-2xl font-bold text-gradient-purple">{formatCurrency(stats.totalCostValue)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Investment</p>
            </div>
          </div>
        </Card>

        <Card variant="red" className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg gradient-red">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Packaging Cost</p>
              <p className="text-2xl font-bold text-gradient-red">{formatCurrency(stats.totalPackagingCost)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg: {formatCurrency(stats.avgPackagingPerRecord)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Filters and Controls */}
      <Card variant="blue" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters & Controls</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              className="btn-blue flex items-center gap-2"
            >
              {viewMode === 'table' ? <Eye className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </button>
            <div className="relative">
              <button
                onClick={() => setSelectedRecords([])}
                className="btn-purple flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormInput
            label="Search"
            type="text"
            value={searchTerm}
            onChange={(value) => setSearchTerm(value as string)}
            placeholder="Search drivers, vehicles, stations..."
          />

          <FormSelect
            label="Status Filter"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as string)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'loaded', label: 'Loaded' },
              { value: 'in-transit', label: 'In Transit' },
              { value: 'delivered', label: 'Delivered' }
            ]}
          />

          <FormSelect
            label="Area Filter"
            value={areaFilter}
            onChange={(value) => setAreaFilter(value as string)}
            options={[
              { value: 'all', label: 'All Areas' },
              ...areaCodes.map(area => ({
                value: area.code,
                label: `${area.code} - ${area.name}`
              }))
            ]}
          />

          <FormSelect
            label="Sort By"
            value={sortBy}
            onChange={(value) => setSortBy(value as string)}
            options={[
              { value: 'date', label: 'Date' },
              { value: 'driverName', label: 'Driver' },
              { value: 'quantitySold', label: 'Quantity' },
              { value: 'totalCost', label: 'Total Cost' },
              { value: 'status', label: 'Status' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <FormInput
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(value) => setDateRange({ ...dateRange, start: value as string })}
            />
            <FormInput
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(value) => setDateRange({ ...dateRange, end: value as string })}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-lime flex items-center gap-2"
            >
              {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {selectedRecords.length} record(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('loaded')}
                  className="btn-emerald text-xs"
                >
                  Mark as Loaded
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('in-transit')}
                  className="btn-teal text-xs"
                >
                  Mark as In Transit
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('delivered')}
                  className="btn-lime text-xs"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="btn-red text-xs"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Enhanced Data Table */}
      <Card variant="green" className="p-6">
        <DataTable
          data={filteredRecords}
          columns={columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          emptyMessage="No source records found. Try adjusting your filters or click 'Add Record' to get started."
        />
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRecord ? 'Edit Source Record' : 'Add Source Record'}
        size="xl"
        type="success"
        icon={<Package className="h-6 w-6" />}
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

              <FormSelect
                label="Area Code"
                value={formData.areaCode}
                onChange={(value) => {
                  const selectedArea = areaCodes.find(area => area.code === value);
                  setFormData({ 
                    ...formData, 
                    areaCode: value as string,
                    pickupStationCode: selectedArea?.pickupStations[0]?.code || ''
                  });
                }}
                options={areaCodes.map(area => ({
                  value: area.code,
                  label: `${area.code} - ${area.name} (${area.region})`
                }))}
                error={errors.areaCode}
                required
              />

              <FormSelect
                label="Pickup Station"
                value={formData.pickupStationCode}
                onChange={(value) => setFormData({ ...formData, pickupStationCode: value as string })}
                options={pickupStations.filter(station => station.areaCode === formData.areaCode)}
                error={errors.pickupStationCode}
                required
              />

              <FormSelect
                label="Drop-off Point"
                value={formData.dropOffPoint}
                onChange={(value) => setFormData({ ...formData, dropOffPoint: value as string })}
                options={formData.areaCode ? dropOffPoints[formData.areaCode as keyof typeof dropOffPoints]?.map(point => ({
                  value: point,
                  label: point
                })) || [] : []}
                error={errors.dropOffPoint}
                required
              />

              <FormInput
                label="Estimated Delivery Time"
                type="datetime-local"
                value={formData.estimatedDeliveryTime}
                onChange={(value) => setFormData({ ...formData, estimatedDeliveryTime: value as string })}
                error={errors.estimatedDeliveryTime}
                required
              />

              <FormInput
                label="Quantity (kg)"
                type="number"
                value={formData.quantitySold}
                onChange={(value) => setFormData({ ...formData, quantitySold: value as number })}
                error={errors.quantitySold}
                required
                placeholder="Weight in kilograms"
              />

              <FormInput
                label="Price per kg"
                type="number"
                value={formData.itemPrice}
                onChange={(value) => setFormData({ ...formData, itemPrice: value as number })}
                error={errors.itemPrice}
                required
                placeholder="Price per kilogram"
              />
            </div>
          </div>

          {/* Driver & Vehicle Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Driver & Vehicle Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Driver Name"
                type="text"
                value={formData.driverName}
                onChange={(value) => setFormData({ ...formData, driverName: value as string })}
                error={errors.driverName}
                required
                placeholder="Driver full name"
              />

              <FormInput
                label="Driver ID"
                type="text"
                value={formData.driverId}
                onChange={(value) => setFormData({ ...formData, driverId: value as string })}
                error={errors.driverId}
                required
                placeholder="Driver identification"
              />

              <FormInput
                label="Driver Phone"
                type="tel"
                value={formData.driverPhone}
                onChange={(value) => setFormData({ ...formData, driverPhone: value as string })}
                placeholder="Driver phone number"
              />

              <FormInput
                label="Vehicle Registration"
                type="text"
                value={formData.vehicleReg}
                onChange={(value) => setFormData({ ...formData, vehicleReg: value as string })}
                error={errors.vehicleReg}
                required
                placeholder="e.g., KAA 123A"
              />

              <FormInput
                label="Vehicle Make"
                type="text"
                value={formData.vehicleMake || ''}
                onChange={(value) => setFormData({ ...formData, vehicleMake: value as string })}
                placeholder="e.g., Toyota Hiace"
                className="md:col-span-1"
              />
            </div>
          </div>

          {/* Packaging Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Packaging Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormInput
                label="Basins"
                type="number"
                value={formData.packaging.basins}
                onChange={(value) => setFormData({
                  ...formData,
                  packaging: { ...formData.packaging, basins: value as number }
                })}
                placeholder="Number of basins"
              />

              <FormInput
                label="Sacks"
                type="number"
                value={formData.packaging.sacks}
                onChange={(value) => setFormData({
                  ...formData,
                  packaging: { ...formData.packaging, sacks: value as number }
                })}
                placeholder="Number of sacks"
              />

              <FormInput
                label="Boxes"
                type="number"
                value={formData.packaging.boxes}
                onChange={(value) => setFormData({
                  ...formData,
                  packaging: { ...formData.packaging, boxes: value as number }
                })}
                placeholder="Number of boxes"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Basin Cost (each)"
                type="number"
                value={formData.packagingCosts.basinCost}
                onChange={(value) => setFormData({
                  ...formData,
                  packagingCosts: { ...formData.packagingCosts, basinCost: value as number }
                })}
                placeholder="Cost per basin"
              />

              <FormInput
                label="Sack Cost (each)"
                type="number"
                value={formData.packagingCosts.sackCost}
                onChange={(value) => setFormData({
                  ...formData,
                  packagingCosts: { ...formData.packagingCosts, sackCost: value as number }
                })}
                placeholder="Cost per sack"
              />

              <FormInput
                label="Box Cost (each)"
                type="number"
                value={formData.packagingCosts.boxCost}
                onChange={(value) => setFormData({
                  ...formData,
                  packagingCosts: { ...formData.packagingCosts, boxCost: value as number }
                })}
                placeholder="Cost per box"
              />
            </div>
          </div>

          {/* Data Entry Info */}
          <div>
            <FormInput
              label="Entered By"
              type="text"
              value={formData.assignedBy || user?.name || ''}
              onChange={(value) => setFormData({ ...formData, assignedBy: value as string })}
              error={errors.assignedBy}
              required
              placeholder="Person entering this data"
            />
          </div>

          {/* Auto-calculated totals */}
          {(formData.quantitySold > 0 && formData.itemPrice > 0) || formData.packaging.basins > 0 || formData.packaging.sacks > 0 || formData.packaging.boxes > 0 ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
              {formData.quantitySold > 0 && formData.itemPrice > 0 && (
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Goods Cost:</strong> {formatCurrency(formData.quantitySold * formData.itemPrice)}
                </p>
              )}
              
              <div className="text-sm text-green-800 dark:text-green-200">
                <strong>Packaging Cost:</strong>
                <div className="ml-4 space-y-1">
                  {formData.packaging.basins > 0 && (
                    <div>Basins: {formData.packaging.basins} × {formatCurrency(formData.packagingCosts.basinCost)} = {formatCurrency(formData.packaging.basins * formData.packagingCosts.basinCost)}</div>
                  )}
                  {formData.packaging.sacks > 0 && (
                    <div>Sacks: {formData.packaging.sacks} × {formatCurrency(formData.packagingCosts.sackCost)} = {formatCurrency(formData.packaging.sacks * formData.packagingCosts.sackCost)}</div>
                  )}
                  {formData.packaging.boxes > 0 && (
                    <div>Boxes: {formData.packaging.boxes} × {formatCurrency(formData.packagingCosts.boxCost)} = {formatCurrency(formData.packaging.boxes * formData.packagingCosts.boxCost)}</div>
                  )}
                  <div className="font-bold border-t pt-1 mt-1">
                    Total Packaging: {formatCurrency(
                      (formData.packaging.basins * formData.packagingCosts.basinCost) +
                      (formData.packaging.sacks * formData.packagingCosts.sackCost) +
                      (formData.packaging.boxes * formData.packagingCosts.boxCost)
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-sm font-bold text-green-800 dark:text-green-200 border-t pt-2">
                <strong>Grand Total:</strong> {formatCurrency(
                  (formData.quantitySold * formData.itemPrice) +
                  (formData.packaging.basins * formData.packagingCosts.basinCost) +
                  (formData.packaging.sacks * formData.packagingCosts.sackCost) +
                  (formData.packaging.boxes * formData.packagingCosts.boxCost)
                )}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-blue"
            >
              Cancel
            </button>
            <button type="submit" className="btn-emerald">
              {editingRecord ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
