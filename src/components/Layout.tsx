import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  // Trigger page transition animation
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // No scroll locking needed for dropdown style sidebar

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay removed for dropdown approach */}

      {/* Desktop Sidebar (left rail) */}
      <div className={`${isCollapsed ? 'lg:w-20' : 'lg:w-72'} hidden lg:block`}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onNavigate={undefined}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Mobile Sidebar as dropdown panel */}
        {sidebarOpen && (
          <div className="lg:hidden z-30 px-3 py-3 border-b rounded-b-xl
                          border-white/30 dark:border-white/10
                          bg-white/40 dark:bg-gray-900/30
                          backdrop-blur-2xl shadow-xl">
            <Sidebar 
              isCollapsed={false} 
              onToggleCollapse={() => {}} 
              fullHeight={false}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className={clsx(
            'w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 transition-all duration-300 ease-in-out',
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          )}>
            <div className="space-y-4 sm:space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
