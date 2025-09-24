import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CustomerInfoForm = ({ customerData, onCustomerDataChange, errors }) => {
  const handleInputChange = (field, value) => {
    onCustomerDataChange({
      ...customerData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="User" size={20} className="text-primary" />
        <h3 className="text-lg font-medium text-foreground">Customer Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Customer Name"
          type="text"
          placeholder="Enter customer full name"
          value={customerData?.name || ''}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
        />

        <Input
          label="Company Name"
          type="text"
          placeholder="Enter company name (optional)"
          value={customerData?.company || ''}
          onChange={(e) => handleInputChange('company', e?.target?.value)}
          error={errors?.company}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="customer@example.com"
          value={customerData?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={customerData?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />
      </div>
      <div className="space-y-4">
        <Input
          label="Street Address"
          type="text"
          placeholder="Enter street address"
          value={customerData?.address || ''}
          onChange={(e) => handleInputChange('address', e?.target?.value)}
          error={errors?.address}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            type="text"
            placeholder="Enter city"
            value={customerData?.city || ''}
            onChange={(e) => handleInputChange('city', e?.target?.value)}
            error={errors?.city}
            required
          />

          <Input
            label="State/Province"
            type="text"
            placeholder="Enter state"
            value={customerData?.state || ''}
            onChange={(e) => handleInputChange('state', e?.target?.value)}
            error={errors?.state}
            required
          />

          <Input
            label="ZIP/Postal Code"
            type="text"
            placeholder="Enter ZIP code"
            value={customerData?.zipCode || ''}
            onChange={(e) => handleInputChange('zipCode', e?.target?.value)}
            error={errors?.zipCode}
            required
          />
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <Input
          label="Additional Notes"
          type="text"
          placeholder="Any special requirements or notes (optional)"
          value={customerData?.notes || ''}
          onChange={(e) => handleInputChange('notes', e?.target?.value)}
          description="Include any special delivery instructions or project requirements"
        />
      </div>
    </div>
  );
};

export default CustomerInfoForm;