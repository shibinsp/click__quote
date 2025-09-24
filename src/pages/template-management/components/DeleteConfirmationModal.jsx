import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ isOpen, template, onConfirm, onCancel }) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-error/10">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Delete Template</h3>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-foreground mb-4">
            Are you sure you want to delete the template <strong>"{template?.name}"</strong>?
          </p>
          
          <div className="bg-error/5 border border-error/20 rounded-md p-4">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-error mt-0.5" />
              <div className="text-sm">
                <p className="text-error font-medium mb-1">Warning:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• This template will be permanently deleted</li>
                  <li>• Existing quotations using this template will not be affected</li>
                  <li>• Template usage history will be lost</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(template?.id)}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;