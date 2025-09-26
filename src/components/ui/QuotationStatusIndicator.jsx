import React from 'react';
import Icon from '../AppIcon';

const QuotationStatusIndicator = ({ 
  status = 'draft', 
  timestamp, 
  className = '',
  showTimestamp = false 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      draft: {
        label: 'Draft',
        icon: 'FileEdit',
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        iconColor: 'text-muted-foreground'
      },
      accepted: {
        label: 'Accepted',
        icon: 'CheckCircle',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      },
      in_process: {
        label: 'In Process',
        icon: 'Clock',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      }
    };
    
    return configs?.[status] || configs?.draft;
  };

  const config = getStatusConfig(status);
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date?.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-md ${config?.bgColor} ${className}`}>
      <Icon 
        name={config?.icon} 
        size={14} 
        className={config?.iconColor}
      />
      <span className={`text-sm font-medium ${config?.textColor}`}>
        {config?.label}
      </span>
      {showTimestamp && timestamp && (
        <>
          <span className={`text-xs ${config?.textColor} opacity-70`}>•</span>
          <span className={`text-xs font-mono ${config?.textColor} opacity-70`}>
            {formatTimestamp(timestamp)}
          </span>
        </>
      )}
    </div>
  );
};

export default QuotationStatusIndicator;