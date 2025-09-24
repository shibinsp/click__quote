import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalInfoTab = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    department: user?.department || '',
    jobTitle: user?.jobTitle || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      department: user?.department || '',
      jobTitle: user?.jobTitle || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </>
        )}
      </div>
      {/* Personal Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="User" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData?.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData?.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData?.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="Job Title"
            name="jobTitle"
            value={formData?.jobTitle}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Company Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Building" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Company Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            name="company"
            value={formData?.company}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="Department"
            name="department"
            value={formData?.department}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Address Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="MapPin" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Address Information</h3>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Street Address"
            name="address"
            value={formData?.address}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData?.city}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Input
              label="State"
              name="state"
              value={formData?.state}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Input
              label="ZIP Code"
              name="zipCode"
              value={formData?.zipCode}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;