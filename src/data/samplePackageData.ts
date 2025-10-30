import { AreaCode, Package, PickupStation, VolumeReport, SupplierPerformance, RegionalReport, User } from '../types';

// Sample Users
export const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@trimly.com',
    phoneNumber: '+254712345678',
    status: 'active',
    department: 'Administration',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20',
  },
  {
    id: '2',
    name: 'John Kimani',
    role: 'user',
    email: 'john.kimani@trimly.com',
    phoneNumber: '+254723456789',
    status: 'active',
    department: 'Packaging',
    assignedStation: 'Nairobi CBD',
    createdAt: '2024-01-16',
    lastLogin: '2024-01-20',
  },
  {
    id: '3',
    name: 'Grace Wanjiku',
    role: 'user',
    email: 'grace.wanjiku@trimly.com',
    phoneNumber: '+254734567890',
    status: 'active',
    department: 'Customer Service',
    assignedStation: 'Westlands',
    createdAt: '2024-01-17',
    lastLogin: '2024-01-19',
  },
];

// Sample Area Codes
export const SAMPLE_AREA_CODES: AreaCode[] = [
  {
    id: 'ac1',
    code: 'AC001',
    name: 'Nairobi CBD',
    region: 'Nairobi',
    minRange: 100,
    maxRange: 500,
    status: 'active',
    notes: 'Downtown area',
  },
  {
    id: 'ac2',
    code: 'AC002',
    name: 'Westlands',
    region: 'Nairobi',
    minRange: 500,
    maxRange: 800,
    status: 'active',
    notes: 'Business district',
  },
  {
    id: 'ac3',
    code: 'AC003',
    name: 'Kilimani',
    region: 'Nairobi',
    minRange: 800,
    maxRange: 1200,
    status: 'active',
    notes: 'Residential area',
  },
  {
    id: 'ac4',
    code: 'AC004',
    name: 'Thika',
    region: 'Central',
    minRange: 2000,
    maxRange: 2500,
    status: 'active',
    notes: 'Industrial town',
  },
];

// Sample Pickup Stations
export const SAMPLE_PICKUP_STATIONS: PickupStation[] = [
  {
    id: 'st1',
    name: 'Nairobi CBD Station',
    code: 'NAI-CBD',
    region: 'Nairobi',
    location: 'Kenyatta Avenue',
    status: 'active',
    manager: 'Peter Ochieng',
    contact: '+254720123456',
    capacity: 1000,
    currentInventory: 450,
  },
  {
    id: 'st2',
    name: 'Westlands Hub',
    code: 'WLD-HUB',
    region: 'Nairobi',
    location: 'Parklands',
    status: 'active',
    manager: 'Mary Njeri',
    contact: '+254721234567',
    capacity: 800,
    currentInventory: 320,
  },
  {
    id: 'st3',
    name: 'Thika Distribution Center',
    code: 'TKA-DC',
    region: 'Central',
    location: 'Industrial Area',
    status: 'active',
    manager: 'James Mutua',
    contact: '+254732345678',
    capacity: 600,
    currentInventory: 280,
  },
];

// Sample Packages
export const SAMPLE_PACKAGES: Package[] = [
  {
    id: 'pkg1',
    trackingNumber: 'TRK-001-100',
    areaCode: 'AC001',
    senderName: 'David Ochieng',
    senderPhone: '+254712345678',
    recipientName: 'Alice Wanjala',
    recipientPhone: '+254723456789',
    destination: 'Nairobi CBD',
    weight: 5.5,
    status: 'registered',
    registeredBy: '1',
    registeredAt: '2024-01-20T08:00:00Z',
    station: 'NAI-CBD',
    notes: 'Fragile items',
  },
  {
    id: 'pkg2',
    trackingNumber: 'TRK-002-501',
    areaCode: 'AC002',
    senderName: 'Robert Kamau',
    senderPhone: '+254734567890',
    recipientName: 'Susan Njoroge',
    recipientPhone: '+254745678901',
    destination: 'Westlands',
    weight: 3.2,
    status: 'in-transit',
    registeredBy: '2',
    registeredAt: '2024-01-20T09:30:00Z',
    station: 'WLD-HUB',
  },
  {
    id: 'pkg3',
    trackingNumber: 'TRK-003-850',
    areaCode: 'AC003',
    senderName: 'Elizabeth Kariuki',
    senderPhone: '+254756789012',
    recipientName: 'Michael Mwangi',
    recipientPhone: '+254767890123',
    destination: 'Kilimani',
    weight: 7.8,
    status: 'delivered',
    registeredBy: '3',
    registeredAt: '2024-01-19T10:15:00Z',
    station: 'NAI-CBD',
  },
];

// Sample Volume Reports
export const SAMPLE_VOLUME_REPORTS: VolumeReport[] = [
  {
    date: '2024-01-20',
    totalPackages: 145,
    registered: 125,
    inTransit: 15,
    delivered: 105,
    cancelled: 5,
  },
  {
    date: '2024-01-19',
    totalPackages: 138,
    registered: 118,
    inTransit: 12,
    delivered: 110,
    cancelled: 6,
  },
];

// Sample Supplier Performance
export const SAMPLE_SUPPLIER_PERFORMANCE: SupplierPerformance[] = [
  {
    supplier: 'Fast Delivery Co.',
    totalPackages: 450,
    delivered: 420,
    pending: 30,
    avgDeliveryTime: 2.5,
    successRate: 93.3,
  },
  {
    supplier: 'Express Logistics',
    totalPackages: 380,
    delivered: 365,
    pending: 15,
    avgDeliveryTime: 2.8,
    successRate: 96.1,
  },
];

// Sample Regional Reports
export const SAMPLE_REGIONAL_REPORTS: RegionalReport[] = [
  {
    region: 'Nairobi',
    totalPackages: 520,
    activeStations: 3,
    registeredToday: 45,
    deliveredToday: 42,
    avgDeliveryTime: 2.3,
  },
  {
    region: 'Central',
    totalPackages: 180,
    activeStations: 2,
    registeredToday: 15,
    deliveredToday: 14,
    avgDeliveryTime: 2.7,
  },
];

