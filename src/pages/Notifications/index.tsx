import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FormSelect } from '../../components/FormSelect';
import { Bell, Send, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import { SAMPLE_DELIVERY_NOTIFICATIONS } from '../../data/sampleLogistics';
import { DeliveryNotification } from '../../types/logistics';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<DeliveryNotification[]>(SAMPLE_DELIVERY_NOTIFICATIONS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDropOffPoint, setFilterDropOffPoint] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    const statusMatch = filterStatus === 'all' || notification.status === filterStatus;
    const dropOffMatch = filterDropOffPoint === 'all' || notification.dropOffPointName === filterDropOffPoint;
    return statusMatch && dropOffMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="h-4 w-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const sendNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'sent', sentAt: new Date().toISOString() }
        : notification
    ));
  };

  const markAsDelivered = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'delivered', deliveredAt: new Date().toISOString() }
        : notification
    ));
  };

  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === 'sent').length;
  const deliveredNotifications = notifications.filter(n => n.status === 'delivered').length;
  const failedNotifications = notifications.filter(n => n.status === 'failed').length;

  const uniqueDropOffPoints = [...new Set(notifications.map(n => n.dropOffPointName))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Delivery Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage notifications sent to clients
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
            <div className="text-2xl font-bold text-gray-600">{totalNotifications}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Sent</div>
            <div className="text-2xl font-bold text-blue-600">{sentNotifications}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Delivered</div>
            <div className="text-2xl font-bold text-green-600">{deliveredNotifications}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
            <div className="text-2xl font-bold text-red-600">{failedNotifications}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex items-center space-x-4">
            <FormSelect
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'sent', label: 'Sent' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'failed', label: 'Failed' }
              ]}
            />
            <FormSelect
              label="Drop-off Point"
              value={filterDropOffPoint}
              onChange={(e) => setFilterDropOffPoint(e.target.value)}
              options={[
                { value: 'all', label: 'All Points' },
                ...uniqueDropOffPoints.map(point => ({ value: point, label: point }))
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {notification.clientName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {notification.clientPhone} • {notification.dropOffPointName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(notification.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                  {notification.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {notification.totalItems}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Weight</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {notification.totalWeight} kg
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Delivery Time</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(notification.estimatedDeliveryTime).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Items Breakdown</div>
              <div className="flex flex-wrap gap-2">
                {notification.items.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                    {item.quantity} {item.packagingType} ({item.weight}kg)
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Message Content</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {notification.messageContent}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sent: {notification.sentAt ? new Date(notification.sentAt).toLocaleString() : 'Not sent'}
                {notification.deliveredAt && (
                  <span className="ml-4">
                    Delivered: {new Date(notification.deliveredAt).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {notification.status === 'sent' && (
                  <Button
                    size="sm"
                    onClick={() => markAsDelivered(notification.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Delivered
                  </Button>
                )}
                {notification.status !== 'sent' && notification.status !== 'delivered' && (
                  <Button
                    size="sm"
                    onClick={() => sendNotification(notification.id)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Notification
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card className="p-12 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No notifications found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or create new notifications from the packing station.
          </p>
        </Card>
      )}
    </div>
  );
};
