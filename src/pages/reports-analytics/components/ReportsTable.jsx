import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportsTable = ({ reports, onExport }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getFormatIcon = (format) => {
    switch (format?.toLowerCase()) {
      case 'pdf': return 'FileText';
      case 'csv': return 'Table';
      case 'excel': return 'FileSpreadsheet';
      default: return 'File';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 animate-fade-in">
      <div className="p-6 border-b border-border animate-slide-down">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Generated Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          Pre-built and custom reports with export options
        </p>
      </div>
      
      <div className="overflow-x-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                Report Name
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                Generated
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                Format
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports?.map((report, index) => (
              <tr 
                key={report?.id} 
                className="hover:bg-muted/30 transition-all duration-300 animate-slide-right"
                style={{ animationDelay: `${300 + (index * 100)}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{report?.name}</div>
                      <div className="text-xs text-muted-foreground">{report?.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {report?.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(report?.generatedDate)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(report?.status)} 
                      size={16} 
                      className={getStatusColor(report?.status)}
                    />
                    <span className={`text-sm font-medium capitalize ${getStatusColor(report?.status)}`}>
                      {report?.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getFormatIcon(report?.format)} 
                      size={16} 
                      className="text-muted-foreground"
                    />
                    <span className="text-sm text-muted-foreground">{report?.format}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {report?.status === 'completed' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('View report:', report?.id)}
                        >
                          <Icon name="Eye" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onExport?.(report?.format, report?.type)}
                        >
                          <Icon name="Download" size={14} />
                        </Button>
                      </>
                    )}
                    {report?.status === 'processing' && (
                      <span className="text-sm text-muted-foreground">Processing...</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;