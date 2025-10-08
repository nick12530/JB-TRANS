import { useNotifications } from '../context/NotificationsContext';

export const useNotificationService = () => {
  const { addNotification } = useNotifications();

  const showSuccessNotification = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification({
      type: 'success',
      title,
      message,
      action,
    });
  };

  const showErrorNotification = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification({
      type: 'error',
      title,
      message,
      action,
    });
  };

  const showWarningNotification = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification({
      type: 'warning',
      title,
      message,
      action,
    });
  };

  const showInfoNotification = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification({
      type: 'info',
      title,
      message,
      action,
    });
  };

  // Sample notifications for demonstration
  const addSampleNotifications = () => {
    // Add some sample notifications
    showSuccessNotification(
      'New Record Added',
      'Successfully added pickup record for Area AC001 with 50kg of goods.',
      {
        label: 'View Record',
        onClick: () => console.log('Navigate to record')
      }
    );

    showWarningNotification(
      'Low Stock Alert',
      'Area AC002 is running low on miraa stock. Consider restocking soon.',
      {
        label: 'Check Stock',
        onClick: () => console.log('Navigate to stock')
      }
    );

    showErrorNotification(
      'Delivery Failed',
      'Delivery to Nairobi CBD failed due to vehicle breakdown. Driver John Kimani needs assistance.',
      {
        label: 'View Details',
        onClick: () => console.log('Navigate to delivery details')
      }
    );

    showInfoNotification(
      'System Update',
      'New features have been added to the dashboard. Check out the enhanced analytics section.',
      {
        label: 'Learn More',
        onClick: () => console.log('Navigate to help')
      }
    );
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    addSampleNotifications,
  };
};
