import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const TemplateCard = ({ template, onUseTemplate, onEditTemplate, onDuplicateTemplate, onDeleteTemplate, userRole }) => {
  const isDefault = template?.type === 'default';
  const canEdit = !isDefault && (userRole === 'Admin' || template?.createdBy === 'current_user');
  const canDelete = !isDefault && (userRole === 'Admin' || template?.createdBy === 'current_user');

  const formatUsageCount = (count) => {
    if (count >= 1000) return `${(count / 1000)?.toFixed(1)}k`;
    return count?.toString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-smooth">
      {/* Template Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{template?.name}</h3>
            {isDefault && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                <Icon name="Shield" size={12} />
                <span>Default</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>
        </div>
      </div>
      {/* Template Preview */}
      <div className="mb-4">
        <div className="bg-muted rounded-md p-4 border-2 border-dashed border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Template Preview</span>
          </div>
          <div className="space-y-2">
            {template?.fields?.slice(0, 3)?.map((field, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                <span className="text-xs text-muted-foreground">{field?.label}</span>
                <span className="text-xs text-muted-foreground">({field?.type})</span>
              </div>
            ))}
            {template?.fields?.length > 3 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                <span className="text-xs text-muted-foreground">+{template?.fields?.length - 3} more fields</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Template Stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="BarChart3" size={14} />
            <span>{formatUsageCount(template?.usageCount)} uses</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>{new Date(template.lastModified)?.toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Layers" size={14} />
          <span>{template?.fields?.length} fields</span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onUseTemplate(template)}
          iconName="Play"
          iconPosition="left"
          className="flex-1"
        >
          Use Template
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDuplicateTemplate(template)}
          iconName="Copy"
          iconPosition="left"
        >
          Duplicate
        </Button>

        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditTemplate(template)}
          >
            <Icon name="Edit" size={16} />
          </Button>
        )}

        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteTemplate(template)}
            className="text-error hover:text-error hover:bg-error/10"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;