import React from 'react';
import { X, AlertCircle, Info, CheckCircle, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  icon,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const typeStyles = {
    default: {
      headerBg: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
      borderColor: 'border-gray-200 dark:border-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      titleColor: 'text-gray-900 dark:text-gray-100',
    },
    success: {
      headerBg: 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      titleColor: 'text-emerald-900 dark:text-emerald-100',
    },
    warning: {
      headerBg: 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      titleColor: 'text-yellow-900 dark:text-yellow-100',
    },
    error: {
      headerBg: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      borderColor: 'border-red-200 dark:border-red-700',
      iconColor: 'text-red-600 dark:text-red-400',
      titleColor: 'text-red-900 dark:text-red-100',
    },
    info: {
      headerBg: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      iconColor: 'text-blue-600 dark:text-blue-400',
      titleColor: 'text-blue-900 dark:text-blue-100',
    },
  };

  const defaultIcon = {
    default: <Settings className="h-6 w-6" />,
    success: <CheckCircle className="h-6 w-6" />,
    warning: <AlertCircle className="h-6 w-6" />,
    error: <AlertCircle className="h-6 w-6" />,
    info: <Info className="h-6 w-6" />,
  };

  const currentType = typeStyles[type];
  const displayIcon = icon || defaultIcon[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div
          className={clsx(
            'relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full border-2',
            sizeClasses[size],
            currentType.borderColor
          )}
        >
          {/* Enhanced Header */}
          <div className={clsx('px-6 py-4 border-b', currentType.headerBg, currentType.borderColor)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${currentType.iconColor} bg-white/50 dark:bg-gray-800/50`}>
                  {displayIcon}
                </div>
                <h3 className={clsx('text-xl font-bold', currentType.titleColor)}>
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
              >
                <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="bg-white dark:bg-gray-800 px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
