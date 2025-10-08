import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { Card } from '../components/Card';
import { formatCurrency } from '../utils/helpers';

interface MonthlyData {
  month: string;
  profit: number;
  cost: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

interface MonthlyTrendsProps {
  monthlyData: MonthlyData[];
}

export const MonthlyTrends: React.FC<MonthlyTrendsProps> = ({ monthlyData }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Profit Trends Chart */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profit Trends</h3>
          <BarChart3 className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          {monthlyData.map((month) => {
            const maxProfit = Math.max(...monthlyData.map(m => m.profit));
            const widthPercentage = (month.profit / maxProfit) * 100;
            
            return (
              <div key={month.month} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    {month.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {month.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    {month.trend === 'stable' && <Activity className="h-3 w-3 text-gray-500" />}
                    <span className={`text-sm font-medium ${month.profit > 50000 ? 'text-green-600' : month.profit > 45000 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {(month.profit / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      month.trend === 'up' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      month.trend === 'down' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                      'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    style={{ width: `${widthPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Performance Summary</h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Best Month</span>
              <span className="text-lg font-bold text-green-900 dark:text-green-100">
                {(Math.max(...monthlyData.map(m => m.profit)) / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Average Profit</span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {(monthlyData.reduce((sum, m) => sum + m.profit, 0) / monthlyData.length / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Trend Status</span>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {monthlyData.slice(-2).every(m => m.trend === 'up') ? 'Growing ↗' : 'Mixed 📊'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
