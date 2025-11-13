import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, DropOffPoint, PackingRecord, DeliveryNotification, Client, Package, PickupStation, AreaCode, DestinationRecord } from '../types';
import { dataService } from '../services/dataService';
import { isSupabaseEnabled } from '../lib/supabaseClient';

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  dropOffPoints: DropOffPoint[];
  setDropOffPoints: (points: DropOffPoint[]) => void;
  packingRecords: PackingRecord[];
  setPackingRecords: (records: PackingRecord[]) => void;
  deliveryNotifications: DeliveryNotification[];
  setDeliveryNotifications: (notifications: DeliveryNotification[]) => void;
  clients: Client[];
  setClients: (clients: Client[]) => void;
  packages: Package[];
  setPackages: (packages: Package[]) => void;
  pickupStations: PickupStation[];
  setPickupStations: (stations: PickupStation[]) => void;
  areaCodes: AreaCode[];
  setAreaCodes: (codes: AreaCode[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  destinationRecords: DestinationRecord[];
  setDestinationRecords: (records: DestinationRecord[]) => void;
  destinations: string[];
  setDestinations: (destinations: string[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(false);
  // Start with no mock data for real-life setup; admin configures via UI
  const [dropOffPoints, setDropOffPoints] = useState<DropOffPoint[]>([]);
  const [packingRecords, setPackingRecords] = useState<PackingRecord[]>([]);
  const [deliveryNotifications, setDeliveryNotifications] = useState<DeliveryNotification[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  // Initialize with the five real stations provided
  const DEFAULT_STATIONS: PickupStation[] = [
    { id: 'st-embu', name: 'Embu', code: 'EMB', region: 'Embu', location: 'Embu', status: 'active', contact: '' },
    { id: 'st-ugweri', name: 'Ugweri', code: 'UGW', region: 'Embu', location: 'Ugweri', status: 'active', contact: '' },
    { id: 'st-meka', name: 'Meka', code: 'MEK', region: 'Embu', location: 'Meka', status: 'active', contact: '' },
    { id: 'st-ena', name: 'Ena', code: 'ENA', region: 'Embu', location: 'Ena', status: 'active', contact: '' },
    { id: 'st-gachuriri', name: 'Gachuriri', code: 'GAC', region: 'Embu', location: 'Gachuriri', status: 'active', contact: '' },
  ];
  const [pickupStations, setPickupStations] = useState<PickupStation[]>(DEFAULT_STATIONS);
  // Configure area code ranges exactly as specified
  const DEFAULT_AREA_CODES: AreaCode[] = [
    { id: 'ac-embu', code: 'Embu', name: 'Embu', region: 'Embu', minRange: 1, maxRange: 300, status: 'active' },
    { id: 'ac-ugweri', code: 'Ugweri', name: 'Ugweri', region: 'Embu', minRange: 301, maxRange: 600, status: 'active' },
    { id: 'ac-meka', code: 'Meka', name: 'Meka', region: 'Embu', minRange: 601, maxRange: 900, status: 'active' },
    { id: 'ac-ena', code: 'Ena', name: 'Ena', region: 'Embu', minRange: 901, maxRange: 1000, status: 'active' },
    { id: 'ac-gachuriri', code: 'Gachuriri', name: 'Gachuriri', region: 'Embu', minRange: 1001, maxRange: 1100, status: 'active' },
  ];
  const [areaCodes, setAreaCodes] = useState<AreaCode[]>(DEFAULT_AREA_CODES);
  const [users, setUsers] = useState<User[]>([]);
  const [destinationRecords, setDestinationRecords] = useState<DestinationRecord[]>([]);
  const [destinations, setDestinations] = useState<string[]>([
    'KONGO', 'MIRITINI', 'MARIAKANI', 'SAMBURU TOWN', 'SAMBURU', 'KILIFI', 'MALINDI', 'VOI',
    'TAVETA', 'TESO', 'DZONI', 'KALOLENI', 'MAVUENI', 'MAZERAS', 'CHASIMBA', 'MAUNGU',
    'MANYATTA', 'TARU', 'MTITO', 'KAMBUU', 'MACKNON', 'MALIKUBWA',
  ]);
  const [hydrated, setHydrated] = useState(false);

  // Load data on mount (Supabase if enabled, otherwise localStorage fallback)
  useEffect(() => {
    const load = async () => {
      if (isSupabaseEnabled()) {
        try {
          const [pkgs, usrs, cls, sts, areas, dests] = await Promise.all([
            dataService.listPackages(),
            dataService.listUsers(),
            dataService.listClients(),
            dataService.listStations(),
            dataService.listAreaCodes(),
            dataService.listDestinationRecords(),
          ]);
          setPackages(pkgs);
          setUsers(usrs);
          setClients(cls);
          setPickupStations(sts && sts.length ? sts : DEFAULT_STATIONS);
          setAreaCodes(areas && areas.length ? areas : DEFAULT_AREA_CODES);
          setDestinationRecords(dests);
        } catch (error) {
          console.error('Failed to load data from Supabase, falling back to localStorage', error);
        }
      } else {
        try {
          const savedPackages = localStorage.getItem('mwalimu-packages');
          if (savedPackages) {
            const parsed = JSON.parse(savedPackages);
            if (Array.isArray(parsed)) setPackages(parsed);
          }

          const savedUsers = localStorage.getItem('mwalimu-users');
          if (savedUsers) {
            const parsed = JSON.parse(savedUsers);
            if (Array.isArray(parsed)) setUsers(parsed);
          }

          const savedClients = localStorage.getItem('mwalimu-clients');
          if (savedClients) {
            const parsed = JSON.parse(savedClients);
            if (Array.isArray(parsed)) setClients(parsed);
          }

          const savedStations = localStorage.getItem('mwalimu-stations');
          if (savedStations) {
            const parsed = JSON.parse(savedStations);
            if (Array.isArray(parsed)) setPickupStations(parsed);
          }

          const savedAreaCodes = localStorage.getItem('mwalimu-area-codes');
          if (savedAreaCodes) {
            const parsed = JSON.parse(savedAreaCodes);
            if (Array.isArray(parsed)) setAreaCodes(parsed);
          }

          const savedDestinationRecords = localStorage.getItem('mwalimu-destination-records');
          if (savedDestinationRecords) {
            const parsed = JSON.parse(savedDestinationRecords);
            if (Array.isArray(parsed)) setDestinationRecords(parsed);
          }

          const savedDestinations = localStorage.getItem('mwalimu-destinations');
          if (savedDestinations) {
            const parsed = JSON.parse(savedDestinations);
            if (Array.isArray(parsed) && parsed.length > 0) setDestinations(parsed);
          }
        } catch (error) {
          console.error('Failed to load data from localStorage:', error);
        }
      }
      setHydrated(true);
    };
    load();
  }, []);

  // Seed Supabase with defaults on first run if tables are empty
  useEffect(() => {
    if (!isSupabaseEnabled()) return;
    const seededFlag = localStorage.getItem('mwalimu-supabase-seeded');
    if (seededFlag === 'true') return;
    const doSeed = async () => {
      try {
        if (pickupStations.length === 0) {
          await dataService.upsertStations(DEFAULT_STATIONS);
          setPickupStations(DEFAULT_STATIONS);
        }
        if (areaCodes.length === 0) {
          await dataService.upsertAreaCodes(DEFAULT_AREA_CODES);
          setAreaCodes(DEFAULT_AREA_CODES);
        }
        localStorage.setItem('mwalimu-supabase-seeded', 'true');
      } catch (e) {
        // ignore; user may not want seeding
      }
    };
    doSeed();
  }, [pickupStations.length, areaCodes.length]);

  // Persist packages
  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseEnabled()) {
      dataService.upsertPackages(packages);
      return;
    }
    try {
      localStorage.setItem('mwalimu-packages', JSON.stringify(packages));
    } catch (error) {
      console.error('Failed to save packages to localStorage:', error);
    }
  }, [packages]);

  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseEnabled()) {
      dataService.upsertUsers(users);
      return;
    }
    try {
      localStorage.setItem('mwalimu-users', JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }, [users]);

  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseEnabled()) {
      dataService.upsertClients(clients);
      return;
    }
    try {
      localStorage.setItem('mwalimu-clients', JSON.stringify(clients));
    } catch (error) {
      console.error('Failed to save clients to localStorage:', error);
    }
  }, [clients]);

  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseEnabled()) {
      dataService.upsertStations(pickupStations);
      return;
    }
    try {
      localStorage.setItem('mwalimu-stations', JSON.stringify(pickupStations));
    } catch (error) {
      console.error('Failed to save stations to localStorage:', error);
    }
  }, [pickupStations]);

  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseEnabled()) {
      dataService.upsertAreaCodes(areaCodes);
      return;
    }
    try {
      localStorage.setItem('mwalimu-area-codes', JSON.stringify(areaCodes));
    } catch (error) {
      console.error('Failed to save area codes to localStorage:', error);
    }
  }, [areaCodes]);

  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseEnabled()) {
      dataService.upsertDestinationRecords(destinationRecords);
      return;
    }
    try {
      localStorage.setItem('mwalimu-destination-records', JSON.stringify(destinationRecords));
    } catch (error) {
      console.error('Failed to save destination records to localStorage:', error);
    }
  }, [destinationRecords]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('mwalimu-destinations', JSON.stringify(destinations));
    } catch (error) {
      console.error('Failed to save destinations to localStorage:', error);
    }
  }, [destinations]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDark(storedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Extract all clients from drop-off points
  useEffect(() => {
    const allClients = dropOffPoints.flatMap(point => point.clients);
    setClients(allClients);
  }, [dropOffPoints]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isDark,
    setIsDark,
    dropOffPoints,
    setDropOffPoints,
    packingRecords,
    setPackingRecords,
    deliveryNotifications,
    setDeliveryNotifications,
    clients,
    setClients,
    packages,
    setPackages,
    pickupStations,
    setPickupStations,
    areaCodes,
    setAreaCodes,
    users,
    setUsers,
    destinationRecords,
    setDestinationRecords,
    destinations,
    setDestinations,
  }), [user, isAuthenticated, isDark, dropOffPoints, packingRecords, deliveryNotifications, clients, packages, pickupStations, areaCodes, users, destinationRecords, destinations]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
