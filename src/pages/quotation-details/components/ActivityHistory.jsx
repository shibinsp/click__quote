import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityHistory = ({ activities }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      created: 'Plus',
      updated: 'Edit',
      submitted: 'Send',
      approved: 'CheckCircle',
      rejected: 'XCircle',
      changes_requested: 'MessageCircle',
      duplicated: 'Copy',
      printed: 'Printer'
    };
    return icons?.[type] || 'Clock';
  };

  const getActivityColor = (type) => {
    const colors = {
      created: 'text-accent',
      updated: 'text-warning',
      submitted: 'text-accent',
      approved: 'text-success',
      rejected: 'text-error',
      changes_requested: 'text-warning',
      duplicated: 'text-muted-foreground',
      printed: 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Activity" size={18} className="mr-2" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {activity?.description}
                </p>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatDate(activity?.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted-foreground">by {activity?.user}</span>
                {activity?.userRole && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{activity?.userRole}</span>
                  </>
                )}
              </div>
              
              {activity?.comment && (
                <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground italic">
                  "{activity?.comment}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {activities?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No activity recorded yet</p>
        </div>
      )}
    </div>
  );
};

export default ActivityHistory;