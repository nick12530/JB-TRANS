import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, Moon, Sun, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Truck, Package } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isDark, setIsDark } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <header className="bg-gradient-to-r from-white via-mint-50 to-white dark:from-gray-800 dark:via-mint-900/10 dark:to-gray-800 border-b-2 border-eco-200 dark:border-eco-800 px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-navy-500 to-eco-500 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="h-6 w-6 text-white" />
              <Package className="h-3 w-3 text-white absolute -top-0.5 -right-0.5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                Mwalimu Transporters
              </h1>
              <p className="text-xs font-bold text-eco-600 dark:text-eco-400">
                Package Management System
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Time Display & Portal Title */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-navy-50 to-eco-50 dark:from-navy-900/30 dark:to-eco-900/10 rounded-xl border border-navy-200 dark:border-navy-700">
              <Clock className="h-4 w-4 text-navy-600 dark:text-navy-400" />
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user?.role === 'admin' ? 'Admin Portal' : user?.role === 'staff' ? 'Staff Portal' : 'Portal'}
              </h2>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Package Registration & Tracking
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - User Info */}
        <div className="flex items-center gap-3">
          {/* Mobile Time Display */}
          <div className="md:hidden flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-navy-50 to-eco-50 dark:from-navy-900/30 dark:to-eco-900/10 rounded-lg border border-navy-200 dark:border-navy-700">
            <Clock className="h-3.5 w-3.5 text-navy-600 dark:text-navy-400" />
            <div className="text-xs font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {formatTime(currentTime)}
            </div>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          {user && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-navy-100 to-eco-100 dark:from-navy-900/40 dark:to-eco-900/20 rounded-xl border border-navy-200 dark:border-navy-700">
              <div className="h-10 w-10 bg-gradient-to-br from-navy-500 to-eco-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {user.name}
                </div>
                <div className="text-xs font-semibold text-eco-600 dark:text-eco-400 capitalize">
                  {user.role}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 hidden md:block" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
