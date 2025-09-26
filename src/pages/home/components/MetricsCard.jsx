import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg',
    success: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg',
    warning: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg',
    accent: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg'
  };

  const trendColorClasses = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group transform-3d overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3 group-hover:scale-105 transition-transform">{value}</p>
          {trend && (
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${trendColorClasses?.[trend]}`}>
              <Icon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14} 
              />
              <span className="text-xs font-semibold">
                {trendValue}
              </span>
              <span className="text-xs opacity-75">vs last month</span>
            </div>
          )}
        </div>
        <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${colorClasses?.[color]} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon name={icon} size={28} />
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
      <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-15 group-hover:opacity-30 transition-opacity"></div>
    </div>
  );
};

export default MetricsCard;