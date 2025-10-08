import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { DataTable } from '../../components/DataTable';
import { useApp } from '../../context/AppContext';
import { useNotificationService } from '../../services/notificationService';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  UserX, 
  Shield,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface StaffControl {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'supervisor' | 'operator' | 'driver';
  department: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  permissions: string[];
  lastLogin?: string;
  loginCount: number;
  accessLevel: 'full' | 'limited' | 'readonly';
  securityLevel: 'high' | 'medium' | 'low';
  twoFactorEnabled: boolean;
  passwordExpiry?: string;
  notes?: string;
}

export const StaffControlPage: React.FC = () => {
  const { user } = useApp();
  const { showSuccessNotification } = useNotificationService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffControl | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all',
    accessLevel: 'all',
  });

  // Mock staff control data
  const [staffControls, setStaffControls] = useState<StaffControl[]>([
    {
      id: '1',
      staffId: 'STF-001',
      name: 'John Admin',
      email: 'john.admin@mwalimu.com',
      phone: '+254 712 345678',
      role: 'admin',
      department: 'Management',
      status: 'active',
      permissions: ['all'],
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      loginCount: 156,
      accessLevel: 'full',
      securityLevel: 'high',
      twoFactorEnabled: true,
      passwordExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'System administrator with full access',
    },
    {
      id: '2',
      staffId: 'STF-002',
      name: 'Mary Manager',
      email: 'mary.manager@mwalimu.com',
      phone: '+254 723 456789',
      role: 'manager',
      department: 'Operations',
      status: 'active',
      permissions: ['read', 'write', 'approve'],
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      loginCount: 89,
      accessLevel: 'limited',
      securityLevel: 'medium',
      twoFactorEnabled: false,
      passwordExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Operations manager',
    },
    {
      id: '3',
      staffId: 'STF-003',
      name: 'Peter Driver',
      email: 'peter.driver@mwalimu.com',
      phone: '+254 734 567890',
      role: 'driver',
      department: 'Transport',
      status: 'active',
      permissions: ['read'],
      lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      loginCount: 45,
      accessLevel: 'readonly',
      securityLevel: 'low',
      twoFactorEnabled: false,
      passwordExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Transport driver',
    },
    {
      id: '4',
      staffId: 'STF-004',
      name: 'Sarah Operator',
      email: 'sarah.operator@mwalimu.com',
      phone: '+254 745 678901',
      role: 'operator',
      department: 'Data Entry',
      status: 'suspended',
      permissions: ['read', 'write'],
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      loginCount: 23,
      accessLevel: 'limited',
      securityLevel: 'medium',
      twoFactorEnabled: true,
      notes: 'Account suspended due to policy violation',
    },
  ]);

  const [formData, setFormData] = useState<Omit<StaffControl, 'id' | 'staffId' | 'loginCount'>>({
    name: '',
    email: '',
    phone: '',
    role: 'operator',
    department: '',
    status: 'pending',
    permissions: [],
    accessLevel: 'readonly',
    securityLevel: 'low',
    twoFactorEnabled: false,
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'operator',
      department: '',
      status: 'pending',
      permissions: [],
      accessLevel: 'readonly',
      securityLevel: 'low',
      twoFactorEnabled: false,
      notes: '',
    });
    setEditingStaff(null);
  };

  const handleOpenModal = (staff?: StaffControl) => {
    if (staff) {
      setEditingStaff(staff);
      const { id, staffId, loginCount, ...staffData } = staff;
      setFormData(staffData);
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
    
    const newStaff = {
      ...formData,
      loginCount: 0,
    };

    if (editingStaff) {
      setStaffControls(
        staffControls.map((staff) =>
          staff.id === editingStaff.id ? { ...newStaff, id: editingStaff.id, staffId: editingStaff.staffId } : staff
        )
      );
      showSuccessNotification('Success', 'Staff member updated successfully!');
    } else {
      const id = Date.now().toString();
      const staffId = `STF-${String(staffControls.length + 1).padStart(3, '0')}`;
      setStaffControls([...staffControls, { ...newStaff, id, staffId }]);
      showSuccessNotification('Success', 'Staff member added successfully!');
    }

    handleCloseModal();
  };

  const handleDelete = (staff: StaffControl) => {
    if (window.confirm(`Are you sure you want to delete staff member ${staff.name}?`)) {
      setStaffControls(staffControls.filter((s) => s.id !== staff.id));
      showSuccessNotification('Success', 'Staff member deleted successfully!');
    }
  };

  // Filter staff controls
  const filteredStaffControls = useMemo(() => {
    return staffControls.filter((staff) => {
      const matchesSearch = filters.search === '' || 
        staff.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        staff.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = filters.role === 'all' || staff.role === filters.role;
      const matchesStatus = filters.status === 'all' || staff.status === filters.status;
      const matchesDepartment = filters.department === 'all' || staff.department === filters.department;
      const matchesAccessLevel = filters.accessLevel === 'all' || staff.accessLevel === filters.accessLevel;

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment && matchesAccessLevel;
    });
  }, [staffControls, filters]);

  const columns = [
    {
      key: 'staffId' as keyof StaffControl,
      label: 'Staff ID',
      sortable: true,
    },
    {
      key: 'name' as keyof StaffControl,
      label: 'Name',
      render: (value: string, row: StaffControl) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'role' as keyof StaffControl,
      label: 'Role',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
          value === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
          value === 'supervisor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
          value === 'operator' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status' as keyof StaffControl,
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
      key: 'accessLevel' as keyof StaffControl,
      label: 'Access Level',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'full' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
          value === 'limited' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'lastLogin' as keyof StaffControl,
      label: 'Last Login',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never',
      sortable: true,
    },
    {
      key: 'twoFactorEnabled' as keyof StaffControl,
      label: '2FA',
      render: (value: boolean) => (
        <div className="flex items-center">
          {value ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      ),
      sortable: true,
    },
  ];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalStaff = staffControls.length;
    const activeStaff = staffControls.filter(s => s.status === 'active').length;
    const adminStaff = staffControls.filter(s => s.role === 'admin').length;
    const twoFactorEnabled = staffControls.filter(s => s.twoFactorEnabled).length;
    const suspendedStaff = staffControls.filter(s => s.status === 'suspended').length;

    return {
      totalStaff,
      activeStaff,
      adminStaff,
      twoFactorEnabled,
      suspendedStaff,
    };
  }, [staffControls]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-red-500">Access Denied: Admins only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Control</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive staff management and access control system
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
            <span>Add Staff</span>
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
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.totalStaff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-500 flex-shrink-0">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.activeStaff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-red-500 flex-shrink-0">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Admins</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.adminStaff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-500 flex-shrink-0">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">2FA Enabled</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.twoFactorEnabled}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-orange-500 flex-shrink-0">
              <UserX className="h-4 w-4 text-white" />
            </div>
            <div className="text-right min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Suspended</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{summaryStats.suspendedStaff}</p>
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
              placeholder="Search staff..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-bright-green focus:border-bright-green"
            />
          </div>
          
          <FormSelect
            label="Role"
            value={filters.role}
            onChange={(value) => setFilters({ ...filters, role: value as string })}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'supervisor', label: 'Supervisor' },
              { value: 'operator', label: 'Operator' },
              { value: 'driver', label: 'Driver' },
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
            label="Department"
            value={filters.department}
            onChange={(value) => setFilters({ ...filters, department: value as string })}
            options={[
              { value: 'all', label: 'All Departments' },
              { value: 'Management', label: 'Management' },
              { value: 'Operations', label: 'Operations' },
              { value: 'Transport', label: 'Transport' },
              { value: 'Data Entry', label: 'Data Entry' },
            ]}
          />
          
          <FormSelect
            label="Access Level"
            value={filters.accessLevel}
            onChange={(value) => setFilters({ ...filters, accessLevel: value as string })}
            options={[
              { value: 'all', label: 'All Levels' },
              { value: 'full', label: 'Full Access' },
              { value: 'limited', label: 'Limited Access' },
              { value: 'readonly', label: 'Read Only' },
            ]}
          />
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-6 overflow-x-auto">
        <DataTable
          data={filteredStaffControls}
          columns={columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          emptyMessage="No staff members found matching the current filters."
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value as string })}
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
                  label="Department"
                  type="text"
                  value={formData.department}
                  onChange={(value) => setFormData({ ...formData, department: value as string })}
                  required
                />
              </div>
            </div>

            {/* Role & Access */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Role & Access Control</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormSelect
                  label="Role"
                  value={formData.role}
                  onChange={(value) => setFormData({ ...formData, role: value as any })}
                  options={[
                    { value: 'admin', label: 'Administrator' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'supervisor', label: 'Supervisor' },
                    { value: 'operator', label: 'Operator' },
                    { value: 'driver', label: 'Driver' },
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
                
                <FormSelect
                  label="Access Level"
                  value={formData.accessLevel}
                  onChange={(value) => setFormData({ ...formData, accessLevel: value as any })}
                  options={[
                    { value: 'full', label: 'Full Access' },
                    { value: 'limited', label: 'Limited Access' },
                    { value: 'readonly', label: 'Read Only' },
                  ]}
                  required
                />
                
                <FormSelect
                  label="Security Level"
                  value={formData.securityLevel}
                  onChange={(value) => setFormData({ ...formData, securityLevel: value as any })}
                  options={[
                    { value: 'high', label: 'High Security' },
                    { value: 'medium', label: 'Medium Security' },
                    { value: 'low', label: 'Low Security' },
                  ]}
                  required
                />
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Security Settings</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
                    className="h-4 w-4 text-bright-green rounded border-gray-300 focus:ring-bright-green"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">Enable Two-Factor Authentication</label>
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
                placeholder="Additional notes about this staff member..."
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
                {editingStaff ? 'Update Staff Member' : 'Create Staff Member'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
