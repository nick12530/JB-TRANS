// New logistics-focused types for the redesigned system

export interface DropOffPoint {
  id: string;
  name: string;
  code: string; // e.g., "KONGO", "MIRITINI", etc.
  location: string;
  region: string;
  clients: Client[];
  status: 'active' | 'inactive';
  capacity: number; // max items per day
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  dropOffPointId: string;
  isActive: boolean;
  preferredNotificationMethod: 'sms' | 'email' | 'both';
  createdAt: string;
  updatedAt: string;
}

export interface PackagingType {
  id: 'boxes' | 'basins' | 'sacks';
  name: string;
  description: string;
  averageWeight: number; // kg per unit
  color: string; // for UI display
}

export interface PackingRecord {
  id: string;
  date: string;
  packingPoint: string; // Main packing location
  items: PackingItem[];
  totalItems: number;
  totalWeight: number; // kg
  assignedBy: string; // Admin who recorded
  status: 'packed' | 'in-transit' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface PackingItem {
  id: string;
  dropOffPointId: string;
  dropOffPointName: string;
  packagingType: 'boxes' | 'basins' | 'sacks';
  quantity: number;
  weight: number; // kg
  estimatedDeliveryTime: string;
  notes?: string;
}

export interface DeliveryNotification {
  id: string;
  packingRecordId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  dropOffPointName: string;
  items: NotificationItem[];
  totalItems: number;
  totalWeight: number;
  estimatedDeliveryTime: string;
  status: 'sent' | 'delivered' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  messageContent: string;
}

export interface NotificationItem {
  packagingType: 'boxes' | 'basins' | 'sacks';
  quantity: number;
  weight: number;
}

export interface DeliveryConfirmation {
  id: string;
  notificationId: string;
  clientId: string;
  itemsReceived: NotificationItem[];
  totalItemsReceived: number;
  totalWeightReceived: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  receivedAt: string;
  confirmedBy: string; // Client name
  notes?: string;
  discrepancies?: {
    missingItems: NotificationItem[];
    damagedItems: NotificationItem[];
    extraItems: NotificationItem[];
  };
}

// All 22 drop-off locations
export const DROP_OFF_LOCATIONS = [
  'KONGO',
  'MIRITINI', 
  'MARIAKANI',
  'SAMBURU TOWN',
  'SAMBURU',
  'KILIFI',
  'MALINDI',
  'VOI',
  'TAVETA',
  'TESO',
  'DZONI',
  'KALOLENI',
  'MAVUENI',
  'MAZERAS',
  'CHASIMBA',
  'MAUNGU',
  'MANYATTA',
  'TARU',
  'MTITO',
  'KAMBUU',
  'MACKNON',
  'MALIKUBWA'
] as const;

export type DropOffLocationCode = typeof DROP_OFF_LOCATIONS[number];

export interface SystemStats {
  totalDropOffPoints: number;
  activeDropOffPoints: number;
  totalClients: number;
  activeClients: number;
  totalItemsPackedToday: number;
  totalItemsDeliveredToday: number;
  pendingNotifications: number;
  deliverySuccessRate: number; // percentage
}
