import React from 'react';
import { Truck, Package } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-eco-700">
      {/* Animated Logo */}
      <div className="relative">
        <div className="relative">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 border-4 border-eco-400/30 rounded-2xl animate-spin" style={{ animationDuration: '3s' }}></div>
          
          {/* Bouncing logo */}
          <div className="animate-bounce" style={{ animationDuration: '1.5s' }}>
            <div className="h-24 w-24 bg-gradient-to-br from-navy-500 to-eco-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Truck className="h-12 w-12 text-white" />
              <Package className="h-8 w-8 text-white absolute -top-2 -right-2" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-extrabold text-white mb-2">
          Mwalimu Transporters
        </h2>
        <p className="text-white/80 text-sm font-semibold mb-6">
          {message}
        </p>
        
        {/* Loading Bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-navy-400 via-eco-400 to-navy-400 rounded-full animate-shimmer"></div>
        </div>
      </div>
      
      {/* Pulse Dots */}
      <div className="flex space-x-2 mt-8">
        <div className="w-2 h-2 bg-eco-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-eco-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-eco-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

