import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsOverview = ({ data }) => {
  const metrics = [
    {
      title: 'Total Quotations',
      value: data?.totalQuotations?.toLocaleString() || '0',
      icon: 'FileText',
      trend: data?.trends?.quotations || '+0%',
      color: 'primary'
    },
    {
      title: 'Total Revenue',
      value: `££{(data?.totalRevenue / 1000)?.toFixed(0) || '0'}K`,
      icon: 'DollarSign',
      trend: data?.trends?.revenue || '+0%',
      color: 'success'
    },
    {
      title: 'Conversion Rate',
      value: `£{data?.conversionRate || '0'}%`,
      icon: 'TrendingUp',
      trend: data?.trends?.conversion || '+0%',
      color: 'accent'
    },
    {
      title: 'Avg Quote Value',
      value: `££{(data?.avgQuoteValue / 1000)?.toFixed(1) || '0'}K`,
      icon: 'Target',
      trend: data?.trends?.avgValue || '+0%',
      color: 'secondary'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent',
    secondary: 'bg-secondary/10 text-secondary'
  };

  const getTrendIcon = (trend) => {
    if (trend?.startsWith('+')) return 'TrendingUp';
    if (trend?.startsWith('-')) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend?.startsWith('+')) return 'text-success';
    if (trend?.startsWith('-')) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics?.map((metric, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg £{colorClasses?.[metric?.color]}`}>
              <Icon name={metric?.icon} size={24} />
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(metric?.trend)} 
                size={14} 
                className={getTrendColor(metric?.trend)}
              />
              <span className={`text-xs font-medium £{getTrendColor(metric?.trend)}`}>
                {metric?.trend}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{metric?.title}</p>
            <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsOverview;