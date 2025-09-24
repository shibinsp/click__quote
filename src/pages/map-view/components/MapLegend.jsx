import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapLegend = ({ quotations, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusCounts = () => {
    const counts = {
      draft: 0,
      submitted: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      accepted: 0
    };

    quotations?.forEach(q => {
      if (counts?.hasOwnProperty(q?.status)) {
        counts[q.status]++;
      }
    });

    return counts;
  };

  const statusConfig = {
    draft: {
      label: 'Draft',
      color: '#64748B',
      icon: 'FileEdit'
    },
    submitted: {
      label: 'Submitted',
      color: '#0EA5E9',
      icon: 'Send'
    },
    under_review: {
      label: 'Under Review',
      color: '#D97706',
      icon: 'Clock'
    },
    approved: {
      label: 'Approved',
      color: '#059669',
      icon: 'CheckCircle'
    },
    rejected: {
      label: 'Rejected',
      color: '#DC2626',
      icon: 'XCircle'
    },
    accepted: {
      label: 'Accepted',
      color: '#059669',
      icon: 'CheckCircle2'
    }
  };

  const statusCounts = getStatusCounts();
  const totalQuotations = Object.values(statusCounts)?.reduce((sum, count) => sum + count, 0);

  return (
    <div className={`absolute bottom-4 right-4 z-[1000] ${className}`}>
      <div className="bg-card border border-border rounded-lg shadow-elevation-2 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Map" size={16} />
            <span className="text-sm font-medium text-foreground">Map Legend</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronDown' : 'ChevronUp'}
            className="h-6 w-6"
          />
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-3">
            {/* Total Count */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Total Quotations</span>
              <span className="text-sm font-semibold text-foreground">{totalQuotations}</span>
            </div>

            {/* Status Legend */}
            <div className="space-y-2">
              {Object.entries(statusConfig)?.map(([status, config]) => {
                const count = statusCounts?.[status];
                if (count === 0) return null;

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: config?.color }}
                      />
                      <span className="text-xs text-foreground">{config?.label}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="mt-3 pt-2 border-t border-border">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center space-x-1">
                  <Icon name="MousePointer" size={12} />
                  <span>Click markers to view quotations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Plus" size={12} />
                  <span>Click empty areas to create new</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed View */}
        {!isExpanded && (
          <div className="px-3 py-2">
            <div className="text-xs text-muted-foreground text-center">
              {totalQuotations} quotation{totalQuotations !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLegend;