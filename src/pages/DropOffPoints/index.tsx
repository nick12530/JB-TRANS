import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MapPin, Users, Package, Plus, Edit, Trash2 } from 'lucide-react';
import { SAMPLE_DROP_OFF_POINTS } from '../../data/sampleLogistics';
import { DropOffPoint } from '../../types/logistics';

export const DropOffPointsPage: React.FC = () => {
  const [dropOffPoints, setDropOffPoints] = useState<DropOffPoint[]>(SAMPLE_DROP_OFF_POINTS);
  const [selectedPoint, setSelectedPoint] = useState<DropOffPoint | null>(null);

  const toggleStatus = (id: string) => {
    setDropOffPoints(dropOffPoints.map(point => 
      point.id === id 
        ? { ...point, status: point.status === 'active' ? 'inactive' : 'active' }
        : point
    ));
  };

  const totalClients = dropOffPoints.reduce((sum, point) => sum + point.clients.length, 0);
  const activePoints = dropOffPoints.filter(point => point.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Drop-off Points
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage distribution locations and their clients
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Points</div>
            <div className="text-2xl font-bold text-green-600">{activePoints}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Clients</div>
            <div className="text-2xl font-bold text-blue-600">{totalClients}</div>
          </div>
        </div>
      </div>

      {/* Drop-off Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dropOffPoints.map((point) => (
          <Card key={point.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {point.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {point.location}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                point.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {point.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-1" />
                  Clients
                </div>
                <span className="font-medium">{point.clients.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Package className="h-4 w-4 mr-1" />
                  Capacity
                </div>
                <span className="font-medium">{point.capacity} items/day</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Region
                </div>
                <span className="font-medium text-sm">{point.region}</span>
              </div>
            </div>

            {point.notes && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {point.notes}
                </p>
              </div>
            )}

            <div className="mt-4 flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedPoint(point)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button
                size="sm"
                variant={point.status === 'active' ? 'outline' : 'default'}
                onClick={() => toggleStatus(point.id)}
                className="flex-1"
              >
                {point.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Drop-off Point */}
      <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <div className="text-center">
          <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
            Add New Drop-off Point
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Create a new distribution location
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Drop-off Point
          </Button>
        </div>
      </Card>

      {/* Selected Point Details Modal */}
      {selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedPoint.name} Details
                </h2>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedPoint.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Region
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedPoint.region}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Capacity
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedPoint.capacity} items per day</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPoint.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {selectedPoint.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Clients ({selectedPoint.clients.length})
                  </label>
                  <div className="space-y-2">
                    {selectedPoint.clients.map((client) => (
                      <div key={client.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {client.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {client.phoneNumber}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {client.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {client.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {client.email}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPoint.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedPoint.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedPoint(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
