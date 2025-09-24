import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const LocationBreadcrumb = ({ coordinates, locationName, onMapReturn }) => {
  if (!coordinates) return null;

  const formatCoordinates = (coords) => {
    if (!coords || !coords?.lat || !coords?.lng) return '';
    return `${coords?.lat?.toFixed(6)}, ${coords?.lng?.toFixed(6)}`;
  };

  const formatCoordinatesMobile = (coords) => {
    if (!coords || !coords?.lat || !coords?.lng) return '';
    return `${coords?.lat?.toFixed(3)}, ${coords?.lng?.toFixed(3)}`;
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link
        to="/map-view"
        onClick={onMapReturn}
        className="flex items-center space-x-1 hover:text-foreground transition-hover"
      >
        <Icon name="Map" size={14} />
        <span>Map View</span>
      </Link>
      
      <Icon name="ChevronRight" size={14} />
      
      <div className="flex items-center space-x-2">
        <Icon name="MapPin" size={14} />
        <div className="flex flex-col">
          {locationName && (
            <span className="text-foreground font-medium">{locationName}</span>
          )}
          <span className="font-mono text-xs">
            <span className="hidden sm:inline" title={formatCoordinates(coordinates)}>
              {formatCoordinates(coordinates)}
            </span>
            <span className="sm:hidden" title={formatCoordinates(coordinates)}>
              {formatCoordinatesMobile(coordinates)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationBreadcrumb;