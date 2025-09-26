import React from 'react';
import Icon from '../../../components/AppIcon';
import RoleIndicatorBadge from '../../../components/ui/RoleIndicatorBadge';

const RolePermissionsTab = ({ user }) => {
  const getPermissions = (role) => {
    const permissions = {
      Admin: [
        { name: 'Full Home Access', description: 'View all system statistics and analytics', icon: 'Home', granted: true },
        { name: 'Quotation Management', description: 'Create, edit, approve, and delete all quotations', icon: 'FileText', granted: true },
        { name: 'Template Management', description: 'Create, modify, and delete quotation templates', icon: 'Settings', granted: true },
        { name: 'User Management', description: 'Manage user accounts and permissions', icon: 'Users', granted: true },
        { name: 'System Configuration', description: 'Access system settings and configurations', icon: 'Cog', granted: true },
        { name: 'Approval Workflow', description: 'Approve or reject submitted quotations', icon: 'CheckCircle', granted: true },
        { name: 'Location Management', description: 'Manage location-based quotations and assignments', icon: 'Map', granted: true },
        { name: 'Export & Reports', description: 'Generate and export system reports', icon: 'Download', granted: true }
      ],
      User: [
        { name: 'Home Access', description: 'View personal Home and statistics', icon: 'Home', granted: true },
        { name: 'Create Quotations', description: 'Create new quotations using available templates', icon: 'Plus', granted: true },
        { name: 'Edit Own Quotations', description: 'Modify quotations in draft status', icon: 'Edit', granted: true },
        { name: 'Template Usage', description: 'Use existing templates for quotation creation', icon: 'FileText', granted: true },
        { name: 'Map View Access', description: 'View and interact with location-based quotations', icon: 'Map', granted: true },
        { name: 'Profile Management', description: 'Update personal profile information', icon: 'User', granted: true },
        { name: 'Template Management', description: 'Create, modify, and delete quotation templates', icon: 'Settings', granted: false },
        { name: 'Approve Quotations', description: 'Approve or reject submitted quotations', icon: 'CheckCircle', granted: false },
        { name: 'User Management', description: 'Manage other user accounts', icon: 'Users', granted: false },
        { name: 'System Configuration', description: 'Access administrative settings', icon: 'Cog', granted: false }
      ]
    };
    
    return permissions?.[role] || permissions?.User;
  };

  const permissions = getPermissions(user?.role);
  const grantedPermissions = permissions?.filter(p => p?.granted);
  const deniedPermissions = permissions?.filter(p => !p?.granted);

  return (
    <div className="space-y-6">
      {/* Role Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Current Role</h3>
          </div>
          <RoleIndicatorBadge role={user?.role} />
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Role Description:</p>
          <p className="text-foreground">
            {user?.role === 'Admin' ?'Administrators have full system access with capabilities to manage quotations, users, templates, and system configurations. They can approve quotations and oversee all business operations.' :'Users can create and manage their own quotations using available templates. They have access to the map view and can submit quotations for admin approval.'
            }
          </p>
        </div>
      </div>
      {/* Granted Permissions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <h3 className="text-lg font-semibold text-foreground">Granted Permissions</h3>
          <span className="text-sm text-muted-foreground">({grantedPermissions?.length})</span>
        </div>
        
        <div className="space-y-3">
          {grantedPermissions?.map((permission, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg border border-success/20">
              <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-md flex items-center justify-center">
                <Icon name={permission?.icon} size={16} className="text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{permission?.name}</h4>
                <p className="text-sm text-muted-foreground">{permission?.description}</p>
              </div>
              <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>
      {/* Denied Permissions (if any) */}
      {deniedPermissions?.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="XCircle" size={20} className="text-error" />
            <h3 className="text-lg font-semibold text-foreground">Restricted Permissions</h3>
            <span className="text-sm text-muted-foreground">({deniedPermissions?.length})</span>
          </div>
          
          <div className="space-y-3">
            {deniedPermissions?.map((permission, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-error/5 rounded-lg border border-error/20">
                <div className="flex-shrink-0 w-8 h-8 bg-error/10 rounded-md flex items-center justify-center">
                  <Icon name={permission?.icon} size={16} className="text-error" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{permission?.name}</h4>
                  <p className="text-sm text-muted-foreground">{permission?.description}</p>
                </div>
                <Icon name="X" size={16} className="text-error flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <Icon name="Info" size={14} className="inline mr-1" />
              Contact your system administrator to request additional permissions or role changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissionsTab;