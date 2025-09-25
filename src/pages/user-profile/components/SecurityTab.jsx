import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SecurityTab = ({ user }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Mock active sessions data
  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, NY",
      ipAddress: "192.168.1.100",
      lastActive: "2025-09-24T13:30:00Z",
      isCurrent: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, NY", 
      ipAddress: "192.168.1.101",
      lastActive: "2025-09-24T09:15:00Z",
      isCurrent: false
    },
    {
      id: 3,
      device: "Chrome on Android",
      location: "New York, NY",
      ipAddress: "192.168.1.102", 
      lastActive: "2025-09-23T18:45:00Z",
      isCurrent: false
    }
  ];

  const handlePasswordInputChange = (e) => {
    const { name, value } = e?.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (passwordErrors?.[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm?.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm?.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm?.newPassword?.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!passwordForm?.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePasswordChange = async () => {
    const errors = validatePasswordForm();
    
    if (Object.keys(errors)?.length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setIsChangingPassword(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
      
      alert('Password changed successfully!');
    } catch (error) {
      setPasswordErrors({ general: 'Failed to change password. Please try again.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Session ${sessionId} logged out successfully`);
    } catch (error) {
      alert('Failed to logout session');
    }
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Active now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date?.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password?.length >= 8) strength += 1;
    if (/[A-Z]/?.test(password)) strength += 1;
    if (/[a-z]/?.test(password)) strength += 1;
    if (/[0-9]/?.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/?.test(password)) strength += 1;
    
    const levels = [
      { label: 'Very Weak', color: 'bg-error' },
      { label: 'Weak', color: 'bg-error' },
      { label: 'Fair', color: 'bg-warning' },
      { label: 'Good', color: 'bg-accent' },
      { label: 'Strong', color: 'bg-success' }
    ];
    
    return { strength, ...levels?.[strength] };
  };

  const passwordStrength = getPasswordStrength(passwordForm?.newPassword);

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Lock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
        </div>
        
        {passwordErrors?.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{passwordErrors?.general}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordForm?.currentPassword}
            onChange={handlePasswordInputChange}
            error={passwordErrors?.currentPassword}
            required
          />
          
          <div>
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm?.newPassword}
              onChange={handlePasswordInputChange}
              error={passwordErrors?.newPassword}
              description="Must be at least 8 characters with uppercase, lowercase, number, and special character"
              required
            />
            
            {/* Password Strength Indicator */}
            {passwordForm?.newPassword && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-muted-foreground">Strength:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength?.strength <= 2 ? 'text-error' :
                    passwordStrength?.strength === 3 ? 'text-warning' : 'text-success'
                  }`}>
                    {passwordStrength?.label}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength?.color}`}
                    style={{ width: `${(passwordStrength?.strength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordForm?.confirmPassword}
            onChange={handlePasswordInputChange}
            error={passwordErrors?.confirmPassword}
            required
          />
          
          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handlePasswordChange}
              loading={isChangingPassword}
              iconName="Save"
              iconPosition="left"
              disabled={!passwordForm?.currentPassword || !passwordForm?.newPassword || !passwordForm?.confirmPassword}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Monitor" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
          </div>
          <span className="text-sm text-muted-foreground">{activeSessions?.length} active</span>
        </div>
        
        <div className="space-y-3">
          {activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon 
                    name={session?.device?.includes('iPhone') || session?.device?.includes('Android') ? 'Smartphone' : 'Monitor'} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{session?.device}</h4>
                    {session?.isCurrent && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span>{session?.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Globe" size={12} />
                      <span>{session?.ipAddress}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{formatLastActive(session?.lastActive)}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {!session?.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogoutSession(session?.id)}
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Logout
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Security Notice</p>
              <p className="text-sm text-muted-foreground">
                If you notice any unfamiliar sessions, logout immediately and change your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;