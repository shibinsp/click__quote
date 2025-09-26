import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Home', path: '/home', icon: 'Home' },
    { label: 'Map View', path: '/map-view', icon: 'Map' },
    { label: 'Quotations', path: '/quotations', icon: 'FileText' },
    { label: 'Create Quote', path: '/create-quotation', icon: 'Plus' },
    { label: 'Templates', path: '/template-management', icon: 'FileText' },
    { label: 'Reports', path: '/reports-analytics', icon: 'BarChart3' },
    { label: 'Profile', path: '/user-profile', icon: 'User' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 border-b border-border z-navigation">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-3">
          <img 
            src="/image.png" 
            alt="Click & Quote Logo" 
            className="w-12 h-12 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-primary-foreground">Click & Quote</span>
            <span className="text-xs text-primary-foreground/80 -mt-1">Electrical Solutions</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-hover ${
                isActivePath(item?.path)
                  ? 'text-accent bg-accent/20 font-semibold' :'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
          
          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 ml-4"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            <span>Logout</span>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
          onClick={toggleMobileMenu}
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
        </Button>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/20 shadow-elevation-2">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-hover ${
                  isActivePath(item?.path)
                    ? 'text-accent bg-accent/20 font-semibold' :'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
            
            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-hover text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 w-full text-left"
            >
              <Icon name="LogOut" size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;