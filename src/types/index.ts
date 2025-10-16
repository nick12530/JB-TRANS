export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  email: string;
}

export interface PickupStation {
  id: string;
  code: string; // e.g., "ST001", "ST002", etc.
  name: string;
  location: string;
  areaCode: string; // One of the 5 key area codes
  dropOffPoints: DropOffPoint[];
  status: 'active' | 'inactive';
  capacity: number; // max kg per day
  notes?: string;
}

export interface DropOffPoint {
  id: string;
  name: string;
  location: string;
  distance: number; // km from pickup station
  estimatedTime: number; // minutes
  accessibility: 'easy' | 'moderate' | 'difficult';
  notes?: string;
}

export interface AreaCode {
  id: string;
  code: string; // e.g., "AC001", "AC002", etc.
  name: string;
  region: string;
  pickupStations: PickupStation[];
  totalCapacity: number;
  performance: {
    totalTrips: number;
    totalRevenue: number;
    avgDeliveryTime: number;
    successRate: number; // percentage
  };
}

export interface SourceRecord {
  id: string;
  date: string;
  pickupStationCode: string; // e.g., "ST001"
  areaCode: string; // e.g., "AC001"
  quantitySold: number; // kgs
  itemPrice: number; // price per kg
  totalCost: number; // auto-calculated
  
  // Driver and vehicle details
  driverName: string;
  driverId: string;
  driverPhone: string;
  vehicleReg: string;
  vehicleMake?: string;
  
  // Packaging details
  packaging: {
    basins: number;
    sacks: number;
    boxes: number;
  };
  packagingCosts: {
    basinCost: number;
    sackCost: number;
    boxCost: number;
  };
  totalPackagingCost: number;
  
  // Drop-off information
  dropOffPoint: string;
  estimatedDeliveryTime: string;
  
  assignedBy: string; // User who entered the data
  status: 'loaded' | 'in-transit' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface PickupPointRecord {
  id: string;
  date: string;
  pickupPoint: 'A' | 'B' | 'C' | 'D';
  transportCode: string; // unique code for tracking from pickup to destination
  driverName: string;
  driverPhone: string;
  driverId: string;
  vehicleReg: string;
  vehicleModel?: string;
  packingDetails: {
    basins: number;
    sacks: number;
    boxes: number;
  };
  unitPrices: {
    basinPrice: number;
    sackPrice: number;
    boxPrice: number;
  };
  totalCost: number; // auto-calculated
  paymentMethod: 'cash' | 'mpesa' | 'bank';
  status: 'loaded' | 'in-transit' | 'delivered';
  destination?: string; // where goods are going
  deliveryDate?: string; // when delivered
  tripCode?: string;
  recordedBy: string; // user who recorded
}

export interface DeliveryComparison {
  transportCode: string;
  pickupRecord: PickupPointRecord;
  deliveryRecord?: DestinationRecord;
  discrepancies: {
    quantityDiff: number; // difference in kgs
    costDiff: number; // difference in money
    status: 'match' | 'shortage' | 'excess' | 'pending';
  };
}

export interface DestinationRecord {
  id: string;
  date: string;
  transportCode: string; // Links to source record
  sourceAreaCode: string; // Area code where goods originated
  sourceStationCode: string; // Station where goods were picked up
  
  // Destination details
  destinationAreaCode: string; // Area code where goods are delivered
  destinationLocation: string; // Specific drop-off point
  destinationType: 'market' | 'warehouse' | 'retail' | 'wholesale' | 'export';
  
  // Buyer/Receiver details
  buyerName: string;
  buyerId: string;
  buyerPhone: string;
  buyerType: 'individual' | 'company' | 'cooperative';
  
  // Goods details
  quantityExpected: number; // From source record
  quantityReceived: number; // Actual received
  quantityDifference: number; // Auto-calculated
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  
  // Pricing
  itemPrice: number; // Price per kg
  totalRevenue: number; // Auto-calculated
  
  // Delivery details
  deliveryTime: string | null;
  deliveryStatus: 'pending' | 'in-transit' | 'delivered' | 'failed' | 'disputed';
  driverName: string;
  driverId: string;
  vehicleReg: string;
  
  // Verification
  verifiedBy: string; // Admin who verified
  verificationDate: string;
  verificationNotes?: string;
  
  // Discrepancy handling
  hasDiscrepancy: boolean;
  discrepancyType?: 'quantity' | 'condition' | 'time' | 'location' | 'other';
  discrepancyDescription?: string;
  discrepancyResolved: boolean;
  
