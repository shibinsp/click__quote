import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import QuotationStatusIndicator from '../../../components/ui/QuotationStatusIndicator';

const QuotationHeader = ({ quotation, userRole, onEdit, onDuplicate, onPrint, onBack }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Quotation #{quotation?.id}
            </h1>
            <p className="text-muted-foreground mt-1">
              Created on {new Date(quotation.createdAt)?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <QuotationStatusIndicator 
            status={quotation?.status} 
            timestamp={quotation?.updatedAt}
            showTimestamp={true}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {userRole === 'Admin' && quotation?.status !== 'accepted' && (
          <Button
            variant="default"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
          >
            Edit Quotation
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={onDuplicate}
          iconName="Copy"
          iconPosition="left"
        >
          Duplicate Template
        </Button>
        
        <Button
          variant="outline"
          onClick={onPrint}
          iconName="Printer"
          iconPosition="left"
        >
          Print / Export
        </Button>
      </div>
    </div>
  );
};

export default QuotationHeader;