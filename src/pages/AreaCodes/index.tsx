import React, { useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { AreaCode, User } from '../../types';
import { 
  Search, 
  Plus, 
  Edit, 
  Download, 
  MapPin, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

export const AreaCodesPage: React.FC = () => {
  const { areaCodes, setAreaCodes, users, packages } = useApp();
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'region' | 'range'>('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = areaCodes.filter(c => 
      (!query || c.code.toLowerCase().includes(query) || c.name.toLowerCase().includes(query) || c.region.toLowerCase().includes(query)) &&
      (statusFilter === 'all' || c.status === statusFilter)
    );
    
    result = result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
        case 'range':
          comparison = a.minRange - b.minRange;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [areaCodes, q, statusFilter, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeCodes = areaCodes.filter(c => c.status === 'active').length;
    const totalCodes = areaCodes.length;
    const assignedCodes = areaCodes.filter(c => c.assignedTo).length;
    const unassignedCodes = areaCodes.filter(c => !c.assignedTo).length;
    
    // Calculate used codes from packages
    const usedCounts = new Map();
    packages.forEach(pkg => {
      // Parse tracking number format: STATION-CODE or similar
      const trackingNumber = pkg.trackingNumber || '';
      const parts = trackingNumber.split('-');
      if (parts.length > 1) {
        const code = parts[1];
        const num = parseInt(code);
        if (!isNaN(num)) {
          const areaCode = areaCodes.find(ac => num >= ac.minRange && num <= ac.maxRange);
          if (areaCode) {
            usedCounts.set(areaCode.id, (usedCounts.get(areaCode.id) || 0) + 1);
          }
        }
      }
    });
    
    return { activeCodes, totalCodes, assignedCodes, unassignedCodes, usedCounts };
  }, [areaCodes, packages]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const [form, setForm] = useState<Partial<AreaCode>>({ code: '', name: '', region: '', minRange: 0, maxRange: 0, status: 'active' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ code: '', name: '', region: '', minRange: 0, maxRange: 0, status: 'active' });
    setEditingId(null);
  };

  const saveCode = () => {
    if (!form.code || !form.name || !form.region || !form.minRange || !form.maxRange) return;
    if ((form.minRange as number) > (form.maxRange as number)) return;
    if (editingId) {
      setAreaCodes(areaCodes.map(c => c.id === editingId ? { ...c, ...form, id: editingId } as AreaCode : c));
    } else {
      const newItem: AreaCode = {
        id: Date.now().toString(),
        code: String(form.code),
        name: String(form.name),
        region: String(form.region),
        minRange: Number(form.minRange),
        maxRange: Number(form.maxRange),
        status: (form.status as any) || 'active',
        assignedTo: form.assignedTo ? String(form.assignedTo) : undefined,
        notes: form.notes ? String(form.notes) : undefined,
      };
      setAreaCodes([newItem, ...areaCodes]);
    }
    resetForm();
  };

  const editCode = (c: AreaCode) => {
    setEditingId(c.id);
    setForm({ ...c });
  };

  const toggleStatus = (id: string) => {
    setAreaCodes(areaCodes.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
  };

  const assignUser = (id: string, userId: string) => {
    setAreaCodes(areaCodes.map(c => c.id === id ? { ...c, assignedTo: userId || undefined } : c));
  };

  const deleteCode = (id: string) => {
    if (window.confirm('Are you sure you want to delete this area code?')) {
      setAreaCodes(areaCodes.filter(c => c.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const exportCSV = () => {
    const rows = [['Code', 'Name', 'Region', 'Min Range', 'Max Range', 'Status', 'Assigned To', 'Package Count']];
    for (const c of filtered) {
      const userName = users.find(u => u.id === c.assignedTo)?.name || 'Unassigned';
      const pkgCount = stats.usedCounts.get(c.id) || 0;
      rows.push([c.code, c.name, c.region, String(c.minRange), String(c.maxRange), c.status, userName, String(pkgCount)]);
    }
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = 'area-codes.csv'; 
    a.click(); 
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-navy-500 to-eco-500 rounded-xl shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-navy-700 via-eco-600 to-navy-700 dark:from-navy-300 dark:via-eco-400 dark:to-navy-300 bg-clip-text text-transparent">
              Area Code Management
            </h1>
          </div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-14">
            Manage area codes and assign them to staff members
          </p>
        </div>
        <Button onClick={() => resetForm()} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Area Code</span>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="enhanced" padding="md" className="bg-navy-50 dark:bg-navy-900/20 border border-navy-200 dark:border-navy-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Codes</p>
              <p className="text-3xl font-bold text-navy-700 dark:text-navy-300">{stats.totalCodes}</p>
            </div>
            <div className="p-3 bg-navy-500 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="enhanced" padding="md" className="bg-eco-50 dark:bg-eco-900/20 border border-eco-200 dark:border-eco-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Codes</p>
              <p className="text-3xl font-bold text-eco-700 dark:text-eco-300">{stats.activeCodes}</p>
            </div>
            <div className="p-3 bg-eco-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="enhanced" padding="md" className="bg-mint-50 dark:bg-mint-900/20 border border-mint-200 dark:border-mint-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Assigned</p>
              <p className="text-3xl font-bold text-mint-700 dark:text-mint-300">{stats.assignedCodes}</p>
            </div>
            <div className="p-3 bg-mint-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="enhanced" padding="md" className="bg-signal-50 dark:bg-signal-900/20 border border-signal-200 dark:border-signal-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Unassigned</p>
              <p className="text-3xl font-bold text-signal-700 dark:text-signal-300">{stats.unassignedCodes}</p>
            </div>
            <div className="p-3 bg-signal-500 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="lg" variant="enhanced" className="border-2 border-mint-200 dark:border-mint-800">
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-mint-600" />
          Search & Filter Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput 
            label="Search" 
            value={q} 
            onChange={(v)=>setQ(String(v))} 
            placeholder="Code, name or region"
            leftIcon={<Search className="h-4 w-4" />}
          />
          <FormSelect 
            label="Status Filter" 
            value={statusFilter} 
            onChange={(v)=>setStatusFilter(v as any)} 
            options={[
              {value:'all', label:'All Statuses'},
              {value:'active', label:'Active'},
              {value:'inactive', label:'Inactive'}
            ]}
            leftIcon={<Filter className="h-4 w-4" />}
          />
          <div className="flex items-end gap-2">
            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={exportCSV}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Add/Edit Form */}
      <Card padding="lg" variant="enhanced" className="bg-gradient-to-r from-navy-50 to-eco-50 dark:from-navy-900/20 dark:to-eco-900/20 border-2 border-navy-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-navy-200 dark:border-navy-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${editingId ? 'bg-yellow-500' : 'bg-eco-500'}`}>
              {editingId ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              {editingId ? 'Edit Area Code' : 'Add New Area Code'}
            </h2>
          </div>
          {editingId && (
            <Button variant="outline" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput 
            label="Area Code" 
            value={form.code || ''} 
            onChange={(v)=>setForm({...form, code: String(v)})}
            placeholder="e.g., EMBU"
            required
          />
          <FormInput 
            label="Station Name" 
            value={form.name || ''} 
            onChange={(v)=>setForm({...form, name: String(v)})}
            placeholder="e.g., Embu Station"
            required
          />
          <FormInput 
            label="Region" 
            value={form.region || ''} 
            onChange={(v)=>setForm({...form, region: String(v)})}
            placeholder="e.g., Eastern Region"
            required
          />
          <FormInput 
            label="Min Range" 
            type="number" 
            value={form.minRange || 0} 
            onChange={(v)=>setForm({...form, minRange: typeof v==='number'?v:Number(v)})}
            placeholder="e.g., 1"
            required
          />
          <FormInput 
            label="Max Range" 
            type="number" 
            value={form.maxRange || 0} 
            onChange={(v)=>setForm({...form, maxRange: typeof v==='number'?v:Number(v)})}
            placeholder="e.g., 300"
            required
          />
          <FormSelect 
            label="Status" 
            value={form.status || 'active'} 
            onChange={(v)=>setForm({...form, status: v as any})} 
            options={[{value:'active',label:'Active'},{value:'inactive',label:'Inactive'}]} 
          />
          <FormSelect 
            label="Assign To User" 
            value={form.assignedTo || ''} 
            onChange={(v)=>setForm({...form, assignedTo: String(v)})} 
            options={[{ value: '', label: 'Unassigned' }, ...users.map((u: User) => ({ value: u.id, label: `${u.name} ${u.email ? `(${u.email})` : ''}` }))]} 
            searchable
          />
          <FormInput 
            label="Notes" 
            value={form.notes || ''} 
            onChange={(v)=>setForm({...form, notes: String(v)})}
            placeholder="Optional notes..."
          />
        </div>
        {form.minRange && form.maxRange && form.minRange > form.maxRange && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">Min range must be less than max range</span>
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <Button onClick={saveCode} disabled={!form.code || !form.name || !form.region || form.minRange! > form.maxRange!}>
            {editingId ? 'Update Area Code' : 'Save Area Code'}
          </Button>
          {editingId && (
            <Button variant="destructive" onClick={() => deleteCode(editingId)}>
              Delete
            </Button>
          )}
        </div>
      </Card>

      <Card padding="lg" variant="enhanced" className="border-2 border-gray-200 dark:border-gray-700">
        <div className="mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-eco-500 rounded-lg shadow-md">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                Area Codes
              </h2>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Showing {filtered.length} of {areaCodes.length} total codes
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-navy-100 dark:bg-navy-900/30 rounded-lg border border-navy-200 dark:border-navy-800">
            <span className="text-sm font-bold text-navy-700 dark:text-navy-300">
              {filtered.length} results
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-navy-50 via-mint-50 to-eco-50 dark:from-navy-900/30 dark:via-mint-900/30 dark:to-eco-900/30 border-b-2 border-navy-200 dark:border-navy-700">
                <th className="py-4 px-3">
                  <button onClick={() => toggleSort('code')} className="flex items-center gap-2 font-extrabold text-navy-700 dark:text-navy-300 hover:text-navy-900 dark:hover:text-navy-100 transition-colors">
                    Code
                    {sortBy === 'code' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="py-4 px-3">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-2 font-extrabold text-navy-700 dark:text-navy-300 hover:text-navy-900 dark:hover:text-navy-100 transition-colors">
                    Name
                    {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="py-4 px-3">
                  <button onClick={() => toggleSort('region')} className="flex items-center gap-2 font-extrabold text-navy-700 dark:text-navy-300 hover:text-navy-900 dark:hover:text-navy-100 transition-colors">
                    Region
                    {sortBy === 'region' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="py-4 px-3">
                  <button onClick={() => toggleSort('range')} className="flex items-center gap-2 font-extrabold text-navy-700 dark:text-navy-300 hover:text-navy-900 dark:hover:text-navy-100 transition-colors">
                    Range
                    {sortBy === 'range' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="py-4 px-3 font-extrabold text-navy-700 dark:text-navy-300">Packages</th>
                <th className="py-4 px-3 font-extrabold text-navy-700 dark:text-navy-300">Assigned To</th>
                <th className="py-4 px-3 font-extrabold text-navy-700 dark:text-navy-300">Status</th>
                <th className="py-4 px-3 font-extrabold text-navy-700 dark:text-navy-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const pkgCount = stats.usedCounts.get(c.id) || 0;
                const user = users.find(u=>u.id===c.assignedTo);
                const range = c.maxRange - c.minRange + 1;
                const utilization = range > 0 ? ((pkgCount / range) * 100).toFixed(1) : '0';
                
                return (
                  <tr key={c.id} className="border-t border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-2 font-bold text-navy-600 dark:text-navy-400">{c.code}</td>
                    <td className="py-3 px-2 font-semibold">{c.name}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{c.region}</td>
                    <td className="py-3 px-2">
                      <span className="font-mono">{c.minRange} - {c.maxRange}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({range} codes)</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-eco-600 dark:text-eco-400">{pkgCount}</span>
                        <div className="flex-1 max-w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-eco-500 transition-all" 
                            style={{ width: `${Math.min(parseFloat(utilization), 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{utilization}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {user ? (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="font-semibold">{user.name}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        c.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {c.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => editCode(c)} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleStatus(c.id)} title={c.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {c.status === 'active' ? <XCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                        </Button>
                        <FormSelect
                          label=""
                          value={c.assignedTo || ''}
                          onChange={(v) => assignUser(c.id, String(v))}
                          options={[{ value: '', label: '—' }, ...users.map(u => ({ value: u.id, label: u.name }))]}
                          className="max-w-32"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MapPin className="h-12 w-12 text-gray-400" />
                      <p className="font-semibold">No area codes found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
