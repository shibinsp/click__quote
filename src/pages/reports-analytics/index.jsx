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
  const [currentUser] = useState({
    name: "Sarah Johnson",
    role: "Admin"
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30days',
    postcode: 'all',
    status: 'all',
    template: 'all'
  });

  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    reports: [],
    chartData: {}
  });

  // Mock analytics data
  useEffect(() => {
    const loadAnalyticsData = () => {
      const mockData = {
        overview: {
          totalQuotations: 1847,
          totalRevenue: 2847500,
          conversionRate: 68.5,
          avgQuoteValue: 15420,
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
            name: 'Monthly Quotation Summary',
            type: 'Summary',
            generatedDate: '2024-09-24',
            status: 'completed',
            format: 'PDF'
          },
          {
            id: 'RPT-002',
            name: 'Postcode Performance Analysis',
            type: 'Geographical',
            generatedDate: '2024-09-23',
            status: 'completed',
            format: 'CSV'
          },
          {
            id: 'RPT-003',
            name: 'Template Usage Statistics',
            type: 'Template Analysis',
            generatedDate: '2024-09-22',
            status: 'processing',
            format: 'PDF'
          },
          {
            id: 'RPT-004',
            name: 'User Productivity Metrics',
            type: 'Performance',
            generatedDate: '2024-09-21',
            status: 'completed',
            format: 'Excel'
          }
        ],
        chartData: {
          conversion: [
            { month: 'Jun', submitted: 180, accepted: 122, conversion: 67.8 },
            { month: 'Jul', submitted: 205, accepted: 145, conversion: 70.7 },
            { month: 'Aug', submitted: 195, accepted: 128, conversion: 65.6 },
            { month: 'Sep', submitted: 220, accepted: 152, conversion: 69.1 }
          ],
          revenue: [
            { month: 'Jun', revenue: 485000, target: 450000 },
            { month: 'Jul', revenue: 520000, target: 480000 },
            { month: 'Aug', revenue: 475000, target: 500000 },
            { month: 'Sep', revenue: 615000, target: 520000 }
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
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
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-hover ${
                    activeTab === tab?.id
                      ? 'bg-card text-foreground shadow-elevation-1'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onGenerateReport={handleGenerateReport}
          />

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <AnalyticsOverview data={analyticsData?.overview} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ConversionChart data={analyticsData?.chartData?.conversion} />
                  <RevenueChart data={analyticsData?.chartData?.revenue} />
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <ReportsTable
                reports={analyticsData?.reports}
                onExport={handleExport}
              />
            )}

            {activeTab === 'geographical' && (
              <div className="space-y-8">
                <GeographicalChart data={analyticsData?.chartData?.geographical} />
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Postcode Performance Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">W1</div>
                      <div className="text-sm text-muted-foreground">Top Performing</div>
                      <div className="text-lg font-semibold text-foreground">75% Conversion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">SW1</div>
                      <div className="text-sm text-muted-foreground">Highest Volume</div>
                      <div className="text-lg font-semibold text-foreground">145 Quotations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">£385K</div>
                      <div className="text-sm text-muted-foreground">Highest Revenue</div>
                      <div className="text-lg font-semibold text-foreground">W1 District</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Seasonal Variations
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Summer Peak</span>
                        <span className="font-semibold text-success">+28%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Autumn Steady</span>
                        <span className="font-semibold text-foreground">+12%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Winter Decline</span>
                        <span className="font-semibold text-warning">-15%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Growth Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Year over Year</span>
                        <span className="font-semibold text-success">+42%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Quarter over Quarter</span>
                        <span className="font-semibold text-success">+18%</span>
                      </div>
                      <div className="flex justify-between items-center">
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