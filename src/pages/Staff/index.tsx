import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, UserCheck, MapPin, Truck, Award } from 'lucide-react';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { DataTable } from '../../components/DataTable';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';

interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'driver' | 'supervisor' | 'coordinator' | 'manager' | 'admin';
  department: 'transport' | 'operations' | 'logistics' | 'management';
  status: 'active' | 'inactive' | 'suspended' | 'on-leave';
  hireDate: string;
  salary: number;
  licenseNumber?: string;
  licenseExpiry?: string;
  assignedRoutes: string[];
  assignedVehicles: string[];
  performance: {
    rating: number; // 1-5
    tripsCompleted: number;
    onTimeDelivery: number; // percentage
    customerSatisfaction: number; // percentage
    safetyScore: number; // 1-5
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: string;
  notes?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

const defaultStaff: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'> = {
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'driver',
  department: 'transport',
  status: 'active',
  hireDate: new Date().toISOString().split('T')[0],
  salary: 0,
  licenseNumber: '',
  licenseExpiry: '',
  assignedRoutes: [],
  assignedVehicles: [],
  performance: {
    rating: 5,
    tripsCompleted: 0,
    onTimeDelivery: 100,
    customerSatisfaction: 100,
    safetyScore: 5,
  },
  emergencyContact: {
    name: '',
    phone: '',
    relationship: '',
  },
  address: '',
  notes: '',
};

