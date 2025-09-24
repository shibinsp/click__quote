import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ExportModal = ({ onClose, onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    reportType: 'overview',
    includeCharts: true,
    includeTables: true
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'csv', label: 'CSV Spreadsheet' },
    { value: 'excel', label: 'Excel Workbook' },
    { value: 'json', label: 'JSON Data' }
  ];

  const reportTypeOptions = [
    { value: 'overview', label: 'Analytics Overview' },
    { value: 'detailed', label: 'Detailed Analysis' },
    { value: 'summary', label: 'Executive Summary' },
    { value: 'geographical', label: 'Geographical Report' },
    { value: 'performance', label: 'Performance Metrics' }
  ];

  const handleExport = () => {
    onExport?.(exportConfig?.format, exportConfig?.reportType);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
      <div className="bg-card border border-border rounded-lg shadow-elevation-2 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Export Report</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Export Format
            </label>
            <Select
              value={exportConfig?.format}
              onChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}
              options={formatOptions}
              placeholder="Select format"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Report Type
            </label>
            <Select
              value={exportConfig?.reportType}
              onChange={(value) => setExportConfig(prev => ({ ...prev, reportType: value }))}
              options={reportTypeOptions}
              placeholder="Select report type"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeCharts"
                checked={exportConfig?.includeCharts}
                onChange={(e) => setExportConfig(prev => ({ ...prev, includeCharts: e?.target?.checked }))}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="includeCharts" className="text-sm text-foreground">
                Include Charts and Graphs
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeTables"
                checked={exportConfig?.includeTables}
                onChange={(e) => setExportConfig(prev => ({ ...prev, includeTables: e?.target?.checked }))}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="includeTables" className="text-sm text-foreground">
                Include Data Tables
              </label>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Export Information</p>
                <p>The report will be generated with current filter settings and downloaded automatically.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Icon name="Download" size={16} />
            <span className="ml-2">Export Report</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;