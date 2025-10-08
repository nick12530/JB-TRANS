import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { SourceRecordsPage } from './pages/SourceRecords';
import { TransportLogPage } from './pages/TransportLog';
import { ProfitReportsPage } from './pages/ProfitReports';
import { DestinationRecordsPage } from './pages/DestinationRecords';
import { AreaPerformancePage } from './pages/AreaPerformance';
import { StaffManagementPage } from './pages/Staff';
import { SettingsPage } from './pages/Settings';
import { BuyersPage } from './pages/Buyers';
import { AnalyticsDashboardPage } from './pages/Analytics';
import { SystemMonitoringPage } from './pages/SystemMonitoring';
import { DiscrepancyReportsPage } from './pages/DiscrepancyReports';
import { AdminControlsPage } from './pages/AdminControls';
import { AuditLogsPage } from './pages/AuditLogs';
import { StaffControlPage } from './pages/StaffControl';
import { SettingsCardPage } from './pages/SettingsCard';

function App() {
  return (
    <AppProvider>
      <NotificationsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout title="Dashboard" subtitle="Overview of your transport operations">
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/source-records"
            element={
              <ProtectedRoute>
                <Layout title="Source Records" subtitle="Manage pickup records and goods received">
                  <SourceRecordsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/transport-log"
            element={
              <ProtectedRoute>
                <Layout title="Transport Log" subtitle="Track vehicles, drivers, and deliveries">
                  <TransportLogPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/destination-records"
            element={
              <ProtectedRoute>
                <Layout title="Destination Records" subtitle="Record deliveries and buyer information">
                  <DestinationRecordsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profit-reports"
            element={
              <ProtectedRoute>
                <Layout title="Profit Reports" subtitle="Financial analysis and performance metrics">
                  <ProfitReportsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/area-performance"
            element={
              <ProtectedRoute>
                <Layout title="Area Performance" subtitle="Pickup point analytics and statistics">
                  <AreaPerformancePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/buyers"
            element={
              <ProtectedRoute>
                <Layout title="Buyers Management" subtitle="Customer database and relationship management">
                  <BuyersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <Layout title="Staff Management" subtitle="Driver and employee administration">
                  <StaffManagementPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout title="Settings" subtitle="Configure your account and preferences">
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Admin-only routes */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout title="Analytics Dashboard" subtitle="Business intelligence and insights">
                  <AnalyticsDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/monitoring"
            element={
              <ProtectedRoute>
                <Layout title="System Monitoring" subtitle="Real-time system health and alerts">
                  <SystemMonitoringPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/discrepancies"
            element={
              <ProtectedRoute>
                <Layout title="Discrepancy Reports" subtitle="Track delivery issues and problems">
                  <DiscrepancyReportsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin-controls"
            element={
              <ProtectedRoute>
                <Layout title="Admin Controls" subtitle="System administration and configuration">
                  <AdminControlsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <Layout title="Audit Logs" subtitle="Activity tracking and compliance monitoring">
                  <AuditLogsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/staff-control"
            element={
              <ProtectedRoute>
                <Layout title="Staff Control" subtitle="Staff management and access control system">
                  <StaffControlPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings-card"
            element={
              <ProtectedRoute>
                <Layout title="Settings Card" subtitle="System configuration and application settings">
                  <SettingsCardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      </NotificationsProvider>
    </AppProvider>
  );
}

export default App;