import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-64 lg:ml-0">
        <Header title={title} subtitle={subtitle} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
            <div className="space-y-4 sm:space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
