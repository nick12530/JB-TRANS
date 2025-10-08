import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'enhanced' | 'outlined' | 'elevated' | 'glass' | 'gradient' | 'neon' | 'blue' | 'green' | 'red' | 'purple' | 'emerald' | 'teal' | 'lime' | 'forest' | 'mint';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  onClick, 
  padding = 'md',
  variant = 'default'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm',
    enhanced: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
    elevated: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700',
    glass: 'glass-card hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
    gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    neon: 'bg-white dark:bg-gray-800 border border-bright-green/20 dark:border-bright-green/30 rounded-xl shadow-lg hover:shadow-bright-green/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    green: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-green-700 rounded-xl shadow-lg hover:shadow-green-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    red: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-900 border border-red-200 dark:border-red-700 rounded-xl shadow-lg hover:shadow-red-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 border border-purple-200 dark:border-purple-700 rounded-xl shadow-lg hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 border border-emerald-200 dark:border-emerald-700 rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    teal: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 border border-teal-200 dark:border-teal-700 rounded-xl shadow-lg hover:shadow-teal-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    lime: 'bg-gradient-to-br from-lime-50 to-lime-100 dark:from-gray-800 dark:to-gray-900 border border-lime-200 dark:border-lime-700 rounded-xl shadow-lg hover:shadow-lime-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    forest: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-green-700 rounded-xl shadow-lg hover:shadow-green-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    mint: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-green-700 rounded-xl shadow-lg hover:shadow-green-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
  };

  return (
    <div
      className={clsx(
        variantClasses[variant],
        paddingClasses[padding],
        'transition-all duration-200',
        'overflow-hidden', // Prevent content from overflowing
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-px',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
