
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { UserRole, User } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ToastProvider from './components/ToastProvider';
import LoadingFallback from './components/LoadingFallback';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load view components for code splitting
const DashboardView = lazy(() => import('./views/DashboardView'));
const AppointmentView = lazy(() => import('./views/AppointmentView'));
const MedicalRecordView = lazy(() => import('./views/MedicalRecordView'));
const AuditLogView = lazy(() => import('./views/AuditLogView'));
const ImageEditView = lazy(() => import('./views/ImageEditView'));
const PharmacyView = lazy(() => import('./views/PharmacyView'));
const PaymentInsuranceView = lazy(() => import('./views/PaymentInsuranceView'));
const PatientPortalView = lazy(() => import('./views/PatientPortalView'));
const UserManagementView = lazy(() => import('./views/UserManagementView'));
const AuthView = lazy(() => import('./views/AuthView'));
const LandingView = lazy(() => import('./views/LandingView'));
const ProfileView = lazy(() => import('./views/ProfileView'));

const AppContent: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Auto-navigate based on user role
  useEffect(() => {
    if (user?.role === UserRole.PATIENT) {
      setActiveTab('patient-portal');
    } else if (user) {
      setActiveTab('dashboard');
    }
  }, [user?.role]);

  const handleLogin = (userData: User, token?: string) => {
    login(userData, token);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
  };

  // Show landing page first
  if (showLanding) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LandingView onNavigateToLogin={() => setShowLanding(false)} />
      </Suspense>
    );
  }

  // Then show login page
  if (!isAuthenticated || !user) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AuthView onLogin={handleLogin} onBackToLanding={() => setShowLanding(true)} />
      </Suspense>
    );
  }

  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <DashboardView />;
            case 'appointments': return <AppointmentView role={user.role} user={user} />;
            case 'users': return <UserManagementView />;
            case 'patient-portal': return <PatientPortalView patientId={user.id} />;
            case 'patient-records': return <MedicalRecordView role={user.role} />;
            case 'records': return <MedicalRecordView role={user.role} />;
            case 'pharmacy': return <PharmacyView />;
            case 'payments': return <PaymentInsuranceView />;
            case 'image-edit': return <ImageEditView />;
            case 'logs': return <AuditLogView />;
            case 'profile': return <ProfileView />;
            default: return <DashboardView />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <>
      <ToastProvider />
      <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
        {/* Sidebar - Desktop Only */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Header
            user={user}
            onLogout={handleLogout}
            onNavigateToProfile={() => setActiveTab('profile')}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6">
            <div className="max-w-7xl mx-auto flex flex-col min-h-full">
              <div className="flex-1">
                {renderContent()}
              </div>
              {/* Footer hide on very small mobile to save space if needed, or keep for professional look */}
              <div className="hidden md:block">
                <Footer />
              </div>
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

