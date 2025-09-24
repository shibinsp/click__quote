import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = ({ userRole }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Create New Quotation',
      description: 'Start a new quotation from templates',
      icon: 'Plus',
      variant: 'default',
      onClick: () => navigate('/create-quotation'),
      roles: ['Admin', 'User']
    },
    {
      label: 'View Map',
      description: 'Browse quotations by location',
      icon: 'Map',
      variant: 'outline',
      onClick: () => navigate('/map-view'),
      roles: ['Admin', 'User']
    },
    {
      label: 'Manage Templates',
      description: 'Create and edit quotation templates',
      icon: 'FileText',
      variant: 'outline',
      onClick: () => navigate('/template-management'),
      roles: ['Admin']
    },
    {
      label: 'User Profile',
      description: 'Update your account settings',
      icon: 'User',
      variant: 'ghost',
      onClick: () => navigate('/user-profile'),
      roles: ['Admin', 'User']
    }
  ];

  const filteredActions = actions?.filter(action => 
    action?.roles?.includes(userRole)
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredActions?.map((action, index) => (
          <div key={index} className="flex flex-col">
            <Button
              variant={action?.variant}
              size="lg"
              iconName={action?.icon}
              iconPosition="left"
              onClick={action?.onClick}
              className="h-auto p-4 flex-col items-start text-left"
            >
              <span className="font-medium">{action?.label}</span>
            </Button>
            <p className="text-xs text-muted-foreground mt-2 px-4">
              {action?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;