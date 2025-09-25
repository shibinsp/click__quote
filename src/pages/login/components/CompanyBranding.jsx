import React from 'react';

const CompanyBranding = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex items-center justify-center mb-6">
        <img 
          src="/assets/images/uk-power-networks-logo.svg" 
          alt="UK Power Networks Logo" 
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Company Name and Tagline */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">UK Power Networks</h1>
        <p className="text-lg text-muted-foreground">Delivering your electricity</p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Streamline your quotation management with our professional platform
        </p>
      </div>
    </div>
  );
};

export default CompanyBranding;