import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import Customers from './pages/admin/Customers';
import Products from './pages/admin/Products';
import Sales from './pages/admin/Sales';
import Expenses from './pages/admin/Expenses';
import Employees from './pages/admin/Employees';
import BusinessProfile from './pages/admin/BusinessProfile';

import StaffDashboard from './pages/staff/Dashboard';
import StaffCustomers from './pages/staff/Customers';
import StaffProducts from './pages/staff/Products';
import StaffSales from './pages/staff/Sales';

import CustomerLogin from './pages/customer/Login';
import CustomerDashboard from './pages/customer/Dashboard';
import Support from './pages/Support';
import SplashScreen from './components/SplashScreen/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <BusinessProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Sales />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Expenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Employees />
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff/dashboard"
                element={
                  <ProtectedRoute requiredRole="STAFF">
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/customers"
                element={
                  <ProtectedRoute requiredRole="STAFF">
                    <StaffCustomers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/products"
                element={
                  <ProtectedRoute requiredRole="STAFF">
                    <StaffProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/sales"
                element={
                  <ProtectedRoute requiredRole="STAFF">
                    <StaffSales />
                  </ProtectedRoute>
                }
              />

              {/* Customer Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* General Routes */}
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
