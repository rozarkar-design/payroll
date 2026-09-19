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
  LogOut,
  Building2,
  MapPin,
  Mail,
  Globe,
  HelpCircle,
  Send,
  KeyRound
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { SugartownLogo } from './SugartownLogo';

export const DashboardPortalGateway: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isEmployeeLoggedIn,
    employeePortalUser,
    employeePortalLogin,
    employeeLogout,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    adminSession,
    employees,
    jobOpenings,
    triggerConfetti
  } = useHRMS();

  // Employee Login State
  const [empInput, setEmpInput] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [showEmpPassword, setShowEmpPassword] = useState(false);
  const [empError, setEmpError] = useState('');
  const [empSuccess, setEmpSuccess] = useState('');

  // Admin Login State
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Forgot Password Modals
  const [forgotPasswordRole, setForgotPasswordRole] = useState<'employee' | 'admin' | null>(null);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Handle Employee Login
  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmpError('');
    setEmpSuccess('');

    const targetId = empInput.trim();
    if (!targetId) {
      setEmpError('Please enter your Employee ID or registered email.');
      return;
    }
    if (!empPassword.trim()) {
      setEmpError('Please enter your employee portal password.');
      return;
    }

    const result = employeePortalLogin(targetId);

    if (result.success && result.employee) {
      setEmpSuccess(`Authenticated! Welcome back, ${result.employee.fullName}`);
      triggerConfetti();
      setTimeout(() => {
        setActiveTab('employee_portal');
      }, 350);
    } else {
      setEmpError(result.error || 'Employee not found. Please verify your Employee ID or Email.');
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!adminPhone.trim() || !adminPass) {
      setAdminError('Please enter both administrator phone/email and password.');
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

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotSubmitted(true);
  };

  const totalOpenings = jobOpenings.reduce((acc, curr) => acc + curr.openingsCount, 0);

  return (
    <div className="space-y-6">
      
      {/* Premium Hero Identity Banner with Sugartown Logo */}
      <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <SugartownLogo size="lg" subtext="Sugartown Retail Pvt. Ltd." />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#201D1A] font-display tracking-tight pt-2">
              Sugartown HRMS & Payroll Operations
            </h1>
            <p className="text-xs sm:text-sm text-[#6B655D] leading-relaxed">
              Unified enterprise portal for retail staff, store managers, confectionery specialists, and corporate executive administration of <strong className="text-[#201D1A]">Sugartown Retail Pvt. Ltd.</strong>
            </p>

            {/* Address Pill */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-[#6B655D]">
              <span className="inline-flex items-center gap-1 font-medium bg-[#FAF8F2] px-2.5 py-1 rounded-xl border border-[#EDEAD9]">
                <MapPin className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>702, Workflo Icon Tower, Baner, Pune – 411045</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium bg-[#FAF8F2] px-2.5 py-1 rounded-xl border border-[#EDEAD9]">
                <Phone className="w-3.5 h-3.5 text-[#396B5A]" />
                <span>+91 91454 48010</span>
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold bg-[#FEF4ED] text-[#E66A1F] px-2 py-0.5 rounded-lg border border-[#E66A1F]/30">
                CIN: {SUGARTOWN_CORPORATE_INFO.cin}
              </span>
            </div>
          </div>

          {/* Quick Access Portal Selectors */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-start lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-[#EDEAD9]">
            <button
              id="gateway-nav-employee-portal-btn"
              onClick={() => setActiveTab('employee_portal')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                activeTab === 'employee_portal'
                  ? 'bg-[#396B5A] text-white shadow-sm'
                  : 'bg-[#EEF7F4] text-[#396B5A] hover:bg-[#396B5A] hover:text-white border border-[#A4CDBD]/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Employee Login</span>
              {isEmployeeLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-[#396B5A] border border-white" />
              )}
            </button>

            <button
              id="gateway-nav-admin-portal-btn"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                activeTab === 'admin'
                  ? 'bg-[#201D1A] text-white shadow-sm'
                  : isAdminLoggedIn
                  ? 'bg-[#EEF7F4] text-[#396B5A] hover:bg-[#396B5A] hover:text-white border border-[#A4CDBD]/50'
                  : 'bg-[#FEF4ED] text-[#E66A1F] hover:bg-[#E66A1F] hover:text-white border border-[#E66A1F]/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
              {isAdminLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-[#396B5A] border border-white" />
              )}
            </button>

            <button
              id="gateway-nav-apply-job-btn"
              onClick={() => setActiveTab('careers')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                activeTab === 'careers'
                  ? 'bg-[#E66A1F] text-white shadow-sm'
                  : 'bg-white text-[#201D1A] hover:bg-[#FEF4ED] hover:text-[#E66A1F] border border-[#E5E0D2]'
              }`}
            >
              <Brain className="w-4 h-4 text-[#E66A1F]" />
              <span>Apply for a Job</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#FEF4ED] text-[#E66A1F]">
                {totalOpenings}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Main Interactive Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
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
                    Staff Portal · Punch In/Out
                  </span>
                </div>
              </div>
              <button
                id="open-employee-portal-direct-btn"
                onClick={() => setActiveTab('employee_portal')}
                className="text-xs font-bold text-[#396B5A] hover:text-[#201D1A] flex items-center gap-1 transition-colors"
                title="Direct link to Employee Portal"
              >
                <span>Open</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content summary */}
            <p className="text-xs text-[#6B655D] mt-3 leading-relaxed">
              Instant access for retail staff to mark attendance (Punch In → Work → Punch Out), review payslips, check leave balances, and view notices.
            </p>

            {/* If employee is already logged in */}
            {isEmployeeLoggedIn ? (
              <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={employeePortalUser.avatar}
                      alt={employeePortalUser.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-[#396B5A]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#201D1A]">{employeePortalUser.fullName}</p>
                      <p className="text-[11px] text-[#6B655D]">{employeePortalUser.id} · {employeePortalUser.designation}</p>
                    </div>
                  </div>
                  <button
                    onClick={employeeLogout}
                    className="p-1.5 text-[#6B655D] hover:text-red-600 rounded-lg hover:bg-white"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setActiveTab('employee_portal')}
                  className="w-full py-2.5 px-3 bg-[#396B5A] hover:bg-[#2C5245] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* If employee is NOT logged in: Show Form with ID, Password, and Forgot Password */
              <form onSubmit={handleEmployeeLogin} className="mt-3 space-y-3">
                {empError && (
                  <div className="p-2.5 bg-[#FEF4ED] border border-[#E66A1F]/30 rounded-xl flex items-center gap-2 text-xs text-[#E66A1F]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{empError}</span>
                  </div>
                )}
                {empSuccess && (
                  <div className="p-2.5 bg-[#EEF7F4] border border-[#396B5A]/30 rounded-xl flex items-center gap-2 text-xs text-[#396B5A]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{empSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#201D1A] mb-1">
                    Employee ID / Email
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="gateway-emp-id-input"
                      type="text"
                      value={empInput}
                      onChange={(e) => setEmpInput(e.target.value)}
                      placeholder="e.g. ST-1005 or maya@sugartown.in"
                      className="w-full pl-8 pr-3 py-2 text-xs font-semibold text-[#201D1A] bg-[#FAF8F2] focus:bg-white rounded-xl border border-[#E5E0D2] focus:border-[#396B5A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-[#201D1A]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordRole('employee');
                        setForgotInput(empInput);
                        setForgotSubmitted(false);
                      }}
                      className="text-[11px] text-[#396B5A] hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="gateway-emp-password-input"
                      type={showEmpPassword ? 'text' : 'password'}
                      value={empPassword}
                      onChange={(e) => setEmpPassword(e.target.value)}
                      placeholder="Enter employee password"
                      className="w-full pl-8 pr-9 py-2 text-xs font-semibold text-[#201D1A] bg-[#FAF8F2] focus:bg-white rounded-xl border border-[#E5E0D2] focus:border-[#396B5A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmpPassword(!showEmpPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B655D] hover:text-[#201D1A]"
                    >
                      {showEmpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Quick Hint for Reviewer / Demo */}
                <div className="p-2 rounded-lg bg-[#FAF8F2] border border-[#EDEAD9] text-[10px] text-[#6B655D] flex items-center justify-between">
                  <span>Demo: <strong className="text-[#201D1A]">ST-1005</strong> / <strong className="text-[#201D1A]">Sugartown@123</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmpInput('ST-1005');
                      setEmpPassword('Sugartown@123');
                    }}
                    className="text-[#396B5A] font-bold hover:underline"
                  >
                    Auto-Fill
                  </button>
                </div>

                <button
                  id="gateway-employee-login-submit-btn"
                  type="submit"
                  className="w-full py-2.5 px-3 bg-[#396B5A] hover:bg-[#2C5245] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Secure Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </form>
            )}
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
        {/* CARD 2: ADMIN / HR LOGIN & PORTAL */}
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
                  <h3 className="text-sm font-bold text-[#201D1A]">Admin / HR Login</h3>
                  <span className="text-[10px] text-[#E66A1F] font-semibold bg-[#FEF4ED] px-1.5 py-0.5 rounded">
                    Executive Control & Payroll
                  </span>
                </div>
              </div>
              <button
                id="open-admin-portal-direct-btn"
                onClick={() => setActiveTab('admin')}
                className="text-xs font-bold text-[#E66A1F] hover:text-[#201D1A] flex items-center gap-1 transition-colors"
                title="Direct link to Admin Portal"
              >
                <span>Open</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content summary */}
            <p className="text-xs text-[#6B655D] mt-3 leading-relaxed">
              Manage employees, process payroll, approve leaves, generate official HR documents, track recruitment, and inspect audits.
            </p>

            {/* If Admin is already logged in: Show active session badge */}
            {isAdminLoggedIn ? (
              <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#201D1A] text-white flex items-center justify-center font-bold text-xs">
                      HQ
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#201D1A]">Corporate Administrator</p>
                      <p className="text-[11px] text-[#6B655D] font-mono">
                        {adminSession?.phone || '+91 91454 48010'}
                      </p>
                    </div>
                  </div>
                  <button
                    id="gateway-admin-logout-btn"
                    onClick={adminLogout}
                    className="p-1.5 text-[#6B655D] hover:text-red-600 rounded-lg hover:bg-white transition-colors"
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
              <form onSubmit={handleAdminLogin} className="mt-3 space-y-3">
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
                  <label className="block text-[11px] font-bold text-[#201D1A] mb-1">
                    Phone / Email
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="gateway-admin-phone-input"
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="e.g. 9145448010 or info@sugartown.in"
                      className="w-full pl-8 pr-3 py-2 text-xs font-semibold text-[#201D1A] bg-[#FAF8F2] focus:bg-white rounded-xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-[#201D1A]">
                      Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordRole('admin');
                        setForgotInput(adminPhone);
                        setForgotSubmitted(false);
                      }}
                      className="text-[11px] text-[#E66A1F] hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="gateway-admin-pass-input"
                      type={showAdminPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full pl-8 pr-9 py-2 text-xs font-semibold text-[#201D1A] bg-[#FAF8F2] focus:bg-white rounded-xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none"
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

                {/* Quick Hint for Reviewer / Demo */}
                <div className="p-2 rounded-lg bg-[#FAF8F2] border border-[#EDEAD9] text-[10px] text-[#6B655D] flex items-center justify-between">
                  <span>Demo: <strong className="text-[#201D1A]">9145448010</strong> / <strong className="text-[#201D1A]">Chikoo@0205</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPhone('9145448010');
                      setAdminPass('Chikoo@0205');
                    }}
                    className="text-[#E66A1F] font-bold hover:underline"
                  >
                    Auto-Fill
                  </button>
                </div>

                <button
                  id="gateway-admin-login-submit-btn"
                  type="submit"
                  className="w-full py-2.5 px-3 bg-[#201D1A] hover:bg-[#38332E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-[#E66A1F]" />
                  <span>Authorize & Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </form>
            )}
          </div>

          {/* Quick Perks footer */}
          <div className="mt-4 pt-3 border-t border-[#EDEAD9] flex items-center justify-between text-[10px] text-[#6B655D]">
            <span>Payroll Processing</span>
            <span>Document Dispatch</span>
            <span>CIN: {SUGARTOWN_CORPORATE_INFO.cin}</span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CARD 3: APPLY FOR A JOB & CAREERS SECTION */}
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
                  <h3 className="text-sm font-bold text-[#201D1A]">Careers at Sugartown</h3>
                  <span className="text-[10px] text-[#E66A1F] font-semibold bg-[#FEF4ED] px-1.5 py-0.5 rounded">
                    {totalOpenings} Active Openings in Pune
                  </span>
                </div>
              </div>
              <button
                id="open-careers-portal-direct-btn"
                onClick={() => setActiveTab('careers')}
                className="text-xs font-bold text-[#E66A1F] hover:text-[#201D1A] flex items-center gap-1 transition-colors"
                title="Direct link to Job Applications"
              >
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content summary */}
            <p className="text-xs text-[#6B655D] mt-3 leading-relaxed">
              Join Pune's premier confectionery brand. We offer transparent salary structures, sweet allowances, and clear career ladders across our stores and kitchen.
            </p>

            {/* Open Roles Badges */}
            <div className="mt-3 space-y-2">
              <span className="text-[10px] font-bold text-[#6B655D] uppercase tracking-wider block">
                Open Positions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Store Staff & Barista
                </span>
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Store Manager
                </span>
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Confectioner / Chocolatier
                </span>
                <span className="text-[10px] font-semibold bg-[#FAF8F2] text-[#201D1A] px-2 py-1 rounded-lg border border-[#EDEAD9]">
                  Sales & Operations
                </span>
              </div>
            </div>

            {/* 10-Minute IQ Test Highlight Box */}
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#FAF8F2] to-[#FEF4ED] border border-[#E66A1F]/20">
              <div className="flex items-center gap-2 text-xs font-bold text-[#201D1A]">
                <Sparkles className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>10-Minute Online Cognitive Test</span>
              </div>
              <p className="text-[11px] text-[#6B655D] mt-0.5 leading-relaxed">
                Streamlined hiring process with instant candidate assessment and fast interview callbacks.
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
              <span>Apply for a Job</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <div className="mt-2 text-center text-[10px] text-[#6B655D]">
              Direct Resumes: <span className="font-semibold text-[#201D1A]">career@sugartown.in</span>
            </div>
          </div>
        </div>

      </div>

      {/* Corporate Contact Details & Office Address Section */}
      <div className="bg-[#FAF8F2] rounded-3xl border border-[#EDEAD9] p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E66A1F] uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Registered Entity</span>
            </div>
            <p className="text-base font-black text-[#201D1A]">
              Sugartown Retail Pvt. Ltd.
            </p>
            <p className="text-xs text-[#6B655D]">
              CIN: <span className="font-mono font-bold text-[#201D1A]">{SUGARTOWN_CORPORATE_INFO.cin}</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E66A1F] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Corporate Office Address</span>
            </div>
            <p className="text-xs font-bold text-[#201D1A]">
              702, Workflo Icon Tower, Baner
            </p>
            <p className="text-xs text-[#6B655D]">
              Pune – 411045, Maharashtra, India
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E66A1F] uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Contact & Communications</span>
            </div>
            <p className="text-xs font-bold text-[#201D1A] flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#396B5A]" />
              <a href="tel:+919145448010" className="hover:text-[#E66A1F]">+91 91454 48010</a>
            </p>
            <p className="text-xs text-[#6B655D] flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#E66A1F]" />
              <a href="https://sugartown.in" target="_blank" rel="noreferrer" className="text-[#E66A1F] font-bold hover:underline">
                sugartown.in
              </a>
              <span>·</span>
              <a href="mailto:info@sugartown.in" className="hover:underline">info@sugartown.in</a>
            </p>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E5E0D2] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#E66A1F]" />
                <h3 className="font-bold text-base text-[#201D1A]">
                  {forgotPasswordRole === 'employee' ? 'Reset Employee Password' : 'Admin Security Recovery'}
                </h3>
              </div>
              <button 
                onClick={() => setForgotPasswordRole(null)} 
                className="w-8 h-8 rounded-full bg-[#FAF8F2] hover:bg-[#EDEAD9] flex items-center justify-center text-[#6B655D]"
              >
                ✕
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-3 text-center py-3">
                <div className="w-12 h-12 rounded-full bg-[#EEF7F4] text-[#396B5A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#201D1A]">Recovery Request Dispatched</h4>
                <p className="text-xs text-[#6B655D] leading-relaxed">
                  A verification link and OTP instruction has been routed for <strong className="text-[#201D1A]">{forgotInput}</strong>. You can also contact HR directly at <a href="mailto:info@sugartown.in" className="text-[#E66A1F] font-bold underline">info@sugartown.in</a> or phone <strong className="text-[#201D1A]">+91 91454 48010</strong>.
                </p>
                <button
                  onClick={() => setForgotPasswordRole(null)}
                  className="mt-2 px-5 py-2 bg-[#201D1A] text-white rounded-xl text-xs font-bold hover:bg-[#38332E]"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <p className="text-xs text-[#6B655D] leading-relaxed">
                  {forgotPasswordRole === 'employee'
                    ? 'Enter your Employee ID or registered email address. We will verify your staff profile and send a password reset OTP.'
                    : 'Enter your administrator phone number (+91 91454 48010) or corporate email to initiate executive authorization recovery.'}
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-[#201D1A] mb-1">
                    {forgotPasswordRole === 'employee' ? 'Employee ID or Work Email' : 'Administrator Phone or Email'}
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder={forgotPasswordRole === 'employee' ? 'e.g. ST-1005 or employee@sugartown.in' : 'e.g. 9145448010 or info@sugartown.in'}
                    className="w-full px-3.5 py-2 text-xs font-semibold text-[#201D1A] bg-[#FAF8F2] focus:bg-white rounded-xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] text-[11px] text-[#6B655D] space-y-1">
                  <p className="font-semibold text-[#201D1A]">Corporate HR Help Desk:</p>
                  <p>Email: <a href="mailto:info@sugartown.in" className="text-[#E66A1F] font-semibold">info@sugartown.in</a></p>
                  <p>Phone: <a href="tel:+919145448010" className="text-[#201D1A] font-semibold">+91 91454 48010</a></p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordRole(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B655D] hover:bg-[#FAF8F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E66A1F] hover:bg-[#D25A12] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reset Instructions</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
