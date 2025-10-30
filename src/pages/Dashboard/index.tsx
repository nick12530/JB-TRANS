import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useApp();

  // Show admin dashboard for admins, user dashboard for regular users
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};
