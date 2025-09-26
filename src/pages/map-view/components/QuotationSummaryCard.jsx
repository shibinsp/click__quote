import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import QuotationStatusIndicator from '../../../components/ui/QuotationStatusIndicator';

const QuotationSummaryCard = ({ 
  quotations, 
  filteredQuotations, 
  onCreateQuotation,
  className = '' 
}) => {
  const displayQuotations = filteredQuotations || quotations;
  const totalQuotations = displayQuotations?.length;
  
  const getStatusCounts = () => {
    const counts = {
      draft: 0,
      submitted: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      accepted: 0
    };

    displayQuotations?.forEach(q => {
      if (counts?.hasOwnProperty(q?.status)) {
        counts[q.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className={`absolute top-4 right-4 z-[1000] w-80 max-w-[calc(100vw-2rem)] ${className}`}>
      <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={18} />
            <h3 className="font-semibold text-foreground">Quotation Overview</h3>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={onCreateQuotation}
            iconName="Plus"
            iconPosition="left"
          >
            New Quote
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-2xl font-bold text-foreground">{totalQuotations}</div>
            <div className="text-sm text-muted-foreground">Total Quotations</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-2xl font-bold text-success">{statusCounts?.approved + statusCounts?.accepted}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Status Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(statusCounts)?.map(([status, count]) => {
              if (count === 0) return null;
              
              const percentage = totalQuotations > 0 ? (count / totalQuotations) * 100 : 0;
              
              return (
                <div key={status} className="flex items-center justify-between text-sm">
                  <QuotationStatusIndicator status={status} timestamp={new Date().toISOString()} />
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{count}</span>
                    <span className="text-xs text-muted-foreground">({percentage?.toFixed(0)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Empty State */}
        {totalQuotations === 0 && (
          <div className="text-center py-6">
            <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              No quotations found on the map
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateQuotation}
              iconName="Plus"
              iconPosition="left"
            >
              Create First Quotation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationSummaryCard;