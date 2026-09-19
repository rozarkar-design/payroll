import React, { useState } from 'react';
import { HRMSProvider, useHRMS } from './context/HRMSContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EmployeeView } from './components/EmployeeView';
import { AttendanceView } from './components/AttendanceView';
import { LeaveView } from './components/LeaveView';
import { PayrollView } from './components/PayrollView';
import { StoreManagementView } from './components/StoreManagementView';
import { RecruitmentView } from './components/RecruitmentView';
import { PerformanceView } from './components/PerformanceView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ReportsView } from './components/ReportsView';
import { AdminPanelView } from './components/AdminPanelView';
import { EmployeePortalView } from './components/EmployeePortalView';
import { JobApplicationView } from './components/JobApplicationView';
import { CheckInModal } from './components/CheckInModal';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';
import { CorporateFooter } from './components/CorporateFooter';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, isAdminLoggedIn } = useHRMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const [initialSelectedEmployeeId, setInitialSelectedEmployeeId] = useState<string | undefined>(undefined);

  // Left-side menu is strictly hidden on homepage and only visible for logged-in admins in admin modules
  const isHomepage = activeTab === 'dashboard';
  const isCareers = activeTab === 'careers';
  const isEmployeePortal = activeTab === 'employee_portal' || activeTab === 'mobile_view';
  const showSidebar = isAdminLoggedIn && !isHomepage && !isCareers && !isEmployeePortal;

  const handleSelectEmployee = (empId: string) => {
    setInitialSelectedEmployeeId(empId);
    setActiveTab('employees');
  };

  const handleQuickAction = (action: 'checkin' | 'leave' | 'payslip' | 'employee' | 'announcement') => {
    switch (action) {
      case 'checkin':
        setIsCheckInModalOpen(true);
        break;
      case 'leave':
        setIsApplyLeaveModalOpen(true);
        break;
      case 'payslip':
        setActiveTab('payroll');
        break;
      case 'employee':
        setActiveTab('employees');
        break;
      case 'announcement':
        setActiveTab('communication');
        break;
    }
  };

  const renderActiveView = () => {
    // If not logged in as Admin, internal operations views route to the Admin Login Portal
    if (!isAdminLoggedIn && ['employees', 'attendance', 'leave', 'payroll', 'stores', 'recruitment', 'performance', 'communication', 'reports'].includes(activeTab)) {
      return <AdminPanelView />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenQuickAction={handleQuickAction}
            onSelectEmployee={handleSelectEmployee}
          />
        );
      case 'employee_portal':
      case 'mobile_view':
        return <EmployeePortalView />;
      case 'careers':
        return <JobApplicationView />;
      case 'admin':
        return <AdminPanelView />;
      case 'employees':
        return <EmployeeView initialSelectedId={initialSelectedEmployeeId} />;
      case 'attendance':
        return <AttendanceView onOpenCheckInModal={() => setIsCheckInModalOpen(true)} />;
      case 'leave':
        return <LeaveView onOpenApplyLeaveModal={() => setIsApplyLeaveModalOpen(true)} />;
      case 'payroll':
        return <PayrollView />;
      case 'stores':
        return <StoreManagementView />;
      case 'recruitment':
        return <RecruitmentView />;
      case 'performance':
        return <PerformanceView />;
      case 'communication':
        return <AnnouncementsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return (
          <DashboardView
            onOpenQuickAction={handleQuickAction}
            onSelectEmployee={handleSelectEmployee}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#201D1A] flex flex-col font-sans selection:bg-[#E66A1F]/20 selection:text-[#E66A1F]">
      
      {/* Top Navigation Bar: Displays only Employee Login, Admin Login, Apply Job on Homepage */}
      <Navbar
        onToggleMobileMenu={showSidebar ? () => setMobileMenuOpen(!mobileMenuOpen) : undefined}
        onOpenQuickAction={handleQuickAction}
        onOpenAuditLogs={() => setActiveTab('reports')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar: Strictly hidden on homepage and without admin login */}
        {showSidebar && (
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Dynamic Content View Container */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
            {renderActiveView()}
          </div>
          <CorporateFooter />
        </main>
      </div>

      {/* Interactive Global Modals */}
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />

      <ApplyLeaveModal
        isOpen={isApplyLeaveModalOpen}
        onClose={() => setIsApplyLeaveModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <HRMSProvider>
      <MainLayout />
    </HRMSProvider>
  );
}
