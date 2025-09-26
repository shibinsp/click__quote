import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import QuotationStatusIndicator from '../../../components/ui/QuotationStatusIndicator';
import Button from '../../../components/ui/Button';

const AdminApprovalQueue = ({ pendingQuotations }) => {
  const navigate = useNavigate();

  const handleReview = (quotationId) => {
    navigate(`/quotation-details?id=${quotationId}&action=review`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    })?.format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Approval Queue</h3>
            <span className="bg-warning/10 text-warning px-2 py-1 rounded-md text-xs font-medium">
              {pendingQuotations?.length} pending
            </span>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {pendingQuotations?.length > 0 ? (
          <div className="divide-y divide-border">
            {pendingQuotations?.map((quotation) => (
              <div key={quotation?.id} className="p-6 hover:bg-muted/30 transition-hover">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono font-medium text-foreground">
                        #{quotation?.id}
                      </span>
                      <QuotationStatusIndicator 
                        status={quotation?.status} 
                        timestamp={quotation?.submittedAt}
                      />
                      <div className="flex items-center space-x-1">
                        <Icon name="AlertCircle" size={14} className={getPriorityColor(quotation?.priority)} />
                        <span className={`text-xs font-medium capitalize ${getPriorityColor(quotation?.priority)}`}>
                          {quotation?.priority} Priority
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="text-sm font-medium text-foreground">{quotation?.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Template</p>
                        <p className="text-sm text-foreground">{quotation?.templateType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(quotation?.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{quotation?.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="User" size={12} />
                        <span>Created by {quotation?.createdBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={12} />
                        <span>{formatDate(quotation?.submittedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleReview(quotation?.id)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground">
              No quotations pending approval at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalQueue;