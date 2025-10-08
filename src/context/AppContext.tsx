import { createContext, useContext, useState, useEffect } from 'react';
import { User, SourceRecord, PickupRecord, DeliveryRecord, DestinationRecord, TransportLog, ProfitRecord } from '../types';

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  sourceRecords: SourceRecord[];
  setSourceRecords: (records: SourceRecord[]) => void;
  pickupRecords: PickupRecord[];
  setPickupRecords: (records: PickupRecord[]) => void;
  deliveryRecords: DeliveryRecord[];
  setDeliveryRecords: (records: DeliveryRecord[]) => void;
  destinationRecords: DestinationRecord[];
  setDestinationRecords: (records: DestinationRecord[]) => void;
  transportLogs: TransportLog[];
  setTransportLogs: (logs: TransportLog[]) => void;
  profitRecords: ProfitRecord[];
  setProfitRecords: (records: ProfitRecord[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sourceRecords, setSourceRecords] = useState<SourceRecord[]>([]);
  const [pickupRecords, setPickupRecords] = useState<PickupRecord[]>([]);
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>([]);
  const [destinationRecords, setDestinationRecords] = useState<DestinationRecord[]>([]);
  const [transportLogs, setTransportLogs] = useState<TransportLog[]>([]);
  const [profitRecords, setProfitRecords] = useState<ProfitRecord[]>([]);

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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isDark,
        setIsDark,
        sourceRecords,
        setSourceRecords,
        pickupRecords,
        setPickupRecords,
        deliveryRecords,
        setDeliveryRecords,
        destinationRecords,
        setDestinationRecords,
        transportLogs,
        setTransportLogs,
        profitRecords,
        setProfitRecords,
      }}
    >
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
