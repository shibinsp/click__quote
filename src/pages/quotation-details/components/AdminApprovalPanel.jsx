import React from 'react';
import Icon from '../../../components/AppIcon';

const AdminApprovalPanel = ({ quotation }) => {
  // Admin approval panel is no longer needed since approval/rejection statuses have been removed
  // Only draft status exists now
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Info" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quotation Information</h3>
          <p className="text-sm text-muted-foreground">View quotation details and information</p>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Quotation Guidelines:</p>
            <ul className="space-y-1 text-xs">
              <li>• All quotations are created in draft status</li>
              <li>• Verify all customer information is accurate</li>
              <li>• Check item specifications and pricing</li>
              <li>• Ensure location coordinates are correct</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovalPanel;