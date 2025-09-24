import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyBranding from './components/CompanyBranding';
import LoginForm from './components/LoginForm';
import SecurityIndicators from './components/SecurityIndicators';
import DemoCredentials from './components/DemoCredentials';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Login Card */}
        <div className="bg-card rounded-xl shadow-elevation-2 border border-border p-8">
          {/* Company Branding */}
          <CompanyBranding />

          {/* Login Form */}
          <LoginForm />

          {/* Demo Credentials */}
          <DemoCredentials />

          {/* Security Indicators */}
          <SecurityIndicators />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date()?.getFullYear()} Click & Quote. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;