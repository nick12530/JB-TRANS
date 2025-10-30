import { DropOffPoint, PackingRecord, DeliveryNotification, PackagingType, DROP_OFF_LOCATIONS } from '../types/logistics';

// Re-export DROP_OFF_LOCATIONS
export { DROP_OFF_LOCATIONS };

// Sample packaging types
export const PACKAGING_TYPES: PackagingType[] = [
  {
    id: 'boxes',
    name: 'Boxes',
    description: 'Standard cardboard boxes',
    averageWeight: 5.0,
    color: '#3B82F6'
  },
  {
    id: 'basins',
    name: 'Basins',
    description: 'Plastic basins for goods',
    averageWeight: 3.5,
    color: '#10B981'
  },
  {
    id: 'sacks',
    name: 'Sacks',
    description: 'Jute sacks for bulk goods',
    averageWeight: 8.0,
    color: '#F59E0B'
  }
];

// Sample drop-off points with clients
export const SAMPLE_DROP_OFF_POINTS: DropOffPoint[] = [
  {
    id: '1',
    name: 'KONGO',
    code: 'KONGO',
    location: 'Kongo Area',
    region: 'Coastal',
    clients: [
      {
        id: '1',
        name: 'John Mwangi',
        phoneNumber: '+254712345678',
        email: 'john.mwangi@email.com',
        dropOffPointId: '1',
        isActive: true,
        preferredNotificationMethod: 'sms',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Mary Wanjiku',
        phoneNumber: '+254723456789',
        email: 'mary.wanjiku@email.com',
        dropOffPointId: '1',
        isActive: true,
        preferredNotificationMethod: 'both',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    status: 'active',
    capacity: 100,
    notes: 'Main distribution point for Kongo area'
  },
  {
    id: '2',
    name: 'MIRITINI',
    code: 'MIRITINI',
    location: 'Miritini Area',
    region: 'Coastal',
    clients: [
      {
        id: '3',
        name: 'Peter Kimani',
        phoneNumber: '+254734567890',
        email: 'peter.kimani@email.com',
        dropOffPointId: '2',
        isActive: true,
        preferredNotificationMethod: 'sms',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    status: 'active',
    capacity: 80,
    notes: 'Secondary distribution point'
  },
  {
    id: '3',
    name: 'MARIAKANI',
    code: 'MARIAKANI',
    location: 'Mariakani Area',
    region: 'Coastal',
    clients: [
      {
        id: '4',
        name: 'Grace Akinyi',
        phoneNumber: '+254745678901',
        email: 'grace.akinyi@email.com',
        dropOffPointId: '3',
        isActive: true,
        preferredNotificationMethod: 'email',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    status: 'active',
    capacity: 120,
    notes: 'Major distribution hub'
  },
  {
    id: '4',
    name: 'SAMBURU TOWN',
    code: 'SAMBURU TOWN',
    location: 'Samburu Town',
    region: 'Northern',
    clients: [
      {
        id: '5',
        name: 'David Lekishon',
        phoneNumber: '+254756789012',
        email: 'david.lekishon@email.com',
        dropOffPointId: '4',
        isActive: true,
        preferredNotificationMethod: 'sms',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    status: 'active',
    capacity: 90,
    notes: 'Northern region distribution'
  },
  {
    id: '5',
    name: 'KILIFI',
    code: 'KILIFI',
    location: 'Kilifi Area',
    region: 'Coastal',
    clients: [
      {
        id: '6',
        name: 'Sarah Mwende',
        phoneNumber: '+254767890123',
        email: 'sarah.mwende@email.com',
        dropOffPointId: '5',
        isActive: true,
        preferredNotificationMethod: 'both',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    status: 'active',
    capacity: 110,
    notes: 'Coastal region distribution'
  }
];

// Sample packing records
export const SAMPLE_PACKING_RECORDS: PackingRecord[] = [
  {
    id: '1',
    date: '2024-01-15T08:00:00Z',
    packingPoint: 'Main Packing Station',
    items: [
      {
        id: '1',
        dropOffPointId: '1',
        dropOffPointName: 'KONGO',
        packagingType: 'boxes',
        quantity: 10,
        weight: 50.0,
        estimatedDeliveryTime: '2024-01-15T14:00:00Z',
        notes: 'Priority delivery'
      },
      {
        id: '2',
        dropOffPointId: '1',
        dropOffPointName: 'KONGO',
        packagingType: 'basins',
        quantity: 5,
        weight: 17.5,
        estimatedDeliveryTime: '2024-01-15T14:00:00Z'
      },
      {
        id: '3',
        dropOffPointId: '2',
        dropOffPointName: 'MIRITINI',
        packagingType: 'sacks',
        quantity: 8,
        weight: 64.0,
        estimatedDeliveryTime: '2024-01-15T16:00:00Z'
      }
    ],
    totalItems: 23,
    totalWeight: 131.5,
    assignedBy: 'Admin User',
    status: 'packed',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  }
];

// Sample delivery notifications
export const SAMPLE_DELIVERY_NOTIFICATIONS: DeliveryNotification[] = [
  {
    id: '1',
    packingRecordId: '1',
    clientId: '1',
    clientName: 'John Mwangi',
    clientPhone: '+254712345678',
    dropOffPointName: 'KONGO',
    items: [
      {
        packagingType: 'boxes',
        quantity: 10,
        weight: 50.0
      },
      {
        packagingType: 'basins',
        quantity: 5,
        weight: 17.5
      }
    ],
    totalItems: 15,
    totalWeight: 67.5,
    estimatedDeliveryTime: '2024-01-15T14:00:00Z',
    status: 'sent',
    sentAt: '2024-01-15T08:30:00Z',
    messageContent: 'Hello John Mwangi, your goods have been packed and are on the way to KONGO drop-off point. You will receive: 10 Boxes (50kg) and 5 Basins (17.5kg). Total: 15 items weighing 67.5kg. Estimated delivery time: 2:00 PM today.'
  },
  {
    id: '2',
    packingRecordId: '1',
    clientId: '3',
    clientName: 'Peter Kimani',
    clientPhone: '+254734567890',
    dropOffPointName: 'MIRITINI',
    items: [
      {
        packagingType: 'sacks',
        quantity: 8,
        weight: 64.0
      }
    ],
    totalItems: 8,
    totalWeight: 64.0,
    estimatedDeliveryTime: '2024-01-15T16:00:00Z',
    status: 'sent',
    sentAt: '2024-01-15T08:35:00Z',
    messageContent: 'Hello Peter Kimani, your goods have been packed and are on the way to MIRITINI drop-off point. You will receive: 8 Sacks (64kg). Total: 8 items weighing 64kg. Estimated delivery time: 4:00 PM today.'
  }
];
