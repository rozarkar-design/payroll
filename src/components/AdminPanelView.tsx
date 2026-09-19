import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  Store,
  Users,
  CheckCircle2,
  Clock,
  CalendarCheck,
  CreditCard,
  Download,
  Megaphone,
  RefreshCw,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Sliders,
  IndianRupee,
  Activity,
  FileCheck,
  FileText,
  Upload,
  PlusCircle,
  Check,
  X,
  Printer,
  Search,
  Building,
  UserCheck,
  FileBadge,
  Trash2,
  UserMinus
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SugartownLogo } from './SugartownLogo';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { OfficialPayslipModal } from './OfficialPayslipModal';
import { HiringDocsAdminView } from './HiringDocsAdminView';
import { Employee, LeaveRequest, PayrollRecord, EmployeeDocument, StoreLocationId } from '../types';

export const AdminPanelView: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminSession,
    adminLogin,
    adminLogout,
    employees,
    locations,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    auditLogs,
    batchApproveAllPendingLeaves,
    reviewLeave,
    createCustomPayrollRecord,
    processPayrollBatch,
    markPayrollPaid,
    uploadEmployeeDocument,
    verifyEmployeeDocument,
    broadcastEmergencyAnnouncement,
    setActiveTab,
    triggerConfetti,
    addEmployee,
    updateEmployee,
    removeEmployee
  } = useHRMS();

  // Login Form State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin Console tabs
  const [adminTab, setAdminTab] = useState<'overview' | 'staff' | 'hiring_docs' | 'payroll' | 'leaves' | 'verification' | 'stores' | 'emergency' | 'audit'>('overview');

  // Staff Management State
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffLocationFilter, setStaffLocationFilter] = useState('All');
  const [selectedStaffToEdit, setSelectedStaffToEdit] = useState<Employee | null>(null);
  const [editDesignation, setEditDesignation] = useState('');
  const [editDepartment, setEditDepartment] = useState<Employee['department']>('Store Operations');
  const [editLocationName, setEditLocationName] = useState('');
  const [editBaseSalary, setEditBaseSalary] = useState(0);
  const [editHra, setEditHra] = useState(0);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffDesignation, setNewStaffDesignation] = useState('Store Executive');
  const [newStaffDepartment, setNewStaffDepartment] = useState<Employee['department']>('Store Operations');
  const [newStaffLocation, setNewStaffLocation] = useState('Brooklyn Candy Café & Espresso Bar');
  const [newStaffSalary, setNewStaffSalary] = useState(38000);

  // Staff Removal / Offboarding State
  const [staffToRemove, setStaffToRemove] = useState<Employee | null>(null);
  const [removalReason, setRemovalReason] = useState('Administrative Offboarding');
  const [removalNotification, setRemovalNotification] = useState('');

  // Emergency broadcast form state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Store override state
  const [storeStatusOverrides, setStoreStatusOverrides] = useState<Record<string, 'Normal' | 'Audit Mode' | 'Special Event'>>({});

  // ----------------------------------------------------
  // PAYROLL CREATION STATE
  // ----------------------------------------------------
  const [selectedPayEmpId, setSelectedPayEmpId] = useState(employees[0]?.id || 'ST-1001');
  const [payMonth, setPayMonth] = useState('October 2026');
  const [payBonus, setPayBonus] = useState(4500);
  const [payOvertimeHours, setPayOvertimeHours] = useState(8);
  const [paySweetAllowance, setPaySweetAllowance] = useState(4000);
  const [payrollSuccessMsg, setPayrollSuccessMsg] = useState('');
  const [selectedPayslipModal, setSelectedPayslipModal] = useState<PayrollRecord | null>(null);

  // ----------------------------------------------------
  // LEAVE APPROVAL STATE
  // ----------------------------------------------------
  const [leaveFilter, setLeaveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [leaveReviewComment, setLeaveReviewComment] = useState<Record<string, string>>({});

  // ----------------------------------------------------
  // BACKEND VERIFICATION & DOCUMENT UPLOAD STATE
  // ----------------------------------------------------
  const [selectedDocEmpId, setSelectedDocEmpId] = useState(employees[0]?.id || 'ST-1001');
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<EmployeeDocument['type']>('Food Safety License');
  const [docUploadMsg, setDocUploadMsg] = useState('');
  const [docSearch, setDocSearch] = useState('');

  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending');
  const checkedInStaffCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = adminLogin(phone, password);
      setIsSubmitting(false);
      if (!result.success) {
        setLoginError(result.error || 'Invalid administrator phone number or password.');
      } else {
        setPhone('');
        setPassword('');
      }
    }, 400);
  };

  const handleBatchApprove = () => {
    const count = batchApproveAllPendingLeaves();
    alert(`Successfully authorized and approved ${count} pending leave request(s) with administrative clearance.`);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    broadcastEmergencyAnnouncement(broadcastTitle, broadcastMessage);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const handleExportFullBackup = () => {
    const backupData = {
      system: 'Sugartown HRMS Master Export',
      timestamp: new Date().toISOString(),
      adminId: adminSession?.phone || '9145448010',
      totalEmployees: employees.length,
      employees,
      locations,
      attendanceRecords,
      leaveRequests,
      payrollRecords,
      auditLogs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sugartown_hrms_master_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerConfetti();
  };

  // Create Custom Payroll Handler
  const handleCreatePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomPayrollRecord({
      employeeId: selectedPayEmpId,
      month: payMonth,
      bonus: Number(payBonus) || 0,
      overtimeHours: Number(payOvertimeHours) || 0,
      confectioneryAllowance: Number(paySweetAllowance) || 400
    });
    const emp = employees.find(e => e.id === selectedPayEmpId);
    setPayrollSuccessMsg(`Payroll created and processed for ${emp?.fullName} (${payMonth})!`);
    setTimeout(() => setPayrollSuccessMsg(''), 4000);
  };

  // Upload Document Handler
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      alert('Please enter a document title.');
      return;
    }
    uploadEmployeeDocument(selectedDocEmpId, {
      name: docName,
      type: docType,
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`
    });
    setDocUploadMsg(`Document "${docName}" successfully uploaded and verified for staff!`);
    setDocName('');
    setTimeout(() => setDocUploadMsg(''), 4000);
  };

  // Selected Employee for Document Management
  const selectedDocEmployee = employees.find(e => e.id === selectedDocEmpId) || employees[0];

  // ----------------------------------------------------
  // Unauthenticated: Master Admin Login UI
  // ----------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5E0D2] shadow-xl overflow-hidden">
          
          <div className="p-8 text-center bg-gradient-to-b from-[#FAF8F2] to-white border-b border-[#EDEAD9]">
            <div className="flex items-center justify-between mb-4">
              <button
                id="admin-login-back-btn"
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B655D] hover:text-[#201D1A] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <span className="text-[10px] font-bold text-[#E66A1F] bg-[#FEF4ED] px-2 py-0.5 rounded-full">
                Executive Security
              </span>
            </div>

            <div className="flex justify-center mb-4">
              <SugartownLogo size="lg" showBadge={false} />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF4ED] text-[#E66A1F] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Executive Access</span>
            </div>
            <h2 className="text-xl font-display font-extrabold text-[#201D1A]">
              Administrator Console Login
            </h2>
            <p className="text-xs text-[#6B655D] mt-1">
              Authorized master credentials required for payroll, approvals & backend verification
            </p>
          </div>

          {/* Login Form (Without Any Hints) */}
          <form onSubmit={handleLoginSubmit} className="p-8 space-y-4.5">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="admin-phone-input" className="text-xs font-bold text-[#201D1A] block mb-1.5">
                Administrator Phone Number
              </label>
              <div className="relative">
                <input
                  id="admin-phone-input"
                  type="text"
                  required
                  autoComplete="username"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter administrator mobile number"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] text-xs font-medium text-[#201D1A] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password-input" className="text-xs font-bold text-[#201D1A] block mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] text-xs font-medium text-[#201D1A] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B655D] hover:text-[#201D1A] p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-md shadow-[#E66A1F]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="p-4 bg-[#FAF8F2] border-t border-[#EDEAD9] text-center space-y-1.5">
            <p className="text-[11px] text-[#6B655D] flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-[#E66A1F]" />
              <span>TLS 1.3 End-to-End Enterprise Encryption · Session Auto-Expires</span>
            </p>
            <p className="text-[10px] text-[#6B655D]">
              <strong className="text-[#201D1A]">{SUGARTOWN_CORPORATE_INFO.legalName}</strong>
            </p>
            <p className="text-[9px] text-[#6B655D] font-mono">
              CIN: {SUGARTOWN_CORPORATE_INFO.cin} · Pune, Maharashtra
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Authenticated Master Administrator Console
  // ----------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Master Session Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#201D1A] via-[#2D2824] to-[#1A1816] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A29] to-[#E66A1F] flex items-center justify-center text-white shadow-md shadow-[#E66A1F]/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-display font-extrabold tracking-tight text-white">
                Master Administrator Console
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#396B5A]/80 text-emerald-200 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Executive Level 5
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Admin: <strong className="text-white font-mono">{adminSession?.phone || '9145448010'}</strong> · Active since {new Date(adminSession?.loginTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-[10px] text-[#A4CDBD] font-medium mt-0.5">
              {SUGARTOWN_CORPORATE_INFO.legalName} · CIN: {SUGARTOWN_CORPORATE_INFO.cin}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            id="admin-dashboard-return-btn"
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            title="Return to Main Dashboard"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            id="admin-export-backup-btn"
            onClick={handleExportFullBackup}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            title="Export complete database backup as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#A4CDBD]" />
            <span>Export Backup</span>
          </button>

          <button
            id="admin-logout-btn"
            onClick={adminLogout}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Log Out</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Payroll Status</span>
            <CreditCard className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <div className="text-xl font-display font-black text-[#201D1A]">
            {payrollRecords.length} Slips
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-[#396B5A] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Sweet Allowance Included</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Leave Approvals</span>
            <CalendarCheck className="w-4 h-4 text-[#A4CDBD]" />
          </div>
          <div className="text-xl font-display font-black text-[#201D1A]">
            {pendingLeaves.length} Pending
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[10px] text-[#6B655D]">Needs Clearance</span>
            {pendingLeaves.length > 0 && (
              <button
                onClick={handleBatchApprove}
                className="text-[10px] font-bold text-[#E66A1F] hover:underline"
              >
                Approve All
              </button>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Staff Verification</span>
            <FileCheck className="w-4 h-4 text-[#396B5A]" />
          </div>
          <div className="text-xl font-display font-black text-[#201D1A]">
            100% Compliant
          </div>
          <div className="mt-1 text-[10px] text-[#396B5A] font-bold">
            HACCP & KYC Verified
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Security Audits</span>
            <ShieldCheck className="w-4 h-4 text-[#396B5A]" />
          </div>
          <div className="text-xl font-display font-black text-[#201D1A]">
            {auditLogs.length} Events
          </div>
          <div className="mt-1 text-[10px] text-[#6B655D] font-bold">
            Master Audit Trail Active
          </div>
        </div>
      </div>

      {/* Admin Tabbed Control Center */}
      <div className="bg-white rounded-3xl border border-[#E5E0D2] shadow-sm overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-2 border-b border-[#EDEAD9] bg-[#FAF8F2] overflow-x-auto">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              adminTab === 'overview' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            Overview
          </button>

          <button
            id="admin-tab-staff-btn"
            onClick={() => setAdminTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              adminTab === 'staff' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Directory & Control</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#EDEAD9] text-[#201D1A]">
              {employees.length}
            </span>
          </button>

          <button
            id="admin-tab-hiring-docs-btn"
            onClick={() => setAdminTab('hiring_docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              adminTab === 'hiring_docs' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Hiring Docs & Policies</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#FEF4ED] text-[#E66A1F] font-bold">
              Offer & Welcome
            </span>
          </button>
          
          <button
            onClick={() => setAdminTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              adminTab === 'payroll' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Create & Manage Payroll</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#EDEAD9] text-[#201D1A]">
              {payrollRecords.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('leaves')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              adminTab === 'leaves' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Leave Approvals</span>
            {pendingLeaves.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#FEF4ED] text-[#E66A1F] font-bold">
                {pendingLeaves.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('verification')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              adminTab === 'verification' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Backend Verification & Uploads</span>
          </button>

          <button
            onClick={() => setAdminTab('stores')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              adminTab === 'stores' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            Store Overrides ({locations.length})
          </button>

          <button
            onClick={() => setAdminTab('emergency')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              adminTab === 'emergency' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            Storewide Broadcast
          </button>

          <button
            onClick={() => setAdminTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              adminTab === 'audit' ? 'bg-[#E66A1F] text-white shadow-xs' : 'text-[#6B655D] hover:bg-[#EDEAD9]'
            }`}
          >
            Master Audit Log
          </button>
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#201D1A] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E66A1F]" />
                <span>Executive Command Shortcuts</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#FEF4ED] border border-[#E66A1F]/20 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#201D1A]">Batch Leave Authorization</h4>
                    <p className="text-[11px] text-[#6B655D] mt-1">
                      Instantly approve {pendingLeaves.length} pending employee leave request(s) across all stores.
                    </p>
                  </div>
                  <button
                    onClick={handleBatchApprove}
                    disabled={pendingLeaves.length === 0}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold disabled:opacity-40 transition-colors"
                  >
                    {pendingLeaves.length > 0 ? `Approve All (${pendingLeaves.length})` : 'No Pending Requests'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEF7F4] border border-[#396B5A]/20 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#201D1A]">Create New Payroll Record</h4>
                    <p className="text-[11px] text-[#6B655D] mt-1">
                      Calculate salary, overtime rates, sweet allowances, and disburse vouchers.
                    </p>
                  </div>
                  <button
                    onClick={() => setAdminTab('payroll')}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-[#396B5A] hover:bg-[#2C5346] text-white text-xs font-bold transition-colors"
                  >
                    Open Payroll Creator
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FEF4ED] to-[#FAF8F2] border border-[#E66A1F]/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#E66A1F] text-[10px] font-bold uppercase mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Letters & Policies</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#201D1A]">Hiring Documents Suite</h4>
                    <p className="text-[11px] text-[#6B655D] mt-1">
                      Replace candidate name, designation, salary breakup & dispatch official offer/welcome letters.
                    </p>
                  </div>
                  <button
                    id="admin-overview-open-hiring-docs-btn"
                    onClick={() => setAdminTab('hiring_docs')}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate & Send</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#201D1A]">Backend Verification</h4>
                    <p className="text-[11px] text-[#6B655D] mt-1">
                      Upload food hygiene permits, W-4 tax forms, and update verification badges.
                    </p>
                  </div>
                  <button
                    onClick={() => setAdminTab('verification')}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-[#201D1A] hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#A4CDBD]" />
                    <span>Upload & Verify</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Store Facility Directory */}
            <div>
              <h3 className="text-sm font-bold text-[#201D1A] mb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#E66A1F]" />
                <span>Store Operations & Facility Directory</span>
              </h3>

              <div className="rounded-2xl border border-[#EDEAD9] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F2] border-b border-[#EDEAD9] text-[#6B655D]">
                    <tr>
                      <th className="p-3 font-bold">Location</th>
                      <th className="p-3 font-bold">Type</th>
                      <th className="p-3 font-bold">Store Manager</th>
                      <th className="p-3 font-bold">Hours</th>
                      <th className="p-3 font-bold">Geofence Beacon</th>
                      <th className="p-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEAD9]">
                    {locations.map(loc => (
                      <tr key={loc.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                        <td className="p-3 font-bold text-[#201D1A]">{loc.name}</td>
                        <td className="p-3 text-[#6B655D]">{loc.type}</td>
                        <td className="p-3 text-[#201D1A]">{loc.managerName}</td>
                        <td className="p-3 font-mono text-[11px] text-[#6B655D]">{loc.openTime} - {loc.closeTime}</td>
                        <td className="p-3">
                          <span className="font-mono text-[11px] text-[#396B5A] bg-[#EEF7F4] px-2 py-0.5 rounded-md font-bold">
                            {loc.geofenceRadiusMeters}m radius
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A]">
                            ● Operational
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MASTER STAFF DIRECTORY & FULL CONTROL */}
        {adminTab === 'staff' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#201D1A] font-display flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#E66A1F]" />
                  <span>Master Staff Directory & Administrative Control</span>
                </h3>
                <p className="text-xs text-[#6B655D]">
                  Unrestricted access to edit designations, reassign store locations, modify base salaries, and manage employee profiles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="admin-add-new-staff-btn"
                  onClick={() => setShowAddStaffModal(true)}
                  className="py-2.5 px-4 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Enroll New Employee</span>
                </button>
              </div>
            </div>

            {/* Removal Success Notification Banner */}
            {removalNotification && (
              <div className="p-3.5 rounded-2xl bg-[#EEF7F4] border border-[#396B5A]/30 flex items-center justify-between text-xs text-[#396B5A] animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#396B5A] shrink-0" />
                  <span>{removalNotification}</span>
                </div>
                <button
                  onClick={() => setRemovalNotification('')}
                  className="text-[#396B5A] hover:text-[#2B5244] text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF8F2] p-3 rounded-2xl border border-[#EDEAD9]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="staff-search-input"
                  type="text"
                  placeholder="Search staff by name, ID (e.g. ST-1001), designation, or phone..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#EDEAD9] text-xs font-medium text-[#201D1A] focus:outline-none focus:border-[#E66A1F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={staffLocationFilter}
                  onChange={(e) => setStaffLocationFilter(e.target.value)}
                  className="p-2 rounded-xl bg-white border border-[#EDEAD9] text-xs font-semibold text-[#201D1A] focus:outline-none focus:border-[#E66A1F]"
                >
                  <option value="All">All Store Locations</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff Table */}
            <div className="rounded-2xl border border-[#EDEAD9] overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F2] border-b border-[#EDEAD9] text-[#6B655D]">
                    <tr>
                      <th className="p-3 font-bold uppercase tracking-wider">Employee</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Role & Dept</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Store Location</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Salary Structure</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Verification</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEAD9]">
                    {employees
                      .filter(emp => {
                        const matchesQuery =
                          emp.fullName.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                          emp.id.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                          emp.phone.includes(staffSearchQuery);
                        const matchesLoc = staffLocationFilter === 'All' || emp.locationName === staffLocationFilter;
                        return matchesQuery && matchesLoc;
                      })
                      .map(emp => (
                        <tr key={emp.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={emp.avatar}
                                alt={emp.fullName}
                                className="w-9 h-9 rounded-xl object-cover border border-[#EDEAD9]"
                              />
                              <div>
                                <span className="font-bold text-[#201D1A] block">{emp.fullName}</span>
                                <span className="text-[11px] text-[#6B655D] font-mono">{emp.id} · {emp.phone}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="font-semibold text-[#201D1A] block">{emp.designation}</span>
                            <span className="text-[11px] text-[#6B655D]">{emp.department}</span>
                          </td>

                          <td className="p-3">
                            <span className="font-medium text-[#201D1A] block">{emp.locationName}</span>
                            <span className="text-[10px] text-[#396B5A] font-bold">● Active Store</span>
                          </td>

                          <td className="p-3">
                            <div className="space-y-0.5">
                              <span className="font-bold text-[#201D1A] block">
                                ₹{emp.salary.baseSalary.toLocaleString('en-IN')} Basic
                              </span>
                              <span className="text-[10px] text-[#6B655D]">
                                +₹{(emp.salary.hra || emp.salary.hraAllowance || 0).toLocaleString('en-IN')} HRA · ₹{emp.salary.overtimeRate || emp.salary.overtimeHourlyRate || 280}/hr OT
                              </span>
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A]">
                              {emp.documents.length} Docs Verified
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`edit-staff-btn-${emp.id}`}
                                onClick={() => {
                                  setSelectedStaffToEdit(emp);
                                  setEditDesignation(emp.designation);
                                  setEditDepartment(emp.department);
                                  setEditLocationName(emp.locationName);
                                  setEditBaseSalary(emp.salary.baseSalary);
                                  setEditHra(emp.salary.hra || emp.salary.hraAllowance || 0);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F2] hover:bg-[#EDEAD9] text-[#201D1A] font-bold text-[11px] border border-[#EDEAD9] transition-colors"
                              >
                                Edit Role & Salary
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedDocEmpId(emp.id);
                                  setAdminTab('verification');
                                }}
                                className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F2] text-[#396B5A] font-bold text-[11px] border border-[#EDEAD9] transition-colors"
                                title="Inspect or upload verification records"
                              >
                                Docs
                              </button>

                              <button
                                id={`remove-staff-btn-${emp.id}`}
                                onClick={() => {
                                  setStaffToRemove(emp);
                                  setRemovalReason('Administrative Offboarding');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] border border-red-200 transition-colors flex items-center gap-1"
                                title={`Remove ${emp.fullName} from Sugartown records`}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EDIT STAFF MODAL */}
            {selectedStaffToEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl border border-[#E5E0D2] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedStaffToEdit.avatar}
                        alt={selectedStaffToEdit.fullName}
                        className="w-10 h-10 rounded-2xl object-cover border border-[#EDEAD9]"
                      />
                      <div>
                        <h4 className="font-bold text-[#201D1A] text-sm">
                          Edit {selectedStaffToEdit.fullName}
                        </h4>
                        <p className="text-[11px] text-[#6B655D]">
                          ID: {selectedStaffToEdit.id} · Phone: {selectedStaffToEdit.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStaffToEdit(null)}
                      className="p-1 rounded-lg text-[#6B655D] hover:text-[#201D1A]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateEmployee(selectedStaffToEdit.id, {
                        designation: editDesignation,
                        department: editDepartment,
                        locationName: editLocationName,
                        salary: {
                          ...selectedStaffToEdit.salary,
                          baseSalary: editBaseSalary,
                          hra: editHra
                        }
                      });
                      triggerConfetti();
                      setSelectedStaffToEdit(null);
                      alert(`Successfully updated employee record for ${selectedStaffToEdit.fullName}`);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block font-bold text-[#201D1A] mb-1">Position / Designation</label>
                      <input
                        type="text"
                        required
                        value={editDesignation}
                        onChange={(e) => setEditDesignation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Department</label>
                        <select
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value as Employee['department'])}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        >
                          <option value="Store Operations">Store Operations</option>
                          <option value="Sales & Customer Delight">Sales & Customer Delight</option>
                          <option value="Marketing & Brand">Marketing & Brand</option>
                          <option value="Backend & Supply Chain">Backend & Supply Chain</option>
                          <option value="Kitchen & Barista">Kitchen & Barista</option>
                          <option value="Corporate Executive">Corporate Executive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Store Location</label>
                        <select
                          value={editLocationName}
                          onChange={(e) => setEditLocationName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        >
                          {locations.map(loc => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Monthly Base Salary (₹ / INR)</label>
                        <input
                          type="number"
                          required
                          value={editBaseSalary}
                          onChange={(e) => setEditBaseSalary(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Monthly HRA (₹ / INR)</label>
                        <input
                          type="number"
                          required
                          value={editHra}
                          onChange={(e) => setEditHra(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EDEAD9] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          const emp = selectedStaffToEdit;
                          setSelectedStaffToEdit(null);
                          setStaffToRemove(emp);
                          setRemovalReason('Administrative Offboarding');
                        }}
                        className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 flex items-center gap-1.5 transition-colors"
                        title="Permanently remove employee"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Offboard / Remove</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedStaffToEdit(null)}
                          className="py-2 px-4 rounded-xl border border-[#EDEAD9] text-[#6B655D] font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2 px-5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* CONFIRMATION MODAL: REMOVE EMPLOYEE */}
            {staffToRemove && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl border border-red-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#201D1A] text-sm font-display">
                          Remove Employee Record
                        </h4>
                        <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider">
                          Administrator Authorization Required
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setStaffToRemove(null)}
                      className="p-1 rounded-lg text-[#6B655D] hover:text-[#201D1A]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center gap-3">
                    <img
                      src={staffToRemove.avatar}
                      alt={staffToRemove.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#EDEAD9]"
                    />
                    <div>
                      <p className="font-bold text-sm text-[#201D1A]">{staffToRemove.fullName}</p>
                      <p className="text-xs text-[#6B655D]">{staffToRemove.designation} · {staffToRemove.department}</p>
                      <p className="text-[11px] font-mono text-[#E66A1F]">{staffToRemove.id} · {staffToRemove.locationName}</p>
                    </div>
                  </div>

                  <div className="text-xs text-[#6B655D] leading-relaxed space-y-2">
                    <p>
                      Are you sure you want to remove <strong className="text-[#201D1A]">{staffToRemove.fullName}</strong> from Sugartown Retail Pvt. Ltd.?
                    </p>
                    <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/60 text-[11px] text-red-700 space-y-1">
                      <p>● Employee portal credentials and mobile check-in access will be revoked immediately.</p>
                      <p>● Associated payroll batches and shift schedules will cease generation.</p>
                      <p>● An entry will be permanently recorded in the Master Audit Log.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201D1A] mb-1">
                      Offboarding Reason / Category:
                    </label>
                    <select
                      id="staff-removal-reason-select"
                      value={removalReason}
                      onChange={(e) => setRemovalReason(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] focus:bg-white focus:outline-none focus:border-red-500 font-medium text-[#201D1A]"
                    >
                      <option value="Administrative Offboarding">Administrative Offboarding</option>
                      <option value="Voluntary Resignation">Voluntary Resignation</option>
                      <option value="End of Contract / Seasonal">End of Contract / Seasonal</option>
                      <option value="Involuntary Termination">Involuntary Termination</option>
                      <option value="Relocation / Store Transfer">Relocation / Store Transfer</option>
                      <option value="Other">Other Reasons</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      id="cancel-staff-removal-btn"
                      onClick={() => setStaffToRemove(null)}
                      className="py-2 px-4 rounded-xl border border-[#EDEAD9] text-[#6B655D] font-bold text-xs hover:bg-[#FAF8F2]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="confirm-staff-removal-btn"
                      onClick={() => {
                        const res = removeEmployee(staffToRemove.id, removalReason);
                        setStaffToRemove(null);
                        if (res.success) {
                          setRemovalNotification(res.message);
                          setTimeout(() => setRemovalNotification(''), 6000);
                        }
                      }}
                      className="py-2 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm & Remove Employee</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADD NEW STAFF MODAL */}
            {showAddStaffModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl border border-[#E5E0D2] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-[#E66A1F]" />
                      <h4 className="font-bold text-[#201D1A] text-sm">Enroll New Employee</h4>
                    </div>
                    <button
                      onClick={() => setShowAddStaffModal(false)}
                      className="p-1 rounded-lg text-[#6B655D] hover:text-[#201D1A]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addEmployee({
                        fullName: newStaffName,
                        phone: newStaffPhone,
                        email: newStaffEmail,
                        role: 'employee',
                        employmentStatus: 'Full-Time',
                        designation: newStaffDesignation,
                        department: newStaffDepartment,
                        locationId: (locations.find(l => l.name === newStaffLocation)?.id || 'loc_cafe_brooklyn') as StoreLocationId,
                        locationName: newStaffLocation,
                        joiningDate: new Date().toISOString().split('T')[0],
                        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
                        leaveBalance: { annual: 15, sick: 10, casual: 12, earned: 15 },
                        emergencyContact: {
                          name: 'Primary Contact',
                          relationship: 'Family',
                          phone: newStaffPhone
                        },
                        streakDays: 1,
                        documents: [
                          {
                            id: `doc-${Date.now()}-1`,
                            name: 'Government Identity Proof',
                            type: 'ID Proof',
                            uploadDate: '2026-09-18',
                            size: '1.8 MB',
                            status: 'Verified'
                          }
                        ],
                        salary: {
                          baseSalary: newStaffSalary,
                          hra: Math.round(newStaffSalary * 0.4),
                          allowances: 350,
                          hraAllowance: Math.round(newStaffSalary * 0.4),
                          sugartownSweetAllowance: 400,
                          transportAllowance: 200,
                          overtimeRate: 25,
                          overtimeHourlyRate: 25,
                          taxDeductionsRate: 10,
                          healthInsuranceDeduction: 120,
                          providentFundRate: 7
                        }
                      });
                      setShowAddStaffModal(false);
                      setNewStaffName('');
                      setNewStaffPhone('');
                      setNewStaffEmail('');
                      triggerConfetti();
                      alert('New employee successfully added to Sugartown HRMS registry!');
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block font-bold text-[#201D1A] mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder="e.g. Liam Parker"
                        className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Phone Number (Login) *</label>
                        <input
                          type="tel"
                          required
                          value={newStaffPhone}
                          onChange={(e) => setNewStaffPhone(e.target.value)}
                          placeholder="e.g. 555-019-8822"
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          placeholder="liam.parker@sugartown.com"
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Designation</label>
                        <input
                          type="text"
                          required
                          value={newStaffDesignation}
                          onChange={(e) => setNewStaffDesignation(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Department</label>
                        <select
                          value={newStaffDepartment}
                          onChange={(e) => setNewStaffDepartment(e.target.value as Employee['department'])}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        >
                          <option value="Store Operations">Store Operations</option>
                          <option value="Sales & Customer Delight">Sales & Customer Delight</option>
                          <option value="Marketing & Brand">Marketing & Brand</option>
                          <option value="Backend & Supply Chain">Backend & Supply Chain</option>
                          <option value="Kitchen & Barista">Kitchen & Barista</option>
                          <option value="Corporate Executive">Corporate Executive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Store Facility</label>
                        <select
                          value={newStaffLocation}
                          onChange={(e) => setNewStaffLocation(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        >
                          {locations.map(loc => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Monthly Base Salary (₹ / INR)</label>
                        <input
                          type="number"
                          required
                          value={newStaffSalary}
                          onChange={(e) => setNewStaffSalary(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddStaffModal(false)}
                        className="py-2 px-4 rounded-xl border border-[#EDEAD9] text-[#6B655D] font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white font-bold"
                      >
                        Enroll Employee
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: HIRING DOCUMENTS & POLICIES */}
        {adminTab === 'hiring_docs' && (
          <div className="p-6">
            <HiringDocsAdminView />
          </div>
        )}

        {/* TAB 2: CREATE & MANAGE PAYROLL */}
        {adminTab === 'payroll' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#201D1A] font-display">
                  Admin Payroll Management & Voucher Generation
                </h3>
                <p className="text-xs text-[#6B655D]">
                  Calculate base earnings, overtime hours, Sugartown Sweet Allowance, and disburse direct deposits.
                </p>
              </div>

              <button
                id="admin-batch-process-payroll-btn"
                onClick={() => {
                  processPayrollBatch('September 2026');
                  triggerConfetti();
                  alert('Processed September 2026 payroll batch for all active store employees!');
                }}
                className="py-2.5 px-4 rounded-xl bg-[#396B5A] hover:bg-[#2C5346] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Batch Process All Staff</span>
              </button>
            </div>

            {payrollSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-[#EEF7F4] border border-[#A4CDBD]/50 text-xs font-bold text-[#396B5A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{payrollSuccessMsg}</span>
              </div>
            )}

            {/* Create Individual Payroll Form */}
            <div className="bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] p-5 space-y-4">
              <h4 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#E66A1F]" />
                <span>Generate Custom Payroll Record</span>
              </h4>

              <form onSubmit={handleCreatePayroll} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#201D1A] mb-1">Select Employee</label>
                  <select
                    id="admin-payroll-employee-select"
                    value={selectedPayEmpId}
                    onChange={(e) => setSelectedPayEmpId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-white font-medium text-[#201D1A]"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.fullName} ({e.id}) - {e.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#201D1A] mb-1">Pay Month</label>
                  <input
                    id="admin-payroll-month-input"
                    type="text"
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-white font-medium text-[#201D1A]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#201D1A] mb-1">Sweet Allowance (₹ / INR)</label>
                  <input
                    id="admin-payroll-sweet-allowance-input"
                    type="number"
                    value={paySweetAllowance}
                    onChange={(e) => setPaySweetAllowance(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-white font-medium text-[#201D1A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#201D1A] mb-1">Overtime (Hours)</label>
                  <input
                    id="admin-payroll-ot-hours-input"
                    type="number"
                    value={payOvertimeHours}
                    onChange={(e) => setPayOvertimeHours(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-white font-medium text-[#201D1A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#201D1A] mb-1">Incentive / Bonus (₹ / INR)</label>
                  <input
                    id="admin-payroll-bonus-input"
                    type="number"
                    value={payBonus}
                    onChange={(e) => setPayBonus(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-white font-medium text-[#201D1A]"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-5 flex justify-end pt-2">
                  <button
                    id="admin-generate-payroll-btn"
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white font-bold text-xs shadow-md shadow-[#E66A1F]/25 flex items-center gap-2 transition-transform active:scale-98"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Calculate & Disburse Payroll Record</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Payroll History Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                Current Payroll Registry ({payrollRecords.length} Records)
              </h4>

              <div className="rounded-2xl border border-[#EDEAD9] overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F2] border-b border-[#EDEAD9] text-[#6B655D]">
                    <tr>
                      <th className="p-3 font-bold">Month</th>
                      <th className="p-3 font-bold">Staff Member</th>
                      <th className="p-3 font-bold">Base Pay</th>
                      <th className="p-3 font-bold">Sweet Allowance</th>
                      <th className="p-3 font-bold">Overtime</th>
                      <th className="p-3 font-bold">Net Salary</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEAD9]">
                    {payrollRecords.map(pay => (
                      <tr key={pay.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                        <td className="p-3 font-bold text-[#201D1A] whitespace-nowrap">{pay.month}</td>
                        <td className="p-3">
                          <div className="font-bold text-[#201D1A]">{pay.employeeName}</div>
                          <div className="text-[10px] text-[#6B655D]">{pay.designation} · {pay.employeeId}</div>
                        </td>
                        <td className="p-3 font-mono">₹{pay.earnings.basic.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono font-bold text-[#E66A1F]">+₹{pay.earnings.confectioneryAllowance.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono">{pay.overtimeHours} hrs (+₹{pay.earnings.overtimePay.toLocaleString('en-IN')})</td>
                        <td className="p-3 font-mono font-black text-[#396B5A]">₹{pay.netSalary.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pay.status === 'Paid' ? 'bg-[#EEF7F4] text-[#396B5A]' : 'bg-[#FEF4ED] text-[#E66A1F]'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {pay.status !== 'Paid' && (
                              <button
                                onClick={() => markPayrollPaid(pay.id)}
                                className="px-2 py-1 rounded-lg bg-[#396B5A] text-white text-[10px] font-bold hover:bg-[#2C5346]"
                              >
                                Disburse
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPayslipModal(pay)}
                              className="px-2 py-1 rounded-lg bg-white border border-[#EDEAD9] text-[#201D1A] text-[10px] font-bold hover:bg-[#FAF8F2]"
                            >
                              Slip
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE APPROVAL */}
        {adminTab === 'leaves' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#201D1A] font-display">
                  Leave Authorization & Manager Approvals
                </h3>
                <p className="text-xs text-[#6B655D]">
                  Review store staff time off requests, verify coverage, and authorize approvals.
                </p>
              </div>

              {pendingLeaves.length > 0 && (
                <button
                  id="admin-batch-approve-leaves-btn"
                  onClick={handleBatchApprove}
                  className="py-2.5 px-4 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize All Pending ({pendingLeaves.length})</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[#EDEAD9] pb-2 text-xs">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setLeaveFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${
                    leaveFilter === tab
                      ? 'bg-[#201D1A] text-white'
                      : 'text-[#6B655D] hover:bg-[#FAF8F2]'
                  }`}
                >
                  {tab} ({tab === 'all' ? leaveRequests.length : leaveRequests.filter(l => l.status === tab).length})
                </button>
              ))}
            </div>

            {/* Leaves List */}
            <div className="space-y-3">
              {leaveRequests
                .filter(l => leaveFilter === 'all' || l.status === leaveFilter)
                .map(req => {
                  const emp = employees.find(e => e.id === req.employeeId);
                  const commentVal = leaveReviewComment[req.id] || '';

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-[#EDEAD9] bg-white hover:border-[#E66A1F]/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={emp?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={req.employeeName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#EDEAD9]"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-[#201D1A]">{req.employeeName}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8F2] text-[#6B655D] font-mono">
                              {req.employeeId}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              req.status === 'approved'
                                ? 'bg-[#EEF7F4] text-[#396B5A]'
                                : req.status === 'rejected'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-[#FEF4ED] text-[#E66A1F]'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B655D]">
                            <strong>{req.leaveType}</strong> · {req.startDate} to {req.endDate} ({req.daysCount} days)
                          </p>
                          <p className="text-[11px] text-[#201D1A] italic">
                            Reason: "{req.reason}"
                          </p>
                          {req.reviewComment && (
                            <p className="text-[10px] text-[#396B5A] font-bold">
                              Clearance Comment: {req.reviewComment}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons if pending */}
                      {req.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                          <input
                            type="text"
                            placeholder="Approval note (optional)"
                            value={commentVal}
                            onChange={(e) => setLeaveReviewComment({ ...leaveReviewComment, [req.id]: e.target.value })}
                            className="px-2.5 py-1.5 bg-[#FAF8F2] border border-[#EDEAD9] rounded-xl text-xs focus:bg-white focus:outline-none text-[#201D1A]"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              id={`approve-leave-${req.id}`}
                              onClick={() => {
                                reviewLeave(req.id, 'approved', commentVal || 'Authorized by Master Admin (9145448010)');
                                triggerConfetti();
                              }}
                              className="flex-1 sm:flex-none py-1.5 px-3 bg-[#396B5A] hover:bg-[#2C5346] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              id={`reject-leave-${req.id}`}
                              onClick={() => {
                                reviewLeave(req.id, 'rejected', commentVal || 'Denied due to peak store footfall');
                              }}
                              className="flex-1 sm:flex-none py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 border border-red-200"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: BACKEND VERIFICATION & DOCUMENT UPLOAD */}
        {adminTab === 'verification' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#201D1A] font-display">
                Staff Backend Verification & Document Repository
              </h3>
              <p className="text-xs text-[#6B655D]">
                Verify employee credentials, upload food safety certifications, W-4 tax documents, and manage compliance.
              </p>
            </div>

            {docUploadMsg && (
              <div className="p-3.5 rounded-2xl bg-[#EEF7F4] border border-[#A4CDBD]/50 text-xs font-bold text-[#396B5A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{docUploadMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Select Employee */}
              <div className="bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                    Staff Personnel
                  </h4>
                  <span className="text-[10px] text-[#6B655D]">{employees.length} Members</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff name..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-[#EDEAD9] text-xs focus:outline-none focus:border-[#E66A1F]"
                  />
                </div>

                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                  {employees
                    .filter(e => e.fullName.toLowerCase().includes(docSearch.toLowerCase()) || e.id.toLowerCase().includes(docSearch.toLowerCase()))
                    .map(e => (
                      <button
                        key={e.id}
                        onClick={() => setSelectedDocEmpId(e.id)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          selectedDocEmpId === e.id
                            ? 'bg-[#E66A1F] text-white border-[#E66A1F]'
                            : 'bg-white text-[#201D1A] border-[#EDEAD9] hover:bg-[#FAF8F2]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={e.avatar} alt={e.fullName} className="w-7 h-7 rounded-full object-cover border border-white/20" />
                          <div>
                            <div className="text-xs font-bold leading-tight">{e.fullName}</div>
                            <div className={`text-[10px] leading-tight ${selectedDocEmpId === e.id ? 'text-white/80' : 'text-[#6B655D]'}`}>
                              {e.id} · {e.department}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          selectedDocEmpId === e.id ? 'bg-white/20 text-white' : 'bg-[#EEF7F4] text-[#396B5A]'
                        }`}>
                          {e.documents.length} Docs
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Right Column: Upload & Manage Docs for Selected Staff */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Selected Employee Verification Card */}
                <div className="bg-white rounded-2xl border border-[#EDEAD9] p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <img src={selectedDocEmployee.avatar} alt={selectedDocEmployee.fullName} className="w-12 h-12 rounded-xl object-cover border-2 border-[#E66A1F]" />
                      <div>
                        <h4 className="font-black text-sm text-[#201D1A]">{selectedDocEmployee.fullName}</h4>
                        <p className="text-xs text-[#6B655D]">{selectedDocEmployee.designation} · {selectedDocEmployee.locationName}</p>
                      </div>
                    </div>

                    {/* Verification Status Pill */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-[#EEF7F4] text-[#396B5A] text-xs font-bold flex items-center gap-1.5 border border-[#A4CDBD]/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Background Verified</span>
                      </span>
                    </div>
                  </div>

                  {/* Backend Compliance Status Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#EDEAD9] text-xs">
                    <div className="p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Govt ID KYC</span>
                      <span className="text-[#396B5A] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Approved
                      </span>
                    </div>
                    <div className="p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Food Safety</span>
                      <span className="text-[#396B5A] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> HACCP Active
                      </span>
                    </div>
                    <div className="p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Direct Deposit</span>
                      <span className="text-[#396B5A] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Bank Verified
                      </span>
                    </div>
                    <div className="p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Tax Form</span>
                      <span className="text-[#396B5A] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> W-4 Filed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload Form */}
                <div className="bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] p-5 space-y-4">
                  <h4 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#E66A1F]" />
                    <span>Upload New Verification Document for {selectedDocEmployee.fullName}</span>
                  </h4>

                  <form onSubmit={handleUploadDocument} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Document Title</label>
                        <input
                          id="admin-doc-title-input"
                          type="text"
                          required
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          placeholder="e.g. NYC Food Handler License 2026"
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-white text-[#201D1A] font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Document Category</label>
                        <select
                          id="admin-doc-category-select"
                          value={docType}
                          onChange={(e) => setDocType(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-white text-[#201D1A] font-medium"
                        >
                          <option value="Food Safety License">Food Safety License / HACCP Certification</option>
                          <option value="ID Proof">Government ID / Passport / Driving License</option>
                          <option value="Contract">Signed Employment Contract / Offer</option>
                          <option value="Tax W-4">Tax Form W-4 / State Exemption</option>
                          <option value="Bank Proof">Direct Deposit Bank Proof</option>
                          <option value="Health Certificate">Health / Food Handler Certificate</option>
                        </select>
                      </div>
                    </div>

                    {/* Drag and Drop Mock File Zone */}
                    <div className="p-4 rounded-xl border-2 border-dashed border-[#EDEAD9] bg-white text-center space-y-1">
                      <Upload className="w-5 h-5 text-[#E66A1F] mx-auto" />
                      <p className="font-bold text-[#201D1A] text-xs">Drop PDF / Scan image here or click to browse</p>
                      <p className="text-[10px] text-[#6B655D]">Supports PDF, PNG, JPG up to 10MB</p>
                    </div>

                    <button
                      id="admin-upload-doc-submit-btn"
                      type="submit"
                      className="py-2.5 px-5 bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-transform active:scale-98 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload & Certify Document</span>
                    </button>
                  </form>
                </div>

                {/* Uploaded Documents List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                    Certified Documents on File ({selectedDocEmployee.documents.length})
                  </h4>

                  <div className="space-y-2">
                    {selectedDocEmployee.documents.map(doc => (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl border border-[#EDEAD9] bg-white flex items-center justify-between text-xs hover:border-[#E66A1F]/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#FAF8F2] text-[#E66A1F]">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-[#201D1A]">{doc.name}</div>
                            <div className="text-[10px] text-[#6B655D]">
                              {doc.type} · Uploaded: {doc.uploadDate} · {doc.size}
                            </div>
                          </div>
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center gap-2">
                          <select
                            value={doc.status}
                            onChange={(e) => verifyEmployeeDocument(selectedDocEmployee.id, doc.id, e.target.value as any)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border ${
                              doc.status === 'Verified'
                                ? 'bg-[#EEF7F4] text-[#396B5A] border-[#A4CDBD]'
                                : doc.status === 'Needs Renewal'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]/40'
                            }`}
                          >
                            <option value="Verified">Verified ✓</option>
                            <option value="Pending Review">Pending Review</option>
                            <option value="Needs Renewal">Needs Renewal</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE OVERRIDES */}
        {adminTab === 'stores' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#201D1A]">Store Facility Modes & Emergency Controls</h3>
                <p className="text-xs text-[#6B655D]">Adjust operational status across all 5 Sugartown retail and production centers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map(loc => {
                const currentOverride = storeStatusOverrides[loc.id] || 'Normal';

                return (
                  <div key={loc.id} className="p-4 rounded-2xl border border-[#EDEAD9] bg-[#FAF8F2] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#201D1A]">{loc.name}</h4>
                        <p className="text-[11px] text-[#6B655D]">{loc.address}, {loc.city}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentOverride === 'Normal' ? 'bg-[#EEF7F4] text-[#396B5A]' : 'bg-[#FEF4ED] text-[#E66A1F]'
                      }`}>
                        {currentOverride}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B655D] pt-2 border-t border-[#EDEAD9]">
                      <span>Manager: <strong className="text-[#201D1A]">{loc.managerName}</strong></span>
                      <span>Phone: <span className="font-mono text-[#201D1A]">{loc.phone}</span></span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setStoreStatusOverrides(prev => ({ ...prev, [loc.id]: 'Normal' }));
                          triggerConfetti();
                        }}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          currentOverride === 'Normal' ? 'bg-[#396B5A] text-white' : 'bg-white text-[#6B655D] border border-[#EDEAD9]'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => {
                          setStoreStatusOverrides(prev => ({ ...prev, [loc.id]: 'Audit Mode' }));
                          triggerConfetti();
                        }}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          currentOverride === 'Audit Mode' ? 'bg-[#E66A1F] text-white' : 'bg-white text-[#6B655D] border border-[#EDEAD9]'
                        }`}
                      >
                        Audit Mode
                      </button>
                      <button
                        onClick={() => {
                          setStoreStatusOverrides(prev => ({ ...prev, [loc.id]: 'Special Event' }));
                          triggerConfetti();
                        }}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          currentOverride === 'Special Event' ? 'bg-[#201D1A] text-white' : 'bg-white text-[#6B655D] border border-[#EDEAD9]'
                        }`}
                      >
                        Special Event
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: STOREWIDE BROADCAST */}
        {adminTab === 'emergency' && (
          <div className="p-6 max-w-xl mx-auto space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-[#E66A1F] text-white flex items-center justify-center mx-auto shadow-md shadow-[#E66A1F]/30">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#201D1A]">Storewide Executive Broadcast</h3>
              <p className="text-xs text-[#6B655D]">
                Dispatches an immediate priority bulletin to all staff across all 5 store and factory terminals.
              </p>
            </div>

            {broadcastSent && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#396B5A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#396B5A]" />
                <span>Executive broadcast dispatched successfully to all store dashboards!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#201D1A] block mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Master Confectionery Tasting Batch & Extended Hours"
                  className="w-full p-2.5 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] text-xs focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#201D1A] block mb-1">Notice Content</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Provide precise instructions for all store managers and staff..."
                  className="w-full p-2.5 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] text-xs focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-md shadow-[#E66A1F]/30 flex items-center justify-center gap-2 transition-all"
              >
                <Megaphone className="w-4 h-4" />
                <span>Broadcast Notice to All Stores</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: MASTER AUDIT LOG */}
        {adminTab === 'audit' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#201D1A]">Master Security & Compliance Audit Log</h3>
                <p className="text-xs text-[#6B655D]">Real-time system events, role changes, leave signoffs, and authentication records</p>
              </div>
              <span className="text-xs font-bold text-[#6B655D] bg-[#FAF8F2] px-3 py-1 rounded-xl border border-[#EDEAD9]">
                {auditLogs.length} Logged Entries
              </span>
            </div>

            <div className="rounded-2xl border border-[#EDEAD9] overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F2] border-b border-[#EDEAD9] text-[#6B655D] sticky top-0">
                  <tr>
                    <th className="p-3 font-bold">Timestamp</th>
                    <th className="p-3 font-bold">Category</th>
                    <th className="p-3 font-bold">Action</th>
                    <th className="p-3 font-bold">Actor</th>
                    <th className="p-3 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEAD9]">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-[#6B655D] whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.category === 'Security' ? 'bg-red-50 text-red-600 border border-red-200' :
                          log.category === 'Payroll' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          log.category === 'Leave' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-[#FAF8F2] text-[#201D1A] border border-[#EDEAD9]'
                        }`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#201D1A]">{log.action}</td>
                      <td className="p-3 text-[#6B655D] whitespace-nowrap">{log.actorName}</td>
                      <td className="p-3 text-[#201D1A] max-w-xs truncate" title={log.details}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Official Payslip Modal in Admin */}
      {selectedPayslipModal && (
        <OfficialPayslipModal
          payslip={selectedPayslipModal}
          onClose={() => setSelectedPayslipModal(null)}
        />
      )}

    </div>
  );
};
