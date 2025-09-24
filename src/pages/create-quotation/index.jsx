import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CustomerInfoForm from './components/CustomerInfoForm';
import ItemsSection from './components/ItemsSection';
import LocationSection from './components/LocationSection';
import QuotationPreview from './components/QuotationPreview';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';

const CreateQuotation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customerData, setCustomerData] = useState({});
  const [items, setItems] = useState([]);
  const [locationData, setLocationData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicateMode, setIsDuplicateMode] = useState(false);

  const steps = [
    { id: 1, name: 'Customer', icon: 'User' },
    { id: 2, name: 'Items', icon: 'Package' },
    { id: 3, name: 'Location', icon: 'MapPin' },
    { id: 4, name: 'Review', icon: 'CheckCircle' }
  ];

  // Handle URL parameters and initialize data
  useEffect(() => {
    const lat = searchParams?.get('lat');
    const lng = searchParams?.get('lng');
    const duplicateTemplateId = searchParams?.get('duplicate_template');

    // Handle location parameters
    if (lat && lng) {
      setLocationData({
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        },
        name: `Location (${parseFloat(lat)?.toFixed(4)}, ${parseFloat(lng)?.toFixed(4)})`,
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
    }

    // Handle template duplication
    if (duplicateTemplateId) {
      const template = getTemplateById(duplicateTemplateId);
      if (template) {
        // Create a duplicate template for editing
        const duplicatedTemplate = {
          ...template,
          id: Date.now(),
          name: `${template?.name} (Copy)`,
          type: 'custom',
          createdBy: 'current_user',
          lastModified: new Date()?.toISOString(),
          usageCount: 0
        };
        
        setSelectedTemplate(duplicatedTemplate);
        setIsDuplicateMode(true);
        // Start directly with customer step since template selection is removed
        setCurrentStep(1);
      }
    }
  }, [searchParams]);

  // Mock function to get template by ID (replace with actual template fetching logic)
  const getTemplateById = (templateId) => {
    // This should match the templates data structure from template management
    const templates = [
      {
        id: 1,
        name: "Standard Quotation Template",
        description: "Standard template for quotations based on technical field specifications",
        type: "default",
        category: "standard",
        usageCount: 156,
        lastModified: "2024-09-24T14:59:07Z",
        createdBy: "system",
        fields: [
          { 
            id: 1, 
            label: "Quotation Number (OBJECT_ID)", 
            type: "text", 
            required: true, 
            maxLength: 10,
            dataType: "CHAR",
            technicalName: "OBJECT_ID"
          },
          { 
            id: 2, 
            label: "Creation Date (POSTING_DATE)", 
            type: "date", 
            required: true, 
            format: "DD.MM.YYYY",
            dataType: "DATS",
            technicalName: "POSTING_DATE",
            fieldLength: 8
          },
          // ... other fields
        ]
      },
      // ... other templates
    ];
    
    return templates?.find(template => template?.id === parseInt(templateId));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Customer Info
        if (!customerData?.name?.trim()) newErrors.name = 'Customer name is required';
        if (!customerData?.email?.trim()) newErrors.email = 'Email is required';
        if (!customerData?.phone?.trim()) newErrors.phone = 'Phone number is required';
        if (!customerData?.address?.trim()) newErrors.address = 'Address is required';
        if (!customerData?.city?.trim()) newErrors.city = 'City is required';
        if (!customerData?.state?.trim()) newErrors.state = 'State is required';
        if (!customerData?.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
        break;

      case 2: // Items
        if (items?.length === 0) {
          newErrors.items = 'At least one item is required';
        } else {
          const hasInvalidItems = items?.some(item => 
            !item?.name?.trim() || !item?.quantity || item?.quantity <= 0 || !item?.unitPrice || item?.unitPrice <= 0
          );
          if (hasInvalidItems) {
            newErrors.items = 'All items must have valid name, quantity, and unit price';
          }
        }
        break;

      case 3: // Location
        if (!locationData?.name?.trim()) newErrors.locationName = 'Location name is required';
        if (!locationData?.coordinates?.lat) newErrors.latitude = 'Latitude is required';
        if (!locationData?.coordinates?.lng) newErrors.longitude = 'Longitude is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const quotationData = {
      id: `draft-${Date.now()}`,
      template: selectedTemplate,
      customer: customerData,
      items,
      location: locationData,
      status: 'draft',
      createdAt: new Date()?.toISOString(),
      total: items?.reduce((sum, item) => sum + ((item?.quantity || 0) * (item?.unitPrice || 0)), 0) * 1.08
    };

    console.log('Draft saved:', quotationData);
    setIsSaving(false);
    
    // Show success message or redirect
    navigate('/dashboard');
  };

  const handleSubmitForApproval = async () => {
    if (!validateStep(currentStep)) return;

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const quotationData = {
      id: `CQ-${Date.now()?.toString()?.slice(-6)}`,
      template: selectedTemplate,
      customer: customerData,
      items,
      location: locationData,
      status: 'submitted',
      createdAt: new Date()?.toISOString(),
      total: items?.reduce((sum, item) => sum + ((item?.quantity || 0) * (item?.unitPrice || 0)), 0) * 1.08
    };

    console.log('Quotation submitted:', quotationData);
    setIsSaving(false);
    
    // Redirect to quotation details or dashboard
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {isDuplicateMode && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Template Duplication Mode</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  You're creating a quotation based on the duplicated template "{selectedTemplate?.name}". 
                  All template fields are editable and will be saved as a new custom template.
                </p>
              </div>
            )}
            <CustomerInfoForm
              customerData={customerData}
              onCustomerDataChange={setCustomerData}
              errors={errors}
            />
          </div>
        );
      case 2:
        return (
          <ItemsSection
            selectedTemplate={selectedTemplate}
            items={items}
            onItemsChange={setItems}
            errors={errors}
          />
        );
      case 3:
        return (
          <LocationSection
            locationData={locationData}
            onLocationDataChange={setLocationData}
            errors={errors}
          />
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">Review your quotation details before submission</p>
              {isDuplicateMode && (
                <p className="text-sm text-primary mt-2">
                  This quotation will be created using your duplicated template
                </p>
              )}
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="User" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Customer</span>
                </div>
                <p className="text-sm text-muted-foreground">{customerData?.name}</p>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Package" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Items</span>
                </div>
                <p className="text-sm text-muted-foreground">{items?.length} items</p>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Location</span>
                </div>
                <p className="text-sm text-muted-foreground">{locationData?.name}</p>
              </div>
            </div>
            {/* Total Amount */}
            <div className="p-6 bg-muted/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Amount (including 8% tax)</p>
              <p className="text-3xl font-bold text-primary">
                ${(items?.reduce((sum, item) => sum + ((item?.quantity || 0) * (item?.unitPrice || 0)), 0) * 1.08)?.toFixed(2)}
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowPreview(true)}
                iconName="Eye"
                iconPosition="left"
              >
                Preview Quotation
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSaveDraft}
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
              >
                Save as Draft
              </Button>
              
              <Button
                variant="default"
                size="lg"
                onClick={handleSubmitForApproval}
                loading={isSaving}
                iconName="Send"
                iconPosition="left"
              >
                Submit for Approval
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="hover:text-foreground transition-hover"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={14} />
              <span>{isDuplicateMode ? 'Duplicate Template Quotation' : 'Create Quotation'}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {isDuplicateMode ? 'Create Quotation from Template' : 'Create New Quotation'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isDuplicateMode 
                ? 'Build a quotation using your duplicated template with location-based workflow' :'Build professional quotations with structured workflows'
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps?.map((step, index) => (
                <React.Fragment key={step?.id}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step?.id
                        ? 'bg-primary border-primary text-white' :'border-border text-muted-foreground'
                    }`}>
                      <Icon name={step?.icon} size={16} />
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`text-sm font-medium ${
                        currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step?.name}
                      </p>
                    </div>
                  </div>
                  {index < steps?.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step?.id ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleSaveDraft}
                  loading={isSaving}
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Draft
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleNext}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Preview Modal */}
      {showPreview && (
        <QuotationPreview
          selectedTemplate={selectedTemplate}
          customerData={customerData}
          items={items}
          locationData={locationData}
          onClose={() => setShowPreview(false)}
        />
      )}
      {/* Quick Action Floating Button */}
      <QuickActionFloatingButton 
        coordinates={locationData?.coordinates}
      />
    </div>
  );
};

export default CreateQuotation;