import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuotationTable = ({ quotations = [], onViewDetails }) => {
  const [sortField, setSortField] = useState('serviceOrderQuotationId');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sort quotations
  const sortedQuotations = useMemo(() => {
    const sorted = [...quotations];
    sorted?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      // Handle different data types
      if (sortField === 'createdOn') {
        aValue = new Date(aValue?.split(' ')?.[0]?.split('.')?.reverse()?.join('-') || '');
        bValue = new Date(bValue?.split(' ')?.[0]?.split('.')?.reverse()?.join('-') || '');
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [quotations, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children, className = "" }) => (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-white' : 'text-blue-300'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`-mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-white' : 'text-blue-300'}`}
          />
        </div>
      </div>
    </th>
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString?.split(' ')?.[0] || dateString;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    return dateTimeString;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Result List: More Than 5 Service Order Quotations Found
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {quotations?.length} quotation{quotations?.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-blue-600 border-white hover:bg-blue-50"
            iconName="Plus"
            iconPosition="left"
            onClick={() => window.location.href = '/create-quotation'}
          >
            New Quote
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-blue-500 sticky top-0">
              <tr>
                <SortableHeader field="serviceOrderQuotationId">
                  Service Order Quotation ID
                </SortableHeader>
                <SortableHeader field="serviceOrderQuotationDescription">
                  Service Order Quotation Description
                </SortableHeader>
                <SortableHeader field="createdOn">
                  Created On
                </SortableHeader>
                <SortableHeader field="soldToParty">
                  Sold To Party
                </SortableHeader>
                <SortableHeader field="status">
                  Status
                </SortableHeader>
                <SortableHeader field="externalReference">
                  External Reference
                </SortableHeader>
                <SortableHeader field="quotationValidFrom">
                  Quotation Valid From
                </SortableHeader>
                <SortableHeader field="quotationValidTo">
                  Quotation Valid To
                </SortableHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedQuotations?.map((quotation, index) => (
                <tr 
                  key={quotation?.serviceOrderQuotationId || quotation?.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono font-medium text-blue-600">
                    {quotation?.serviceOrderQuotationId}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={quotation?.serviceOrderQuotationDescription}>
                      {quotation?.serviceOrderQuotationDescription}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {formatDateTime(quotation?.createdOn)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={quotation?.soldToParty}>
                      {quotation?.soldToParty}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {quotation?.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {quotation?.externalReference}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {formatDate(quotation?.quotationValidFrom)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {formatDate(quotation?.quotationValidTo)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => onViewDetails?.(quotation?.serviceOrderQuotationId || quotation?.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {quotations?.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <Icon name="FileText" size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations found</h3>
            <p className="text-gray-500 mb-4">
              No service order quotations match your current criteria
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => window.location.href = '/create-quotation'}
            >
              Create New Quotation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationTable;