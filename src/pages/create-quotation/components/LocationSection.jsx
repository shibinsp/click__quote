import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import LocationBreadcrumb from '../../../components/ui/LocationBreadcrumb';

const LocationSection = ({ locationData, onLocationDataChange, errors }) => {
  const [searchParams] = useSearchParams();
  
  // Get coordinates from URL params if coming from map view
  React.useEffect(() => {
    const lat = searchParams?.get('lat');
    const lng = searchParams?.get('lng');
    
    if (lat && lng && !locationData?.coordinates) {
      onLocationDataChange({
        ...locationData,
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        },
        source: 'map'
      });
    }
  }, [searchParams, locationData, onLocationDataChange]);

  const handleCoordinateChange = (field, value) => {
    const coordinates = {
      ...locationData?.coordinates,
      [field]: parseFloat(value) || 0
    };
    
    onLocationDataChange({
      ...locationData,
      coordinates,
      source: 'manual'
    });
  };

  const handleLocationNameChange = (value) => {
    onLocationDataChange({
      ...locationData,
      name: value
    });
  };

  const handleDescriptionChange = (value) => {
    onLocationDataChange({
      ...locationData,
      description: value
    });
  };

  const formatCoordinates = (coords) => {
    if (!coords || !coords?.lat || !coords?.lng) return null;
    return `${coords?.lat?.toFixed(6)}, ${coords?.lng?.toFixed(6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="MapPin" size={20} className="text-primary" />
        <h3 className="text-lg font-medium text-foreground">Location Information</h3>
      </div>
      {/* Location Breadcrumb if coordinates exist */}
      {locationData?.coordinates && (
        <LocationBreadcrumb
          coordinates={locationData?.coordinates}
          locationName={locationData?.name}
          onMapReturn={() => {}}
        />
      )}
      {/* Location Source Indicator */}
      {locationData?.source && (
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <Icon 
            name={locationData?.source === 'map' ? 'Map' : 'Edit'} 
            size={16} 
            className="text-accent" 
          />
          <span className="text-sm text-muted-foreground">
            Location {locationData?.source === 'map' ? 'selected from map view' : 'entered manually'}
          </span>
          {locationData?.coordinates && (
            <span className="text-xs font-mono text-muted-foreground ml-auto">
              {formatCoordinates(locationData?.coordinates)}
            </span>
          )}
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Location Name"
          type="text"
          placeholder="Enter location name or description"
          value={locationData?.name || ''}
          onChange={(e) => handleLocationNameChange(e?.target?.value)}
          error={errors?.locationName}
          description="Provide a descriptive name for this location"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Latitude"
            type="number"
            step="any"
            placeholder="40.7128"
            value={locationData?.coordinates?.lat || ''}
            onChange={(e) => handleCoordinateChange('lat', e?.target?.value)}
            error={errors?.latitude}
            required
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            placeholder="-74.0060"
            value={locationData?.coordinates?.lng || ''}
            onChange={(e) => handleCoordinateChange('lng', e?.target?.value)}
            error={errors?.longitude}
            required
          />
        </div>

        <Input
          label="Location Description"
          type="text"
          placeholder="Additional details about this location (optional)"
          value={locationData?.description || ''}
          onChange={(e) => handleDescriptionChange(e?.target?.value)}
          description="Include any relevant details about the installation site"
        />
      </div>
      {/* Map Preview */}
      {locationData?.coordinates && locationData?.coordinates?.lat && locationData?.coordinates?.lng && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location Preview</label>
          <div className="w-full h-64 border border-border rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={locationData?.name || 'Selected Location'}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${locationData?.coordinates?.lat},${locationData?.coordinates?.lng}&z=15&output=embed`}
              className="border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSection;