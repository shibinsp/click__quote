import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onFilterChange, onGenerateReport }) => {
  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: '6months', label: 'Last 6 months' },
    { value: '1year', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const zipcodeOptions = [
    { value: 'all', label: 'All Zip Codes' },
    { value: 'SW1', label: 'SW1 - Westminster' },
    { value: 'N1', label: 'N1 - Islington' },
    { value: 'E1', label: 'E1 - Whitechapel' },
    { value: 'W1', label: 'W1 - West End' },
    { value: 'SE1', label: 'SE1 - Southwark' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const templateOptions = [
    { value: 'all', label: 'All Templates' },
    { value: 'household', label: 'Household Electrical' },
    { value: 'commercial', label: 'Commercial Electrical' },
    { value: 'industrial', label: 'Industrial Wiring' },
    { value: 'transformer', label: 'Transformer Installation' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Analytics Filters
          </h3>
          <p className="text-sm text-muted-foreground">
            Customize your analytics view and generate custom reports
          </p>
        </div>
        <Button onClick={onGenerateReport}>
          <Icon name="FileText" size={16} />
          <span className="ml-2">Generate Report</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date Range
          </label>
          <Select
            value={filters?.dateRange}
            onChange={(value) => onFilterChange?.('dateRange', value)}
            options={dateRangeOptions}
            placeholder="Select date range"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Zip Code Area
          </label>
          <Select
            value={filters?.zipcode}
              onChange={(value) => onFilterChange?.('zipcode', value)}
              options={zipcodeOptions}
              placeholder="Select zip code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <Select
            value={filters?.status}
            onChange={(value) => onFilterChange?.('status', value)}
            options={statusOptions}
            placeholder="Select status"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Template Type
          </label>
          <Select
            value={filters?.template}
            onChange={(value) => onFilterChange?.('template', value)}
            options={templateOptions}
            placeholder="Select template"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Applied filters: {Object?.values(filters)?.filter(value => value !== 'all')?.length || 0}
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            onFilterChange?.('dateRange', '30days');
            onFilterChange?.('zipcode', 'all');
            onFilterChange?.('status', 'all');
            onFilterChange?.('template', 'all');
          }}
        >
          <Icon name="RotateCcw" size={16} />
          <span className="ml-2">Reset Filters</span>
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;