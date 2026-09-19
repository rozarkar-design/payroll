import React, { useState } from 'react';
import { 
  Candy, 
  Search, 
  Bell, 
  RotateCcw, 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  ChevronDown, 
  Sparkles,
  FileText,
  Calendar,
  UserPlus,
  Megaphone,
  CheckCircle2,
  Clock,
  Menu,
  Lock,
  Brain,
  Home,
  LogOut
} from 'lucide-react';
import { useHRMS, NavigationTab } from '../context/HRMSContext';
import { RoleType, StoreLocationId } from '../types';
import { SugartownLogo } from './SugartownLogo';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';

interface NavbarProps {
  onOpenQuickAction: (action: 'checkin' | 'leave' | 'payslip' | 'employee' | 'announcement') => void;
  onOpenAuditLogs?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickAction, onOpenAuditLogs, onToggleMobileMenu }) => {
  const {
    currentRole,
    switchRole,
    currentUser,
    selectedLocationFilter,
    setSelectedLocationFilter,
    locations,
    globalSearch,
    setGlobalSearch,
    activeTab,
    setActiveTab,
    announcements,
    resetToDefaults,
    leaveRequests,
    isAdminLoggedIn,
    adminLogout,
    isEmployeeLoggedIn,
    employeeLogout,
    employeePortalUser
  } = useHRMS();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActionsMenu, setShowQuickActionsMenu] = useState(false);

  const pendingLeavesCount = leaveRequests.filter(l => l.status === 'pending').length;
  const recentAnnouncements = announcements.slice(0, 3);

  const rolesList: { role: RoleType; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Full enterprise control (Eleanor)' },
    { role: 'hr_manager', label: 'HR Manager', desc: 'People, hiring, payroll, leaves (Clara)' },
    { role: 'director', label: 'Director / Exec', desc: 'Financials, store analytics (Oliver)' },
    { role: 'store_manager', label: 'Store Manager', desc: 'Candy Café DUMBO team (Marco)' },
    { role: 'employee', label: 'Store Employee', desc: 'Barista & Confectioner (Maya)' }
  ];

  // =========================================================================
  // 1. HOMEPAGE VIEW: STRICTLY ONLY Sugartown Logo, Employee Login, Admin Login, Apply Job
  // NO left side menu trigger, NO search bar, NO other menus without login
  // =========================================================================
  if (activeTab === 'dashboard') {
    return (
      <header className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E5E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <button 
                id="brand-home-btn"
                onClick={() => setActiveTab('dashboard')} 
                className="flex items-center text-left group focus:outline-none"
                title={`${SUGARTOWN_CORPORATE_INFO.legalName} · Baner, Pune`}
              >
                <SugartownLogo size="md" subtext="Sugartown Retail Pvt Ltd" singleLine={true} />
              </button>
            </div>

            {/* Homepage Menu: Strictly Employee Login, Admin Login, Apply Job */}
            <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main Navigation">
              {/* 1. Employee Login */}
              <button
                id="navbar-employee-login-btn"
                onClick={() => setActiveTab('employee_portal')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#396B5A] hover:bg-[#2B5244] text-white shadow-xs transition-all active:scale-98 cursor-pointer"
                title="Employee Login & Staff Portal"
              >
                <UserCheck className="w-4 h-4" />
                <span>Employee Login</span>
              </button>

              {/* 2. Admin Login */}
              <button
                id="navbar-admin-login-btn"
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#201D1A] hover:bg-[#38332E] text-white shadow-xs transition-all active:scale-98 cursor-pointer"
                title="Administrator / HR Login"
              >
                <ShieldCheck className="w-4 h-4 text-[#E66A1F]" />
                <span>Admin Login</span>
              </button>

              {/* 3. Apply Job */}
              <button
                id="navbar-apply-job-btn"
                onClick={() => setActiveTab('careers')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FEF4ED] hover:bg-[#E66A1F] text-[#E66A1F] hover:text-white border border-[#E66A1F]/30 shadow-xs transition-all active:scale-98 cursor-pointer"
                title="Apply for a Job at Sugartown"
              >
                <Brain className="w-4 h-4" />
                <span>Apply Job</span>
              </button>
            </nav>

          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // 2. CAREERS / JOB APPLICATION VIEW
  // =========================================================================
  if (activeTab === 'careers') {
    return (
      <header className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E5E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <button 
                id="brand-home-btn"
                onClick={() => setActiveTab('dashboard')} 
                className="flex items-center text-left group focus:outline-none"
              >
                <SugartownLogo size="md" subtext="Sugartown Retail Pvt Ltd" singleLine={true} />
              </button>
            </div>

            <nav className="flex items-center gap-2 sm:gap-3">
              <button
                id="navbar-back-home-btn"
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9] transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                id="navbar-employee-login-btn"
                onClick={() => setActiveTab('employee_portal')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#396B5A] hover:bg-[#2B5244] text-white shadow-xs transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Employee Login</span>
              </button>

              <button
                id="navbar-admin-login-btn"
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#201D1A] hover:bg-[#38332E] text-white shadow-xs transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#E66A1F]" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#E66A1F] text-white shadow-xs">
                <Brain className="w-4 h-4" />
                <span>Apply Job</span>
              </span>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // 3. EMPLOYEE PORTAL VIEW
  // =========================================================================
  if (activeTab === 'employee_portal') {
    return (
      <header className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E5E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <button 
                id="brand-home-btn"
                onClick={() => setActiveTab('dashboard')} 
                className="flex items-center text-left group focus:outline-none"
              >
                <SugartownLogo size="md" subtext="Staff Portal" singleLine={true} />
              </button>
            </div>

            <nav className="flex items-center gap-2 sm:gap-3">
              <button
                id="navbar-back-home-btn"
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9] transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>

              {isEmployeeLoggedIn ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#EEF7F4] border border-[#A4CDBD]/40 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-[#396B5A] text-white text-[11px] font-bold flex items-center justify-center">
                      {employeePortalUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="text-left leading-tight">
                      <span className="text-xs font-bold text-[#201D1A] block">{employeePortalUser.fullName}</span>
                      <span className="text-[10px] text-[#396B5A] font-semibold">{employeePortalUser.designation}</span>
                    </div>
                  </div>

                  <button
                    id="navbar-employee-logout-btn"
                    onClick={employeeLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#C2541A] bg-[#FEF4ED] hover:bg-[#FEECE0] border border-[#E66A1F]/20 transition-all cursor-pointer"
                    title="Sign Out of Employee Portal"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#396B5A] text-white shadow-xs">
                    <UserCheck className="w-4 h-4" />
                    <span>Employee Login</span>
                  </span>

                  <button
                    id="navbar-admin-login-btn"
                    onClick={() => setActiveTab('admin')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#201D1A] hover:bg-[#38332E] text-white shadow-xs transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#E66A1F]" />
                    <span>Admin Login</span>
                  </button>

                  <button
                    id="navbar-apply-job-btn"
                    onClick={() => setActiveTab('careers')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#FEF4ED] hover:bg-[#E66A1F] text-[#E66A1F] hover:text-white border border-[#E66A1F]/30 shadow-xs transition-all cursor-pointer"
                  >
                    <Brain className="w-4 h-4" />
                    <span className="hidden sm:inline">Apply Job</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // 4. ADMIN PORTAL / INTERNAL VIEWS (Only if logged in as Admin)
  // If not logged in as Admin, show clean login gateway header
  // =========================================================================
  if (!isAdminLoggedIn) {
    return (
      <header className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E5E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <button 
                id="brand-home-btn"
                onClick={() => setActiveTab('dashboard')} 
                className="flex items-center text-left group focus:outline-none"
              >
                <SugartownLogo size="md" subtext="Admin Portal" singleLine={true} />
              </button>
            </div>

            <nav className="flex items-center gap-2 sm:gap-3">
              <button
                id="navbar-back-home-btn"
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9] transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                id="navbar-employee-login-btn"
                onClick={() => setActiveTab('employee_portal')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#396B5A] hover:bg-[#2B5244] text-white shadow-xs transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Employee Login</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#201D1A] text-white shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#E66A1F]" />
                <span>Admin Login</span>
              </span>

              <button
                id="navbar-apply-job-btn"
                onClick={() => setActiveTab('careers')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FEF4ED] hover:bg-[#E66A1F] text-[#E66A1F] hover:text-white border border-[#E66A1F]/30 shadow-xs transition-all cursor-pointer"
              >
                <Brain className="w-4 h-4" />
                <span>Apply Job</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // If Admin IS Logged In: Full Admin Workspace Header
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E5E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Hamburger (for mobile admin) & Logo */}
          <div className="flex items-center gap-3">
            {onToggleMobileMenu && (
              <button
                id="navbar-mobile-menu-btn"
                onClick={onToggleMobileMenu}
                className="p-2 rounded-xl border border-[#E5E0D2] lg:hidden text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9]/60 cursor-pointer"
                aria-label="Open Admin Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button 
              id="brand-home-btn"
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center text-left group focus:outline-none"
              title="Return to Home Gateway"
            >
              <SugartownLogo size="md" subtext="Admin Portal" singleLine={true} />
            </button>

            {/* Location selector */}
            <div className="hidden xl:flex items-center ml-4 pl-4 border-l border-[#E5E0D2]">
              <MapPin className="w-3.5 h-3.5 text-[#E66A1F] mr-1.5 shrink-0" />
              <select
                id="store-location-select"
                aria-label="Filter by Store Location"
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value as 'all' | StoreLocationId)}
                className="bg-transparent text-xs font-semibold text-[#201D1A] focus:outline-none cursor-pointer pr-4"
              >
                <option value="all">All Locations (5 Active)</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Admin Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#6B655D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="global-search-input"
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search staff, stores, attendance, payslips, leaves..."
                className="w-full bg-[#EDEAD9]/60 hover:bg-[#EDEAD9]/80 focus:bg-white text-xs font-medium text-[#201D1A] placeholder-[#6B655D] pl-9 pr-4 py-2 rounded-xl border border-transparent focus:border-[#E66A1F] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Right Controls: Quick Actions, Notifications, Admin Session & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Quick Actions Trigger */}
            <div className="relative hidden lg:block">
              <button
                id="quick-actions-menu-btn"
                onClick={() => setShowQuickActionsMenu(!showQuickActionsMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E66A1F] hover:bg-[#D25A12] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Actions</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {showQuickActionsMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5E0D2] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowQuickActionsMenu(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-[#6B655D] uppercase tracking-wider">
                    Instant Operations
                  </div>
                  <button
                    id="quick-action-checkin-btn"
                    onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('checkin'); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-[#E66A1F]" />
                    <span>Mark Attendance</span>
                  </button>
                  <button
                    id="quick-action-leave-btn"
                    onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('leave'); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#A4CDBD]" />
                    <span>Apply Leave</span>
                  </button>
                  <button
                    id="quick-action-payslip-btn"
                    onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('payslip'); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#6B655D]" />
                    <span>View Payslip</span>
                  </button>
                  <div className="border-t border-[#EDEAD9] my-1"></div>
                  <button
                    id="quick-action-add-employee-btn"
                    onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('employee'); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-[#E66A1F]" />
                    <span>Add New Employee</span>
                  </button>
                  <button
                    id="quick-action-announcement-btn"
                    onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('announcement'); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Megaphone className="w-4 h-4 text-[#A4CDBD]" />
                    <span>Create Announcement</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9] rounded-xl transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {(pendingLeavesCount > 0 || recentAnnouncements.length > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E66A1F] ring-2 ring-[#FAF8F2]" />
                )}
              </button>

              {showNotifications && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E0D2] py-2 z-50"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="px-4 py-2 border-b border-[#EDEAD9] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#201D1A]">Team Notifications</span>
                    <span className="text-[10px] font-semibold text-[#E66A1F] bg-[#FEF4ED] px-2 py-0.5 rounded-full">
                      {pendingLeavesCount} Pending Review
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-[#EDEAD9]/60">
                    {pendingLeavesCount > 0 && (
                      <div 
                        className="p-3 hover:bg-[#FAF8F2] cursor-pointer"
                        onClick={() => { setActiveTab('leave'); setShowNotifications(false); }}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[#E66A1F]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{pendingLeavesCount} Leave Request(s) Awaiting Approval</span>
                        </div>
                        <p className="text-[11px] text-[#6B655D] mt-0.5">Click to open Leave approvals dashboard.</p>
                      </div>
                    )}
                    {recentAnnouncements.map(ann => (
                      <div 
                        key={ann.id} 
                        className="p-3 hover:bg-[#FAF8F2] cursor-pointer"
                        onClick={() => { setActiveTab('communication'); setShowNotifications(false); }}
                      >
                        <p className="text-xs font-semibold text-[#201D1A] line-clamp-1">{ann.title}</p>
                        <p className="text-[11px] text-[#6B655D] line-clamp-2 mt-0.5">{ann.content}</p>
                        <span className="text-[10px] text-[#A4CDBD] font-medium mt-1 inline-block">{ann.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audit Logs Quick Link */}
            <button
              id="audit-logs-open-btn"
              onClick={onOpenAuditLogs}
              className="hidden xl:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9] rounded-xl transition-colors cursor-pointer"
              title="View Security & Compliance Audit Log"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#396B5A]" />
              <span>Audit Logs</span>
            </button>

            {/* Admin Profile & Logout Button */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E0D2]">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#EEF7F4] border border-[#A4CDBD]/50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#396B5A] text-white text-[11px] font-bold flex items-center justify-center">
                  EV
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-[#201D1A] block">Eleanor Vance</span>
                  <span className="text-[9px] font-bold text-[#396B5A] uppercase tracking-wider">Super Admin</span>
                </div>
              </div>

              <button
                id="navbar-admin-logout-btn"
                onClick={adminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#C2541A] bg-[#FEF4ED] hover:bg-[#FEECE0] border border-[#E66A1F]/20 transition-all cursor-pointer"
                title="Log out of Admin Console and return to Homepage"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
