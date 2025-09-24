import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const TemplateFilters = ({ 
  filters, 
  onFiltersChange, 
  onCreateNew, 
  onClearFilters,
  templateCount 
}) => {
  const typeOptions = [
    { value: 'all', label: 'All Templates' },
    { value: 'default', label: 'Default Templates' },
    { value: 'custom', label: 'Custom Templates' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'transformers', label: 'Transformers' },
    { value: 'household', label: 'Household Products' },
    { value: 'industrial', label: 'Industrial Equipment' },
    { value: 'lighting', label: 'Lighting Solutions' },
    { value: 'cables', label: 'Cables & Wiring' },
    { value: 'custom', label: 'Custom Category' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'usage', label: 'Most Used' },
    { value: 'recent', label: 'Recently Modified' },
    { value: 'created', label: 'Date Created' }
  ];

  const hasActiveFilters = filters?.search || filters?.type !== 'all' || filters?.category !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Template Library</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your quotation templates ({templateCount} templates)
          </p>
        </div>
        <Button
          variant="default"
          onClick={onCreateNew}
          iconName="Plus"
          iconPosition="left"
        >
          Create Template
        </Button>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search templates..."
          value={filters?.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e?.target?.value })}
          className="w-full"
        />

        <Select
          options={typeOptions}
          value={filters?.type}
          onChange={(value) => onFiltersChange({ ...filters, type: value })}
          placeholder="Filter by type"
        />

        <Select
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFiltersChange({ ...filters, category: value })}
          placeholder="Filter by category"
        />

        <Select
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
          placeholder="Sort by"
        />
      </div>
      {/* Active Filters & Actions */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters?.search && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                <span>Search: "{filters?.search}"</span>
                <button
                  onClick={() => onFiltersChange({ ...filters, search: '' })}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            {filters?.type !== 'all' && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                <span>Type: {typeOptions?.find(t => t?.value === filters?.type)?.label}</span>
                <button
                  onClick={() => onFiltersChange({ ...filters, type: 'all' })}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            {filters?.category !== 'all' && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                <span>Category: {categoryOptions?.find(c => c?.value === filters?.category)?.label}</span>
                <button
                  onClick={() => onFiltersChange({ ...filters, category: 'all' })}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateFilters;