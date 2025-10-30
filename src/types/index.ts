export interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'client';
  email?: string;
  phoneNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  department?: string;
  assignedStation?: string;
}

export interface AreaCode {
  id: string;
  code: string;
  name: string;
  region: string;
  minRange: number;
  maxRange: number;
  status: 'active' | 'inactive';
  assignedTo?: string;
  notes?: string;
}

export interface Package {
  id: string;
  trackingNumber: string;
  areaCode: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  destination: string;
  weight: number;
  status: 'registered' | 'in-transit' | 'delivered' | 'cancelled';
  registeredBy: string;
  registeredAt: string;
  station: string;
  notes?: string;
}

export interface PickupStation {
  id: string;
  name: string;
  code: string;
  region: string;
  location: string;
  status: 'active' | 'inactive';
  manager?: string;
  contact: string;
  capacity?: number;
  currentInventory?: number;
}

export interface VolumeReport {
  date: string;
  totalPackages: number;
  registered: number;
  inTransit: number;
  delivered: number;
  cancelled: number;
}

export interface SupplierPerformance {
  supplier: string;
  totalPackages: number;
  delivered: number;
  pending: number;
  avgDeliveryTime: number;
  successRate: number;
}

export interface RegionalReport {
  region: string;
  totalPackages: number;
  activeStations: number;
  registeredToday: number;
  deliveredToday: number;
  avgDeliveryTime: number;
}

// Re-export new logistics types
export * from './logistics';