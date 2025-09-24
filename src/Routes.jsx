import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MapView from './pages/map-view';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import QuotationDetails from './pages/quotation-details';
import TemplateManagement from './pages/template-management';
import UserProfile from './pages/user-profile';
import CreateQuotation from './pages/create-quotation';
import ReportsAnalytics from './pages/reports-analytics';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CreateQuotation />} />
        <Route path="/map-view" element={<MapView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quotation-details" element={<QuotationDetails />} />
        <Route path="/template-management" element={<TemplateManagement />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/create-quotation" element={<CreateQuotation />} />
        <Route path="/reports-analytics" element={<ReportsAnalytics />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;