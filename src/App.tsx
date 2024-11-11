import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import ChecklistsPage from './pages/ChecklistsPage';
import RDC216ChecklistPage from './pages/RDC216ChecklistPage';
import HygieneChecklistPage from './pages/HygieneChecklistPage';
import ReportsPage from './pages/ReportsPage';
import AuthPage from './pages/AuthPage';
import StockPage from './pages/StockPage';
import SampleCollectionsPage from './pages/SampleCollectionsPage';
import SettingsPage from './pages/SettingsPage';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

export default function App() {
  const { session, loading, initialize } = useAuthStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.setState({ session });
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              session ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage type="login" onNavigate={() => {}} onSuccess={() => {}} />
              )
            }
          />
          <Route
            path="/register"
            element={
              session ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage type="register" onNavigate={() => {}} onSuccess={() => {}} />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              session ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage type="forgot-password" onNavigate={() => {}} onSuccess={() => {}} />
              )
            }
          />
          <Route
            path="/reset-password"
            element={
              session ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage type="reset-password" onNavigate={() => {}} onSuccess={() => {}} />
              )
            }
          />
          <Route
            path="/dashboard/*"
            element={
              session ? (
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={
                      <div className="p-8">
                        <h1 className="text-2xl font-semibold">Dashboard</h1>
                      </div>
                    } />
                    <Route path="clientes" element={<ClientsPage />} />
                    <Route path="checklists" element={<ChecklistsPage />} />
                    <Route path="checklists/rdc216" element={<RDC216ChecklistPage />} />
                    <Route path="checklists/hygiene" element={<HygieneChecklistPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="estoque" element={<StockPage />} />
                    <Route path="coletas" element={<SampleCollectionsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Routes>
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}