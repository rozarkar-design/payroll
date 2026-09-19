import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  FileText,
  Send,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Flame,
  ArrowRight,
  Printer,
  Download,
  Eye,
  LogOut,
  Camera,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building,
  User,
  Phone,
  Hash,
  Briefcase,
  DollarSign,
  Award,
  CreditCard,
  Mail
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SugartownLogo } from './SugartownLogo';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { OfficialPayslipModal } from './OfficialPayslipModal';
import { Employee, LeaveRequest, PayrollRecord, AttendanceRecord } from '../types';

export const EmployeePortalView: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    checkIn,
    checkOut,
    isEmployeeCheckedIn,
    getTodayAttendance,
    applyLeave,
    triggerConfetti,
    employeePortalUser,
    setEmployeePortalUser,
    employeePortalLogin,
    setActiveTab,
    isEmployeeLoggedIn,
    employeeLogout
  } = useHRMS();

  // Active view tab inside Employee Portal
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'history' | 'payslips' | 'leave' | 'profile'>('attendance');

  // Employee Login Form State
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Leave Form State
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Annual Paid Leave');
  const [startDate, setStartDate] = useState('2026-09-25');
  const [endDate, setEndDate] = useState('2026-09-26');
  const [reason, setReason] = useState('');
  const [leaveSuccessMsg, setLeaveSuccessMsg] = useState('');

  // Selected Payslip for View Modal
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  // Check in action feedback
  const [checkInMsg, setCheckInMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const emp = employeePortalUser;
  const todayStr = '2026-09-18';
  const todayRecord = getTodayAttendance(emp.id);
  const isCheckedIn = isEmployeeCheckedIn(emp.id);

  // Calculate days for leave
  const calcDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    const diff = Math.round((e - s) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setLoginError('Please enter your Employee ID or phone number');
      return;
    }
    const res = employeePortalLogin(loginInput);
    if (res.success) {
      setLoginError('');
      setLoginInput('');
    } else {
      setLoginError(res.error || 'Employee not found');
    }
  };

  // Quick switch employee
  const handleQuickSwitch = (targetEmp: Employee) => {
    setEmployeePortalUser(targetEmp);
    employeePortalLogin(targetEmp.id);
    setLoginError('');
  };

  // Handle Check In
  const handleDoCheckIn = () => {
    const res = checkIn(emp.id, emp.avatar, 8);
    if (res.success) {
      setCheckInMsg({ type: 'success', text: res.message });
      triggerConfetti();
    } else {
      setCheckInMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setCheckInMsg(null), 4000);
  };

  // Handle Check Out
  const handleDoCheckOut = () => {
    const res = checkOut(emp.id);
    if (res.success) {
      setCheckInMsg({ type: 'success', text: res.message });
      triggerConfetti();
    } else {
      setCheckInMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setCheckInMsg(null), 4000);
  };

  // Handle Leave Submit
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for your leave request.');
      return;
    }
    const daysCount = calcDays();
    applyLeave({
      employeeId: emp.id,
      employeeName: emp.fullName,
      department: emp.department,
      locationName: emp.locationName,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason
    });
    setLeaveSuccessMsg(`Leave request submitted for ${daysCount} day(s). Awaiting manager approval.`);
    setReason('');
    triggerConfetti();
    setTimeout(() => setLeaveSuccessMsg(''), 5000);
  };

  // User attendance history
  const myAttendanceHistory = attendanceRecords
    .filter(r => r.employeeId === emp.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  // User leaves
  const myLeaves = leaveRequests.filter(l => l.employeeId === emp.id);

  // User payslips
  const myPayslips = payrollRecords.filter(p => p.employeeId === emp.id);

  // If not logged in, show simple employee sign in UI
  if (!isEmployeeLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5E0D2] shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <button
              id="employee-login-back-btn"
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B655D] hover:text-[#201D1A] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-[10px] font-bold text-[#396B5A] bg-[#EEF7F4] px-2 py-0.5 rounded-full">
              Staff Portal
            </span>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <SugartownLogo size="lg" showBadge={false} />
            </div>
            <h2 className="text-2xl font-black text-[#201D1A] font-display">Staff & Employee Portal</h2>
            <p className="text-xs text-[#6B655D]">
              Sign in to mark daily attendance, view monthly payslips, and manage leaves.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-[#FEF4ED] border border-[#E66A1F]/30 rounded-2xl flex items-center gap-2 text-xs font-semibold text-[#E66A1F]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#201D1A] uppercase tracking-wider mb-1.5">
                Employee ID or Registered Phone
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#6B655D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="employee-login-input"
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="e.g. ST-1005 or 555-0155"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none text-sm font-semibold text-[#201D1A]"
                  autoFocus
                />
              </div>
            </div>

            <button
              id="employee-login-submit-btn"
              type="submit"
              className="w-full py-3.5 px-4 bg-[#E66A1F] hover:bg-[#D25A12] text-white rounded-2xl text-sm font-bold shadow-md shadow-[#E66A1F]/25 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In to My Dashboard</span>
            </button>
          </form>

          {/* Secure Employee Access Notice */}
          <div className="border-t border-[#EDEAD9] pt-4 text-center space-y-1">
            <p className="text-[11px] text-[#6B655D] font-medium">
              Authorized personnel self-service portal.
            </p>
            <p className="text-[10px] text-[#6B655D]">
              <strong className="text-[#201D1A]">{SUGARTOWN_CORPORATE_INFO.legalName}</strong> · CIN: {SUGARTOWN_CORPORATE_INFO.cin}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Staff Identity Banner */}
      <div className="bg-white rounded-3xl border border-[#E5E0D2] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={emp.avatar}
              alt={emp.fullName}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-[#E66A1F] shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#396B5A] border-2 border-white flex items-center justify-center text-white" title="Active">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#201D1A] font-display tracking-tight">
                {emp.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#FEF4ED] text-[#E66A1F] text-xs font-bold font-mono">
                {emp.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#EEF7F4] text-[#396B5A] text-xs font-bold">
                {emp.employmentStatus}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B655D] font-medium flex items-center gap-1.5 flex-wrap">
              <span>{emp.designation}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#201D1A]">
                <MapPin className="w-3 h-3 text-[#E66A1F]" />
                {emp.locationName}
              </span>
            </p>
            <p className="text-[11px] text-[#6B655D] pt-0.5">
              <strong className="text-[#201D1A]">{SUGARTOWN_CORPORATE_INFO.legalName}</strong> · CIN: {SUGARTOWN_CORPORATE_INFO.cin}
            </p>
          </div>
        </div>

        {/* Right side: Streak & Switch */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#EDEAD9]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FAF8F2] border border-[#E5E0D2]">
            <Flame className="w-4 h-4 text-[#E66A1F] animate-bounce" />
            <div className="text-left">
              <span className="text-xs font-extrabold text-[#201D1A] block leading-tight">{emp.attendanceStreak} Days</span>
              <span className="text-[10px] text-[#6B655D] leading-tight">On-Time Streak</span>
            </div>
          </div>

          <button
            id="employee-dashboard-return-btn"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDEAD9] hover:bg-[#E5E0D2] text-xs font-semibold text-[#201D1A] transition-colors"
            title="Return to Main Dashboard"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            id="employee-switch-btn"
            onClick={employeeLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E0D2] text-xs font-semibold text-[#6B655D] hover:text-[#201D1A] hover:bg-[#FAF8F2] transition-colors cursor-pointer"
            title="Sign out of your employee session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation: Attendance, History, Payslip, Leave, Profile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E5E0D2]">
        <button
          id="subtab-daily-attendance-btn"
          onClick={() => setActiveSubTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'attendance'
              ? 'bg-[#E66A1F] text-white shadow-sm shadow-[#E66A1F]/30'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] hover:text-[#201D1A] border border-[#E5E0D2]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Today's Attendance</span>
          {isCheckedIn && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>

        <button
          id="subtab-attendance-history-btn"
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'history'
              ? 'bg-[#E66A1F] text-white shadow-sm shadow-[#E66A1F]/30'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] hover:text-[#201D1A] border border-[#E5E0D2]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Attendance History</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#EDEAD9] text-[#201D1A]">
            {myAttendanceHistory.length}
          </span>
        </button>

        <button
          id="subtab-payslips-btn"
          onClick={() => setActiveSubTab('payslips')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'payslips'
              ? 'bg-[#E66A1F] text-white shadow-sm shadow-[#E66A1F]/30'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] hover:text-[#201D1A] border border-[#E5E0D2]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Payslips</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#EDEAD9] text-[#201D1A]">
            {myPayslips.length}
          </span>
        </button>

        <button
          id="subtab-apply-leave-btn"
          onClick={() => setActiveSubTab('leave')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'leave'
              ? 'bg-[#E66A1F] text-white shadow-sm shadow-[#E66A1F]/30'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] hover:text-[#201D1A] border border-[#E5E0D2]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Apply for Leave</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#EDEAD9] text-[#201D1A]">
            {emp.leaveBalance.annual + emp.leaveBalance.casual} Days Left
          </span>
        </button>

        <button
          id="subtab-profile-info-btn"
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'bg-[#E66A1F] text-white shadow-sm shadow-[#E66A1F]/30'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] hover:text-[#201D1A] border border-[#E5E0D2]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile & Information</span>
        </button>
      </div>

      {/* SUBTAB 1: TODAY'S DAILY ATTENDANCE */}
      {activeSubTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          
          {/* Main Action Clock Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E0D2] p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E66A1F]">
                  Store Terminal Check-In
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#201D1A] font-display">
                  Daily Attendance Punch
                </h2>
                <p className="text-xs text-[#6B655D]">
                  Assigned Store: <strong className="text-[#201D1A]">{emp.locationName}</strong>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  isCheckedIn
                    ? 'bg-[#EEF7F4] text-[#396B5A] border border-[#A4CDBD]/40'
                    : 'bg-[#FEF4ED] text-[#E66A1F] border border-[#E66A1F]/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-[#396B5A] animate-pulse' : 'bg-[#E66A1F]'}`} />
                  {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                </span>
              </div>
            </div>

            {/* Big Live Clock Display */}
            <div className="text-center py-6 px-4 rounded-3xl bg-gradient-to-b from-[#FAF8F2] to-[#FEF4ED] border border-[#E5E0D2] space-y-2">
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#201D1A] tracking-wider">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <p className="text-xs font-bold text-[#6B655D] uppercase tracking-wider">
                {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Action Feedback Message */}
            {checkInMsg && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in zoom-in-95 ${
                checkInMsg.type === 'success'
                  ? 'bg-[#EEF7F4] text-[#396B5A] border border-[#A4CDBD]/50'
                  : 'bg-[#FEF4ED] text-[#E66A1F] border border-[#E66A1F]/40'
              }`}>
                {checkInMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <span>{checkInMsg.text}</span>
              </div>
            )}

            {/* Check-In / Check-Out Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                id="employee-checkin-btn"
                disabled={isCheckedIn}
                onClick={handleDoCheckIn}
                className={`py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                  isCheckedIn
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-[#E66A1F] hover:bg-[#D25A12] text-white shadow-[#E66A1F]/30 hover:scale-[1.01] active:scale-98 cursor-pointer'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>{isCheckedIn ? 'Already Checked In' : 'Punch In (Check In)'}</span>
              </button>

              <button
                id="employee-checkout-btn"
                disabled={!isCheckedIn}
                onClick={handleDoCheckOut}
                className={`py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                  !isCheckedIn
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-[#201D1A] hover:bg-black text-white shadow-black/20 hover:scale-[1.01] active:scale-98 cursor-pointer'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span>Punch Out (Check Out)</span>
              </button>
            </div>

            {/* Today's Punch Information */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FAF8F2] p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Shift</span>
                <span className="font-bold text-[#201D1A]">{todayRecord?.shift || 'Morning Sweet (7AM - 3PM)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B655D] block uppercase font-bold">In Time</span>
                <span className="font-bold text-[#201D1A]">{todayRecord?.checkInTime || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Overtime Today</span>
                <span className="font-bold text-[#396B5A]">{todayRecord ? `${todayRecord.overtimeHours} hrs` : '0 hrs'}</span>
              </div>
            </div>
          </div>

          {/* Side Info & Store Beacon Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-[#201D1A] text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E66A1F]" />
                <span>Store Beacon & Geofence</span>
              </h3>
              <div className="p-3 bg-[#EEF7F4] rounded-2xl border border-[#A4CDBD]/40 text-xs space-y-1">
                <div className="flex items-center gap-2 text-[#396B5A] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terminal Connected</span>
                </div>
                <p className="text-[#6B655D]">
                  Location verified within 12 meters of store POS register.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#EDEAD9] text-[#6B655D]">
                  <span>Store Hours</span>
                  <span className="font-semibold text-[#201D1A]">07:00 AM – 09:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EDEAD9] text-[#6B655D]">
                  <span>Grace Period</span>
                  <span className="font-semibold text-[#201D1A]">15 Minutes</span>
                </div>
                <div className="flex justify-between py-1.5 text-[#6B655D]">
                  <span>Break Time</span>
                  <span className="font-semibold text-[#201D1A]">45 Mins Paid</span>
                </div>
              </div>
            </div>

            {/* Quick Balance Preview */}
            <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 space-y-3 shadow-xs">
              <h3 className="font-bold text-[#201D1A] text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#A4CDBD]" />
                <span>My Available Leaves</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2]">
                  <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Annual Paid</span>
                  <span className="text-lg font-black text-[#201D1A] font-display">{emp.leaveBalance.annual} Days</span>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2]">
                  <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Casual</span>
                  <span className="text-lg font-black text-[#201D1A] font-display">{emp.leaveBalance.casual} Days</span>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2]">
                  <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Sick</span>
                  <span className="text-lg font-black text-[#201D1A] font-display">{emp.leaveBalance.sick} Days</span>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2]">
                  <span className="text-[10px] text-[#E66A1F] uppercase font-bold block">Sweet Sabbatical</span>
                  <span className="text-lg font-black text-[#E66A1F] font-display">{emp.leaveBalance.sweetSabbatical} Days</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: ATTENDANCE HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#201D1A] font-display">My Attendance Log</h3>
                <p className="text-xs text-[#6B655D]">September 2026 Shift Record & Work Hours</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-xl bg-[#EEF7F4] text-[#396B5A] font-bold">
                  On-Time: 100%
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#FAF8F2] text-[#201D1A] font-bold border border-[#E5E0D2]">
                  Streak: {emp.attendanceStreak} Days 🔥
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EDEAD9] text-[#6B655D] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Shift</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Overtime</th>
                    <th className="py-3 px-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF8F2]">
                  {myAttendanceHistory.length > 0 ? (
                    myAttendanceHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#201D1A]">{rec.date}</td>
                        <td className="py-3 px-4 text-[#6B655D]">{rec.shift}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#201D1A]">{rec.checkInTime || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            rec.status === 'present'
                              ? 'bg-[#EEF7F4] text-[#396B5A]'
                              : rec.status === 'late'
                              ? 'bg-[#FEF4ED] text-[#E66A1F]'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{rec.overtimeHours > 0 ? `+${rec.overtimeHours} hrs` : '—'}</td>
                        <td className="py-3 px-4 text-[#396B5A] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Store GPS Beacon</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#6B655D]">
                        No prior records found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: MY PAYSLIPS */}
      {activeSubTab === 'payslips' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-[#201D1A] font-display">Salary Vouchers & Payslips</h3>
              <p className="text-xs text-[#6B655D]">Official direct deposit receipts and sweet allowance vouchers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPayslips.map((pay) => (
                <div
                  key={pay.id}
                  className="bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2] p-5 space-y-4 hover:border-[#E66A1F]/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E66A1F]">
                        {pay.month}
                      </span>
                      <h4 className="font-black text-lg text-[#201D1A] font-display">
                        ${pay.netSalary.toLocaleString()}
                      </h4>
                      <span className="text-[11px] text-[#6B655D]">Net Direct Deposit</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EEF7F4] text-[#396B5A]">
                      {pay.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#6B655D] border-t border-[#EDEAD9] pt-3">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <span className="font-mono text-[#201D1A]">${pay.earnings.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sugartown Sweet Allowance 🍬</span>
                      <span className="font-mono font-bold text-[#E66A1F]">+${pay.earnings.confectioneryAllowance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deductions</span>
                      <span className="font-mono text-red-700">-${(pay.deductions.incomeTax + pay.deductions.healthInsurance + pay.deductions.providentFund).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id={`view-payslip-${pay.id}`}
                      onClick={() => setSelectedPayslip(pay)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#E5E0D2] hover:bg-[#FEF4ED] hover:text-[#E66A1F] text-xs font-bold text-[#201D1A] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Voucher</span>
                    </button>
                    <button
                      id={`print-payslip-${pay.id}`}
                      onClick={() => { setSelectedPayslip(pay); setTimeout(() => window.print(), 300); }}
                      className="py-2 px-3 rounded-xl bg-white border border-[#E5E0D2] hover:bg-[#FEF4ED] hover:text-[#E66A1F] text-xs font-bold text-[#201D1A] transition-colors"
                      title="Print"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: APPLY FOR LEAVE */}
      {activeSubTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          
          {/* Apply Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E0D2] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E66A1F]">
                Time Off Request
              </span>
              <h3 className="text-xl font-black text-[#201D1A] font-display">
                Apply for Leave
              </h3>
              <p className="text-xs text-[#6B655D]">
                Requests are automatically routed to your store manager for approval.
              </p>
            </div>

            {leaveSuccessMsg && (
              <div className="p-4 rounded-2xl bg-[#EEF7F4] border border-[#A4CDBD]/50 flex items-center gap-2.5 text-xs font-bold text-[#396B5A]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{leaveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#201D1A] uppercase tracking-wider mb-1.5">
                    Leave Type
                  </label>
                  <select
                    id="leave-type-select"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none font-semibold text-[#201D1A] bg-white"
                  >
                    <option value="Annual Paid Leave">Annual Paid Leave ({emp.leaveBalance.annual} days left)</option>
                    <option value="Casual Leave">Casual Leave ({emp.leaveBalance.casual} days left)</option>
                    <option value="Sick Leave">Sick Leave ({emp.leaveBalance.sick} days left)</option>
                    <option value="Sweet Sabbatical">Sugartown Sweet Sabbatical ({emp.leaveBalance.sweetSabbatical} days left)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#201D1A] uppercase tracking-wider mb-1.5">
                    Total Duration
                  </label>
                  <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#E5E0D2] font-black text-[#201D1A] text-sm">
                    {calcDays()} Day(s) Selected
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#201D1A] uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    id="leave-start-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none font-semibold text-[#201D1A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#201D1A] uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    id="leave-end-date-input"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none font-semibold text-[#201D1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#201D1A] uppercase tracking-wider mb-1.5">
                  Reason for Leave
                </label>
                <textarea
                  id="leave-reason-textarea"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Attending family wedding / Doctor appointment..."
                  className="w-full p-3 rounded-2xl border border-[#E5E0D2] focus:border-[#E66A1F] focus:outline-none font-medium text-[#201D1A]"
                  required
                />
              </div>

              <button
                id="submit-leave-request-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#E66A1F] hover:bg-[#D25A12] text-white font-bold text-sm shadow-md shadow-[#E66A1F]/25 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit Leave Application</span>
              </button>
            </form>
          </div>

          {/* Past Leave Requests Feed */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-[#201D1A] text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E66A1F]" />
                <span>My Past Requests</span>
              </h3>

              <div className="space-y-2.5">
                {myLeaves.length > 0 ? (
                  myLeaves.map(l => (
                    <div key={l.id} className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E5E0D2] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#201D1A]">{l.leaveType}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          l.status === 'approved'
                            ? 'bg-[#EEF7F4] text-[#396B5A]'
                            : l.status === 'rejected'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-[#FEF4ED] text-[#E66A1F]'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      <p className="text-[#6B655D] text-[11px]">
                        {l.startDate} to {l.endDate} ({l.daysCount} days)
                      </p>
                      {l.reviewComment && (
                        <p className="text-[11px] text-[#396B5A] italic bg-white p-2 rounded-lg border border-[#EDEAD9]">
                          Manager: "{l.reviewComment}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#6B655D] text-center py-4">No recent leave requests.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 5: MY PROFILE & EMPLOYMENT INFORMATION */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Profile Summary Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={emp.avatar}
                alt={emp.fullName}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-[#E66A1F] shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#201D1A]">{emp.fullName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A] border border-[#A4CDBD]/40">
                    Active Full-Time
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#E66A1F]">
                  {emp.designation} · {emp.department} Department
                </p>
                <div className="flex items-center gap-4 text-xs text-[#6B655D] pt-1">
                  <span className="flex items-center gap-1 font-mono font-bold text-[#201D1A]">
                    <Hash className="w-3.5 h-3.5 text-[#6B655D]" /> {emp.id}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#396B5A]" /> {emp.locationName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#6B655D]" /> Joined {emp.joiningDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] text-right shrink-0">
              <span className="text-[11px] font-bold text-[#6B655D] uppercase tracking-wider block">
                Official Entity
              </span>
              <span className="text-xs font-bold text-[#201D1A] block mt-0.5">
                {SUGARTOWN_CORPORATE_INFO.legalName}
              </span>
              <span className="text-[11px] text-[#396B5A] font-semibold block mt-0.5">
                CIN: {SUGARTOWN_CORPORATE_INFO.cin}
              </span>
            </div>
          </div>

          {/* 3-Column Detailed Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CARD 1: PERSONAL & CONTACT INFORMATION */}
            <div className="bg-white rounded-3xl border border-[#E5E0D2] p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDEAD9]">
                <User className="w-4 h-4 text-[#E66A1F]" />
                <h3 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                  Personal & Contact Details
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Registered Mobile</span>
                  <span className="font-semibold text-[#201D1A] flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-[#396B5A]" /> {emp.phone}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Official Email</span>
                  <span className="font-semibold text-[#201D1A] flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-[#396B5A]" /> {emp.email}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Reporting Manager</span>
                  <span className="font-semibold text-[#201D1A] flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#6B655D]" /> Eleanor Vance (Director of HR)
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EDEAD9]">
                  <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Emergency Contact</span>
                  <div className="mt-1 p-2.5 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] text-xs">
                    <p className="font-bold text-[#201D1A]">{emp.emergencyContact.name}</p>
                    <p className="text-[#6B655D] text-[11px]">{emp.emergencyContact.relationship} · {emp.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: SALARY & COMPENSATION STRUCTURE */}
            <div className="bg-white rounded-3xl border border-[#E5E0D2] p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDEAD9]">
                <CreditCard className="w-4 h-4 text-[#396B5A]" />
                <h3 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                  My Salary Structure
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#EDEAD9]/60">
                  <span className="text-[#6B655D]">Basic Monthly Salary</span>
                  <span className="font-bold text-[#201D1A]">${emp.salary.baseSalary.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#EDEAD9]/60">
                  <span className="text-[#6B655D]">House Rent Allowance (HRA)</span>
                  <span className="font-bold text-[#201D1A]">${(emp.salary.hra ?? 0).toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#EDEAD9]/60">
                  <span className="text-[#6B655D]">Sugartown Special Allowance</span>
                  <span className="font-bold text-[#201D1A]">${(emp.salary.allowances ?? 0).toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#EDEAD9]/60">
                  <span className="text-[#6B655D]">Overtime Rate</span>
                  <span className="font-bold text-[#396B5A]">${emp.salary.overtimeRate} / hour</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#EDEAD9]/60">
                  <span className="text-[#6B655D]">Estimated Deductions (PF/Tax)</span>
                  <span className="font-bold text-red-600">-$340</span>
                </div>

                <div className="pt-2 flex justify-between items-center text-sm font-bold bg-[#EEF7F4] p-2.5 rounded-xl border border-[#A4CDBD]/40">
                  <span className="text-[#396B5A]">Est. Net Take-Home</span>
                  <span className="text-[#396B5A]">
                    ${(emp.salary.baseSalary + (emp.salary.hra ?? 0) + (emp.salary.allowances ?? 0) - 340).toLocaleString()} / mo
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: VERIFIED DOCUMENTS & COMPLIANCE */}
            <div className="bg-white rounded-3xl border border-[#E5E0D2] p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDEAD9]">
                <ShieldCheck className="w-4 h-4 text-[#396B5A]" />
                <h3 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                  Verified Employee Records
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#396B5A]" />
                    <span className="font-bold text-[#201D1A]">Government ID / KYC</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A] px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#396B5A]" />
                    <span className="font-bold text-[#201D1A]">Food Hygiene & FSSAI</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A] px-2 py-0.5 rounded">
                    Certified
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#396B5A]" />
                    <span className="font-bold text-[#201D1A]">Employment Agreement</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A] px-2 py-0.5 rounded">
                    Signed
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#396B5A]" />
                    <span className="font-bold text-[#201D1A]">Direct Deposit Bank W-4</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A] px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>

              {/* Attendance Streak Pill */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FAF8F2] to-[#FEF4ED] border border-[#E66A1F]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#E66A1F]" />
                  <span className="text-xs font-bold text-[#201D1A]">Current Punch Streak</span>
                </div>
                <span className="text-xs font-extrabold text-[#E66A1F]">{emp.streakDays} Consecutive Days</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Official Payslip Modal */}
      {selectedPayslip && (
        <OfficialPayslipModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}

    </div>
  );
};
