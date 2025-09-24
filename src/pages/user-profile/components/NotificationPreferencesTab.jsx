import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const NotificationPreferencesTab = ({ user }) => {
  const [preferences, setPreferences] = useState({
    email: {
      quotationStatusChanges: true,
      approvalRequests: true,
      systemUpdates: false,
      weeklyReports: true,
      securityAlerts: true
    },
    inApp: {
      quotationStatusChanges: true,
      approvalRequests: true,
      systemUpdates: true,
      newMessages: true,
      templateUpdates: false
    },
    mobile: {
      quotationStatusChanges: false,
      approvalRequests: true,
      systemUpdates: false,
      securityAlerts: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (category, preference, checked) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [preference]: checked
      }
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Notification preferences saved successfully!');
    } catch (error) {
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const notificationCategories = [
    {
      key: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: 'Mail',
      options: [
        {
          key: 'quotationStatusChanges',
          label: 'Quotation Status Changes',
          description: 'When quotations are approved, rejected, or updated'
        },
        {
          key: 'approvalRequests',
          label: 'Approval Requests',
          description: 'When quotations require your approval (Admin only)',
          adminOnly: true
        },
        {
          key: 'systemUpdates',
          label: 'System Updates',
          description: 'New features, maintenance notifications, and system changes'
        },
        {
          key: 'weeklyReports',
          label: 'Weekly Reports',
          description: 'Summary of quotation activity and system statistics'
        },
        {
          key: 'securityAlerts',
          label: 'Security Alerts',
          description: 'Login attempts, password changes, and security events'
        }
      ]
    },
    {
      key: 'inApp',
      title: 'In-App Notifications',
      description: 'Receive notifications within the application',
      icon: 'Bell',
      options: [
        {
          key: 'quotationStatusChanges',
          label: 'Quotation Status Changes',
          description: 'Real-time updates on quotation status'
        },
        {
          key: 'approvalRequests',
          label: 'Approval Requests',
          description: 'Immediate notification of pending approvals',
          adminOnly: true
        },
        {
          key: 'systemUpdates',
          label: 'System Updates',
          description: 'In-app announcements and feature updates'
        },
        {
          key: 'newMessages',
          label: 'New Messages',
          description: 'Comments and messages on quotations'
        },
        {
          key: 'templateUpdates',
          label: 'Template Updates',
          description: 'When templates are modified or new ones are added'
        }
      ]
    },
    {
      key: 'mobile',
      title: 'Mobile Push Notifications',
      description: 'Receive push notifications on mobile devices',
      icon: 'Smartphone',
      options: [
        {
          key: 'quotationStatusChanges',
          label: 'Quotation Status Changes',
          description: 'Push notifications for important status updates'
        },
        {
          key: 'approvalRequests',
          label: 'Urgent Approval Requests',
          description: 'High-priority approvals requiring immediate attention',
          adminOnly: true
        },
        {
          key: 'systemUpdates',
          label: 'Critical System Updates',
          description: 'Important system maintenance and security updates'
        },
        {
          key: 'securityAlerts',
          label: 'Security Alerts',
          description: 'Suspicious activity and security warnings'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={handleSavePreferences}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Save Preferences
        </Button>
      </div>
      {/* Notification Categories */}
      {notificationCategories?.map((category) => (
        <div key={category?.key} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name={category?.icon} size={20} className="text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">{category?.title}</h3>
              <p className="text-sm text-muted-foreground">{category?.description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {category?.options?.map((option) => {
              // Hide admin-only options for non-admin users
              if (option?.adminOnly && user?.role !== 'Admin') {
                return null;
              }
              
              return (
                <div key={option?.key} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <Checkbox
                    checked={preferences?.[category?.key]?.[option?.key]}
                    onChange={(e) => handlePreferenceChange(category?.key, option?.key, e?.target?.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <label className="font-medium text-foreground cursor-pointer">
                        {option?.label}
                      </label>
                      {option?.adminOnly && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          Admin Only
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option?.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* Notification Frequency Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Clock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notification Frequency</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">Digest Frequency</h4>
              <select className="px-3 py-1 bg-card border border-border rounded-md text-sm">
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <p className="text-sm text-muted-foreground">
              How often you want to receive grouped notifications
            </p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">Quiet Hours</h4>
              <div className="flex items-center space-x-2">
                <input 
                  type="time" 
                  defaultValue="22:00"
                  className="px-2 py-1 bg-card border border-border rounded text-sm"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <input 
                  type="time" 
                  defaultValue="08:00"
                  className="px-2 py-1 bg-card border border-border rounded text-sm"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              No notifications will be sent during these hours (except security alerts)
            </p>
          </div>
        </div>
      </div>
      {/* Notification Preview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Eye" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notification Preview</h3>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Quotation Approved</h4>
                <p className="text-sm text-muted-foreground">Your quotation #QT-2024-001 has been approved by the admin.</p>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Clock" size={16} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Approval Required</h4>
                <p className="text-sm text-muted-foreground">New quotation #QT-2024-005 requires your approval.</p>
                <span className="text-xs text-muted-foreground">5 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesTab;