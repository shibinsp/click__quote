import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DemoCredentials = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'Admin',
      email: 'admin@clickquote.com',
      password: 'Admin@123',
      description: 'Full system access with quotation management'
    },
    {
      role: 'User',
      email: 'user@clickquote.com',
      password: 'User@123',
      description: 'Create and manage quotations'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
        iconPosition="right"
        className="w-full text-muted-foreground hover:text-foreground"
      >
        Demo Credentials
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {credentials?.map((cred, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-md border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{cred?.role} Account</span>
                <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                  <Icon name={cred?.role === 'Admin' ? 'Shield' : 'User'} size={12} />
                  <span>{cred?.role}</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">{cred?.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono">
                      {cred?.email}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(cred?.email)}
                      className="h-6 w-6"
                    >
                      <Icon name="Copy" size={12} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Password:</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono">
                      {cred?.password}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(cred?.password)}
                      className="h-6 w-6"
                    >
                      <Icon name="Copy" size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DemoCredentials;