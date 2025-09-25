import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationConfirmationModal = ({ 
  isOpen, 
  location, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen || !location) return null;

  const formatCoordinate = (coord) => {
    return coord?.toFixed(6);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-2 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Confirm Location</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            iconName="X"
            className="h-8 w-8"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground mb-4">
            You've selected the following coordinates for your new quotation:
          </p>

          {/* Coordinates Display */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Latitude
                </label>
                <div className="font-mono text-sm text-muted-foreground bg-background px-3 py-2 rounded border">
                  {formatCoordinate(location?.lat)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Longitude
                </label>
                <div className="font-mono text-sm text-muted-foreground bg-background px-3 py-2 rounded border">
                  {formatCoordinate(location?.lng)}
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground block mb-2">
              Location Preview
            </label>
            <div className="w-full h-32 rounded-lg overflow-hidden border border-border">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Selected Location"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=£{location?.lat},£{location?.lng}&z=15&output=embed`}
              />
            </div>
          </div>

          {/* Info Message */}
          <div className="flex items-start space-x-2 p-3 bg-accent/10 rounded-lg mb-6">
            <Icon name="Info" size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <div className="text-sm text-accent">
              <p className="font-medium mb-1">Location Assignment</p>
              <p>This location will be automatically assigned to your new quotation. You can modify it later if needed.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => onConfirm(location)}
            iconName="Check"
            iconPosition="left"
          >
            Confirm & Create Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationConfirmationModal;