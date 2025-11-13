import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  Settings,
  ArrowRightFromLine,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Navigation,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  fullHeight?: boolean; // mobile dropdown sets this to false so it doesn't take screen height
  onNavigate?: () => void; // callback to close mobile sidebar when navigating
}

// Admin navigation items
const adminNavItems = [
  { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/dashboard', adminOnly: true },
  { icon: Users, label: 'User Management', path: '/users', adminOnly: true },
  { icon: Navigation, label: 'Destinations', path: '/destinations', adminOnly: true },
  { icon: MapPin, label: 'Pickup Stations', path: '/stations', adminOnly: true },
  { icon: Package, label: 'Package Management', path: '/packages', adminOnly: true },
  { icon: BarChart3, label: 'Reports', path: '/reports', adminOnly: true },
  { icon: FileText, label: 'Area Codes', path: '/area-codes', adminOnly: true },
];

// Staff navigation
const staffNavItems = [
  { icon: LayoutDashboard, label: 'Staff Dashboard', path: '/dashboard', adminOnly: false },
  { icon: Package, label: 'Register Package', path: '/register-package', adminOnly: false },
  { icon: Navigation, label: 'Destinations', path: '/destinations', adminOnly: false },
  { icon: MapPin, label: 'Pickup Stations', path: '/stations', adminOnly: false },
  { icon: Package, label: 'Package Management', path: '/packages', adminOnly: false },
];

// Client navigation (clients don't use the UI; keep empty to avoid showing menu)
const clientNavItems: any[] = [];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggleCollapse, fullHeight = true, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();

  // Let Layout control fixed positioning and visibility. Sidebar itself stays relative
  const sidebarClasses = clsx(
    fullHeight && 'h-full',
    'glass-sidebar transition-all duration-300 relative',
    isCollapsed ? 'px-2 py-4' : 'px-6 py-4',
    !user && 'lg:translate-x-0'
  );

  const currentNavItems = user?.role === 'admin' ? adminNavItems : user?.role === 'staff' ? staffNavItems : clientNavItems;

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Header with collapse button (desktop only) */}
        <div className={clsx('mb-8 flex-shrink-0 flex items-center justify-between', isCollapsed && 'flex-col gap-4')}>
          {!isCollapsed ? (
            <Logo size="lg" className="justify-center" />
          ) : (
            <Logo size="sm" className="justify-center" />
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-2">
          {currentNavItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            
            return (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  onNavigate?.(); // Close mobile sidebar after navigation
                }}
                className={clsx(
                  'flex items-center w-full rounded-lg text-left transition-all duration-300',
                  isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2 space-x-3',
                  isActive
                    ? 'bg-gray-800 dark:bg-gray-700 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                title={isCollapsed ? label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-bold truncate text-base md:text-sm">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 flex-shrink-0">
          <button
            onClick={() => {
              navigate('/settings');
              onNavigate?.();
            }}
            className={clsx(
              'flex items-center w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
              isCollapsed && 'justify-center px-2'
            )}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-bold">Settings</span>}
          </button>
          
          {user && (
            <button
              onClick={() => {
                navigate('/login');
                onNavigate?.();
              }}
              className={clsx(
                'flex items-center w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <ArrowRightFromLine className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-bold">Logout</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
