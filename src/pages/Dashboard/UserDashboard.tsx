import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  MapPin,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const { packages, user } = useApp();
  const navigate = useNavigate();

  // Filter packages for current user
  const userPackages = packages.filter(p => p.registeredBy === user?.id);
  const registeredToday = userPackages.filter(p => {
    const today = new Date().toISOString().split('T')[0];
    return p.registeredAt.startsWith(today);
  }).length;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card variant="enhanced" padding="md" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-navy-400/20 to-navy-600/20 rounded-bl-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-navy-500 text-white">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Packages Registered Today
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {registeredToday}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total today
            </p>
          </div>
        </Card>

        <Card variant="enhanced" padding="md" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-eco-400/20 to-eco-600/20 rounded-bl-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-eco-500 text-white">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Registered
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {userPackages.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              All time
            </p>
          </div>
        </Card>

        <Card variant="enhanced" padding="md" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-signal-300/20 to-signal-500/20 rounded-bl-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-signal-400 text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Active Packages
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {userPackages.filter(p => p.status !== 'delivered' && p.status !== 'cancelled').length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              In transit
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="default" 
            size="lg"
            className="w-full flex items-center justify-between"
            onClick={() => navigate('/register-package')}
          >
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Register New Package</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full flex items-center justify-between"
            onClick={() => navigate('/packages')}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Open Package Management</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      {/* Recent Packages */}
      <Card variant="enhanced" padding="lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Your Recent Packages
        </h2>
        <div className="space-y-3">
          {userPackages.slice(0, 5).map((pkg) => (
            <div key={pkg.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  pkg.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/20' :
                  pkg.status === 'in-transit' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-blue-100 dark:bg-blue-900/20'
                }`}>
                  <Package className={`h-5 w-5 ${
                    pkg.status === 'delivered' ? 'text-green-600' :
                    pkg.status === 'in-transit' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {pkg.trackingNumber}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {pkg.recipientName} • {pkg.destination}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pkg.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                  pkg.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                }`}>
                  {pkg.status}
                </span>
              </div>
            </div>
          ))}
          {userPackages.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No packages registered yet
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

