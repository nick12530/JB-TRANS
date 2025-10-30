import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Truck, User, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - create fake user
    const user = {
      id: '1',
      name: role === 'admin' ? 'Admin User' : 'Regular Staff',
      email: role === 'admin' ? 'admin@mwalimu.com' : 'staff@mwalimu.com',
      role,
      status: 'active' as const,
    };
    
    setUser(user);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/459203/pexels-photo-459203.jpeg)'
        }}
      >
        {/* Subtle dark overlay for better contrast without blue tint */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      <div className="relative w-full max-w-full sm:max-w-lg z-10 px-3 sm:px-0">
        {/* Main Login Card with Glass Morphism */}
        <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl shadow-2xl rounded-3xl border-2 border-white/30 dark:border-white/10 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-br from-navy-700/70 via-navy-600/70 to-eco-600/70 backdrop-blur-xl p-6 sm:p-8 text-center shadow-inner border-b-2 border-white/20">
            {/* Enhanced Animated Logo */}
            <div className="relative mx-auto mb-3 w-24 h-24 anim-float">
              {/* Shimmering conic ring */}
              <div className="absolute inset-0 rounded-full anim-spin-slow"
                   style={{
                     background: 'conic-gradient(from 0deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05), rgba(255,255,255,0.35))'
                   }} />
              {/* Inner gradient disc with shimmer */}
              <div className="absolute inset-2 rounded-full anim-shimmer"
                   style={{
                     backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04), rgba(255,255,255,0.14))'
                   }} />
              {/* Orbiting dots */}
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -ml-0.5 -mt-0.5 bg-white/80 rounded-full anim-orbit" />
              <span className="absolute left-1/2 top-1/2 h-1 w-1 -ml-0.5 -mt-0.5 bg-white/70 rounded-full anim-orbit" style={{ animationDuration: '3.6s' }} />
              {/* Core logo */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center">
                  <Truck className="h-8 w-8 text-white drop-shadow" />
                </div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
              Mwalimu Transporters
            </h1>
            <p className="text-white/90 text-[11px] sm:text-xs font-semibold">
              Package Management System
            </p>
          </div>

          {/* Form Section */}
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white text-center mb-1 drop-shadow-lg">
                {role === 'admin' ? 'Welcome Back, Admin' : 'Welcome Back, Staff'}
              </h2>
              <p className="text-white/80 text-center text-[11px] sm:text-xs font-semibold">
                Select your role to continue
              </p>

              {/* Role Tabs (Segmented Control) */}
              <div
                role="tablist"
                aria-label="Login role selector"
                className="mt-3 grid grid-cols-2 rounded-lg overflow-hidden border border-white/30 bg-white/40 backdrop-blur-xl shadow-lg"
              >
                <button
                  role="tab"
                  aria-selected={role === 'staff'}
                  aria-controls="panel-staff"
                  className={`py-2.5 px-3 text-sm font-bold transition-all duration-200 ${
                    role === 'staff'
                      ? 'bg-eco-500/90 text-white shadow-inner backdrop-blur-sm'
                      : 'text-gray-800 hover:bg-white/20'
                  }`}
                  onClick={() => setRole('staff')}
                  type="button"
                >
                  <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> Staff</span>
                </button>
                <button
                  role="tab"
                  aria-selected={role === 'admin'}
                  aria-controls="panel-admin"
                  className={`py-2.5 px-3 text-sm font-bold transition-all duration-200 ${
                    role === 'admin'
                      ? 'bg-eco-500/90 text-white shadow-inner backdrop-blur-sm'
                      : 'text-gray-800 hover:bg-white/20'
                  }`}
                  onClick={() => setRole('admin')}
                  type="button"
                >
                  <span className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4" /> Admin</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-navy-600/80 to-eco-500/80 backdrop-blur-lg text-white font-bold py-3 sm:py-3.5 px-4 rounded-xl hover:from-navy-700/90 hover:to-eco-600/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 transform hover:scale-[1.01] shadow-xl hover:shadow-2xl border border-white/20 text-base"
              >
                Access Portal →
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/20 text-center">
              <p className="text-xs text-white font-semibold drop-shadow-lg">
                Secure Login Portal
              </p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-eco-400 rounded-full animate-pulse shadow-md shadow-eco-400/50"></div>
                <span className="text-xs text-white/90 font-medium">System Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};