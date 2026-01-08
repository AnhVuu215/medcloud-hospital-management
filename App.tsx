
import React, { useState, useEffect } from 'react';
import { UserRole, User } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import DashboardView from './views/DashboardView';
import AppointmentView from './views/AppointmentView';
import MedicalRecordView from './views/MedicalRecordView';
import AuditLogView from './views/AuditLogView';
import ImageEditView from './views/ImageEditView';
import PharmacyView from './views/PharmacyView';
import PaymentInsuranceView from './views/PaymentInsuranceView';
import PatientPortalView from './views/PatientPortalView';
import UserManagementView from './views/UserManagementView';
import AuthView from './views/AuthView';
import LandingView from './views/LandingView';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  useEffect(() => {
    if (currentUser?.role === UserRole.PATIENT) {
      setActiveTab('patient-portal');
    } else if (currentUser) {
      setActiveTab('dashboard');
    }
  }, [currentUser?.role]);

  // Show landing page first
  if (showLanding) {
    return <LandingView onNavigateToLogin={() => setShowLanding(false)} />;
  }

  // Then show login page
  if (!isLoggedIn || !currentUser) {
    return <AuthView onLogin={handleLogin} onBackToLanding={() => setShowLanding(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView user={currentUser} />;
      case 'appointments': return <AppointmentView role={currentUser.role} user={currentUser} />;
      case 'users': return <UserManagementView />;
      case 'patient-portal': return <PatientPortalView patientId={currentUser.id} />;
      case 'patient-records': return <MedicalRecordView role={currentUser.role} />;
      case 'records': return <MedicalRecordView role={currentUser.role} />;
      case 'pharmacy': return <PharmacyView />;
      case 'payments': return <PaymentInsuranceView />;
      case 'image-edit': return <ImageEditView />;
      case 'logs': return <AuditLogView />;
      default: return <DashboardView user={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      {/* Sidebar - Desktop Only */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUser.role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header user={currentUser} onLogout={handleLogout} />

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
        <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUser.role} />
      </div>
    </div>
  );
};

export default App;
