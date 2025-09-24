import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import RoleIndicatorBadge from '../../../components/ui/RoleIndicatorBadge';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {user?.avatar ? (
              <Image 
                src={user?.avatar} 
                alt={`${user?.name}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="User" size={32} className="text-muted-foreground" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
            <Icon name="CheckCircle" size={12} className="text-white" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">{user?.name}</h1>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              <div className="flex items-center space-x-3">
                <RoleIndicatorBadge role={user?.role} />
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={14} />
                  <span>Joined {user?.joinDate}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats for Admin */}
            {user?.role === 'Admin' && (
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{user?.stats?.totalQuotations}</div>
                  <div className="text-xs text-muted-foreground">Total Quotes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{user?.stats?.pendingApprovals}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{user?.stats?.activeUsers}</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;