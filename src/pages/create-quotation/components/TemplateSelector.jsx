import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, onProceed }) => {
  const defaultTemplates = [
    {
      id: 'transformer-basic',
      name: 'Basic Transformer Package',
      description: 'Standard transformer installation with basic accessories',
      category: 'Transformers',
      itemCount: 5,
      isDefault: true
    },
    {
      id: 'household-starter',
      name: 'Household Electrical Starter',
      description: 'Essential electrical components for residential setup',
      category: 'Household',
      itemCount: 8,
      isDefault: true
    },
    {
      id: 'commercial-lighting',
      name: 'Commercial Lighting Solution',
      description: 'Complete lighting package for commercial spaces',
      category: 'Lighting',
      itemCount: 12,
      isDefault: true
    },
    {
      id: 'industrial-power',
      name: 'Industrial Power Distribution',
      description: 'Heavy-duty power distribution components',
      category: 'Industrial',
      itemCount: 15,
      isDefault: true
    },
    {
      id: 'maintenance-kit',
      name: 'Maintenance & Repair Kit',
      description: 'Essential tools and parts for electrical maintenance',
      category: 'Maintenance',
      itemCount: 10,
      isDefault: true
    }
  ];

  const customTemplates = [
    {
      id: 'custom-solar',
      name: 'Solar Panel Installation',
      description: 'Custom solar panel setup with inverters',
      category: 'Solar',
      itemCount: 7,
      isDefault: false
    },
    {
      id: 'custom-security',
      name: 'Security System Package',
      description: 'Complete electrical security system',
      category: 'Security',
      itemCount: 9,
      isDefault: false
    }
  ];

  const allTemplates = [...defaultTemplates, ...customTemplates];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Select Quotation Template</h2>
        <p className="text-muted-foreground">Choose a template to start building your quotation</p>
      </div>
      {/* Default Templates */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="Star" size={20} className="mr-2 text-warning" />
          Default Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaultTemplates?.map((template) => (
            <div
              key={template?.id}
              onClick={() => onTemplateSelect(template)}
              className={`p-4 border rounded-lg cursor-pointer transition-hover ${
                selectedTemplate?.id === template?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                    <Icon name="FileText" size={16} className="text-primary" />
                  </div>
                  <div className="text-xs px-2 py-1 bg-success/10 text-success rounded-md font-medium">
                    Default
                  </div>
                </div>
                {selectedTemplate?.id === template?.id && (
                  <Icon name="CheckCircle" size={20} className="text-primary" />
                )}
              </div>
              
              <h4 className="font-medium text-foreground mb-2">{template?.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Icon name="Tag" size={12} className="mr-1" />
                  {template?.category}
                </span>
                <span className="flex items-center">
                  <Icon name="Package" size={12} className="mr-1" />
                  {template?.itemCount} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Custom Templates */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2 text-accent" />
          Custom Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customTemplates?.map((template) => (
            <div
              key={template?.id}
              onClick={() => onTemplateSelect(template)}
              className={`p-4 border rounded-lg cursor-pointer transition-hover ${
                selectedTemplate?.id === template?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center">
                    <Icon name="FileText" size={16} className="text-accent" />
                  </div>
                  <div className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-md font-medium">
                    Custom
                  </div>
                </div>
                {selectedTemplate?.id === template?.id && (
                  <Icon name="CheckCircle" size={20} className="text-primary" />
                )}
              </div>
              
              <h4 className="font-medium text-foreground mb-2">{template?.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Icon name="Tag" size={12} className="mr-1" />
                  {template?.category}
                </span>
                <span className="flex items-center">
                  <Icon name="Package" size={12} className="mr-1" />
                  {template?.itemCount} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-center pt-6">
        <Button
          variant="default"
          size="lg"
          onClick={onProceed}
          disabled={!selectedTemplate}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue with Selected Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;