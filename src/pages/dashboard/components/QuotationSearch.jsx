import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import QuotationStatusIndicator from '../../../components/ui/QuotationStatusIndicator';

const QuotationSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Mock search results
  const mockSearchResults = [
    {
      id: "QT-2024-001",
      customerName: "ABC Manufacturing Corp",
      templateType: "Transformer Installation",
      location: "New York, NY",
      status: "approved",
      totalAmount: 15750.00,
      createdAt: "2024-09-20T10:30:00Z"
    },
    {
      id: "QT-2024-002",
      customerName: "TechFlow Industries",
      templateType: "Household Electrical",
      location: "Los Angeles, CA",
      status: "submitted",
      totalAmount: 8500.00,
      createdAt: "2024-09-22T14:15:00Z"
    }
  ];

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery?.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = mockSearchResults?.filter(quote => 
        quote?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        quote?.customerName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
      if (onSearch) onSearch(searchQuery, results);
    }, 500);
  };

  const handleDuplicate = (quotationId) => {
    navigate(`/create-quotation?duplicate=${quotationId}`);
  };

  const handleViewDetails = (quotationId) => {
    navigate(`/quotation-details?id=${quotationId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Search Quotations</h3>
        
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by Quote ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            iconName="Search"
            loading={isSearching}
            disabled={!searchQuery?.trim()}
          >
            Search
          </Button>
        </form>
      </div>
      {searchResults?.length > 0 && (
        <div className="p-6">
          <div className="space-y-4">
            {searchResults?.map((quotation) => (
              <div key={quotation?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-hover">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono font-medium text-foreground">
                        #{quotation?.id}
                      </span>
                      <QuotationStatusIndicator status={quotation?.status} timestamp={quotation?.createdAt} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="text-sm font-medium text-foreground">{quotation?.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Template</p>
                        <p className="text-sm text-foreground">{quotation?.templateType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(quotation?.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{quotation?.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={12} />
                        <span>{formatDate(quotation?.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleViewDetails(quotation?.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Copy"
                      onClick={() => handleDuplicate(quotation?.id)}
                    >
                      Duplicate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {searchQuery && searchResults?.length === 0 && !isSearching && (
        <div className="px-6 py-12 text-center">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try searching with a different Quote ID or Customer Name
          </p>
        </div>
      )}
    </div>
  );
};

export default QuotationSearch;