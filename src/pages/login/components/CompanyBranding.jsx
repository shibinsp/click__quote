import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyBranding = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl shadow-elevation-2">
          <Icon name="Zap" size={32} color="white" />
        </div>
      </div>

      {/* Company Name and Tagline */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Click & Quote</h1>
        <p className="text-lg text-muted-foreground">Electrical Solutions</p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Streamline your quotation management with our professional platform
        </p>
      </div>
    </div>
  );
};

export default CompanyBranding;