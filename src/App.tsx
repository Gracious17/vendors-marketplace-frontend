import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout/Layout';
import DashboardLayout from './components/Layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import VendorDashboard from './pages/VendorDashboard';
import VendorListing from './pages/VendorListing';
import VendorProfile from './pages/VendorProfile';
import VendorProfileEdit from './pages/VendorProfileEdit';
import VendorProfilePreview from './pages/VendorProfilePreview';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminDashboard from './pages/AdminDashboard';
import HelpCenter from './pages/HelpCenter';

function App() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    // Initialize auth store
    initialize().catch(console.error);
  }, [initialize, initialized]);

  // Show loading state while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes - Home and Vendors are always accessible */}
          <Route index element={<Home />} />
          <Route path="vendors" element={<VendorListing />} />
          <Route path="vendor/:id" element={<VendorProfile />} />
          <Route path="help" element={<HelpCenter />} />
          
          {/* Auth Routes - Only redirect from these specific pages */}
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          
          {/* Dashboard route group - shares DashboardLayout, no public nav/footer */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/client" replace />} />
            <Route
              path="client"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="vendor"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>


          {/* Vendor Profile Management Routes */}
          <Route
            path="vendor-profile/edit"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="vendor-preview/:id"
            element={
              <VendorProfilePreview />
            }
          />

          {/* Subscription Routes */}
          <Route
            path="subscription"
            element={
              <ProtectedRoute requiredRole="vendor">
                <SubscriptionPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;