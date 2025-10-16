import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Truck, User, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - create fake user
    const user = {
      id: '1',
      name: role === 'admin' ? 'Admin User' : 'Regular User',
      email: role === 'admin' ? 'admin@mwalimu.com' : 'user@mwalimu.com',
      role,
    };
    
    setUser(user);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: 'url("/login-forest.jpg?v=1")',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-br from-bright-green to-miraa-green/90 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 shadow-inner">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">
              Mwalimu Transporters
            </h1>
            <p className="text-green-100 text-sm">
              Miraa Transport Management System
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/30 dark:border-gray-700/50" />

          {/* Form Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
                {role === 'admin' ? 'Welcome Back, Admin' : 'Welcome Back, Regular User'}
              </h2>
              <p className="text-gray-800/90 dark:text-gray-200/90 text-center text-sm">
                Select your role to continue
              </p>

              {/* Role Tabs (Segmented Control) */}
              <div
                role="tablist"
                aria-label="Login role selector"
                className="mt-4 grid grid-cols-2 rounded-xl overflow-hidden border border-white/30 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40 backdrop-blur"
              >
                <button
                  role="tab"
                  aria-selected={role === 'user'}
                  aria-controls="panel-user"
                  className={`py-2.5 px-3 text-sm font-medium transition-colors ${
                    role === 'user'
                      ? 'bg-bright-green/90 text-white'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/40'
                  }`}
                  onClick={() => setRole('user')}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2"><User className="h-4 w-4" /> User</span>
                </button>
                <button
                  role="tab"
                  aria-selected={role === 'admin'}
                  aria-controls="panel-admin"
                  className={`py-2.5 px-3 text-sm font-medium transition-colors ${
                    role === 'admin'
                      ? 'bg-bright-green/90 text-white'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/40'
                  }`}
                  onClick={() => setRole('admin')}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> Admin</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30 dark:border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/60 dark:bg-gray-800/50 backdrop-blur-md text-gray-800 dark:text-gray-200 rounded-md">
                    Ready to continue?
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-bright-green to-miraa-green text-white font-semibold py-3 px-6 rounded-xl hover:from-miraa-green hover:to-bright-green focus:outline-none focus:ring-2 focus:ring-bright-green focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                Access Portal →
              </button>
            </form>

            {/* Divider */}
            <div className="border-t border-white/30 dark:border-gray-700/50 mt-6"></div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-900 dark:text-gray-200">
                Demo Mode • Select role to access portal
              </p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-900 dark:text-gray-200">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};