  // Admin capabilities
  adminNotes?: string;
  adminActions?: string[];
  lastModifiedBy: string;
  lastModifiedDate: string;
  
  // Additional properties
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryVerification {
  id: string;
  destinationRecordId: string;
  transportCode: string;
  verificationType: 'quantity' | 'condition' | 'time' | 'location';
  expectedValue: string | number;
  actualValue: string | number;
  discrepancy: number;
  verifiedBy: string;
  verificationDate: string;
  notes?: string;
  status: 'verified' | 'discrepancy' | 'pending';
}

export interface LocationFilter {
  areaCode: string;
  location: string;
  dateRange: {
    start: string;
    end: string;
  };
  status: string[];
  hasDiscrepancy: boolean | null;
}

export interface TransportLog {
  id: string;
  tripId: string;
  date: string;
  driver: string;
  driverId: string;
  lorryReg: string;
  routeName: string;
  destinations: string[];
  totalQuantityLoaded: number; // in kgs
  trackingNo: string;
}

export interface ProfitRecord {
  id: string;
  trackingNo: string;
  totalCost: number;
  totalRevenue: number;
  profitLoss: number;
  remainingStock: number; // in kgs
  margin?: number; // percentage
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email?: string;
  idNumber: string;
  status: 'active' | 'inactive' | 'suspended';
  routes: Route[];
  allocatedVehicles: Vehicle[];
  totalTrips: number;
  totalRevenue: number;
  joiningDate: string;
  performance: {
    rating: number; // 1-5 stars
    onTimeDeliveries: number;
    issueReports: number;
  };
  emergencyContact?: {
    name: string;
    phone: string;
  };
  notes?: string;
}

export interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  capacity: number; // in kg
  type: 'lorry' | 'van' | 'truck';
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  driverId?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelType: 'diesel' | 'petrol';
  insuranceExpiry: string;
  notes?: string;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number; // in km
  estimatedTime: number; // in hours
  riskLevel: 'low' | 'medium' | 'high';
  roadConditions: string[];
  landmarks: string[];
  notes?: string;
  active: boolean;
}

export interface DiscrepancyReport {
  id: string;
  transportCode: string;
  driverId: string;
  driverName: string;
  date: string;
  route: string;
  reportedBy: string; // admin who reported
  discrepancyType: 'quantity' | 'condition' | 'time' | 'route' | 'other';
  description: string;
  evidence: string[]; // file paths or descriptions
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
  actionsTaken?: string[];
  createdAt: string;
  updatedAt: string;
}

// Keep the old Lorry interface for compatibility
export interface Lorry {
  id: string;
  registrationNumber: string;
  model?: string;
  capacity?: number; // in kgs
}

export interface Buyer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  city?: string;
}

export interface PickupPoint {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  location?: string;
}

export interface PickupRecord {
  id: string;
  date: string;
  pickupPoint: 'A' | 'B' | 'C' | 'D';
  driverName: string;
  driverPhone: string;
  driverId: string;
  vehicleNumber: string;
  vehicleType: string;
  basins?: number;
  sacks?: number;
  boxes?: number;
  totalKilos: number; // auto-calculated
  pricePerKilo: number;
  totalCost: number; // auto-calculated
  notes?: string;
  recordedBy: string;
  transportCode: string; // unique tracking code for this pickup
  status: 'loaded' | 'in-transit' | 'delivered';
}

export interface DeliveryRecord {
  id: string;
  transportCode: string; // links to PickupRecord
  date: string;
  destination: string;
  receiverName: string;
  receiverPhone: string;
  basinsReceived?: number;
  sacksReceived?: number;
  boxesReceived?: number;
  totalKilosReceived: number; // auto-calculated
  condition: 'good' | 'damaged' | 'partial';
  notes?: string;
  deliveredBy: string; // driver who delivered
  recordedBy: string; // user who recorded delivery
}

export interface TransportComparison {
  transportCode: string;
  pickupRecord: PickupRecord;
  deliveryRecord?: DeliveryRecord;
  status: 'in-transit' | 'delivered' | 'discrepancy';
  discrepancies?: {
    basinsDiff?: number;
    sacksDiff?: number;
    boxesDiff?: number;
    totalKilosDiff?: number;
    conditionNotes?: string;
  };
}

export interface ContainmentUnit {
  type: 'basin' | 'sack' | 'box';
  name: string;
  avgKilos: number; // average weight per unit
  color: string; // for UI display
}

// Re-export inventory types
export * from './inventory';