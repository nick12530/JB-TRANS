import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Users, Plus, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { SAMPLE_DROP_OFF_POINTS } from '../../data/sampleLogistics';
import { Client } from '../../types/logistics';

export const ClientsPage: React.FC = () => {
  const [dropOffPoints] = useState(SAMPLE_DROP_OFF_POINTS);
  const [selectedDropOffPoint, setSelectedDropOffPoint] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    phoneNumber: '',
    email: '',
    dropOffPointId: '',
    isActive: true,
    preferredNotificationMethod: 'sms'
  });

  const allClients = dropOffPoints.flatMap(point => 
    point.clients.map(client => ({ ...client, dropOffPointName: point.name }))
  );

  const filteredClients = selectedDropOffPoint === 'all' 
    ? allClients 
    : allClients.filter(client => client.dropOffPointId === selectedDropOffPoint);

  const addClient = () => {
    if (newClient.name && newClient.phoneNumber && newClient.dropOffPointId) {
      // Here you would add to backend
      console.log('Adding client:', newClient);
      alert('Client added successfully!');
      setNewClient({
        name: '',
        phoneNumber: '',
        email: '',
        dropOffPointId: '',
        isActive: true,
        preferredNotificationMethod: 'sms'
      });
      setShowAddForm(false);
    }
  };

  const updateClient = () => {
    if (editingClient) {
      // Here you would update in backend
      console.log('Updating client:', editingClient);
      alert('Client updated successfully!');
      setEditingClient(null);
    }
  };

  const deleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      // Here you would delete from backend
      console.log('Deleting client:', clientId);
      alert('Client deleted successfully!');
    }
  };

  const totalClients = allClients.length;
  const activeClients = allClients.filter(client => client.isActive).length;
  const inactiveClients = totalClients - activeClients;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Clients Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage clients at each drop-off point
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Clients</div>
            <div className="text-2xl font-bold text-blue-600">{totalClients}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
            <div className="text-2xl font-bold text-green-600">{activeClients}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Inactive</div>
            <div className="text-2xl font-bold text-gray-600">{inactiveClients}</div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FormSelect
              label="Drop-off Point"
              value={selectedDropOffPoint}
              onChange={(e) => setSelectedDropOffPoint(e.target.value)}
              options={[
                { value: 'all', label: 'All Drop-off Points' },
                ...dropOffPoints.map(point => ({ value: point.id, label: point.name }))
              ]}
            />
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </Card>

      {/* Add Client Form */}
      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Client Name"
              value={newClient.name || ''}
              onChange={(e) => setNewClient({...newClient, name: e.target.value})}
              placeholder="Enter client name"
            />
            <FormInput
              label="Phone Number"
              value={newClient.phoneNumber || ''}
              onChange={(e) => setNewClient({...newClient, phoneNumber: e.target.value})}
              placeholder="Enter phone number"
            />
            <FormInput
              label="Email (Optional)"
              type="email"
              value={newClient.email || ''}
              onChange={(e) => setNewClient({...newClient, email: e.target.value})}
              placeholder="Enter email address"
            />
            <FormSelect
              label="Drop-off Point"
              value={newClient.dropOffPointId || ''}
              onChange={(e) => setNewClient({...newClient, dropOffPointId: e.target.value})}
              options={dropOffPoints.map(point => ({ value: point.id, label: point.name }))}
              placeholder="Select drop-off point"
            />
            <FormSelect
              label="Notification Method"
              value={newClient.preferredNotificationMethod || 'sms'}
              onChange={(e) => setNewClient({...newClient, preferredNotificationMethod: e.target.value as 'sms' | 'email' | 'both'})}
              options={[
                { value: 'sms', label: 'SMS Only' },
                { value: 'email', label: 'Email Only' },
                { value: 'both', label: 'SMS & Email' }
              ]}
            />
          </div>
          <div className="mt-4 flex space-x-3">
            <Button onClick={addClient}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {client.dropOffPointName}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                client.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {client.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                {client.phoneNumber}
              </div>
              
              {client.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  {client.email}
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                {client.preferredNotificationMethod.toUpperCase()}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingClient(client)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteClient(client.id)}
                className="flex-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No clients found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filter or add new clients.
          </p>
        </Card>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
              <div className="space-y-4">
                <FormInput
                  label="Client Name"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({...editingClient, name: e.target.value})}
                />
                <FormInput
                  label="Phone Number"
                  value={editingClient.phoneNumber}
                  onChange={(e) => setEditingClient({...editingClient, phoneNumber: e.target.value})}
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={editingClient.email || ''}
                  onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                />
                <FormSelect
                  label="Notification Method"
                  value={editingClient.preferredNotificationMethod}
                  onChange={(e) => setEditingClient({...editingClient, preferredNotificationMethod: e.target.value as 'sms' | 'email' | 'both'})}
                  options={[
                    { value: 'sms', label: 'SMS Only' },
                    { value: 'email', label: 'Email Only' },
                    { value: 'both', label: 'SMS & Email' }
                  ]}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingClient.isActive}
                    onChange={(e) => setEditingClient({...editingClient, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                    Active Client
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setEditingClient(null)}>
                  Cancel
                </Button>
                <Button onClick={updateClient}>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Client
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
