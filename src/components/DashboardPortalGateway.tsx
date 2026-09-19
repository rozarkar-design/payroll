import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Brain,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  FileText,
  CalendarCheck,
  Phone,
  Hash,
  Eye,
  EyeOff,
  Briefcase,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';

export const DashboardPortalGateway: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    employeePortalUser,
    setEmployeePortalUser,
    employeePortalLogin,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    employees,
    jobOpenings,
    triggerConfetti
  } = useHRMS();

  // Employee Login State
  const [empInput, setEmpInput] = useState('');
  const [empError, setEmpError] = useState('');
  const [empSuccess, setEmpSuccess] = useState('');

  // Admin Login State
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Handle Employee Login
  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmpError('');
    setEmpSuccess('');

    const targetId = empInput.trim();
    if (!targetId) {
      setEmpError('Please enter your Employee ID or registered mobile number.');
      return;
    }
    const result = employeePortalLogin(targetId);

    if (result.success && result.employee) {
      setEmpSuccess(`Logged in as ${result.employee.fullName}`);
      triggerConfetti();
      setTimeout(() => {
        setActiveTab('employee_portal');
      }, 350);
    } else {
      setEmpError(result.error || 'Employee not found. Please verify your Employee ID or Phone.');
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!adminPhone.trim() || !adminPass) {
      setAdminError('Please enter both administrator mobile number and password.');
      return;
    }

    const result = adminLogin(adminPhone.trim(), adminPass);
    if (result.success) {
      setAdminSuccess('Admin credentials verified!');
      setTimeout(() => {
        setActiveTab('admin');
      }, 350);
    } else {
      setAdminError(result.error || 'Invalid administrator phone or password.');
    }
  };

  const totalOpenings = jobOpenings.reduce((acc, curr) => acc + curr.openingsCount, 0);

  return (
    <div id="dashboard-portal-gateway-section" className="space-y-4">
      {/* Section Header & Direct Portal Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E66A1F] animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#201D1A]">
              Sugartown Portals & Fast Access Hub
            </h2>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Quick sign-in, applicant careers, and direct routing to staff and administrative suites.
          </p>
        </div>

        {/* Quick Portal Switcher Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="gateway-nav-employee-portal-btn"
            onClick={() => setActiveTab('employee_portal')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'employee_portal'
                ? 'bg-[#396B5A] text-white shadow-sm'
                : 'bg-[#EEF7F4] text-[#396B5A] hover:bg-[#396B5A] hover:text-white border border-[#A4CDBD]/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Employee Portal</span>
          </button>

          <button
            id="gateway-nav-admin-portal-btn"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-[#201D1A] text-white shadow-sm'
                : isAdminLoggedIn
                ? 'bg-[#EEF7F4] text-[#396B5A] hover:bg-[#396B5A] hover:text-white border border-[#A4CDBD]/50'
                : 'bg-[#FEF4ED] text-[#E66A1F] hover:bg-[#E66A1F] hover:text-white border border-[#E66A1F]/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
            {isAdminLoggedIn && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#396B5A]" />
            )}
          </button>

          <button
            id="gateway-nav-apply-job-btn"
            onClick={() => setActiveTab('careers')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'careers'
                ? 'bg-[#E66A1F] text-white shadow-sm'
                : 'bg-white text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] border border-[#E5E0D2]'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-[#E66A1F]" />
            <span>Apply for Job</span>
          </button>
        </div>
      </div>

      {/* 3 Main Interactive Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* ==================================================================== */}
        {/* CARD 1: EMPLOYEE LOGIN & PORTAL */}
        {/* ==================================================================== */}
        <div 
          id="gateway-employee-login-card"
          className="bg-white rounded-3xl border border-[#E5E0D2] p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#EEF7F4] border border-[#A4CDBD]/40 flex items-center justify-center text-[#396B5A]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#201D1A]">Employee Login</h3>
                  <span className="text-[10px] text-[#396B5A] font-semibold bg-[#EEF7F4] px-1.5 py-0.5 rounded">
                    Staff Self-Service
                  </span>
                </div>
              </div>
              <button
                id="open-employee-portal-direct-btn"
                onClick={() => setActiveTab('employee_portal')}
                className="text-xs font-bold text-[#396B5A] hover:text-[#201D1A] flex items-center gap-1 transition-colors"
                title="Direct link to Employee Portal"
              >
                <span>Open Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content summary */}
            <p className="text-xs text-[#6B655D] mt-3 leading-relaxed">
              Mark daily attendance with selfie/GPS, inspect official payslips with CIN, and submit leave requests.
            </p>

            {/* Error / Success feedback */}
            {empError && (
              <div className="mt-3 p-2.5 bg-[#FEF4ED] border border-[#E66A1F]/30 rounded-xl flex items-center gap-2 text-xs text-[#E66A1F]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{empError}</span>
              </div>
            )}
            {empSuccess && (
              <div className="mt-3 p-2.5 bg-[#EEF7F4] border border-[#396B5A]/30 rounded-xl flex items-center gap-2 text-xs text-[#396B5A]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{empSuccess}</span>
              </div>
            )}

            {/* Simple Login Form */}
            <form onSubmit={handleEmployeeLogin} className="mt-3 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                  Employee ID or Phone
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="gateway-emp-id-input"
                    type="text"
                    value={empInput}
                    onChange={(e) => setEmpInput(e.target.value)}
                    placeholder="Enter Employee ID (e.g. ST-1005) or Phone"
                    className="w-full pl-8 pr-3 py-2.5 text-xs font-semibold text-[#201D1A] bg-white rounded-xl border border-[#E5E0D2] focus:border-[#396B5A] focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="gateway-employee-login-submit-btn"
                type="submit"
                className="w-full py-2.5 px-3 bg-[#396B5A] hover:bg-[#2C5245] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all pt-2.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In & Open Employee Portal</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </form>
          </div>

          {/* Quick Perks footer */}
          <div className="mt-4 pt-3 border-t border-[#EDEAD9] flex items-center justify-between text-[10px] text-[#6B655D]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#396B5A]" /> Daily Attendance
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#396B5A]" /> CIN Payslips
            </span>
            <span className="flex items-center gap-1">
              <CalendarCheck className="w-3 h-3 text-[#396B5A]" /> Leave Balance
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CARD 2: ADMIN LOGIN & PORTAL */}
        {/* ==================================================================== */}
        <div 
          id="gateway-admin-login-card"
          className="bg-white rounded-3xl border border-[#E5E0D2] p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FEF4ED] border border-[#E66A1F]/30 flex items-center justify-center text-[#E66A1F]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#201D1A]">Admin Login</h3>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isAdminLoggedIn ? 'bg-[#EEF7F4] text-[#396B5A]' : 'bg-[#FEF4ED] text-[#E66A1F]'
                  }`}>
                    {isAdminLoggedIn ? 'Level 5 Unlocked' : 'Executive Security'}
                  </span>
                </div>
              </div>
              <button
                id="open-admin-portal-direct-btn"
                onClick={() => setActiveTab('admin')}
                className="text-xs font-bold text-[#E66A1F] hover:text-[#201D1A] flex items-center gap-1 transition-colors"
                title="Direct link to Admin Portal"
              >
                <span>Admin Panel</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content summary */}
            <p className="text-xs text-[#6B655D] mt-3 leading-relaxed">
              Executive authority for payroll processing, master leave clearances, document audits, and store compliance.
            </p>

            {/* If Admin is already logged in */}
            {isAdminLoggedIn ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-[#EEF7F4] border border-[#A4CDBD]/50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#396B5A] text-white flex items-center justify-center font-bold text-xs">
                      EV
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#201D1A] block">
                        Eleanor Vance
                      </span>
                      <span className="text-[10px] text-[#396B5A] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#396B5A]" />
                        Master Executive Session Active
                      </span>
                    </div>
                  </div>
                  <button
                    id="gateway-admin-logout-btn"
                    onClick={adminLogout}
                    className="p-1.5 text-[#6B655D] hover:text-[#C2541A] hover:bg-white rounded-lg transition-colors"
                    title="Lock Admin Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="gateway-enter-admin-panel-btn"
                  onClick={() => setActiveTab('admin')}
                  className="w-full py-2.5 px-3 bg-[#201D1A] hover:bg-[#38332E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E66A1F]" />
                  <span>Enter Administrator Console</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            ) : (
              /* If Admin is NOT logged in: Show crisp login form */
              <form onSubmit={handleAdminLogin} className="mt-3 space-y-2.5">
                {adminError && (
                  <div className="p-2.5 bg-[#FEF4ED] border border-[#E66A1F]/30 rounded-xl flex items-center gap-2 text-xs text-[#E66A1F]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}
                {adminSuccess && (
                  <div className="p-2.5 bg-[#EEF7F4] border border-[#396B5A]/30 rounded-xl flex items-center gap-2 text-xs text-[#396B5A]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{adminSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                    Administrator Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="gateway-admin-phone-input"
                      type="tel"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="Enter registered mobile number"
                      className="w-full pl-8 pr-3 py-2 text-xs font-semibold text-[#201D1A] bg-white rounded-xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="gateway-admin-pass-input"
                      type={showAdminPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full pl-8 pr-9 py-2 text-xs font-semibold text-[#201D1A] bg-white rounded-xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B655D] hover:text-[#201D1A]"
                    >
                      {showAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  id="gateway-admin-login-submit-btn"
                  type="submit"
                  className="w-full py-2.5 px-3 bg-[#201D1A] hover:bg-[#38332E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all mt-1"
                >
                  <Lock className="w-3.5 h-3.5 text-[#E66A1F]" />
                  <span>Authorize & Open Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </form>
            )}
          </div>

          {/* Quick Perks footer */}
          <div className="mt-4 pt-3 border-t border-[#EDEAD9] flex items-center justify-between text-[10px] text-[#6B655D]">
            <span>Payroll Disbursal</span>
            <span>Batch Approvals</span>
            <span>CIN: {SUGARTOWN_CORPORATE_INFO.cin}</span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CARD 3: APPLY JOB (CAREERS & IQ TEST) */}
        {/* ==================================================================== */}
        <div 
          id="gateway-apply-job-card"
          className="bg-white rounded-3xl border border-[#E5E0D2] p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FEF4ED] border border-[#E66A1F]/30 flex items-center justify-center text-[#E66A1F]">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#201D1A]">Apply for Job</h3>
                  <span className="text-[10px] text-[#E66A1F] font-semibold bg-[#FEF4ED] px-1.5 py-0.5 rounded">
                    {totalOpenings} Active Openings
                  </span>
                </div>
              </div>
              <button
                id="open-careers-portal-direct-btn"
                onClick={() => setActiveTab('careers')}
                className="text-xs font-bold text-[#E66A1F] hover:text-[#201D1A] flex items-center gap-1 transition-colors"
                title="Direct link to Job Applications"
              >
                <span>View Jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content summary */}
            <p className="text-xs text-[#6B655D] mt-3 leading-relaxed">
              Explore positions across retail stores, confectionery kitchen, and operations. Includes a required 10-minute online IQ test.
            </p>

            {/* Open Roles Badges */}
            <div className="mt-3 space-y-2">
              <span className="text-[10px] font-bold text-[#6B655D] uppercase tracking-wider block">
                Open Career Tracks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Store Staff & Barista
                </span>
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Store Manager
                </span>
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Cluster Manager
                </span>
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Sales & Marketing
                </span>
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Operations & Kitchen
                </span>
              </div>
            </div>

            {/* 10-Minute IQ Test Highlight Box */}
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#FAF8F2] to-[#FEF4ED] border border-[#E66A1F]/20">
              <div className="flex items-center gap-2 text-xs font-bold text-[#201D1A]">
                <Sparkles className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>10-Minute IQ & Cognitive Test</span>
              </div>
              <p className="text-[11px] text-[#6B655D] mt-0.5 leading-relaxed">
                Applicants must achieve a ≥ 70% threshold in pattern recognition, numeric aptitude, and logic.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-4 pt-3 border-t border-[#EDEAD9]">
            <button
              id="gateway-apply-job-start-btn"
              onClick={() => setActiveTab('careers')}
              className="w-full py-2.5 px-3 bg-[#E66A1F] hover:bg-[#D25A12] text-white rounded-xl text-xs font-bold shadow-xs shadow-[#E66A1F]/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Apply for Open Roles Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <div className="mt-2 text-center text-[10px] text-[#6B655D]">
              Direct Inquiries: <span className="font-semibold text-[#201D1A]">career@sugartown.in</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
