import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';

const QuickActionFloatingButton = ({ coordinates, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show on Map View and on mobile devices
  const shouldShow = location?.pathname === '/map-view';
  
  if (!shouldShow) return null;

  const handleCreateQuotation = () => {
    const params = new URLSearchParams();
    if (coordinates) {
      params?.set('lat', coordinates?.lat?.toString());
      params?.set('lng', coordinates?.lng?.toString());
    }
    navigate(`/create-quotation?${params?.toString()}`);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-floating md:hidden ${className}`}>
      <Button
        variant="default"
        size="lg"
        onClick={handleCreateQuotation}
        iconName="Plus"
        iconPosition="left"
        className="shadow-elevation-2 hover:shadow-lg transition-all duration-200"
      >
        Create Quote
      </Button>
    </div>
  );
};

export default QuickActionFloatingButton;