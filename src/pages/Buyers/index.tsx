import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { DataTable } from '../../components/DataTable';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  DollarSign, 
  Star, 
  CheckCircle, 
  CreditCard
} from 'lucide-react';

interface Buyer {
  id: string;
  buyerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  buyerType: 'individual' | 'company' | 'cooperative';
  location: string;
  areaCode: string;
  preferredDeliveryTime: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: 'cash' | 'credit' | 'net30' | 'net60';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  registrationDate: string;
  lastPurchaseDate?: string;
  totalPurchases: number;
  totalValue: number;
  averageOrderValue: number;
  loyaltyPoints: number;
  rating: number;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents?: {
    idCopy: boolean;
    businessLicense: boolean;
    taxCertificate: boolean;
  };
}

export const BuyersPage: React.FC = () => {
  const { user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    areaCode: 'all',
    paymentTerms: 'all',
  });

  // Mock buyers data
  const [buyers, setBuyers] = useState<Buyer[]>([
    {
      id: '1',
      buyerId: 'BYR-001',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+254 712 345678',
      company: 'Hassan Enterprises',
      buyerType: 'company',
      location: 'Nairobi CBD',
      areaCode: 'AC005',
      preferredDeliveryTime: '09:00-12:00',
      creditLimit: 500000,
      currentBalance: 125000,
      paymentTerms: 'net30',
      status: 'active',
      registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastPurchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      totalPurchases: 45,
      totalValue: 2250000,
      averageOrderValue: 50000,
      loyaltyPoints: 2250,
      rating: 4.8,
      notes: 'Reliable buyer, always pays on time',
      emergencyContact: {
        name: 'Fatima Hassan',
        phone: '+254 723 456789',
        relationship: 'Wife',
      },
      documents: {
        idCopy: true,
        businessLicense: true,
        taxCertificate: true,
      },
    },
    {
      id: '2',
      buyerId: 'BYR-002',
      firstName: 'Mary',
      lastName: 'Wanjiku',
      email: 'mary.wanjiku@email.com',
      phone: '+254 734 567890',
      buyerType: 'individual',
      location: 'Mombasa',
      areaCode: 'AC003',
      preferredDeliveryTime: '14:00-17:00',
      creditLimit: 100000,
      currentBalance: 0,
      paymentTerms: 'cash',
      status: 'active',
      registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastPurchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalPurchases: 12,
      totalValue: 480000,
      averageOrderValue: 40000,
      loyaltyPoints: 480,
      rating: 4.5,
      notes: 'Prefers morning deliveries',
    },
    {
      id: '3',
      buyerId: 'BYR-003',
      firstName: 'Cooperative',
      lastName: 'Farmers Union',
      email: 'info@farmersunion.co.ke',
      phone: '+254 745 678901',
      company: 'Meru Farmers Cooperative',
      buyerType: 'cooperative',
      location: 'Meru Town',
      areaCode: 'AC001',
      preferredDeliveryTime: '08:00-10:00',
      creditLimit: 1000000,
      currentBalance: 250000,
      paymentTerms: 'net60',
      status: 'active',
      registrationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      lastPurchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      totalPurchases: 78,
      totalValue: 3900000,
      averageOrderValue: 50000,
      loyaltyPoints: 3900,
      rating: 4.9,
      notes: 'Large volume buyer, seasonal patterns',
      emergencyContact: {
        name: 'John Mwangi',
        phone: '+254 756 789012',
        relationship: 'Secretary',
      },
      documents: {
        idCopy: true,
        businessLicense: true,
        taxCertificate: true,
      },
    },
    {
      id: '4',
      buyerId: 'BYR-004',
      firstName: 'Omar',
      lastName: 'Ali',
      email: 'omar.ali@email.com',
      phone: '+254 767 890123',
      buyerType: 'individual',
      location: 'Garissa',
      areaCode: 'AC004',
      preferredDeliveryTime: '10:00-14:00',
      creditLimit: 75000,
      currentBalance: 45000,
      paymentTerms: 'credit',
      status: 'suspended',
      registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastPurchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      totalPurchases: 8,
      totalValue: 240000,
      averageOrderValue: 30000,
      loyaltyPoints: 240,
      rating: 3.2,
      notes: 'Payment issues, account suspended',
    },
  ]);

  const [formData, setFormData] = useState<Omit<Buyer, 'id' | 'buyerId' | 'registrationDate' | 'totalPurchases' | 'totalValue' | 'averageOrderValue' | 'loyaltyPoints' | 'rating'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    buyerType: 'individual',
    location: '',
    areaCode: '',
    preferredDeliveryTime: '',
    creditLimit: 0,
    currentBalance: 0,
    paymentTerms: 'cash',
    status: 'pending',
    lastPurchaseDate: '',
    notes: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    documents: {
      idCopy: false,
      businessLicense: false,
      taxCertificate: false,
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      buyerType: 'individual',
      location: '',
      areaCode: '',
      preferredDeliveryTime: '',
      creditLimit: 0,
      currentBalance: 0,
      paymentTerms: 'cash',
      status: 'pending',
      lastPurchaseDate: '',
      notes: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      documents: {
        idCopy: false,
        businessLicense: false,
        taxCertificate: false,
      },
    });
    setEditingBuyer(null);
  };

  const handleOpenModal = (buyer?: Buyer) => {
    if (buyer) {
      setEditingBuyer(buyer);
      const { id, buyerId, registrationDate, totalPurchases, totalValue, averageOrderValue, loyaltyPoints, rating, ...buyerData } = buyer;
      setFormData(buyerData);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const newBuyer = {
      ...formData,
      registrationDate: now,
      totalPurchases: 0,
      totalValue: 0,
      averageOrderValue: 0,
      loyaltyPoints: 0,
      rating: 0,
    };

    if (editingBuyer) {
      setBuyers(
        buyers.map((buyer) =>
          buyer.id === editingBuyer.id ? { ...newBuyer, id: editingBuyer.id, buyerId: editingBuyer.buyerId } : buyer
        )
      );
    } else {
      const id = Date.now().toString();
      const buyerId = `BYR-${String(buyers.length + 1).padStart(3, '0')}`;
      setBuyers([...buyers, { ...newBuyer, id, buyerId }]);
    }

    handleCloseModal();
  };

  const handleDelete = (buyer: Buyer) => {
    if (window.confirm(`Are you sure you want to delete buyer ${buyer.firstName} ${buyer.lastName}?`)) {
      setBuyers(buyers.filter((b) => b.id !== buyer.id));
    }
  };

  // Filter buyers
  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const matchesSearch = filters.search === '' || 
        buyer.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        buyer.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        buyer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        buyer.company?.toLowerCase().includes(filters.search.toLowerCase()) ||
        buyer.buyerId.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = filters.type === 'all' || buyer.buyerType === filters.type;
      const matchesStatus = filters.status === 'all' || buyer.status === filters.status;
      const matchesAreaCode = filters.areaCode === 'all' || buyer.areaCode === filters.areaCode;
      const matchesPaymentTerms = filters.paymentTerms === 'all' || buyer.paymentTerms === filters.paymentTerms;

      return matchesSearch && matchesType && matchesStatus && matchesAreaCode && matchesPaymentTerms;
    });
  }, [buyers, filters]);

  const columns = [
    {
      key: 'buyerId' as keyof Buyer,
      label: 'Buyer ID',
      sortable: true,
    },
    {
      key: 'firstName' as keyof Buyer,
      label: 'Name',
      render: (value: string, row: Buyer) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value} {row.lastName}</p>
          <p className="text-xs text-gray-500">{row.company || 'Individual'}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'buyerType' as keyof Buyer,
      label: 'Type',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'company' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
          value === 'cooperative' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'location' as keyof Buyer,
      label: 'Location',
      render: (value: string, row: Buyer) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-xs text-gray-500">{row.areaCode}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status' as keyof Buyer,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          value === 'suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
          value === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200' :
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'totalValue' as keyof Buyer,
      label: 'Total Value',
      render: (value: number) => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'currentBalance' as keyof Buyer,
      label: 'Balance',
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600' : 'text-green-600'}>
          {formatCurrency(value)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'rating' as keyof Buyer,
      label: 'Rating',
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{value.toFixed(1)}</span>
        </div>
      ),
      sortable: true,
    },
  ];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalBuyers = buyers.length;
    const activeBuyers = buyers.filter(b => b.status === 'active').length;
    const totalValue = buyers.reduce((sum, buyer) => sum + buyer.totalValue, 0);
    const totalBalance = buyers.reduce((sum, buyer) => sum + buyer.currentBalance, 0);
    const averageRating = buyers.length > 0 ? buyers.reduce((sum, buyer) => sum + buyer.rating, 0) / buyers.length : 0;

    return {
      totalBuyers,
      activeBuyers,
      totalValue,
      totalBalance,
      averageRating,
    };
  }, [buyers]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-red-500">Access Denied: Admins only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buyers Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive buyer database and relationship management
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Buyer</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-500 flex-shrink-0">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Buyers</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.totalBuyers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-500 flex-shrink-0">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.activeBuyers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-500 flex-shrink-0">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{formatCurrency(summaryStats.totalValue)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-orange-500 flex-shrink-0">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Outstanding</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{formatCurrency(summaryStats.totalBalance)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-yellow-500 flex-shrink-0">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.averageRating.toFixed(1)}</p>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search buyers..."
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
              { value: 'individual', label: 'Individual' },
              { value: 'company', label: 'Company' },
              { value: 'cooperative', label: 'Cooperative' },
            ]}
          />
          
          <FormSelect
            label="Status"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value as string })}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
          
          <FormSelect
            label="Area Code"
            value={filters.areaCode}
            onChange={(value) => setFilters({ ...filters, areaCode: value as string })}
            options={[
              { value: 'all', label: 'All Areas' },
              { value: 'AC001', label: 'AC001 - Embu Area' },
              { value: 'AC002', label: 'AC002 - Mecca Area' },
              { value: 'AC003', label: 'AC003 - Ena Area' },
              { value: 'AC004', label: 'AC004 - Ugweri Area' },
            ]}
          />
          
          <FormSelect
            label="Payment Terms"
            value={filters.paymentTerms}
            onChange={(value) => setFilters({ ...filters, paymentTerms: value as string })}
            options={[
              { value: 'all', label: 'All Terms' },
              { value: 'cash', label: 'Cash' },
              { value: 'credit', label: 'Credit' },
              { value: 'net30', label: 'Net 30' },
              { value: 'net60', label: 'Net 60' },
            ]}
          />
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-6 overflow-x-auto">
        <DataTable
          data={filteredBuyers}
          columns={columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          emptyMessage="No buyers found matching the current filters."
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBuyer ? 'Edit Buyer' : 'Add New Buyer'}
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(value) => setFormData({ ...formData, firstName: value as string })}
                required
              />
              
              <FormInput
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(value) => setFormData({ ...formData, lastName: value as string })}
                required
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value as string })}
                required
              />
              
              <FormInput
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value as string })}
                required
              />
              
              <FormInput
                label="Company (Optional)"
                type="text"
                value={formData.company || ''}
                onChange={(value) => setFormData({ ...formData, company: value as string })}
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

          {/* Location & Delivery */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Location & Delivery</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                label="Location"
                type="text"
                value={formData.location}
                onChange={(value) => setFormData({ ...formData, location: value as string })}
                required
              />
              
              <FormSelect
                label="Area Code"
                value={formData.areaCode}
                onChange={(value) => setFormData({ ...formData, areaCode: value as string })}
                options={[
                  { value: 'AC001', label: 'AC001 - Embu Area' },
                  { value: 'AC002', label: 'AC002 - Mecca Area' },
                  { value: 'AC003', label: 'AC003 - Ena Area' },
                  { value: 'AC004', label: 'AC004 - Ugweri Area' },
                ]}
                required
              />
              
              <FormInput
                label="Preferred Delivery Time"
                type="text"
                value={formData.preferredDeliveryTime}
                onChange={(value) => setFormData({ ...formData, preferredDeliveryTime: value as string })}
                placeholder="e.g., 09:00-12:00"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Financial Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                label="Credit Limit"
                type="number"
                value={formData.creditLimit}
                onChange={(value) => setFormData({ ...formData, creditLimit: Number(value) })}
                required
              />
              
              <FormInput
                label="Current Balance"
                type="number"
                value={formData.currentBalance}
                onChange={(value) => setFormData({ ...formData, currentBalance: Number(value) })}
                required
              />
              
              <FormSelect
                label="Payment Terms"
                value={formData.paymentTerms}
                onChange={(value) => setFormData({ ...formData, paymentTerms: value as any })}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'credit', label: 'Credit' },
                  { value: 'net30', label: 'Net 30' },
                  { value: 'net60', label: 'Net 60' },
                ]}
                required
              />
              
              <FormSelect
                label="Status"
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value as any })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'pending', label: 'Pending' },
                ]}
                required
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Emergency Contact</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <FormInput
                label="Contact Name"
                type="text"
                value={formData.emergencyContact?.name || ''}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact!, name: value as string }
                })}
              />
              
              <FormInput
                label="Contact Phone"
                type="tel"
                value={formData.emergencyContact?.phone || ''}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact!, phone: value as string }
                })}
              />
              
              <FormInput
                label="Relationship"
                type="text"
                value={formData.emergencyContact?.relationship || ''}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact!, relationship: value as string }
                })}
              />
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Document Verification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.documents?.idCopy || false}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    documents: { ...formData.documents!, idCopy: e.target.checked }
                  })}
                  className="h-4 w-4 text-bright-green rounded border-gray-300 focus:ring-bright-green"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">ID Copy</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.documents?.businessLicense || false}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    documents: { ...formData.documents!, businessLicense: e.target.checked }
                  })}
                  className="h-4 w-4 text-bright-green rounded border-gray-300 focus:ring-bright-green"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Business License</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.documents?.taxCertificate || false}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    documents: { ...formData.documents!, taxCertificate: e.target.checked }
                  })}
                  className="h-4 w-4 text-bright-green rounded border-gray-300 focus:ring-bright-green"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Tax Certificate</label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={3}
              placeholder="Additional notes about this buyer..."
            />
          </div>

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
              {editingBuyer ? 'Update Buyer' : 'Create Buyer'}
            </button>
          </div>
        </form>
        </div>
      </Modal>

    </div>
  );
};
