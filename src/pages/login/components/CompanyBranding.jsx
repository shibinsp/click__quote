import React from 'react';

const CompanyBranding = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex items-center justify-center mb-6">
        <img 
          src="/image.png" 
          alt="Click & Quote Logo" 
          className="w-40 h-50 object-contain"
        />
      </div>

      {/* Company Name and Tagline */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">UK Power Networks</h1>
        <p className="text-lg text-muted-foreground">Delivering your electricity</p>
      </div>
    </div>
  );
};

export default CompanyBranding;