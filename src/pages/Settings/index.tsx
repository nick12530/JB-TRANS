import React, { useState, useRef } from 'react';
import { Card } from '../../components/Card';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { useApp } from '../../context/AppContext';
import { useNotificationService } from '../../services/notificationService';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download, 
  Upload, 
  Save, 
  Camera,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Users,
  HardDrive,
  RefreshCw,
  FileText,
  Calendar,
  Mail,
  Phone,
  Clock,
  Zap,
  Activity,
  BarChart3,
  Cloud,
  Truck,
  MessageSquare,
  Volume2,
  VolumeX,
  Sun,
  Moon
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'client';
  department: string;
  avatar?: string;
  bio: string;
  location: string;
  joinDate: string;
  lastLogin: string;
  isActive: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
  loginAttempts: number;
  trustedDevices: number;
  sessionTimeout: number;
}

interface SystemSettings {
  maintenanceMode: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: number;
  maxFileSize: number;
  systemLogs: boolean;
}

export const SettingsPage: React.FC = () => {
  const { user, isDark, setIsDark, packages, pickupStations } = useApp();
  const { showSuccessNotification, showErrorNotification } = useNotificationService();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance' | 'data' | 'system'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Enhanced profile data
  const [profileData, setProfileData] = useState<UserProfile>({
    id: user?.id || '1',
    name: user?.name || '',
    email: user?.email || '',
    phone: '+254 700 000 000',
    role: (user?.role as 'admin' | 'staff' | 'client') || 'staff',
    department: 'Transport Operations',
    avatar: '',
    bio: 'Transport operations specialist with focus on miraa logistics and delivery management.',
    location: 'Nairobi, Kenya',
    joinDate: '2024-01-15',
    lastLogin: new Date().toISOString(),
    isActive: true,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordLastChanged: '2024-01-15',
    loginAttempts: 0,
    trustedDevices: 2,
    sessionTimeout: 30,
  });

  // System settings (admin only)
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    maxFileSize: 10,
    systemLogs: true,
  });

  // Enhanced notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    deliveryAlerts: true,
    discrepancyAlerts: true,
    weeklyReports: false,
    systemAlerts: user?.role === 'admin',
    maintenanceAlerts: user?.role === 'admin',
    securityAlerts: true,
    marketingEmails: false,
    soundEffects: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  });

  // Enhanced appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: isDark ? 'dark' : 'light',
    language: 'en',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'KES',
    dashboardLayout: 'grid',
    sidebarCollapsed: false,
    animations: true,
    soundEffects: false,
  });

  // Data management state
  const dataStats = {
    totalRecords: packages.length,
    totalSize: '2.4 MB',
    lastBackup: '2024-01-20 14:30',
    nextBackup: '2024-01-21 14:30',
  };

  const tabs = user?.role === 'admin' 
    ? [
        { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal information', adminOnly: false },
        { id: 'security', label: 'Security', icon: Shield, description: 'Password and security settings', adminOnly: false },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure notification preferences', adminOnly: false },
        { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize your interface', adminOnly: false },
        { id: 'data', label: 'Data Management', icon: Database, description: 'Export, import, and backup data', adminOnly: true },
        { id: 'system', label: 'System', icon: SettingsIcon, description: 'System administration', adminOnly: true },
      ]
    : [
        { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal information', adminOnly: false },
        { id: 'security', label: 'Security', icon: Shield, description: 'Password and security settings', adminOnly: false },
        { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize your interface', adminOnly: false },
      ];

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showErrorNotification('File Too Large', 'Please select an image smaller than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, avatar: e.target?.result as string });
        showSuccessNotification('Avatar Updated', 'Your profile picture has been updated successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in context
      // setUser({ ...user, ...profileData });
      
      showSuccessNotification('Profile Updated', 'Your profile information has been saved successfully.');
    } catch (error) {
      showErrorNotification('Update Failed', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showErrorNotification('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8) {
      showErrorNotification('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecuritySettings({
        ...securitySettings,
        passwordLastChanged: new Date().toISOString(),
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      showSuccessNotification('Password Changed', 'Your password has been updated successfully.');
    } catch (error) {
      showErrorNotification('Password Change Failed', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const exportData = {
        profile: profileData,
        settings: {
          notifications: notificationSettings,
          appearance: appearanceSettings,
        },
        data: {
          packages,
          pickupStations,
        },
        exportDate: new Date().toISOString(),
        version: '1.0',
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mwalimu-transporters-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccessNotification('Data Exported', 'Your data has been exported successfully.');
    } catch (error) {
      showErrorNotification('Export Failed', 'Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemMaintenance = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSystemSettings({
        ...systemSettings,
        maintenanceMode: !systemSettings.maintenanceMode,
      });
      
      showSuccessNotification(systemSettings.maintenanceMode ? 'Maintenance Mode Disabled' : 'Maintenance Mode Enabled', systemSettings.maintenanceMode ? 'System is now accessible to users.' : 'System is now in maintenance mode. Users will see a maintenance page.');
    } catch (error) {
      showErrorNotification('Operation Failed', 'Failed to toggle maintenance mode.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="page-header -mx-6 px-6 py-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title text-gradient-primary">Settings</h1>
            <p className="page-subtitle">
              Manage your account preferences, security settings, and system configurations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${profileData.isActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {profileData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last login: {new Date(profileData.lastLogin).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Enhanced Sidebar */}
        <div className="lg:w-80">
          <Card className="card-enhanced p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Settings Menu</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure your account and system preferences
              </p>
            </div>
            
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-start space-x-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 hover-lift ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-bright-green to-green-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium block">{tab.label}</span>
                    <span className={`text-xs mt-1 ${
                      activeTab === tab.id ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {tab.description}
                    </span>
                  </div>
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Records</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{dataStats.totalRecords}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Data Size</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{dataStats.totalSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(dataStats.lastBackup).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1">
          <Card className="card-enhanced p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-6 w-6 text-bright-green" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h2>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-bright-green to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        profileData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button
                      onClick={handleAvatarUpload}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{profileData.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {profileData.role === 'admin' ? 'Administrator' : 'User'} • {profileData.department}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    type="text"
                    value={profileData.name}
                    onChange={(value) => setProfileData({ ...profileData, name: value as string })}
                    required
                  />
                  
                  <FormInput
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(value) => setProfileData({ ...profileData, email: value as string })}
                    required
                  />
                  
                  <FormInput
                    label="Phone Number"
                    type="tel"
                    value={profileData.phone}
                    onChange={(value) => setProfileData({ ...profileData, phone: value as string })}
                  />
                  
                  <FormInput
                    label="Department"
                    type="text"
                    value={profileData.department}
                    onChange={(value) => setProfileData({ ...profileData, department: value as string })}
                  />
                  
                  <FormInput
                    label="Location"
                    type="text"
                    value={profileData.location}
                    onChange={(value) => setProfileData({ ...profileData, location: value as string })}
                  />
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Account Status</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Active • Joined {new Date(profileData.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-semibold text-bright-green">
                      {profileData.role === 'admin' ? 'Administrator' : 'User'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-bright-green" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Security Settings</h2>
                </div>

                {/* Password Change */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Current Password"
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(value) => setCurrentPassword(value as string)}
                      required
                    />
                    <div className="flex items-end">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormInput
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(value) => setNewPassword(value as string)}
                      required
                    />
                    <FormInput
                      label="Confirm New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(value) => setConfirmPassword(value as string)}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                      <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                  </div>
                </div>

                {/* Security Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="btn-outline w-full">
                      {securitySettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Activity className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Login Activity</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Last Password Change</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Trusted Devices</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{securitySettings.trustedDevices}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Session Timeout</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{securitySettings.sessionTimeout} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notification Preferences</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Customize how and when you receive notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${notificationSettings.emailNotifications ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {notificationSettings.emailNotifications ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Notification Channels */}
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span>Notification Channels</span>
                    </h3>
                  </div>

                  {/* Email Notifications */}
                  <div className="group p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Email Notifications</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Primary notification method</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 dark:peer-focus:ring-blue-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="group p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">SMS Notifications</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via SMS</p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Requires phone number verification</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/20 dark:peer-focus:ring-green-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="group p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Bell className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Push Notifications</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Browser and mobile push notifications</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Real-time alerts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 dark:peer-focus:ring-purple-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span>Notification Types</span>
                    </h3>
                  </div>

                  {/* Delivery Alerts */}
                  <div className="group p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Delivery Alerts</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when deliveries are completed</p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Critical business updates</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.deliveryAlerts}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, deliveryAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20 dark:peer-focus:ring-orange-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Discrepancy Alerts */}
                  <div className="group p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Discrepancy Alerts</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about quantity discrepancies</p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">High priority alerts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.discrepancyAlerts}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, discrepancyAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 dark:peer-focus:ring-red-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Weekly Reports */}
                  <div className="group p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Reports</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive weekly performance summaries</p>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Business insights</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 dark:peer-focus:ring-indigo-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                      <SettingsIcon className="h-5 w-5 text-gray-600" />
                      <span>Advanced Settings</span>
                    </h3>
                  </div>

                  {/* Quiet Hours */}
                  <div className="group p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quiet Hours</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Disable notifications during specific hours</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Respect your sleep schedule</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.quietHours.enabled}
                          onChange={(e) => setNotificationSettings({ 
                            ...notificationSettings, 
                            quietHours: { ...notificationSettings.quietHours, enabled: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500/20 dark:peer-focus:ring-gray-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-500"></div>
                      </label>
                    </div>
                    {notificationSettings.quietHours.enabled && (
                      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="Start Time"
                            type="time"
                            value={notificationSettings.quietHours.start}
                            onChange={(value) => setNotificationSettings({ 
                              ...notificationSettings, 
                              quietHours: { ...notificationSettings.quietHours, start: value as string }
                            })}
                            leftIcon={<Sun className="h-4 w-4" />}
                          />
                          <FormInput
                            label="End Time"
                            type="time"
                            value={notificationSettings.quietHours.end}
                            onChange={(value) => setNotificationSettings({ 
                              ...notificationSettings, 
                              quietHours: { ...notificationSettings.quietHours, end: value as string }
                            })}
                            leftIcon={<Moon className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sound Settings */}
                  <div className="group p-6 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border border-pink-200 dark:border-pink-800 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          {notificationSettings.soundEffects ? <Volume2 className="h-6 w-6 text-white" /> : <VolumeX className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Sound Effects</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Play sounds for notifications</p>
                          <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">Audio feedback</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.soundEffects}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, soundEffects: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500/20 dark:peer-focus:ring-pink-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button className="btn-outline flex items-center justify-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset to Defaults</span>
                  </button>
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Notification Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Palette className="h-6 w-6 text-bright-green" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Appearance Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Theme"
                    value={appearanceSettings.theme}
                    onChange={(value) => {
                      setAppearanceSettings({ ...appearanceSettings, theme: value as string });
                      if (value === 'dark' && !isDark) {
                        setIsDark(true);
                      } else if (value === 'light' && isDark) {
                        setIsDark(false);
                      }
                    }}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                    ]}
                  />
                  
                  <FormSelect
                    label="Language"
                    value={appearanceSettings.language}
                    onChange={(value) => setAppearanceSettings({ ...appearanceSettings, language: value as string })}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'sw', label: 'Kiswahili' },
                    ]}
                  />
                  
                  <FormSelect
                    label="Timezone"
                    value={appearanceSettings.timezone}
                    onChange={(value) => setAppearanceSettings({ ...appearanceSettings, timezone: value as string })}
                    options={[
                      { value: 'Africa/Nairobi', label: 'Nairobi (EAT)' },
                      { value: 'Africa/Dar_es_Salaam', label: 'Dar es Salaam (EAT)' },
                      { value: 'UTC', label: 'UTC' },
                    ]}
                  />
                  
                  <FormSelect
                    label="Date Format"
                    value={appearanceSettings.dateFormat}
                    onChange={(value) => setAppearanceSettings({ ...appearanceSettings, dateFormat: value as string })}
                    options={[
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                    ]}
                  />
                  
                  <FormSelect
                    label="Time Format"
                    value={appearanceSettings.timeFormat}
                    onChange={(value) => setAppearanceSettings({ ...appearanceSettings, timeFormat: value as string })}
                    options={[
                      { value: '12h', label: '12 Hour (AM/PM)' },
                      { value: '24h', label: '24 Hour' },
                    ]}
                  />
                  
                  <FormSelect
                    label="Currency"
                    value={appearanceSettings.currency}
                    onChange={(value) => setAppearanceSettings({ ...appearanceSettings, currency: value as string })}
                    options={[
                      { value: 'KES', label: 'Kenyan Shilling (KES)' },
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                    ]}
                  />
                </div>

                {/* Additional Appearance Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Animations</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable smooth transitions and animations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearanceSettings.animations}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, animations: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Sound Effects</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Play sounds for notifications and actions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearanceSettings.soundEffects}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, soundEffects: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Appearance Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="h-6 w-6 text-bright-green" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Data Management</h2>
                </div>

                {/* Data Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Total Records</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{dataStats.totalRecords}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Source & Transport records</p>
                  </div>

                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <HardDrive className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Data Size</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{dataStats.totalSize}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total storage used</p>
                  </div>

                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Last Backup</h3>
                    </div>
                    <p className="text-lg font-bold text-purple-600">
                      {new Date(dataStats.lastBackup).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatic backup</p>
                  </div>
                </div>

                {/* Export/Import Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Download className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Export Data</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Download all your data including records, reports, and settings as a JSON file.
                    </p>
                    <button
                      onClick={handleExportData}
                      disabled={isLoading}
                      className="btn-secondary w-full flex items-center justify-center space-x-2"
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      <span>{isLoading ? 'Exporting...' : 'Export Data'}</span>
                    </button>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Upload className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Import Data</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Import data from CSV or Excel files. Supported formats: CSV, XLSX, JSON.
                    </p>
                    <button className="btn-primary w-full flex items-center justify-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Import Data</span>
                    </button>
                  </Card>
                </div>

                {/* Backup Settings */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Backup Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      label="Backup Frequency"
                      value={systemSettings.backupFrequency}
                      onChange={(value) => setSystemSettings({ ...systemSettings, backupFrequency: value as any })}
                      options={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                      ]}
                    />
                    <FormInput
                      label="Data Retention (days)"
                      type="number"
                      value={systemSettings.dataRetention.toString()}
                      onChange={(value) => setSystemSettings({ ...systemSettings, dataRetention: parseInt(value as string) })}
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800 dark:text-yellow-200">Data Security</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your data is encrypted and stored securely. Only you and authorized administrators can access your information. 
                    All exports are encrypted and require authentication to open.
                  </p>
                </div>
              </div>
            )}

            {/* System Tab (Admin Only) */}
            {activeTab === 'system' && user?.role === 'admin' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <SettingsIcon className="h-6 w-6 text-bright-green" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Administration</h2>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">System Status</h3>
                    </div>
                    <p className="text-lg font-bold text-green-600">Operational</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">All systems running normally</p>
                  </div>

                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Active Users</h3>
                    </div>
                    <p className="text-lg font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Currently online</p>
                  </div>
                </div>

                {/* System Controls */}
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Maintenance Mode</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {systemSettings.maintenanceMode 
                              ? 'System is in maintenance mode' 
                              : 'Enable maintenance mode for system updates'
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleSystemMaintenance}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          systemSettings.maintenanceMode
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {isLoading ? 'Processing...' : systemSettings.maintenanceMode ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Cloud className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Auto Backup</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Automatic daily backups to cloud storage
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.autoBackup}
                          onChange={(e) => setSystemSettings({ ...systemSettings, autoBackup: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">System Logs</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enable detailed system activity logging
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.systemLogs}
                          onChange={(e) => setSystemSettings({ ...systemSettings, systemLogs: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bright-green/20 dark:peer-focus:ring-bright-green/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-bright-green"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Version</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Update</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">2024-01-20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Database Size</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">2.4 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};