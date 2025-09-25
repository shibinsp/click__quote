import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import RoleIndicatorBadge from '../../components/ui/RoleIndicatorBadge';
import MetricsCard from './components/MetricsCard';
import RecentQuotationsTable from './components/RecentQuotationsTable';
import QuickActions from './components/QuickActions';
import ActivityLog from './components/ActivityLog';
import QuotationSearch from './components/QuotationSearch';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('Admin'); // Mock user role
  
  // Mock dashboard metrics
  const mockMetrics = {
    totalQuotations: {
      value: 1847,
      trend: 'up',
      trendValue: '+15%',
      color: 'primary'
    },
    submittedQuotations: {
      value: 1205,
      trend: 'up',
      trendValue: '+23%',
      color: 'success'
    },
    totalRevenue: {
      value: '£2.4M',
      trend: 'up',
      trendValue: '+18%',
      color: 'accent'
    },
    conversionRate: {
      value: '68%',
      trend: 'up',
      trendValue: '+8%',
      color: 'warning'
    },
    avgQuoteValue: {
      value: '£12.5K',
      trend: 'up',
      trendValue: '+12%',
      color: 'primary'
    }
  };

  const [dashboardData, setDashboardData] = useState({
    metrics: mockMetrics,
    recentQuotations: [],
    activities: []
  });

  // Mock user data
  const currentUser = {
    name: "Sarah Johnson",
    email: "sarah.johnson@clickquote.com",
    role: userRole,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  // Mock recent quotations
  const mockRecentQuotations = [
    {
      id: "QT-2024-015",
      customerName: "ABC Manufacturing Corp",
      customerEmail: "contact@abcmfg.com",
      templateType: "Standard Quotation Template",
      location: "London, UK",
      totalAmount: 15750.00,
      status: "submitted",
      createdAt: "2024-09-24T09:30:00Z"
    },
    {
      id: "QT-2024-014",
      customerName: "TechFlow Industries",
      customerEmail: "procurement@techflow.com",
      templateType: "Standard Quotation Template",
      location: "Manchester, UK",
      totalAmount: 8500.00,
      status: "approved",
      createdAt: "2024-09-23T14:15:00Z"
    },
    {
      id: "QT-2024-013",
      customerName: "Green Energy Solutions",
      customerEmail: "orders@greenenergy.com",
      templateType: "Standard Quotation Template",
      location: "Birmingham, UK",
      totalAmount: 22300.00,
      status: "under_review",
      createdAt: "2024-09-23T11:45:00Z"
    },
    {
      id: "QT-2024-012",
      customerName: "Metro Construction Ltd",
      customerEmail: "supplies@metroconstruction.com",
      templateType: "Standard Quotation Template",
      location: "Leeds, UK",
      totalAmount: 18900.00,
      status: "draft",
      createdAt: "2024-09-22T16:20:00Z"
    },
    {
      id: "QT-2024-011",
      customerName: "Residential Plus Inc",
      customerEmail: "info@residentialplus.com",
      templateType: "Standard Quotation Template",
      location: "Glasgow, UK",
      totalAmount: 6750.00,
      status: "accepted",
      createdAt: "2024-09-22T10:10:00Z"
    },
    {
      id: "QT-2024-010",
      customerName: "Northern Electric Solutions",
      customerEmail: "contracts@northernelectric.co.uk",
      templateType: "Standard Quotation Template",
      location: "Edinburgh, UK",
      totalAmount: 12450.00,
      status: "submitted",
      createdAt: "2024-09-21T15:45:00Z"
    },
    {
      id: "QT-2024-009",
      customerName: "Bristol Power Systems",
      customerEmail: "info@bristolpower.co.uk",
      templateType: "Standard Quotation Template",
      location: "Bristol, UK",
      totalAmount: 28750.00,
      status: "approved",
      createdAt: "2024-09-21T11:20:00Z"
    },
    {
      id: "QT-2024-008",
      customerName: "Cardiff Construction Group",
      customerEmail: "procurement@cardiffconstruction.co.uk",
      templateType: "Standard Quotation Template",
      location: "Cardiff, UK",
      totalAmount: 19850.00,
      status: "under_review",
      createdAt: "2024-09-20T13:30:00Z"
    },
    {
      id: "QT-2024-007",
      customerName: "Liverpool Electrical Services",
      customerEmail: "quotes@liverpoolelectrical.co.uk",
      templateType: "Standard Quotation Template",
      location: "Liverpool, UK",
      totalAmount: 5680.00,
      status: "draft",
      createdAt: "2024-09-20T09:15:00Z"
    },
    {
      id: "QT-2024-006",
      customerName: "Sheffield Industrial Ltd",
      customerEmail: "orders@sheffieldindustrial.co.uk",
      templateType: "Standard Quotation Template",
      location: "Sheffield, UK",
      totalAmount: 31200.00,
      status: "accepted",
      createdAt: "2024-09-19T16:40:00Z"
    }
  ];

  // Mock activity log
  const mockActivities = [
    {
      type: "submitted",
      user: "Mike Rodriguez",
      action: "submitted quotation",
      quotationId: "QT-2024-015",
      details: "Transformer Installation for ABC Manufacturing Corp",
      timestamp: "2024-09-24T09:30:00Z"
    },
    {
      type: "approved",
      user: "Sarah Johnson",
      action: "approved quotation",
      quotationId: "QT-2024-014",
      details: "Household Electrical for TechFlow Industries",
      timestamp: "2024-09-24T08:45:00Z"
    },
    {
      type: "created",
      user: "Lisa Chen",
      action: "created new quotation",
      quotationId: "QT-2024-016",
      details: "Commercial Electrical template",
      timestamp: "2024-09-24T08:15:00Z"
    },
    {
      type: "duplicated",
      user: "David Park",
      action: "duplicated quotation",
      quotationId: "QT-2024-008",
      details: "Used as template for new customer",
      timestamp: "2024-09-24T07:30:00Z"
    },
    {
      type: "login",
      user: "Sarah Johnson",
      action: "logged into the system",
      timestamp: "2024-09-24T07:00:00Z"
    }
  ];

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = () => {
      setDashboardData({
        metrics: mockMetrics,
        recentQuotations: mockRecentQuotations,
        activities: mockActivities
      });
    };

    loadDashboardData();
  }, [userRole]);

  const handleSearch = (query, results) => {
    console.log('Search performed:', query, results);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-orange-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                Click & Quote
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Reliable electrical solutions for your business needs. Get instant quotes and manage your power infrastructure efficiently.
              </p>
              

            </div>
          </div>
          
          {/* Animated Background Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-300/30 rounded-full animate-ping"></div>
        </div>



        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {currentUser?.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's what's happening with your quotations today
                </p>
              </div>
              <RoleIndicatorBadge role={currentUser?.role} />
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
            <div className="animate-bounce-in hover-lift" style={{ animationDelay: '0.1s' }}>
              <MetricsCard
                title="Total Quotations"
                value={dashboardData?.metrics?.totalQuotations?.value || 0}
                icon="FileText"
                trend={dashboardData?.metrics?.totalQuotations?.trend}
                trendValue={dashboardData?.metrics?.totalQuotations?.trendValue}
                color={dashboardData?.metrics?.totalQuotations?.color}
              />
            </div>
            <div className="animate-bounce-in hover-lift" style={{ animationDelay: '0.2s' }}>
              <MetricsCard
                title="Submitted quotation"
                value={dashboardData?.metrics?.submittedQuotations?.value || 0}
                icon="CheckCircle"
                trend={dashboardData?.metrics?.submittedQuotations?.trend}
                trendValue={dashboardData?.metrics?.submittedQuotations?.trendValue}
                color={dashboardData?.metrics?.submittedQuotations?.color}
              />
            </div>
            <div className="animate-bounce-in hover-lift" style={{ animationDelay: '0.3s' }}>
              <MetricsCard
                title="Total Revenue"
                value={dashboardData?.metrics?.totalRevenue?.value || '£0'}
                icon="DollarSign"
                trend={dashboardData?.metrics?.totalRevenue?.trend}
                trendValue={dashboardData?.metrics?.totalRevenue?.trendValue}
                color={dashboardData?.metrics?.totalRevenue?.color}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <QuickActions userRole={currentUser?.role} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Quotations Table */}
              <div className="animate-bounce-in" style={{ animationDelay: '0.6s' }}>
                <RecentQuotationsTable 
                  quotations={dashboardData?.recentQuotations}
                  userRole={currentUser?.role}
                />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Search Quotations */}
              <div className="animate-slide-in-left" style={{ animationDelay: '0.7s' }}>
                <QuotationSearch onSearch={handleSearch} />
              </div>

              {/* Activity Log */}
              <div className="animate-slide-in-left" style={{ animationDelay: '0.8s' }}>
                <ActivityLog activities={dashboardData?.activities} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;