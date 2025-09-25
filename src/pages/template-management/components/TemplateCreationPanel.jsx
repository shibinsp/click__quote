import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TemplateCreationPanel = ({ isOpen, onClose, onSaveTemplate, editingTemplate }) => {
  const [templateData, setTemplateData] = useState(editingTemplate || {
    name: '',
    description: '',
    category: '',
    fields: []
  });

  const [newField, setNewField] = useState({
    label: '',
    type: 'text',
    required: false,
    options: []
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date Picker' },
    { value: 'currency', label: 'Currency Input' }
  ];

  const categories = [
    { value: 'transformers', label: 'Transformers' },
    { value: 'household', label: 'Household Products' },
    { value: 'industrial', label: 'Industrial Equipment' },
    { value: 'lighting', label: 'Lighting Solutions' },
    { value: 'cables', label: 'Cables & Wiring' },
    { value: 'custom', label: 'Custom Category' }
  ];

  const handleAddField = () => {
    if (!newField?.label?.trim()) return;

    setTemplateData(prev => ({
      ...prev,
      fields: [...prev?.fields, { ...newField, id: Date.now() }]
    }));

    setNewField({
      label: '',
      type: 'text',
      required: false,
      options: []
    });
  };

  const handleRemoveField = (fieldId) => {
    setTemplateData(prev => ({
      ...prev,
      fields: prev?.fields?.filter(field => field?.id !== fieldId)
    }));
  };

  const handleSave = () => {
    if (!templateData?.name?.trim() || !templateData?.description?.trim() || templateData?.fields?.length === 0) {
      return;
    }

    const template = {
      ...templateData,
      id: editingTemplate?.id || Date.now(),
      type: 'custom',
      createdBy: 'current_user',
      lastModified: new Date()?.toISOString(),
      usageCount: editingTemplate?.usageCount || 0
    };

    onSaveTemplate(template);
    onClose();
    
    // Reset form
    setTemplateData({
      name: '',
      description: '',
      category: '',
      fields: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Design a custom quotation template with your required fields
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Template Configuration */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Template Information</h3>
                <div className="space-y-4">
                  <Input
                    label="Template Name"
                    type="text"
                    placeholder="Enter template name"
                    value={templateData?.name}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, name: e?.target?.value }))}
                    required
                  />
                  
                  <Input
                    label="Description"
                    type="text"
                    placeholder="Describe what this template is for"
                    value={templateData?.description}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, description: e?.target?.value }))}
                    required
                  />

                  <Select
                    label="Category"
                    options={categories}
                    value={templateData?.category}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}
                    placeholder="Select category"
                  />
                </div>
              </div>

              {/* Field Creation */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Add Fields</h3>
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Field Label"
                      type="text"
                      placeholder="e.g., Product Name"
                      value={newField?.label}
                      onChange={(e) => setNewField(prev => ({ ...prev, label: e?.target?.value }))}
                    />
                    
                    <Select
                      label="Field Type"
                      options={fieldTypes}
                      value={newField?.type}
                      onChange={(value) => setNewField(prev => ({ ...prev, type: value }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newField?.required}
                        onChange={(e) => setNewField(prev => ({ ...prev, required: e?.target?.checked }))}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">Required field</span>
                    </label>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddField}
                      iconName="Plus"
                      iconPosition="left"
                      disabled={!newField?.label?.trim()}
                    >
                      Add Field
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fields List */}
              {templateData?.fields?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Template Fields</h3>
                  <div className="space-y-2">
                    {templateData?.fields?.map((field, index) => (
                      <div key={field?.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-md">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                          <div>
                            <span className="text-sm font-medium text-foreground">{field?.label}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">{fieldTypes?.find(t => t?.value === field?.type)?.label}</span>
                              {field?.required && (
                                <span className="text-xs text-error">Required</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(field?.id)}
                          className="text-error hover:text-error hover:bg-error/10"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Template Preview */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Template Preview</h3>
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="space-y-4">
                  <div className="text-center border-b border-border pb-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      {templateData?.name || 'Template Name'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {templateData?.description || 'Template description will appear here'}
                    </p>
                  </div>

                  {templateData?.fields?.length > 0 ? (
                    <div className="space-y-3">
                      {templateData?.fields?.map((field, index) => (
                        <div key={field?.id} className="space-y-1">
                          <label className="text-sm font-medium text-foreground flex items-center space-x-1">
                            <span>{field?.label}</span>
                            {field?.required && <span className="text-error">*</span>}
                          </label>
                          <div className="w-full h-8 bg-muted border border-border rounded-md flex items-center px-3">
                            <span className="text-xs text-muted-foreground">
                              {field?.type === 'select' ? 'Select option...' : 
                               field?.type === 'textarea' ? 'Text area...' :
                               field?.type === 'date' ? 'MM/DD/YYYY' :
                               field?.type === 'currency' ? '£0.00' :
                               field?.type === 'number'? '0' : 'Sample text...'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Add fields to see template preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!templateData?.name?.trim() || !templateData?.description?.trim() || templateData?.fields?.length === 0}
            iconName="Save"
            iconPosition="left"
          >
            {editingTemplate ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreationPanel;