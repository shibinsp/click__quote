import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicators = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'SSL Secured'
    },
    {
      icon: 'Lock',
      text: 'JWT Authentication'
    },
    {
      icon: 'UserCheck',
      text: 'Role-Based Access'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-center space-x-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-muted-foreground">
            <Icon name={feature?.icon} size={16} />
            <span className="text-xs font-medium">{feature?.text}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Your data is protected with enterprise-grade security
      </p>
    </div>
  );
};

export default SecurityIndicators;