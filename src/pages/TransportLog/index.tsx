import React, { useState } from 'react';
import { Truck, MapPin, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/helpers';

type TripStatus = 'loading' | 'in-transit' | 'dropped-off';

interface TransportEntry {
  id: string;
  tripId: string;
  date: string;
  driver: string;
  driverPhone: string;
  vehicleReg: string;
  vehicleMake?: string;
  pickupPoint: string;
  destination: string;
  goodsQuantity: number;
  goodsValue: number;
  packagingDetails: string;
  status: TripStatus;
  estimatedArrival?: string;
}

export const TransportLogPage: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'loading' | 'in-transit' | 'dropped-off'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<TransportEntry, 'id'>>({
    tripId: '',
    date: new Date().toISOString().split('T')[0],
    driver: '',
    driverPhone: '',
    vehicleReg: '',
    vehicleMake: '',
    pickupPoint: '',
    destination: '',
    goodsQuantity: 0,
    goodsValue: 0,
    packagingDetails: '',
    status: 'loading',
    estimatedArrival: '',
  });

  const [transportEntries, setTransportEntries] = useState<TransportEntry[]>([
    {
      id: '1',
      tripId: 'TRIP-001',
      date: '2024-01-15',
      driver: 'John Kimani',
      driverPhone: '+254 712 345678',
      vehicleReg: 'KAA 123A',
      vehicleMake: 'Toyota Hiace',
      pickupPoint: 'Point A',
      destination: 'Nairobi CBD',
      goodsQuantity: 50,
      goodsValue: 25000,
      packagingDetails: '2 Basins, 1 Sack',
      status: 'in-transit',
      estimatedArrival: '2024-01-15 15:30',
    },
    {
      id: '2',
      tripId: 'TRIP-002',
      date: '2024-01-15',
      driver: 'Peter Wanjiku',
      driverPhone: '+254 723 456789',
      vehicleReg: 'KBC 567B',
      vehicleMake: 'Mitsubishi Canter',
      pickupPoint: 'Point B',
      destination: 'Mombasa',
      goodsQuantity: 75,
      goodsValue: 37500,
      packagingDetails: '3 Basins, 2 Boxes',
      status: 'loading',
    },
    {
      id: '3',
      tripId: 'TRIP-003',
      date: '2024-01-14',
      driver: 'Mary Njoki',
      driverPhone: '+254 734 567890',
      vehicleReg: 'KAB 789C',
      vehicleMake: 'Isuzu NKR',
      pickupPoint: 'Point C',
      destination: 'Garissa',
      goodsQuantity: 30,
      goodsValue: 15000,
      packagingDetails: '1 Sack, 1 Box',
      status: 'dropped-off',
    },
  ]);

  const filteredEntries = activeTab === 'all' 
    ? transportEntries 
    : transportEntries.filter(entry => entry.status === activeTab);

  const handleStatusChange = (id: string, newStatus: TripStatus) => {
    setTransportEntries(entries => 
      entries.map(entry => 
        entry.id === id ? { ...entry, status: newStatus } : entry
      )
    );
  };

  const handleOpenModal = () => {
    setFormData({
      tripId: `TRIP-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      driver: '',
      driverPhone: '',
      vehicleReg: '',
      vehicleMake: '',
      pickupPoint: '',
      destination: '',
      goodsQuantity: 0,
      goodsValue: 0,
      packagingDetails: '',
      status: 'loading',
      estimatedArrival: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TransportEntry = {
      id: Date.now().toString(),
      ...formData,
    };
    setTransportEntries([...transportEntries, newEntry]);
    handleCloseModal();
  };

  const getStatusIcon = (status: TripStatus) => {
    switch (status) {
      case 'loading':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'dropped-off':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case 'loading':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'dropped-off':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getStatusText = (status: TripStatus) => {
    switch (status) {
      case 'loading':
        return 'Loading';
      case 'in-transit':
        return 'In Transit';
      case 'dropped-off':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transport Log</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track vehicles, drivers, and goods in transit
          </p>
        </div>
        {user?.role === 'user' && (
          <button 
            onClick={handleOpenModal}
            className="flex items-center space-x-2 px-4 py-2 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Trip</span>
          </button>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {['all', 'loading', 'in-transit', 'dropped-off'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Transport Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header with Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(entry.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                  {getStatusText(entry.status)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{entry.tripId}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</div>
              </div>
            </div>

            {/* Vehicle & Driver Info */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Driver</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{entry.driver}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{entry.driverPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vehicle</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{entry.vehicleReg}</p>
                  {entry.vehicleMake && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{entry.vehicleMake}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Route</p>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{entry.pickupPoint}</div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-3 w-3" />
                    <span>{entry.destination}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Goods</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{entry.goodsQuantity} kg</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(entry.goodsValue)}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Packaging</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{entry.packagingDetails}</p>
                {entry.estimatedArrival && entry.status === 'in-transit' && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    ETA: {entry.estimatedArrival}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {user?.role === 'admin' && (
              <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {entry.status === 'loading' && (
                  <button 
                    onClick={() => handleStatusChange(entry.id, 'in-transit')}
                    className="flex-1 text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Start Trip
                  </button>
                )}
                {entry.status === 'in-transit' && (
                  <button 
                    onClick={() => handleStatusChange(entry.id, 'dropped-off')}
                    className="flex-1 text-xs px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  >
                    Mark Delivered
                  </button>
                )}
                <button className="text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Edit
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <Card className="p-12 text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No transport entries found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No entries match the current filter criteria.
          </p>
        </Card>
      )}

      {/* Add Trip Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Trip"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Trip ID"
              type="text"
              value={formData.tripId}
              onChange={(value) => setFormData({ ...formData, tripId: value as string })}
              required
            />
            
            <FormInput
              label="Date"
              type="date"
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value as string })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Driver Name"
              type="text"
              value={formData.driver}
              onChange={(value) => setFormData({ ...formData, driver: value as string })}
              required
            />
            
            <FormInput
              label="Driver Phone"
              type="tel"
              value={formData.driverPhone}
              onChange={(value) => setFormData({ ...formData, driverPhone: value as string })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Vehicle Registration"
              type="text"
              value={formData.vehicleReg}
              onChange={(value) => setFormData({ ...formData, vehicleReg: value as string })}
              required
            />
            
            <FormInput
              label="Vehicle Make"
              type="text"
              value={formData.vehicleMake || ''}
              onChange={(value) => setFormData({ ...formData, vehicleMake: value as string })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Pickup Point"
              value={formData.pickupPoint}
              onChange={(value) => setFormData({ ...formData, pickupPoint: value as string })}
              options={[
                { value: 'Point A', label: 'Point A' },
                { value: 'Point B', label: 'Point B' },
                { value: 'Point C', label: 'Point C' },
                { value: 'Point D', label: 'Point D' },
              ]}
              required
            />
            
            <FormSelect
              label="Destination"
              value={formData.destination}
              onChange={(value) => setFormData({ ...formData, destination: value as string })}
              options={[
                { value: 'Nairobi CBD', label: 'Nairobi CBD' },
                { value: 'Mombasa', label: 'Mombasa' },
                { value: 'Garissa', label: 'Garissa' },
                { value: 'Meru', label: 'Meru' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Goods Quantity (kg)"
              type="number"
              value={formData.goodsQuantity}
              onChange={(value) => setFormData({ ...formData, goodsQuantity: value as number })}
              required
            />
            
            <FormInput
              label="Goods Value"
              type="number"
              value={formData.goodsValue}
              onChange={(value) => setFormData({ ...formData, goodsValue: value as number })}
              required
            />
          </div>

          <FormInput
            label="Packaging Details"
            type="text"
            value={formData.packagingDetails}
            onChange={(value) => setFormData({ ...formData, packagingDetails: value as string })}
            placeholder="e.g., 2 Basins, 1 Sack"
            required
          />

          <FormInput
            label="Estimated Arrival"
            type="datetime-local"
            value={formData.estimatedArrival || ''}
            onChange={(value) => setFormData({ ...formData, estimatedArrival: value as string })}
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bright-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Trip
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
