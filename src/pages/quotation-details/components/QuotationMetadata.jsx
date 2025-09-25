import React from 'react';
import Icon from '../../../components/AppIcon';
import RoleIndicatorBadge from '../../../components/ui/RoleIndicatorBadge';

const QuotationMetadata = ({ quotation }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTemplateTypeIcon = (type) => {
    return type === 'default' ? 'FileText' : 'Wrench';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Info" size={18} className="mr-2" />
        Quotation Information
      </h3>
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Created By</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{quotation?.createdBy?.name}</span>
              <RoleIndicatorBadge role={quotation?.createdBy?.role} />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Template Type</span>
            <div className="flex items-center space-x-2">
              <Icon name={getTemplateTypeIcon(quotation?.templateType)} size={14} />
              <span className="text-sm font-medium capitalize">{quotation?.templateType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Template Name</span>
            <span className="text-sm font-medium">{quotation?.templateName}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Valid Until</span>
            <span className="text-sm font-medium">
              {new Date(quotation.validUntil)?.toLocaleDateString('en-GB')}
            </span>
          </div>

          {quotation?.location && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Location</span>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span className="text-sm font-mono">
                    {quotation?.location?.lat?.toFixed(6)}, {quotation?.location?.lng?.toFixed(6)}
                  </span>
                </div>
                {quotation?.location?.address && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {quotation?.location?.address}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Activity History */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Clock" size={16} className="mr-2" />
            Activity History
          </h4>
          <div className="space-y-3">
            {quotation?.activityHistory?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-background rounded-full shrink-0">
                  <Icon name={activity?.icon} size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity?.action}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity?.user}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDate(activity?.timestamp)}
                    </span>
                  </div>
                  {activity?.comment && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      "{activity?.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{quotation?.items?.length}</p>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">
                {quotation?.items?.reduce((sum, item) => sum + item?.quantity, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Qty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationMetadata;