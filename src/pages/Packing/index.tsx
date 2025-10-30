import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { Button } from '../../components/Button';
import { Plus, Package, MapPin, Save } from 'lucide-react';
import { DROP_OFF_LOCATIONS, PACKAGING_TYPES } from '../../data/sampleLogistics';
import { PackingItem } from '../../types/logistics';

export const PackingPage: React.FC = () => {
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<PackingItem>>({
    dropOffPointId: '',
    packagingType: 'boxes',
    quantity: 0,
    weight: 0,
    estimatedDeliveryTime: '',
    notes: ''
  });

  const addItem = () => {
    if (currentItem.dropOffPointId && currentItem.quantity && currentItem.weight) {
      const newItem: PackingItem = {
        id: Date.now().toString(),
        dropOffPointId: currentItem.dropOffPointId,
        dropOffPointName: DROP_OFF_LOCATIONS.find((loc: string) => loc === currentItem.dropOffPointId) || '',
        packagingType: currentItem.packagingType || 'boxes',
        quantity: currentItem.quantity,
        weight: currentItem.weight,
        estimatedDeliveryTime: currentItem.estimatedDeliveryTime || '',
        notes: currentItem.notes
      };
      
      setPackingItems([...packingItems, newItem]);
      setCurrentItem({
        dropOffPointId: '',
        packagingType: 'boxes',
        quantity: 0,
        weight: 0,
        estimatedDeliveryTime: '',
        notes: ''
      });
    }
  };

  const removeItem = (id: string) => {
    setPackingItems(packingItems.filter(item => item.id !== id));
  };

  const savePackingRecord = () => {
    // Here you would save to backend
    console.log('Saving packing record:', packingItems);
    alert('Packing record saved successfully!');
    setPackingItems([]);
  };

  const totalItems = packingItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = packingItems.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Packing Station
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record items being packed for delivery to drop-off points
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
            <div className="text-2xl font-bold text-bright-green">{totalItems}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Weight</div>
            <div className="text-2xl font-bold text-blue-600">{totalWeight.toFixed(1)} kg</div>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Items to Pack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect
            label="Drop-off Point"
            value={currentItem.dropOffPointId || ''}
            onChange={(value) => setCurrentItem({...currentItem, dropOffPointId: value})}
            options={DROP_OFF_LOCATIONS.map((location: string) => ({ value: location, label: location }))}
            placeholder="Select drop-off point"
          />
          
          <FormSelect
            label="Packaging Type"
            value={currentItem.packagingType || 'boxes'}
            onChange={(value) => setCurrentItem({...currentItem, packagingType: value as 'boxes' | 'basins' | 'sacks'})}
            options={PACKAGING_TYPES.map(type => ({ value: type.id, label: type.name }))}
          />
          
          <FormInput
            label="Quantity"
            type="number"
            value={currentItem.quantity || 0}
            onChange={(value) => setCurrentItem({...currentItem, quantity: typeof value === 'number' ? value : parseInt(value.toString()) || 0})}
            placeholder="Enter quantity"
          />
          
          <FormInput
            label="Weight (kg)"
            type="number"
            step={0.1}
            value={currentItem.weight || 0}
            onChange={(value) => setCurrentItem({...currentItem, weight: typeof value === 'number' ? value : parseFloat(value.toString()) || 0})}
            placeholder="Enter weight"
          />
          
          <FormInput
            label="Estimated Delivery Time"
            type="datetime-local"
            value={currentItem.estimatedDeliveryTime || ''}
            onChange={(value) => setCurrentItem({...currentItem, estimatedDeliveryTime: value.toString()})}
          />
          
          <FormInput
            label="Notes"
            value={currentItem.notes || ''}
            onChange={(value) => setCurrentItem({...currentItem, notes: value.toString()})}
            placeholder="Additional notes"
          />
        </div>
        
        <div className="mt-4">
          <Button onClick={addItem} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </Card>

      {/* Packing Items List */}
      {packingItems.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Packing Items ({packingItems.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Drop-off Point</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Packaging</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Weight</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Delivery Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Notes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packingItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {item.dropOffPointName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                            style={{ 
                              backgroundColor: PACKAGING_TYPES.find(t => t.id === item.packagingType)?.color + '20',
                              color: PACKAGING_TYPES.find(t => t.id === item.packagingType)?.color 
                            }}>
                        {item.packagingType.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.quantity}</td>
                    <td className="py-3 px-4">{item.weight} kg</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {item.estimatedDeliveryTime ? new Date(item.estimatedDeliveryTime).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {item.notes || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={savePackingRecord} className="flex items-center bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Packing Record
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
