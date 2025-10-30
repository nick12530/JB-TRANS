import React, { useState } from 'react';
import { Logo } from './Logo';
import { Settings, User, LogOut, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showUserMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showUserMenu = true 
}) => {
  const { user, isDark, setIsDark } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('mwalimu-user');
    localStorage.removeItem('mwalimu-auth');
    window.location.href = '/login';
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
        <header className="glass-sidebar border-b border-white/20 dark:border-gray-700/50 shadow-sm relative z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-6">
            <Logo size="md" />
            
            {title && (
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Menu */}
            {showUserMenu && user && (
              <div className="relative flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((o) => !o)}
                  className="text-right hidden sm:block cursor-pointer group py-2"
                  title="Open user menu"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:underline">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role}
                  </p>
                </button>

                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="User menu"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-bright-green to-green-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>

                {/* Dropdown Menu anchored to the wrapper so both triggers work */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-2">
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          window.location.href = '/settings';
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          console.log('Profile clicked');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </button>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
