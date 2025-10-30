import React, { useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { useApp } from '../../context/AppContext';
import { User, Client } from '../../types';

export const UsersPage: React.FC = () => {
  const { users, setUsers, clients, setClients } = useApp();
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' as User['role'] });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;
    return users.filter(u => u.name.toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query));
  }, [q, users]);

  const addUser = () => {
    if (!form.name) return;
    const newUser: User = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email || undefined,
      role: form.role,
      status: 'active',
      createdAt: new Date().toISOString(),
    } as User;
    setUsers([newUser, ...users]);
    setForm({ name: '', email: '', role: 'staff' });
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const deleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Clients management
  const [cq, setCq] = useState('');
  const [cform, setCform] = useState<{ name: string; phoneNumber: string; email?: string } | null>({ name: '', phoneNumber: '', email: '' });

  const filteredClients = useMemo(() => {
    const query = cq.trim().toLowerCase();
    return clients.filter(c => !query || c.name.toLowerCase().includes(query) || (c.phoneNumber||'').toLowerCase().includes(query) || (c.email||'').toLowerCase().includes(query));
  }, [cq, clients]);

  const addClient = () => {
    if (!cform || !cform.name || !cform.phoneNumber) return;
    const newClient: Client = {
      id: Date.now().toString(),
      name: cform.name,
      phoneNumber: cform.phoneNumber,
      email: cform.email || undefined,
      dropOffPointId: '',
      isActive: true,
      preferredNotificationMethod: 'sms',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClients([newClient, ...clients]);
    setCform({ name: '', phoneNumber: '', email: '' });
  };

  const toggleClient = (id: string) => {
    setClients(clients.map(c => c.id === id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>

      <Card padding="lg" variant="enhanced">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput label="Search" value={q} onChange={(v)=>setQ(String(v))} placeholder="Name or email" />
          <FormInput label="Name" value={form.name} onChange={(v)=>setForm({...form, name: String(v)})} />
          <FormInput label="Email" value={form.email} onChange={(v)=>setForm({...form, email: String(v)})} />
          <FormSelect label="Role" value={form.role} onChange={(v)=>setForm({...form, role: v as User['role']})} options={[{value:'staff',label:'Staff'},{value:'client',label:'Client'},{value:'admin',label:'Admin'}]} />
        </div>
        <div className="mt-4">
          <Button onClick={addUser}>Add User</Button>
        </div>
      </Card>

      <Card padding="lg" variant="enhanced">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-gray-200 dark:border-gray-700 text-sm">
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4 capitalize">{u.role}</td>
                  <td className="py-2 pr-4">{u.status}</td>
                  <td className="py-2 pr-4 space-x-1">
                    <Button size="sm" variant={u.status==='active'?'outline':'default'} onClick={()=>toggleStatus(u.id)}>
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={()=>deleteUser(u.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">No users</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Clients</h2>

      <Card padding="lg" variant="enhanced">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput label="Search" value={cq} onChange={(v)=>setCq(String(v))} placeholder="Name, phone or email" />
          <FormInput label="Name" value={cform?.name || ''} onChange={(v)=>setCform({ ...(cform||{name:'',phoneNumber:''}), name: String(v) })} />
          <FormInput label="Phone" value={cform?.phoneNumber || ''} onChange={(v)=>setCform({ ...(cform||{name:'',phoneNumber:''}), phoneNumber: String(v) })} />
          <FormInput label="Email" value={cform?.email || ''} onChange={(v)=>setCform({ ...(cform||{name:'',phoneNumber:''}), email: String(v) })} />
        </div>
        <div className="mt-4">
          <Button onClick={addClient}>Add Client</Button>
        </div>
      </Card>

      <Card padding="lg" variant="enhanced">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(c => (
                <tr key={c.id} className="border-t border-gray-200 dark:border-gray-700 text-sm">
                  <td className="py-2 pr-4">{c.name}</td>
                  <td className="py-2 pr-4">{c.phoneNumber}</td>
                  <td className="py-2 pr-4">{c.email || '—'}</td>
                  <td className="py-2 pr-4">{c.isActive ? 'active' : 'inactive'}</td>
                  <td className="py-2 pr-4">
                    <Button size="sm" variant={c.isActive?'outline':'default'} onClick={()=>toggleClient(c.id)}>
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">No clients</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
