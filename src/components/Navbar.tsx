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
  Brain
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
    isAdminLoggedIn
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

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E5E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {onToggleMobileMenu && (
              <button
                id="navbar-mobile-menu-btn"
                onClick={onToggleMobileMenu}
                className="p-2 rounded-xl border border-[#E5E0D2] lg:hidden text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9]/60"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button 
              id="brand-home-btn"
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center text-left group focus:outline-none"
              title={`${SUGARTOWN_CORPORATE_INFO.legalName} · CIN: ${SUGARTOWN_CORPORATE_INFO.cin}`}
            >
              <SugartownLogo size="md" subtext="Sugartown Retail Pvt Ltd" singleLine={true} />
            </button>

            {/* Corporate Entity Details Pill */}
            <div className="hidden 2xl:flex items-center ml-3 pl-3 border-l border-[#E5E0D2] text-[10px]">
              <span className="text-[#6B655D] font-mono bg-[#EDEAD9]/60 px-2 py-0.5 rounded border border-[#E5E0D2]">
                CIN: {SUGARTOWN_CORPORATE_INFO.cin}
              </span>
            </div>

            {/* Store Location Filter (for managers/admins) */}
            {currentRole !== 'employee' && (
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
            )}
          </div>

          {/* Search bar */}
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

          {/* Right Controls: Quick Actions, Role Switcher, Mobile Mode, User */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Employee Portal Access Button */}
            <button
              id="navbar-employee-portal-btn"
              onClick={() => setActiveTab('employee_portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'employee_portal'
                  ? 'bg-[#396B5A] text-white shadow-sm'
                  : 'bg-[#EEF7F4] text-[#396B5A] hover:bg-[#396B5A] hover:text-white border border-[#A4CDBD]/40'
              }`}
              title="Employee Daily Attendance, History, Payslip & Leave"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Employee Portal</span>
            </button>

            {/* Admin Panel Quick Access Button */}
            <button
              id="navbar-admin-panel-btn"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#201D1A] text-white shadow-sm'
                  : isAdminLoggedIn
                  ? 'bg-[#EEF7F4] text-[#396B5A] hover:bg-[#A4CDBD]/40 border border-[#A4CDBD]/50'
                  : 'bg-[#FEF4ED] text-[#E66A1F] hover:bg-[#E66A1F] hover:text-white border border-[#E66A1F]/30'
              }`}
              title="Enter Sugartown Administrator Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
              {isAdminLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-[#396B5A] animate-pulse" />
              )}
            </button>

            {/* Careers / Job Application Button */}
            <button
              id="navbar-careers-btn"
              onClick={() => setActiveTab('careers')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'careers'
                  ? 'bg-[#E66A1F] text-white shadow-sm'
                  : 'bg-white text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] border border-[#EDEAD9]'
              }`}
              title="Apply for Open Positions with 10-Minute IQ Test"
            >
              <Brain className="w-3.5 h-3.5 text-[#E66A1F]" />
              <span className="hidden xl:inline">Apply for Jobs</span>
            </button>

            {/* Quick Actions Trigger */}
            <div className="relative hidden lg:block">
              <button
                id="quick-actions-menu-btn"
                onClick={() => setShowQuickActionsMenu(!showQuickActionsMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E66A1F] hover:bg-[#D25A12] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
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
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-[#E66A1F]" />
                    <span>Mark Attendance</span>
                  </button>
                  <button
                    id="quick-action-leave-btn"
                    onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('leave'); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#A4CDBD]" />
                    <span>Apply Leave</span>
                  </button>
                  <button
                    id="quick-action-payslip-btn"
                    onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('payslip'); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#6B655D]" />
                    <span>View Payslip</span>
                  </button>
                  {currentRole !== 'employee' && (
                    <>
                      <div className="border-t border-[#EDEAD9] my-1"></div>
                      <button
                        id="quick-action-add-employee-btn"
                        onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('employee'); }}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-[#E66A1F]" />
                        <span>Add New Employee</span>
                      </button>
                      <button
                        id="quick-action-announcement-btn"
                        onClick={() => { setShowQuickActionsMenu(false); onOpenQuickAction('announcement'); }}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] flex items-center gap-2.5 transition-colors"
                      >
                        <Megaphone className="w-4 h-4 text-[#A4CDBD]" />
                        <span>Create Announcement</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9] rounded-xl transition-colors"
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
            {currentRole === 'super_admin' && (
              <button
                id="audit-logs-open-btn"
                onClick={onOpenAuditLogs}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#6B655D] hover:text-[#201D1A] hover:bg-[#EDEAD9] rounded-xl transition-colors"
                title="View Security & Compliance Audit Log"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#396B5A]" />
                <span>Audit Logs</span>
              </button>
            )}

            {/* Reset Data Button */}
            <button
              id="reset-demo-data-btn"
              onClick={() => {
                if (window.confirm('Reset all HRMS records, check-ins, and leave requests back to default Sugartown sample data?')) {
                  resetToDefaults();
                }
              }}
              className="p-2 text-[#6B655D] hover:text-[#E66A1F] hover:bg-[#EDEAD9] rounded-xl transition-colors"
              title="Reset to fresh demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Role Switcher & Persona Card */}
            <div className="relative">
              <button
                id="role-persona-switcher-btn"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#E5E0D2] bg-white hover:border-[#E66A1F] transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#E5E0D2]"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#201D1A] leading-none">{currentUser.fullName}</span>
                    <ChevronDown className="w-3 h-3 text-[#6B655D]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#E66A1F] uppercase tracking-wider block mt-0.5">
                    {rolesList.find(r => r.role === currentRole)?.label}
                  </span>
                </div>
              </button>

              {showRoleDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E0D2] p-2 z-50"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-[#EDEAD9] mb-1">
                    <p className="text-xs font-bold text-[#201D1A]">Role-Based Access Control</p>
                    <p className="text-[11px] text-[#6B655D]">Simulate permissions & store access:</p>
                  </div>

                  <div className="space-y-1">
                    {rolesList.map(({ role, label, desc }) => {
                      const isActive = currentRole === role;
                      return (
                        <button
                          key={role}
                          id={`switch-role-to-${role}-btn`}
                          onClick={() => {
                            switchRole(role);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start gap-2.5 transition-colors ${
                            isActive
                              ? 'bg-[#FEF4ED] text-[#E66A1F] font-bold'
                              : 'text-[#201D1A] hover:bg-[#FAF8F2]'
                          }`}
                        >
                          <UserCheck className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-[#E66A1F]' : 'text-[#6B655D]'}`} />
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{label}</span>
                              {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#E66A1F]" />}
                            </div>
                            <span className="text-[10px] text-[#6B655D] font-normal block leading-tight mt-0.5">{desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
