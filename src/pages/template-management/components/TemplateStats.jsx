import React from 'react';
import Icon from '../../../components/AppIcon';

const TemplateStats = ({ templates, userRole }) => {
  const totalTemplates = templates?.length;
  const defaultTemplates = templates?.filter(t => t?.type === 'default')?.length;
  const customTemplates = templates?.filter(t => t?.type === 'custom')?.length;
  const totalUsage = templates?.reduce((sum, t) => sum + t?.usageCount, 0);
  const mostUsedTemplate = templates?.reduce((max, t) => t?.usageCount > max?.usageCount ? t : max, templates?.[0] || { usageCount: 0 });

  const stats = [
    {
      label: 'Total Templates',
      value: totalTemplates,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Default Templates',
      value: defaultTemplates,
      icon: 'Shield',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Custom Templates',
      value: customTemplates,
      icon: 'Edit',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'Total Usage',
      value: totalUsage,
      icon: 'BarChart3',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-md £{stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        </div>
      ))}
      {/* Most Used Template */}
      {mostUsedTemplate && mostUsedTemplate?.usageCount > 0 && (
        <div className="sm:col-span-2 lg:col-span-4 bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-warning/10">
              <Icon name="TrendingUp" size={20} className="text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Most Popular Template</p>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-foreground">{mostUsedTemplate?.name}</p>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{mostUsedTemplate?.usageCount} uses</span>
                {mostUsedTemplate?.type === 'default' && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                    <Icon name="Shield" size={10} />
                    <span>Default</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateStats;