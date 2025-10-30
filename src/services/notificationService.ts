// Notifications disabled; provide no-op service to avoid crashes
export const useNotificationService = () => {
  const noop = (..._args: any[]) => {};
  return {
    showSuccessNotification: noop as (...args: any[]) => void,
    showErrorNotification: noop as (...args: any[]) => void,
    showWarningNotification: noop as (...args: any[]) => void,
    showInfoNotification: noop as (...args: any[]) => void,
    addSampleNotifications: noop as (...args: any[]) => void,
  };
};
