import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  isOpen, 
  onToggle, 
  filters, 
  onFiltersChange, 
  onClearFilters,
  quotations 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'accepted', label: 'Accepted' }
  ];

  const templateOptions = [
    { value: '', label: 'All Templates' },
    { value: 'transformer', label: 'Transformer' },
    { value: 'household', label: 'Household Electrical' },
    { value: 'industrial', label: 'Industrial Equipment' },
    { value: 'lighting', label: 'Lighting Solutions' },
    { value: 'custom', label: 'Custom Template' }
  ];

  const userOptions = [
    { value: '', label: 'All Users' },
    ...Array.from(new Set(quotations.map(q => q.createdBy)))?.map(user => ({ value: user, label: user }))
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      templateType: '',
      user: '',
      dateFrom: '',
      dateTo: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters)?.filter(value => value && value !== '')?.length;
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          variant="outline"
          size="default"
          onClick={onToggle}
          iconName="Filter"
          iconPosition="left"
          className="bg-card shadow-elevation-2 border-border"
        >
          <span className="hidden sm:inline">Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </Button>
      </div>
      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-4 left-4 z-[1001] w-80 max-w-[calc(100vw-2rem)]">
          <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Filter" size={18} />
                <h3 className="font-semibold text-foreground">Filter Quotations</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                iconName="X"
                className="h-8 w-8"
              />
            </div>

            {/* Filter Controls */}
            <div className="space-y-4">
              {/* Status Filter */}
              <Select
                label="Status"
                options={statusOptions}
                value={localFilters?.status}
                onChange={(value) => handleFilterChange('status', value)}
                className="w-full"
              />

              {/* Template Type Filter */}
              <Select
                label="Template Type"
                options={templateOptions}
                value={localFilters?.templateType}
                onChange={(value) => handleFilterChange('templateType', value)}
                className="w-full"
              />

              {/* User Filter */}
              <Select
                label="Created By"
                options={userOptions}
                value={localFilters?.user}
                onChange={(value) => handleFilterChange('user', value)}
                searchable
                className="w-full"
              />

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="From Date"
                  type="date"
                  value={localFilters?.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                />
                <Input
                  label="To Date"
                  type="date"
                  value={localFilters?.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Clear All
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {getActiveFilterCount() > 0 ? (
                  `${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? 's' : ''} active`
                ) : (
                  'No filters applied'
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[999]"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilterPanel;