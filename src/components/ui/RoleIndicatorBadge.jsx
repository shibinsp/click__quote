import React from 'react';
import Icon from '../AppIcon';

const RoleIndicatorBadge = ({ role = 'User', className = '' }) => {
  const isAdmin = role === 'Admin';
  
  return (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium £{
      isAdmin 
        ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
    } ${className}`}>
      <Icon 
        name={isAdmin ? 'Shield' : 'User'} 
        size={12} 
      />
      <span>{role}</span>
    </div>
  );
};

export default RoleIndicatorBadge;