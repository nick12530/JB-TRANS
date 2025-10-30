import { getSupabaseClient, isSupabaseEnabled } from '../lib/supabaseClient';
import type { AreaCode, Client, Package, PickupStation, User } from '../types';

type Tables = 'packages' | 'users' | 'clients' | 'stations' | 'area_codes' | 'notifications';

const localKeys: Record<Tables, string> = {
  packages: 'mwalimu-packages',
  users: 'mwalimu-users',
  clients: 'mwalimu-clients',
  stations: 'mwalimu-stations',
  area_codes: 'mwalimu-area-codes',
  notifications: 'mwalimu-notifications',
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const dataService = {
  async listPackages(): Promise<Package[]> {
    if (!isSupabaseEnabled()) return readLocal(localKeys.packages, [] as Package[]);
    const supabase = getSupabaseClient();
    if (!supabase) return readLocal(localKeys.packages, [] as Package[]);
    const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
    if (error) return readLocal(localKeys.packages, [] as Package[]);
    return (data ?? []).map(fromDbPackage);
  },

  async upsertPackages(items: Package[]): Promise<void> {
    if (!isSupabaseEnabled()) return writeLocal(localKeys.packages, items);
    const supabase = getSupabaseClient();
    if (!supabase) return writeLocal(localKeys.packages, items);
    if (items.length) await supabase.from('packages').upsert(items.map(toDbPackage), { onConflict: 'id' });
  },

  async listUsers(): Promise<User[]> {
    if (!isSupabaseEnabled()) return readLocal(localKeys.users, [] as User[]);
    const supabase = getSupabaseClient();
    if (!supabase) return readLocal(localKeys.users, [] as User[]);
    const { data, error } = await supabase.from('users').select('*');
    if (error) return readLocal(localKeys.users, [] as User[]);
    return (data ?? []).map(fromDbUser);
  },

  async upsertUsers(items: User[]): Promise<void> {
    if (!isSupabaseEnabled()) return writeLocal(localKeys.users, items);
    const supabase = getSupabaseClient();
    if (!supabase) return writeLocal(localKeys.users, items);
    if (items.length) await supabase.from('users').upsert(items.map(toDbUser), { onConflict: 'id' });
  },

  async listClients(): Promise<Client[]> {
    if (!isSupabaseEnabled()) return readLocal(localKeys.clients, [] as Client[]);
    const supabase = getSupabaseClient();
    if (!supabase) return readLocal(localKeys.clients, [] as Client[]);
    const { data, error } = await supabase.from('clients').select('*');
    if (error) return readLocal(localKeys.clients, [] as Client[]);
    return (data ?? []).map(fromDbClient);
  },

  async upsertClients(items: Client[]): Promise<void> {
    if (!isSupabaseEnabled()) return writeLocal(localKeys.clients, items);
    const supabase = getSupabaseClient();
    if (!supabase) return writeLocal(localKeys.clients, items);
    if (items.length) await supabase.from('clients').upsert(items.map(toDbClient), { onConflict: 'id' });
  },

  async listStations(): Promise<PickupStation[]> {
    if (!isSupabaseEnabled()) return readLocal(localKeys.stations, [] as PickupStation[]);
    const supabase = getSupabaseClient();
    if (!supabase) return readLocal(localKeys.stations, [] as PickupStation[]);
    const { data, error } = await supabase.from('stations').select('*').order('name');
    if (error) return readLocal(localKeys.stations, [] as PickupStation[]);
    return (data ?? []).map(fromDbStation);
  },

  async upsertStations(items: PickupStation[]): Promise<void> {
    if (!isSupabaseEnabled()) return writeLocal(localKeys.stations, items);
    const supabase = getSupabaseClient();
    if (!supabase) return writeLocal(localKeys.stations, items);
    if (items.length) await supabase.from('stations').upsert(items.map(toDbStation), { onConflict: 'id' });
  },

  async listAreaCodes(): Promise<AreaCode[]> {
    if (!isSupabaseEnabled()) return readLocal(localKeys.area_codes, [] as AreaCode[]);
    const supabase = getSupabaseClient();
    if (!supabase) return readLocal(localKeys.area_codes, [] as AreaCode[]);
    const { data, error } = await supabase.from('area_codes').select('*').order('minrange');
    if (error) return readLocal(localKeys.area_codes, [] as AreaCode[]);
    return (data ?? []).map(fromDbAreaCode);
  },

  async upsertAreaCodes(items: AreaCode[]): Promise<void> {
    if (!isSupabaseEnabled()) return writeLocal(localKeys.area_codes, items);
    const supabase = getSupabaseClient();
    if (!supabase) return writeLocal(localKeys.area_codes, items);
    if (items.length) await supabase.from('area_codes').upsert(items.map(toDbAreaCode), { onConflict: 'id' });
  },
};

// ---------- Mappers: app types <-> DB row shapes (lowercase column names) ----------

function toDbPackage(p: Package): any {
  return {
    id: p.id,
    trackingnumber: p.trackingNumber,
    areacode: p.areaCode,
    sendername: p.senderName,
    senderphone: p.senderPhone,
    recipientname: p.recipientName,
    recipientphone: p.recipientPhone,
    destination: p.destination,
    weight: p.weight,
    status: p.status,
    registeredby: p.registeredBy,
    registeredat: p.registeredAt,
    station: p.station,
    notes: p.notes ?? null,
  };
}

function fromDbPackage(r: any): Package {
  return {
    id: r.id,
    trackingNumber: r.trackingnumber,
    areaCode: r.areacode,
    senderName: r.sendername,
    senderPhone: r.senderphone,
    recipientName: r.recipientname,
    recipientPhone: r.recipientphone,
    destination: r.destination,
    weight: Number(r.weight),
    status: r.status,
    registeredBy: r.registeredby,
    registeredAt: r.registeredat,
    station: r.station,
    notes: r.notes ?? undefined,
  } as Package;
}

function toDbUser(u: User): any {
  return {
    id: u.id,
    name: u.name,
    role: u.role,
    email: u.email ?? null,
    phonenumber: u.phoneNumber ?? null,
    status: u.status,
    createdat: u.createdAt ?? null,
    updatedat: u.updatedAt ?? null,
    lastlogin: u.lastLogin ?? null,
    department: u.department ?? null,
    assignedstation: u.assignedStation ?? null,
  };
}

function fromDbUser(r: any): User {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    email: r.email ?? undefined,
    phoneNumber: r.phonenumber ?? undefined,
    status: r.status,
    createdAt: r.createdat ?? undefined,
    updatedAt: r.updatedat ?? undefined,
    lastLogin: r.lastlogin ?? undefined,
    department: r.department ?? undefined,
    assignedStation: r.assignedstation ?? undefined,
  } as User;
}

