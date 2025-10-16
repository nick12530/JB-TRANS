import React, { useState, useMemo } from 'react';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { useApp } from '../../context/AppContext';
import { useNotificationService } from '../../services/notificationService';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Lock,
  CheckCircle,
  XCircle,
  User,
  Download,
  Upload,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';

interface SystemSetting {
  id: string;
  category: 'general' | 'security' | 'notifications' | 'appearance' | 'system';
  key: string;
  label: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'select' | 'password';
  value: any;
  options?: { value: string; label: string }[];
  required: boolean;
  sensitive: boolean;
  lastModified?: string;
  modifiedBy?: string;
}

export const SettingsCardPage: React.FC = () => {
  const { user } = useApp();
  const { showSuccessNotification, showErrorNotification } = useNotificationService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('general');
  
  // Mock system settings data
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([
    // General Settings
    {
      id: '1',
      category: 'general',
      key: 'app_name',
      label: 'Application Name',
      description: 'The name displayed in the application header',
      type: 'string',
      value: 'Mwalimu Transporters',
      required: true,
      sensitive: false,
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      modifiedBy: 'admin',
    },
    {
      id: '2',
      category: 'general',
      key: 'timezone',
      label: 'Default Timezone',
      description: 'The default timezone for the application',
      type: 'select',
      value: 'Africa/Nairobi',
      options: [
        { value: 'Africa/Nairobi', label: 'Nairobi (EAT)' },
        { value: 'Africa/Dar_es_Salaam', label: 'Dar es Salaam (EAT)' },
        { value: 'Africa/Kampala', label: 'Kampala (EAT)' },
        { value: 'UTC', label: 'UTC' },
      ],
      required: true,
      sensitive: false,
    },
    {
      id: '3',
      category: 'general',
      key: 'language',
      label: 'Default Language',
      description: 'The default language for the application interface',
      type: 'select',
      value: 'en',
      options: [
        { value: 'en', label: 'English' },
        { value: 'sw', label: 'Swahili' },
        { value: 'fr', label: 'French' },
      ],
      required: true,
      sensitive: false,
    },
    
    // Security Settings
    {
      id: '4',
      category: 'security',
      key: 'password_min_length',
      label: 'Minimum Password Length',
      description: 'Minimum number of characters required for passwords',
      type: 'number',
      value: 8,
      required: true,
      sensitive: false,
    },
    {
      id: '5',
      category: 'security',
      key: 'session_timeout',
      label: 'Session Timeout (minutes)',
      description: 'How long a user session remains active before requiring re-authentication',
      type: 'number',
      value: 30,
      required: true,
      sensitive: false,
    },
    {
      id: '6',
      category: 'security',
      key: 'two_factor_required',
      label: 'Require Two-Factor Authentication',
      description: 'Force all users to enable two-factor authentication',
      type: 'boolean',
      value: false,
      required: false,
      sensitive: false,
    },
    {
      id: '7',
      category: 'security',
      key: 'api_key',
      label: 'API Secret Key',
      description: 'Secret key used for API authentication',
      type: 'password',
      value: '••••••••••••••••',
      required: true,
      sensitive: true,
    },
    
    // Notification Settings
    {
      id: '8',
      category: 'notifications',
      key: 'email_notifications',
      label: 'Email Notifications',
      description: 'Enable email notifications for system events',
      type: 'boolean',
      value: true,
      required: false,
      sensitive: false,
    },
    {
      id: '9',
      category: 'notifications',
      key: 'push_notifications',
      label: 'Push Notifications',
      description: 'Enable push notifications for mobile devices',
      type: 'boolean',
      value: true,
      required: false,
      sensitive: false,
    },
    {
      id: '10',
      category: 'notifications',
      key: 'notification_sound',
      label: 'Notification Sound',
      description: 'Play sound when notifications are received',
      type: 'boolean',
      value: false,
      required: false,
      sensitive: false,
    },
    
    // Appearance Settings
    {
      id: '11',
      category: 'appearance',
      key: 'theme',
      label: 'Default Theme',
      description: 'The default theme for new users',
      type: 'select',
      value: 'light',
      options: [
        { value: 'light', label: 'Light Theme' },
        { value: 'dark', label: 'Dark Theme' },
        { value: 'auto', label: 'Auto (System)' },
      ],
      required: true,
      sensitive: false,
    },
    {
      id: '12',
      category: 'appearance',
      key: 'primary_color',
      label: 'Primary Color',
      description: 'The primary color used throughout the application',
      type: 'select',
      value: 'green',
      options: [
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
        { value: 'purple', label: 'Purple' },
        { value: 'red', label: 'Red' },
      ],
      required: true,
      sensitive: false,
    },
    
    // System Settings
    {
      id: '13',
      category: 'system',
      key: 'maintenance_mode',
      label: 'Maintenance Mode',
      description: 'Enable maintenance mode to restrict access to the system',
      type: 'boolean',
      value: false,
      required: false,
      sensitive: false,
    },
    {
      id: '14',
      category: 'system',
      key: 'auto_backup',
      label: 'Automatic Backup',
      description: 'Enable automatic daily backups of system data',
      type: 'boolean',
      value: true,
      required: false,
      sensitive: false,
    },
    {
      id: '15',
      category: 'system',
      key: 'log_level',
      label: 'Log Level',
      description: 'The level of detail in system logs',
      type: 'select',
      value: 'info',
      options: [
        { value: 'debug', label: 'Debug' },
        { value: 'info', label: 'Info' },
        { value: 'warn', label: 'Warning' },
        { value: 'error', label: 'Error' },
      ],
      required: true,
      sensitive: false,
    },
  ]);

  const [formData, setFormData] = useState<Partial<SystemSetting>>({});

  const categories = [
    { key: 'general', label: 'General', icon: Settings, color: 'blue', description: 'Basic application settings' },
    { key: 'security', label: 'Security', icon: Shield, color: 'red', description: 'Security and privacy settings' },
    { key: 'notifications', label: 'Notifications', icon: Bell, color: 'emerald', description: 'Notification preferences' },
    { key: 'appearance', label: 'Appearance', icon: Palette, color: 'purple', description: 'Theme and visual settings' },
    { key: 'system', label: 'System', icon: Database, color: 'lime', description: 'System configuration' },
  ];

  const filteredSettings = useMemo(() => {
    return systemSettings.filter(setting => setting.category === activeCategory);
  }, [systemSettings, activeCategory]);

  const handleOpenModal = (setting?: SystemSetting) => {
    if (setting) {
      setEditingSetting(setting);
      setFormData(setting);
    } else {
      setEditingSetting(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSetting(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSetting) {
      setSystemSettings(
        systemSettings.map((setting) =>
          setting.id === editingSetting.id 
            ? { 
                ...setting, 
                value: formData.value,
                lastModified: new Date().toISOString(),
                modifiedBy: user?.name || 'admin'
              } 
            : setting
        )
      );
      showSuccessNotification('Success', 'Setting updated successfully!');
    }

    handleCloseModal();
  };

  const handleResetToDefault = (setting: SystemSetting) => {
    if (window.confirm(`Reset "${setting.label}" to default value?`)) {
      // In a real app, you would reset to the actual default value
      showSuccessNotification('Success', `"${setting.label}" reset to default value`);
    }
  };

  const handleBulkSave = () => {
    showSuccessNotification('Success', 'All settings saved successfully!');
  };

  const handleExportSettings = () => {
    const settingsData = JSON.stringify(systemSettings, null, 2);
    const blob = new Blob([settingsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    showSuccessNotification('Success', 'Settings exported successfully!');
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string);
            setSystemSettings(importedSettings);
            showSuccessNotification('Success', 'Settings imported successfully!');
          } catch (error) {
            showErrorNotification('Error', 'Invalid settings file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const renderSettingValue = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            {setting.value ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {setting.value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
      case 'password':
        return (
          <div className="flex items-center">
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {setting.value}
            </span>
          </div>
        );
      case 'select':
        const option = setting.options?.find(opt => opt.value === setting.value);
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {option?.label || setting.value}
          </span>
        );
      default:
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {setting.value}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-purple">Settings & Configuration</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your application preferences and system configuration
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span>{filteredSettings.length} settings in {categories.find(c => c.key === activeCategory)?.label}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleImportSettings}
            className="btn-blue flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button 
            onClick={handleExportSettings}
            className="btn-emerald flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={handleBulkSave}
            className="btn-purple flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save All
          </button>
        </div>
      </div>

      {/* Enhanced Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.key;
          const settingsCount = systemSettings.filter(s => s.category === category.key).length;
          
          return (
            <Card 
              key={category.key}
              variant={isActive ? category.color as any : 'default'}
              className={`p-4 cursor-pointer transition-all duration-200 hover-lift ${
                isActive ? 'ring-2 ring-opacity-50' : ''
              }`}
              onClick={() => setActiveCategory(category.key)}
            >
              <div className="text-center">
                <div className={`p-3 rounded-xl mx-auto mb-3 ${
                  isActive 
                    ? `gradient-${category.color}` 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Icon className={`h-6 w-6 mx-auto ${
                    isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <h3 className={`font-semibold mb-1 ${
                  isActive 
                    ? `text-gradient-${category.color}` 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {category.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {category.description}
                </p>
                <div className={`text-sm font-medium ${
                  isActive 
                    ? `text-gradient-${category.color}` 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {settingsCount} settings
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSettings.map((setting) => (
          <Card key={setting.id} variant="glass" className="p-6 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {setting.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    {setting.required && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded-full flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Required
                      </span>
                    )}
                    {setting.sensitive && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Sensitive
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {setting.description}
                </p>
              </div>
            </div>

            {/* Setting Value Display */}
            <div className="mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {renderSettingValue(setting)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(setting)}
                    className="btn-blue text-xs flex items-center gap-1"
                  >
                    <Settings className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleResetToDefault(setting)}
                    className="btn-lime text-xs flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Setting Metadata */}
            {setting.lastModified && (
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Modified {new Date(setting.lastModified).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>by {setting.modifiedBy}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Enhanced Edit Setting Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSetting ? `Edit ${editingSetting.label}` : 'Add New Setting'}
        size="lg"
        type="default"
        icon={<Settings className="h-6 w-6" />}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {editingSetting && (
            <>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Setting Information
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {editingSetting.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Value
                </label>
                {editingSetting.type === 'boolean' ? (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.value || false}
                      onChange={(e) => setFormData({ ...formData, value: e.target.checked })}
                      className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2">
                      {formData.value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formData.value ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                ) : editingSetting.type === 'select' ? (
                  <FormSelect
                    label="Value"
                    value={formData.value || ''}
                    onChange={(value) => setFormData({ ...formData, value })}
                    options={editingSetting.options || []}
                  />
                ) : editingSetting.type === 'password' ? (
                  <div className="relative">
                    <FormInput
                      label="Password"
                      type="password"
                      value={formData.value || ''}
                      onChange={(value) => setFormData({ ...formData, value })}
                      placeholder="Enter new password"
                    />
                  </div>
                ) : (
                  <FormInput
                    label="Value"
                    type={editingSetting.type === 'number' ? 'number' : 'text'}
                    value={formData.value || ''}
                    onChange={(value) => setFormData({ ...formData, value })}
                  />
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-blue"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-emerald"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
