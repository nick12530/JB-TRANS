import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Package,
  Truck,
  MapPin,
  BarChart3,
  Users,
  Settings,
  UserPlus,
  ArrowRightFromLine,
  Map,
  Shield,
  Activity,
  AlertTriangle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', adminOnly: false },
  { icon: Package, label: 'Source Records', path: '/source-records', adminOnly: false },
  { icon: Truck, label: 'Transport Log', path: '/transport-log', adminOnly: false },
  { icon: MapPin, label: 'Destination Records', path: '/destination-records', adminOnly: false },
  
  // Admin-only sections
  { icon: BarChart3, label: 'Analytics Dashboard', path: '/analytics', adminOnly: true },
  { icon: TrendingUp, label: 'Performance Reports', path: '/profit-reports', adminOnly: true },
  { icon: Map, label: 'Area Performance', path: '/area-performance', adminOnly: true },
  { icon: Activity, label: 'System Monitoring', path: '/monitoring', adminOnly: true },
  { icon: AlertTriangle, label: 'Discrepancy Reports', path: '/discrepancies', adminOnly: true },
  { icon: Users, label: 'Buyers Management', path: '/buyers', adminOnly: true },
  { icon: UserPlus, label: 'Staff Management', path: '/staff', adminOnly: true },
  { icon: Shield, label: 'Admin Controls', path: '/admin-controls', adminOnly: true },
  { icon: FileText, label: 'Audit Logs', path: '/audit-logs', adminOnly: true },
  
  // Staff Control and Settings Cards
  { icon: UserPlus, label: 'Staff Control', path: '/staff-control', adminOnly: true, isCard: true },
  { icon: Settings, label: 'Settings Card', path: '/settings-card', adminOnly: false, isCard: true },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();

  const sidebarClasses = clsx(
    'w-64 glass-sidebar px-6 py-4 fixed left-0 top-0 bottom-0 h-screen transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
    '[&.mobile-closed]:transform [&.mobile-closed]:-translate-x-full lg:[&.mobile-closed]:translate-x-0',
    !user && 'translate-x-full lg:translate-x-0'
  );

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col h-full">
        <div className="mb-8 flex-shrink-0">
          <Logo size="lg" className="justify-center" />
        </div>

        <nav className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          {navItems.map(({ icon: Icon, label, path, adminOnly, isCard }) => {
            if (adminOnly && user?.role !== 'admin') return null;
            
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={clsx(
                  'flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-colors hover-lift',
                  isCard 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30'
                    : '',
                  isActive
                    ? 'bg-gradient-to-r from-bright-green to-green-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{label}</span>
                {isCard && (
                  <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full flex-shrink-0">
                    Card
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 flex-shrink-0">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover-lift"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
          
          {user && (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover-lift"
            >
              <ArrowRightFromLine className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