function toDbClient(c: Client): any {
  return {
    id: (c as any).id,
    name: (c as any).name,
    phonenumber: (c as any).phoneNumber ?? null,
    email: (c as any).email ?? null,
    address: (c as any).address ?? null,
  };
}

function fromDbClient(r: any): Client {
  return ({
    id: r.id,
    name: r.name,
    phoneNumber: r.phonenumber ?? undefined,
    email: r.email ?? undefined,
    address: r.address ?? undefined,
  } as unknown) as Client;
}

function toDbStation(s: PickupStation): any {
  return {
    id: s.id,
    name: s.name,
    code: s.code,
    region: s.region,
    location: s.location,
    status: s.status,
    manager: s.manager ?? null,
    contact: s.contact,
    capacity: s.capacity ?? null,
    currentinventory: s.currentInventory ?? null,
  };
}

function fromDbStation(r: any): PickupStation {
  return {
    id: r.id,
    name: r.name,
    code: r.code,
    region: r.region,
    location: r.location,
    status: r.status,
    manager: r.manager ?? undefined,
    contact: r.contact,
    capacity: r.capacity == null ? undefined : Number(r.capacity),
    currentInventory: r.currentinventory == null ? undefined : Number(r.currentinventory),
  } as PickupStation;
}

function toDbAreaCode(a: AreaCode): any {
  return {
    id: a.id,
    code: a.code,
    name: a.name,
    region: a.region,
    minrange: a.minRange,
    maxrange: a.maxRange,
    status: a.status,
    assignedto: a.assignedTo ?? null,
    notes: a.notes ?? null,
  };
}

function fromDbAreaCode(r: any): AreaCode {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    region: r.region,
    minRange: Number(r.minrange),
    maxRange: Number(r.maxrange),
    status: r.status,
    assignedTo: r.assignedto ?? undefined,
    notes: r.notes ?? undefined,
  } as AreaCode;
}


