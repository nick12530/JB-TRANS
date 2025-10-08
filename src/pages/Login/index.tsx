import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

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
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: 'url("/login-bg.jpg")',
      }}
    >
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-br from-bright-green to-miraa-green p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">🚛</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">
              Mwalimu Transporters
            </h1>
            <p className="text-green-100 text-sm">
              Miraa Transport Management System
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          {/* Form Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                Select your role to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Access Role
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {/* User Role Option */}
                  <label className={`relative flex p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    role === 'user' 
                      ? 'border-bright-green bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === 'user' ? 'border-bright-green' : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {role === 'user' && <div className="w-2 h-2 bg-bright-green rounded-full"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">User Portal</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Record daily activities</div>
                      </div>
                    </div>
                    <div className={`ml-auto ${role === 'user' ? 'text-bright-green' : 'text-gray-400'}`}>
                      👤
                    </div>
                  </label>

                  {/* Admin Role Option */}
                  <label className={`relative flex p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    role === 'admin' 
                      ? 'border-bright-green bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === 'admin' ? 'border-bright-green' : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {role === 'admin' && <div className="w-2 h-2 bg-bright-green rounded-full"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Admin Portal</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Manage all records</div>
                      </div>
                    </div>
                    <div className={`ml-auto ${role === 'admin' ? 'text-bright-green' : 'text-gray-400'}`}>
                      ⚙️
                    </div>
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Ready to continue?
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-bright-green to-miraa-green text-white font-semibold py-3 px-6 rounded-xl hover:from-miraa-green hover:to-bright-green focus:outline-none focus:ring-2 focus:ring-bright-green focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Access Portal →
              </button>
            </form>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-700 mt-6"></div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Demo Mode • Select role to access portal
              </p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};