import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityLog = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'created': return 'Plus';
      case 'updated': return 'Edit';
      case 'submitted': return 'Send';
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'duplicated': return 'Copy';
      case 'login': return 'LogIn';
      case 'logout': return 'LogOut';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'created': return 'text-accent';
      case 'updated': return 'text-warning';
      case 'submitted': return 'text-primary';
      case 'approved': return 'text-success';
      case 'rejected': return 'text-error';
      case 'duplicated': return 'text-muted-foreground';
      case 'login': return 'text-success';
      case 'logout': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return activityTime?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activities?.length > 0 ? (
          <div className="p-6 space-y-4">
            {activities?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
                  <Icon 
                    name={getActivityIcon(activity?.type)} 
                    size={14} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.user}</span>
                    {' '}
                    <span>{activity?.action}</span>
                    {activity?.quotationId && (
                      <>
                        {' '}
                        <span className="font-mono text-primary">#{activity?.quotationId}</span>
                      </>
                    )}
                  </p>
                  {activity?.details && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity?.details}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(activity?.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Icon name="Activity" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No recent activity</h3>
            <p className="text-muted-foreground">
              Activity will appear here as you use the system
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;