export const StaffManagementPage: React.FC = () => {
  const { user } = useApp();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Kimani',
      email: 'john.kimani@mwalimu.com',
      phone: '+254 712 345678',
      role: 'driver',
      department: 'transport',
      status: 'active',
      hireDate: '2023-01-15',
      salary: 45000,
      licenseNumber: 'DL123456',
      licenseExpiry: '2025-12-31',
      assignedRoutes: ['Nairobi-Mombasa', 'Nairobi-Garissa'],
      assignedVehicles: ['KAA 123A', 'KBB 456B'],
      performance: {
        rating: 4.5,
        tripsCompleted: 156,
        onTimeDelivery: 92,
        customerSatisfaction: 88,
        safetyScore: 4.8,
      },
      emergencyContact: {
        name: 'Mary Kimani',
        phone: '+254 723 456789',
        relationship: 'Spouse',
      },
      address: 'Nairobi, Kenya',
      notes: 'Excellent driver with clean record',
      lastLogin: '2024-01-15T08:30:00Z',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Mwangi',
      email: 'sarah.mwangi@mwalimu.com',
      phone: '+254 734 567890',
      role: 'supervisor',
      department: 'operations',
      status: 'active',
      hireDate: '2022-06-01',
      salary: 65000,
      assignedRoutes: ['All Routes'],
      assignedVehicles: [],
      performance: {
        rating: 4.8,
        tripsCompleted: 0,
        onTimeDelivery: 95,
        customerSatisfaction: 92,
        safetyScore: 5.0,
      },
      emergencyContact: {
        name: 'Peter Mwangi',
        phone: '+254 745 678901',
        relationship: 'Brother',
      },
      address: 'Meru, Kenya',
      notes: 'Team supervisor with excellent leadership skills',
      lastLogin: '2024-01-15T09:15:00Z',
      createdAt: '2022-06-01T00:00:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>>(defaultStaff);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    department: 'all',
    status: 'all',
    performance: 'all',
  });

  const resetForm = () => {
    setFormData(defaultStaff);
    setErrors({});
    setEditingStaff(null);
  };

  const handleOpenModal = (staff?: StaffMember) => {
    if (staff) {
      setEditingStaff(staff);
      const { id, createdAt, updatedAt, ...staffData } = staff;
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Valid salary is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const now = new Date().toISOString();
    const newStaff = {
      ...formData,
      updatedAt: now,
    };

    if (editingStaff) {
      setStaffMembers(
        staffMembers.map((staff) =>
          staff.id === editingStaff.id ? { ...newStaff, id: editingStaff.id, createdAt: editingStaff.createdAt } : staff
        )
      );
    } else {
      const id = Date.now().toString();
      setStaffMembers([...staffMembers, { ...newStaff, id, createdAt: now }]);
    }

    handleCloseModal();
  };

  const handleDelete = (staff: StaffMember) => {
    if (window.confirm(`Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`)) {
      setStaffMembers(staffMembers.filter((s) => s.id !== staff.id));
    }
  };

  // Filter staff members
  const filteredStaff = useMemo(() => {
    return staffMembers.filter((staff) => {
      const matchesSearch = filters.search === '' || 
        `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(filters.search.toLowerCase()) ||
        staff.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = filters.role === 'all' || staff.role === filters.role;
      const matchesDepartment = filters.department === 'all' || staff.department === filters.department;
      const matchesStatus = filters.status === 'all' || staff.status === filters.status;
      
      let matchesPerformance = true;
      if (filters.performance !== 'all') {
        const rating = staff.performance.rating;
        switch (filters.performance) {
          case 'excellent':
            matchesPerformance = rating >= 4.5;
            break;
          case 'good':
            matchesPerformance = rating >= 3.5 && rating < 4.5;
            break;
          case 'average':
            matchesPerformance = rating >= 2.5 && rating < 3.5;
            break;
          case 'poor':
            matchesPerformance = rating < 2.5;
            break;
        }
      }

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus && matchesPerformance;
    });
  }, [staffMembers, filters]);

  const columns = [
    {
      key: 'employeeId' as keyof StaffMember,
      label: 'Employee ID',
      sortable: true,
    },
    {
      key: 'firstName' as keyof StaffMember,
      label: 'Name',
      render: (_: string, row: StaffMember) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'role' as keyof StaffMember,
      label: 'Role',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
          value === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
          value === 'supervisor' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          value === 'coordinator' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'department' as keyof StaffMember,
      label: 'Department',
      sortable: true,
    },
    {
      key: 'status' as keyof StaffMember,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
          value === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200' :
          value === 'suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'performance' as keyof StaffMember,
      label: 'Performance',
      render: (value: any) => (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Award
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(value.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{value.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'hireDate' as keyof StaffMember,
      label: 'Hire Date',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
  ];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalStaff = staffMembers.length;
    const activeStaff = staffMembers.filter(s => s.status === 'active').length;
    const drivers = staffMembers.filter(s => s.role === 'driver').length;
    const avgPerformance = staffMembers.reduce((sum, s) => sum + s.performance.rating, 0) / totalStaff;
    const totalTrips = staffMembers.reduce((sum, s) => sum + s.performance.tripsCompleted, 0);

    return {
      totalStaff,
      activeStaff,
      drivers,
      avgPerformance: avgPerformance || 0,
      totalTrips,
    };
  }, [staffMembers]);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage staff members, roles, and performance
          </p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-500">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.totalStaff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-500">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Active Staff</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.activeStaff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-500">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Drivers</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.drivers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-yellow-500">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg Performance</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.avgPerformance.toFixed(1)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-orange-500">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Trips</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{summaryStats.totalTrips}</p>
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
              { value: 'driver', label: 'Driver' },
              { value: 'supervisor', label: 'Supervisor' },
              { value: 'coordinator', label: 'Coordinator' },
              { value: 'manager', label: 'Manager' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
          
          <FormSelect
            label="Department"
            value={filters.department}
            onChange={(value) => setFilters({ ...filters, department: value as string })}
            options={[
              { value: 'all', label: 'All Departments' },
              { value: 'transport', label: 'Transport' },
              { value: 'operations', label: 'Operations' },
              { value: 'logistics', label: 'Logistics' },
              { value: 'management', label: 'Management' },
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
              { value: 'on-leave', label: 'On Leave' },
            ]}
          />
          
          <FormSelect
            label="Performance"
            value={filters.performance}
            onChange={(value) => setFilters({ ...filters, performance: value as string })}
            options={[
              { value: 'all', label: 'All Performance' },
              { value: 'excellent', label: 'Excellent (4.5+)' },
              { value: 'good', label: 'Good (3.5-4.4)' },
              { value: 'average', label: 'Average (2.5-3.4)' },
              { value: 'poor', label: 'Poor (<2.5)' },
            ]}
          />
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-6">
        <DataTable
          data={filteredStaff}
          columns={columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          emptyMessage="No staff members found. Click 'Add Staff' to get started."
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Employee ID"
                type="text"
                value={formData.employeeId}
                onChange={(value) => setFormData({ ...formData, employeeId: value as string })}
                error={errors.employeeId}
                required
              />
              
              <FormInput
                label="Hire Date"
                type="date"
                value={formData.hireDate}
                onChange={(value) => setFormData({ ...formData, hireDate: value as string })}
                error={errors.hireDate}
                required
              />
              
              <FormInput
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(value) => setFormData({ ...formData, firstName: value as string })}
                error={errors.firstName}
                required
              />
              
              <FormInput
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(value) => setFormData({ ...formData, lastName: value as string })}
                error={errors.lastName}
                required
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value as string })}
                error={errors.email}
                required
              />
              
              <FormInput
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value as string })}
                error={errors.phone}
                required
              />
            </div>
          </div>

          {/* Role & Department */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Role & Department</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Role"
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value as any })}
                options={[
                  { value: 'driver', label: 'Driver' },
                  { value: 'supervisor', label: 'Supervisor' },
                  { value: 'coordinator', label: 'Coordinator' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'admin', label: 'Admin' },
                ]}
                required
              />
              
              <FormSelect
                label="Department"
                value={formData.department}
                onChange={(value) => setFormData({ ...formData, department: value as any })}
                options={[
                  { value: 'transport', label: 'Transport' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'logistics', label: 'Logistics' },
                  { value: 'management', label: 'Management' },
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
                  { value: 'on-leave', label: 'On Leave' },
                ]}
                required
              />
              
              <FormInput
                label="Salary"
                type="number"
                value={formData.salary}
                onChange={(value) => setFormData({ ...formData, salary: value as number })}
                error={errors.salary}
                required
              />
            </div>
          </div>

          {/* Driver-specific fields */}
          {formData.role === 'driver' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Driver Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="License Number"
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={(value) => setFormData({ ...formData, licenseNumber: value as string })}
                />
                
                <FormInput
                  label="License Expiry"
                  type="date"
                  value={formData.licenseExpiry || ''}
                  onChange={(value) => setFormData({ ...formData, licenseExpiry: value as string })}
                />
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Contact Name"
                type="text"
                value={formData.emergencyContact.name}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact, name: value as string }
                })}
              />
              
              <FormInput
                label="Contact Phone"
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact, phone: value as string }
                })}
              />
              
              <FormInput
                label="Relationship"
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact, relationship: value as string }
                })}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Additional Information</h4>
            <div className="space-y-4">
              <FormInput
                label="Address"
                type="text"
                value={formData.address}
                onChange={(value) => setFormData({ ...formData, address: value as string })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                  placeholder="Additional notes about the staff member..."
                />
              </div>
            </div>
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
              {editingStaff ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
