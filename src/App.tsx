import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loader } from './components/Loader';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { PackingPage } from './pages/Packing';
import { DropOffPointsPage } from './pages/DropOffPoints';
import { ClientsPage } from './pages/Clients';
import { SettingsPage } from './pages/Settings';
import { UsersPage } from './pages/Users';
import { StationsPage } from './pages/Stations';
import { PackagesPage } from './pages/Packages';
import { ReportsPage } from './pages/Reports';
import { AreaCodesPage } from './pages/AreaCodes';
import { RegisterPackagePage } from './pages/RegisterPackage';
import { DeliveriesPage } from './pages/Deliveries';
import { RegistrationsPage } from './pages/Registrations';
import { DestinationsPage } from './pages/Destinations';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization (reduced from 2000ms to 500ms for faster startup)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader message="Initializing Mwalimu Transporters..." />;
  }

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/packing"
            element={
              <ProtectedRoute>
                <Layout>
                  <PackingPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dropoff-points"
            element={
              <ProtectedRoute>
                <Layout>
                  <DropOffPointsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Layout>
                  <ClientsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stations"
            element={
              <ProtectedRoute>
                <Layout>
                  <StationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/packages"
            element={
              <ProtectedRoute>
                <Layout>
                  <PackagesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/area-codes"
            element={
              <ProtectedRoute>
                <Layout>
                  <AreaCodesPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/register-package"
            element={
              <ProtectedRoute>
                <Layout>
                  <RegisterPackagePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deliveries"
            element={
              <ProtectedRoute>
                <Layout>
                  <DeliveriesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrations"
            element={
              <ProtectedRoute>
                <Layout>
                  <RegistrationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/destinations"
            element={
              <ProtectedRoute>
                <Layout>
                  <DestinationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Track route removed per requirements */}
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;