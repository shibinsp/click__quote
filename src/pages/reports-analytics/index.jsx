import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import RoleIndicatorBadge from '../../components/ui/RoleIndicatorBadge';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import AnalyticsOverview from './components/AnalyticsOverview';
import ConversionChart from './components/ConversionChart';
import RevenueChart from './components/RevenueChart';
import GeographicalChart from './components/GeographicalChart';
import ReportsTable from './components/ReportsTable';
import ExportModal from './components/ExportModal';
import FilterPanel from './components/FilterPanel';

const ReportsAnalytics = () => {
  const [currentUser] = useState({ role: 'admin' });
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30d',
    status: 'all',
    category: 'all'
  });
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const loadAnalyticsData = () => {
      // Mock data for demonstration
      const mockData = {
        overview: {
          totalQuotations: 1847,
          totalRevenue: 2450000,
          conversionRate: 68.5,
          avgQuoteValue: 1327,
          trends: {
            quotations: '+15%',
            revenue: '+23%',
            conversion: '+8%',
            avgValue: '+12%'
          }
        },
        reports: [
          {
            id: 'RPT-001',
            name: 'Monthly Performance Report',
            type: 'Performance',
            generatedDate: '2024-01-15',
            status: 'completed',
            format: 'PDF',
            size: '2.4 MB'
          },
          {
            id: 'RPT-002',
            name: 'Customer Analysis Report',
            type: 'Analytics',
            generatedDate: '2024-01-14',
            status: 'completed',
            format: 'Excel',
            size: '1.8 MB'
          },
          {
            id: 'RPT-003',
            name: 'Revenue Breakdown',
            type: 'Financial',
            generatedDate: '2024-01-13',
            status: 'processing',
            format: 'CSV',
            size: '0.9 MB'
          }
        ],
        chartData: {
          conversion: [
            { month: 'Jan', submitted: 180, accepted: 125, rate: 69 },
            { month: 'Feb', submitted: 165, accepted: 118, rate: 71 },
            { month: 'Mar', submitted: 195, accepted: 142, rate: 73 },
            { month: 'Apr', submitted: 210, accepted: 155, rate: 74 },
            { month: 'May', submitted: 225, accepted: 168, rate: 75 },
            { month: 'Jun', submitted: 240, accepted: 185, rate: 77 }
          ],
          revenue: [
            { month: 'Jan', target: 180000, actual: 165000 },
            { month: 'Feb', target: 190000, actual: 185000 },
            { month: 'Mar', target: 200000, actual: 195000 },
            { month: 'Apr', target: 210000, actual: 220000 },
            { month: 'May', target: 220000, actual: 235000 },
            { month: 'Jun', target: 230000, actual: 245000 }
          ],
          geographical: [
            { postcode: 'SW1', quotations: 145, revenue: 325000, conversion: 72 },
            { postcode: 'N1', quotations: 132, revenue: 285000, conversion: 68 },
            { postcode: 'E1', quotations: 118, revenue: 245000, conversion: 65 },
            { postcode: 'W1', quotations: 156, revenue: 385000, conversion: 75 },
            { postcode: 'SE1', quotations: 98, revenue: 195000, conversion: 62 }
          ]
        }
      };
      setAnalyticsData(mockData);
    };

    loadAnalyticsData();
  }, [filters]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
    { id: 'geographical', label: 'Geographical', icon: 'Map' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleExport = (format, reportType) => {
    console.log(`Exporting ${reportType} as ${format}`);
    setShowExportModal(false);
  };

  const handleGenerateReport = () => {
    console.log('Generating custom report with filters:', filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
          {/* Header Section */}
          <div className="mb-8 animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive business intelligence for quotation and job performance analysis
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <RoleIndicatorBadge role={currentUser?.role} />
                <Button onClick={() => setShowExportModal(true)}>
                  <Icon name="Download" size={16} />
                  <span className="ml-2">Export Report</span>
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit animate-slide-up">
              {tabs?.map((tab, index) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    activeTab === tab?.id
                      ? 'bg-card text-foreground shadow-elevation-1'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Panel */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onGenerateReport={handleGenerateReport}
            />
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <AnalyticsOverview data={analyticsData?.overview} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <ConversionChart data={analyticsData?.chartData?.conversion} />
                  </div>
                  <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                    <RevenueChart data={analyticsData?.chartData?.revenue} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="animate-fade-in">
                <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <ReportsTable
                    reports={analyticsData?.reports}
                    onExport={handleExport}
                  />
                </div>
              </div>
            )}

            {activeTab === 'geographical' && (
              <div className="space-y-8 animate-fade-in">
                <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <GeographicalChart data={analyticsData?.chartData?.geographical} />
                </div>
                <div className="bg-card border border-border rounded-lg p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Post Code Performance Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center animate-scale-in" style={{ animationDelay: '500ms' }}>
                      <div className="text-2xl font-bold text-primary">W1</div>
                      <div className="text-sm text-muted-foreground">Top Performing</div>
                      <div className="text-lg font-semibold text-foreground">75% Conversion</div>
                    </div>
                    <div className="text-center animate-scale-in" style={{ animationDelay: '600ms' }}>
                      <div className="text-2xl font-bold text-secondary">SW1</div>
                      <div className="text-sm text-muted-foreground">Highest Volume</div>
                      <div className="text-lg font-semibold text-foreground">145 Quotations</div>
                    </div>
                    <div className="text-center animate-scale-in" style={{ animationDelay: '700ms' }}>
                      <div className="text-2xl font-bold text-accent">£385K</div>
                      <div className="text-sm text-muted-foreground">Highest Revenue</div>
                      <div className="text-lg font-semibold text-foreground">W1 District</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card border border-border rounded-lg p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Seasonal Variations
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center animate-slide-right" style={{ animationDelay: '400ms' }}>
                        <span className="text-muted-foreground">Summer Peak</span>
                        <span className="font-semibold text-success">+28%</span>
                      </div>
                      <div className="flex justify-between items-center animate-slide-right" style={{ animationDelay: '500ms' }}>
                        <span className="text-muted-foreground">Autumn Steady</span>
                        <span className="font-semibold text-foreground">+12%</span>
                      </div>
                      <div className="flex justify-between items-center animate-slide-right" style={{ animationDelay: '600ms' }}>
                        <span className="text-muted-foreground">Winter Decline</span>
                        <span className="font-semibold text-warning">-15%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Growth Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center animate-slide-left" style={{ animationDelay: '500ms' }}>
                        <span className="text-muted-foreground">Year over Year</span>
                        <span className="font-semibold text-success">+42%</span>
                      </div>
                      <div className="flex justify-between items-center animate-slide-left" style={{ animationDelay: '600ms' }}>
                        <span className="text-muted-foreground">Quarter over Quarter</span>
                        <span className="font-semibold text-success">+18%</span>
                      </div>
                      <div className="flex justify-between items-center animate-slide-left" style={{ animationDelay: '700ms' }}>
                        <span className="text-muted-foreground">Monthly Growth</span>
                        <span className="font-semibold text-foreground">+8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default ReportsAnalytics;