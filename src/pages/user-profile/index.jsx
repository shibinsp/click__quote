import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoTab from './components/PersonalInfoTab';
import RolePermissionsTab from './components/RolePermissionsTab';
import SecurityTab from './components/SecurityTab';
import ActivityHistoryTab from './components/ActivityHistoryTab';
import NotificationPreferencesTab from './components/NotificationPreferencesTab';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Michael Rodriguez",
    email: "michael.rodriguez@clickquote.com",
    phone: "+1 (555) 123-4567",
    company: "Click & Quote Solutions",
    department: "Sales & Operations",
    jobTitle: "Senior Sales Manager",
    address: "123 Business Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    joinDate: "March 2023",
    stats: {
      totalQuotations: 156,
      pendingApprovals: 8,
      activeUsers: 24
    }
  };

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUser);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async (formData) => {
    try {
      // Mock API call to save profile data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      
      alert('Profile updated successfully!');
    } catch (error) {
      throw new Error('Failed to save profile');
    }
  };

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'User',
      component: PersonalInfoTab
    },
    {
      id: 'role',
      label: 'Role & Permissions',
      icon: 'Shield',
      component: RolePermissionsTab
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Lock',
      component: SecurityTab
    },
    {
      id: 'activity',
      label: 'Activity History',
      icon: 'Clock',
      component: ActivityHistoryTab
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      component: NotificationPreferencesTab
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground">Loading profile...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center py-12">
              <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Profile</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't load your profile information. Please try again.
              </p>
              <Button
                variant="default"
                onClick={() => window.location?.reload()}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ActiveTabComponent = tabs?.find(tab => tab?.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Back Navigation */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-1 hover:text-foreground transition-hover"
            >
              <Icon name="ArrowLeft" size={14} />
              <span>Back to Dashboard</span>
            </button>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">User Profile</span>
          </div>

          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Tab Navigation */}
          <div className="bg-card rounded-lg border border-border mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Profile tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-hover ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {ActiveTabComponent && (
                <ActiveTabComponent 
                  user={user} 
                  onSave={handleSaveProfile}
                />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                iconName="LayoutDashboard"
                iconPosition="left"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/create-quotation')}
                iconName="Plus"
                iconPosition="left"
              >
                Create Quotation
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/template-management')}
                iconName="FileText"
                iconPosition="left"
              >
                Manage Templates
              </Button>
              {user?.role === 'Admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/map-view')}
                  iconName="Map"
                  iconPosition="left"
                >
                  View Map
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;