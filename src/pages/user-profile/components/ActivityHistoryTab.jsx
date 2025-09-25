import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import QuotationStatusIndicator from '../../../components/ui/QuotationStatusIndicator';

const ActivityHistoryTab = ({ user }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'quotation_created',
      title: 'Created quotation #QT-2024-001',
      description: 'New quotation for Transformer Installation at Downtown Office',
      timestamp: '2025-09-24T12:30:00Z',
      status: 'draft',
      metadata: {
        quotationId: 'QT-2024-001',
        location: 'Downtown Office',
        amount: '£15,750.00'
      }
    },
    {
      id: 2,
      type: 'quotation_approved',
      title: 'Approved quotation #QT-2024-002',
      description: 'Approved quotation for Electrical Panel Upgrade',
      timestamp: '2025-09-24T11:15:00Z',
      status: 'approved',
      metadata: {
        quotationId: 'QT-2024-002',
        submittedBy: 'John Smith',
        amount: '£8,500.00'
      }
    },
    {
      id: 3,
      type: 'template_created',
      title: 'Created new template',
      description: 'Created "Industrial Lighting Package" template',
      timestamp: '2025-09-24T10:45:00Z',
      metadata: {
        templateName: 'Industrial Lighting Package',
        category: 'Lighting'
      }
    },
    {
      id: 4,
      type: 'quotation_submitted',
      title: 'Submitted quotation #QT-2024-003',
      description: 'Submitted quotation for review - Warehouse Electrical Setup',
      timestamp: '2025-09-24T09:30:00Z',
      status: 'submitted',
      metadata: {
        quotationId: 'QT-2024-003',
        location: 'Warehouse District',
        amount: '£22,300.00'
      }
    },
    {
      id: 5,
      type: 'profile_updated',
      title: 'Updated profile information',
      description: 'Updated contact information and company details',
      timestamp: '2025-09-23T16:20:00Z'
    },
    {
      id: 6,
      type: 'quotation_rejected',
      title: 'Rejected quotation #QT-2024-004',
      description: 'Rejected quotation due to incomplete specifications',
      timestamp: '2025-09-23T14:10:00Z',
      status: 'rejected',
      metadata: {
        quotationId: 'QT-2024-004',
        reason: 'Incomplete specifications',
        submittedBy: 'Sarah Johnson'
      }
    },
    {
      id: 7,
      type: 'login',
      title: 'Logged in to system',
      description: 'Successful login from Chrome on Windows',
      timestamp: '2025-09-23T08:00:00Z',
      metadata: {
        device: 'Chrome on Windows',
        location: 'New York, NY'
      }
    }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      quotation_created: 'Plus',
      quotation_approved: 'CheckCircle',
      quotation_rejected: 'XCircle',
      quotation_submitted: 'Send',
      template_created: 'FileText',
      profile_updated: 'User',
      login: 'LogIn'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      quotation_created: 'text-accent',
      quotation_approved: 'text-success',
      quotation_rejected: 'text-error',
      quotation_submitted: 'text-warning',
      template_created: 'text-primary',
      profile_updated: 'text-muted-foreground',
      login: 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date?.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities', count: activities?.length },
    { value: 'quotations', label: 'Quotations', count: activities?.filter(a => a?.type?.includes('quotation'))?.length },
    { value: 'templates', label: 'Templates', count: activities?.filter(a => a?.type?.includes('template'))?.length },
    { value: 'system', label: 'System', count: activities?.filter(a => ['login', 'profile_updated']?.includes(a?.type))?.length }
  ];

  const filteredActivities = activities?.filter(activity => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'quotations') return activity?.type?.includes('quotation');
    if (selectedFilter === 'templates') return activity?.type?.includes('template');
    if (selectedFilter === 'system') return ['login', 'profile_updated']?.includes(activity?.type);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Activity Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filter Activities</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSelectedFilter(option?.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-hover ${
                selectedFilter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {option?.label}
              <span className="ml-1 opacity-70">({option?.count})</span>
            </button>
          ))}
        </div>
      </div>
      {/* Activity Timeline */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Clock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <span className="text-sm text-muted-foreground">({filteredActivities?.length} activities)</span>
        </div>
        
        <div className="space-y-4">
          {filteredActivities?.map((activity, index) => (
            <div key={activity?.id} className="flex items-start space-x-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center ${
                  index === 0 ? 'border-primary' : ''
                }`}>
                  <Icon 
                    name={getActivityIcon(activity?.type)} 
                    size={14} 
                    className={getActivityColor(activity?.type)}
                  />
                </div>
                {index < filteredActivities?.length - 1 && (
                  <div className="w-px h-12 bg-border mt-2" />
                )}
              </div>
              
              {/* Activity Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{activity?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{activity?.description}</p>
                    
                    {/* Activity Metadata */}
                    {activity?.metadata && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {activity?.metadata?.quotationId && (
                          <span className="flex items-center space-x-1">
                            <Icon name="Hash" size={10} />
                            <span>{activity?.metadata?.quotationId}</span>
                          </span>
                        )}
                        {activity?.metadata?.amount && (
                          <span className="flex items-center space-x-1">
                            <Icon name="DollarSign" size={10} />
                            <span>{activity?.metadata?.amount}</span>
                          </span>
                        )}
                        {activity?.metadata?.location && (
                          <span className="flex items-center space-x-1">
                            <Icon name="MapPin" size={10} />
                            <span>{activity?.metadata?.location}</span>
                          </span>
                        )}
                        {activity?.metadata?.submittedBy && (
                          <span className="flex items-center space-x-1">
                            <Icon name="User" size={10} />
                            <span>by {activity?.metadata?.submittedBy}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatTimestamp(activity?.timestamp)}
                    </span>
                    {activity?.status && (
                      <QuotationStatusIndicator status={activity?.status} timestamp={activity?.timestamp} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredActivities?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Activities Found</h4>
            <p className="text-muted-foreground">No activities match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistoryTab;