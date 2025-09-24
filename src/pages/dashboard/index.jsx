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
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
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

  // Mock dashboard metrics
  const mockMetrics = {
    totalQuotations: {
      value: 247,
      trend: 'up',
      trendValue: '+12%',
      color: 'primary'
    },
    submittedQuotations: {
      value: 189,
      trend: 'up',
      trendValue: '+18%',
      color: 'success'
    },
    totalRevenue: {
      value: '$1.2M',
      trend: 'up',
      trendValue: '+25%',
      color: 'accent'
    }
  };

  // Mock recent quotations
  const mockRecentQuotations = [
    {
      id: "QT-2024-015",
      customerName: "ABC Manufacturing Corp",
      customerEmail: "contact@abcmfg.com",
      templateType: "Transformer Installation",
      location: "New York, NY",
      totalAmount: 15750.00,
      status: "submitted",
      createdAt: "2024-09-24T09:30:00Z"
    },
    {
      id: "QT-2024-014",
      customerName: "TechFlow Industries",
      customerEmail: "procurement@techflow.com",
      templateType: "Household Electrical",
      location: "Los Angeles, CA",
      totalAmount: 8500.00,
      status: "approved",
      createdAt: "2024-09-23T14:15:00Z"
    },
    {
      id: "QT-2024-013",
      customerName: "Green Energy Solutions",
      customerEmail: "orders@greenenergy.com",
      templateType: "Industrial Wiring",
      location: "Chicago, IL",
      totalAmount: 22300.00,
      status: "under_review",
      createdAt: "2024-09-23T11:45:00Z"
    },
    {
      id: "QT-2024-012",
      customerName: "Metro Construction Ltd",
      customerEmail: "supplies@metroconstruction.com",
      templateType: "Commercial Electrical",
      location: "Houston, TX",
      totalAmount: 18900.00,
      status: "draft",
      createdAt: "2024-09-22T16:20:00Z"
    },
    {
      id: "QT-2024-011",
      customerName: "Residential Plus Inc",
      customerEmail: "info@residentialplus.com",
      templateType: "Household Electrical",
      location: "Phoenix, AZ",
      totalAmount: 6750.00,
      status: "accepted",
      createdAt: "2024-09-22T10:10:00Z"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricsCard
              title="Total Quotations"
              value={dashboardData?.metrics?.totalQuotations?.value || 0}
              icon="FileText"
              trend={dashboardData?.metrics?.totalQuotations?.trend}
              trendValue={dashboardData?.metrics?.totalQuotations?.trendValue}
              color={dashboardData?.metrics?.totalQuotations?.color}
            />
            <MetricsCard
              title="Submitted quotation"
              value={dashboardData?.metrics?.submittedQuotations?.value || 0}
              icon="CheckCircle"
              trend={dashboardData?.metrics?.submittedQuotations?.trend}
              trendValue={dashboardData?.metrics?.submittedQuotations?.trendValue}
              color={dashboardData?.metrics?.submittedQuotations?.color}
            />
            <MetricsCard
              title="Total Revenue"
              value={dashboardData?.metrics?.totalRevenue?.value || '$0'}
              icon="DollarSign"
              trend={dashboardData?.metrics?.totalRevenue?.trend}
              trendValue={dashboardData?.metrics?.totalRevenue?.trendValue}
              color={dashboardData?.metrics?.totalRevenue?.color}
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions userRole={currentUser?.role} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Quotations Table */}
              <RecentQuotationsTable 
                quotations={dashboardData?.recentQuotations}
                userRole={currentUser?.role}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Search Quotations */}
              <QuotationSearch onSearch={handleSearch} />

              {/* Activity Log */}
              <ActivityLog activities={dashboardData?.activities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;