import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Quotations = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_on');
  const [sortOrder, setSortOrder] = useState('desc');

  // Service Order Quotations Data
  const serviceOrderQuotations = [
    {
      id: '3200034533',
      description: '5G DEB Lawn Lane',
      createdOn: '20.07.2021 15:03:06',
      soldToParty: 'Infrastructure Gateway Limited',
      siteAddress: 'EC1 TERN N15 0XE',
      interactivityQuote: '',
      status: 'Quote Sent to Customer',
      externalReference: '6200044514',
      quotationValidFrom: '29.07.2021',
      quotationValidTo: '18.01.2022'
    },
    {
      id: '3200059574',
      description: 'IPB 3LW Ltd Holy Mour Lane & Grove',
      createdOn: '28.02.2024 10:58:14',
      soldToParty: 'Merox Connections',
      siteAddress: 'Crawley GU34 3LF',
      interactivityQuote: '',
      status: 'Quote Sent to Customer',
      externalReference: '8200060914',
      quotationValidFrom: '27.02.2024',
      quotationValidTo: '25.08.2024'
    },
    {
      id: '3200059636',
      description: 'CM12 8HJ London Road',
      createdOn: '28.02.2024 10:17:04',
      soldToParty: 'TriConnect Ltd',
      siteAddress: 'Great Notley CM77 7AL',
      interactivityQuote: '',
      status: 'Quote Sent to Customer',
      externalReference: '6200047005',
      quotationValidFrom: '28.02.2024',
      quotationValidTo: '26.08.2024'
    },
    {
      id: '3200059651',
      description: 'KT19 0SH 274-276 Kingston Rd (CV)',
      createdOn: '28.02.2024 13:46:10',
      soldToParty: 'Eurosat',
      siteAddress: 'Glasgow G32 8EY',
      interactivityQuote: '',
      status: 'Quote Sent to Customer',
      externalReference: '6200046856',
      quotationValidFrom: '29.02.2024',
      quotationValidTo: '27.08.2024'
    },
    {
      id: '3200059720',
      description: 'KT15 2QG Woburn Hill',
      createdOn: '04.03.2024 12:32:55',
      soldToParty: 'TriConnect Ltd',
      siteAddress: 'Great Notley CM77 7AL',
      interactivityQuote: '',
      status: 'Quote Sent to Customer',
      externalReference: '8200060958',
      quotationValidFrom: '04.03.2024',
      quotationValidTo: '31.08.2024'
    }
  ];

  useEffect(() => {
    setQuotations(serviceOrderQuotations);
    setFilteredQuotations(serviceOrderQuotations);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = quotations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(quotation =>
        quotation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.soldToParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.siteAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quotation => quotation.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdOn') {
        aValue = new Date(aValue.split(' ')[0].split('.').reverse().join('-'));
        bValue = new Date(bValue.split(' ')[0].split('.').reverse().join('-'));
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredQuotations(filtered);
  }, [quotations, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Quote Sent to Customer':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Service Order Quotations</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and track all service order quotations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/create-quotation')}
                  iconName="Plus"
                  iconPosition="left"
                >
                  New Quotation
                </Button>
                <Button
                  variant="default"
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search quotations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Quote Sent to Customer">Quote Sent to Customer</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Quotations</p>
                    <p className="text-2xl font-bold text-foreground">{quotations.length}</p>
                  </div>
                  <Icon name="FileText" size={24} className="text-primary" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sent to Customer</p>
                    <p className="text-2xl font-bold text-foreground">
                      {quotations.filter(q => q.status === 'Quote Sent to Customer').length}
                    </p>
                  </div>
                  <Icon name="Send" size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-foreground">
                      {quotations.filter(q => q.createdOn.includes('2024')).length}
                    </p>
                  </div>
                  <Icon name="Calendar" size={24} className="text-green-600" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-foreground">
                      {quotations.filter(q => new Date(q.quotationValidTo.split('.').reverse().join('-')) > new Date()).length}
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={24} className="text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quotations Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('id')}
                        className="flex items-center space-x-1 hover:text-foreground"
                      >
                        <span>Quotation ID</span>
                        <Icon name={getSortIcon('id')} size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('description')}
                        className="flex items-center space-x-1 hover:text-foreground"
                      >
                        <span>Description</span>
                        <Icon name={getSortIcon('description')} size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('createdOn')}
                        className="flex items-center space-x-1 hover:text-foreground"
                      >
                        <span>Created On</span>
                        <Icon name={getSortIcon('createdOn')} size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Sold To Party
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Site Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      External Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Valid From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Valid To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredQuotations.map((quotation) => (
                    <tr key={quotation.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {quotation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {quotation.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {quotation.createdOn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {quotation.soldToParty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {quotation.siteAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(quotation.status)}`}>
                          {quotation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {quotation.externalReference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {quotation.quotationValidFrom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {quotation.quotationValidTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/quotation-details?id=${quotation.id}`)}
                            iconName="Eye"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Edit"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Download"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No quotations found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by creating your first quotation.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quotations;