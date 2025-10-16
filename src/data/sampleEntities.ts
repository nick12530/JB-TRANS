// Sample buyers data
export const SAMPLE_BUYERS = [
  {
    id: 'BUYER001',
    name: 'Husra General Store',
    contactPerson: 'Husra Ahmed',
    phone: '0729123456',
    email: 'husra@store.com',
    location: 'Embu Town',
    areaCode: 'AC001',
    buyerType: 'company',
    paymentTerms: 'cash',
    creditLimit: 50000,
    preferredDeliveryTime: '09:00-12:00',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'BUYER002',
    name: 'Exodus Trading Co.',
    contactPerson: 'Exodus Mwangi',
    phone: '0729234567',
    email: 'exodus@trading.com',
    location: 'Mecca Center',
    areaCode: 'AC002',
    buyerType: 'company',
    paymentTerms: 'credit',
    creditLimit: 75000,
    preferredDeliveryTime: '14:00-17:00',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'BUYER003',
    name: 'Boss Lady Enterprises',
    contactPerson: 'Grace Wanjiku',
    phone: '0729345678',
    email: 'grace@bosslady.com',
    location: 'Ena Market',
    areaCode: 'AC003',
    buyerType: 'individual',
    paymentTerms: 'cash',
    creditLimit: 25000,
    preferredDeliveryTime: '08:00-10:00',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'BUYER004',
    name: 'Koy Wholesale',
    contactPerson: 'Koy Otieno',
    phone: '0729456789',
    email: 'koy@wholesale.com',
    location: 'Ugweri Center',
    areaCode: 'AC004',
    buyerType: 'cooperative',
    paymentTerms: 'credit',
    creditLimit: 100000,
    preferredDeliveryTime: '10:00-13:00',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'BUYER005',
    name: 'Manare Distributors',
    contactPerson: 'Manare Hassan',
    phone: '0729567890',
    email: 'manare@distributors.com',
    location: 'Embu Town',
    areaCode: 'AC001',
    buyerType: 'company',
    paymentTerms: 'credit',
    creditLimit: 150000,
    preferredDeliveryTime: '15:00-18:00',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

// Sample drivers data
export const SAMPLE_DRIVERS = [
  {
    id: 'DRIVER001',
    name: 'Timothy Peter',
    phone: '0729678901',
    licenseNumber: 'DL001234',
    vehicleType: 'truck',
    vehicleNumber: 'KAB 123A',
    areaCode: 'AC001',
    status: 'active',
    experience: '5 years',
    rating: 4.5,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'DRIVER002',
    name: 'Murithi Kamau',
    phone: '0729789012',
    licenseNumber: 'DL002345',
    vehicleType: 'van',
    vehicleNumber: 'KAB 456B',
    areaCode: 'AC002',
    status: 'active',
    experience: '3 years',
    rating: 4.2,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'DRIVER003',
    name: 'Agnes Wanjiku',
    phone: '0729890123',
    licenseNumber: 'DL003456',
    vehicleType: 'truck',
    vehicleNumber: 'KAB 789C',
    areaCode: 'AC003',
    status: 'active',
    experience: '7 years',
    rating: 4.8,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'DRIVER004',
    name: 'Eugene Ochieng',
    phone: '0729901234',
    licenseNumber: 'DL004567',
    vehicleType: 'van',
    vehicleNumber: 'KAB 012D',
    areaCode: 'AC004',
    status: 'active',
    experience: '4 years',
    rating: 4.3,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

// Sample staff data
export const SAMPLE_STAFF = [
  {
    id: 'STAFF001',
    name: 'Admin User',
    email: 'admin@jbtrans.com',
    phone: '0729001234',
    role: 'admin',
    status: 'active',
    accessLevel: 'full',
    securityLevel: 'high',
    twoFactorEnabled: true,
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 'STAFF002',
    name: 'Manager One',
    email: 'manager@jbtrans.com',
    phone: '0729112345',
    role: 'manager',
    status: 'active',
    accessLevel: 'limited',
    securityLevel: 'medium',
    twoFactorEnabled: false,
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 'STAFF003',
    name: 'Supervisor Alpha',
    email: 'supervisor@jbtrans.com',
    phone: '0729223456',
    role: 'supervisor',
    status: 'active',
    accessLevel: 'limited',
    securityLevel: 'medium',
    twoFactorEnabled: false,
    lastLogin: '2024-01-15T08:45:00Z',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 'STAFF004',
    name: 'Operator Beta',
    email: 'operator@jbtrans.com',
    phone: '0729334567',
    role: 'operator',
    status: 'active',
    accessLevel: 'readonly',
    securityLevel: 'low',
    twoFactorEnabled: false,
    lastLogin: '2024-01-15T07:30:00Z',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
];
