import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isDark } = useApp();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-4"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Miraa Transport Management System
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tracking goods from pickup points to destinations
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="h-8 w-8 bg-bright-green rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
