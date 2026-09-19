import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Employee,
  StoreLocation,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  JobOpening,
  Candidate,
  CandidateStage,
  PerformanceReview,
  Announcement,
  AuditLog,
  RoleType,
  StoreLocationId
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_LOCATIONS,
  INITIAL_ATTENDANCE_TODAY,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_JOB_OPENINGS,
  INITIAL_CANDIDATES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PERFORMANCE_REVIEWS,
  INITIAL_AUDIT_LOGS
} from '../mockData';

export type NavigationTab = 
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'stores'
  | 'recruitment'
  | 'performance'
  | 'communication'
  | 'reports'
  | 'mobile_view'
  | 'employee_portal'
  | 'careers'
  | 'admin';

export interface AdminSession {
  phone: string;
  loginTime: string;
  role: string;
}

interface HRMSContextType {
  // Navigation & Role
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentRole: RoleType;
  switchRole: (role: RoleType) => void;
  currentUser: Employee;
  selectedLocationFilter: 'all' | StoreLocationId;
  setSelectedLocationFilter: (loc: 'all' | StoreLocationId) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Employee Portal User Session
  isEmployeeLoggedIn: boolean;
  employeePortalUser: Employee;
  setEmployeePortalUser: (emp: Employee) => void;
  employeePortalLogin: (empIdOrPhone: string) => { success: boolean; employee?: Employee; error?: string };
  employeeLogout: () => void;

  // Admin Portal Authentication
  isAdminLoggedIn: boolean;
  adminSession: AdminSession | null;
  adminLogin: (phone: string, pass: string) => { success: boolean; error?: string };
  adminLogout: () => void;
  batchApproveAllPendingLeaves: () => number;
  broadcastEmergencyAnnouncement: (title: string, message: string) => void;

  // Data collections
  locations: StoreLocation[];
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  jobOpenings: JobOpening[];
  candidates: Candidate[];
  performanceReviews: PerformanceReview[];
  announcements: Announcement[];
  auditLogs: AuditLog[];

  // Actions
  addEmployee: (employeeData: Omit<Employee, 'id' | 'attendanceStreak' | 'badges'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  
  // Document Management & Backend Verification
  uploadEmployeeDocument: (employeeId: string, doc: { name: string; type: Employee['documents'][0]['type']; size: string }) => void;
  verifyEmployeeDocument: (employeeId: string, docId: string, status: 'Verified' | 'Pending Review' | 'Needs Renewal') => void;

  checkIn: (employeeId: string, selfieUrl?: string, customDistance?: number) => { success: boolean; message: string };
  checkOut: (employeeId: string) => { success: boolean; message: string };
  isEmployeeCheckedIn: (employeeId: string) => boolean;
  getTodayAttendance: (employeeId: string) => AttendanceRecord | undefined;

  applyLeave: (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  reviewLeave: (leaveId: string, status: 'approved' | 'rejected', comment?: string) => void;

  processPayrollBatch: (month: string) => void;
  createCustomPayrollRecord: (payrollData: {
    employeeId: string;
    month: string;
    bonus: number;
    overtimeHours: number;
    confectioneryAllowance?: number;
  }) => void;
  markPayrollPaid: (id: string) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  awardBadge: (employeeId: string, badgeId: string, customMessage?: string) => void;

  addCandidate: (candidateData: Omit<Candidate, 'id' | 'appliedDate'>) => void;
  submitJobApplication: (candidate: {
    jobId: string;
    jobTitle: string;
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    resumeSummary: string;
    notes: string;
    department?: string;
    iqScore: number;
    iqPassed: boolean;
    appliedLocations?: string[];
    preferredShift?: string;
    cvFileName?: string;
    cvFileSize?: string;
    documentsCount?: number;
    qualification?: string;
    expectedSalary?: string;
  }) => { success: boolean; message: string };
  updateCandidateStage: (candidateId: string, stage: CandidateStage) => void;
  updateOnboardingItem: (candidateId: string, key: string, val: boolean) => void;
  addJobOpening: (jobData: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => void;

  resetToDefaults: () => void;
  triggerConfetti: () => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMPLOYEES: 'sugartown_hrms_employees_v1',
  ATTENDANCE: 'sugartown_hrms_attendance_v1',
  LEAVES: 'sugartown_hrms_leaves_v1',
  PAYROLL: 'sugartown_hrms_payroll_v1',
  ANNOUNCEMENTS: 'sugartown_hrms_announcements_v1',
  CANDIDATES: 'sugartown_hrms_candidates_v1',
  JOB_OPENINGS: 'sugartown_hrms_job_openings_v1',
  AUDIT_LOGS: 'sugartown_hrms_audit_logs_v1',
  ROLE: 'sugartown_hrms_role_v1',
  ADMIN_AUTH: 'sugartown_admin_auth_v1',
  ADMIN_SESSION: 'sugartown_admin_session_v1'
};

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<'all' | StoreLocationId>('all');
  const [globalSearch, setGlobalSearch] = useState('');

  // Admin Portal Authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('sugartown_admin_auth_v1');
    return saved === 'true';
  });

  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('sugartown_admin_session_v1');
    return saved ? JSON.parse(saved) : null;
  });

  // Role state
  const [currentRole, setCurrentRole] = useState<RoleType>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as RoleType) || 'super_admin';
  });

  // Entities
  const [locations] = useState<StoreLocation[]>(INITIAL_LOCATIONS);
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_TODAY;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYROLL);
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL_RECORDS;
  });

  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOB_OPENINGS);
    return saved ? JSON.parse(saved) : INITIAL_JOB_OPENINGS;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(INITIAL_PERFORMANCE_REVIEWS);

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOB_OPENINGS, JSON.stringify(jobOpenings));
  }, [jobOpenings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  // Derive Current User based on Role
  const currentUser: Employee = React.useMemo(() => {
    if (currentRole === 'super_admin') {
      return employees.find(e => e.id === 'ST-1001') || employees[0];
    }
    if (currentRole === 'hr_manager') {
      return employees.find(e => e.id === 'ST-1002') || employees[1];
    }
    if (currentRole === 'director') {
      return employees.find(e => e.id === 'ST-1006') || employees[0];
    }
    if (currentRole === 'store_manager') {
      return employees.find(e => e.id === 'ST-1003') || employees[2];
    }
    // employee
    return employees.find(e => e.id === 'ST-1005') || employees[4];
  }, [currentRole, employees]);

  // Employee Portal User State
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('sugartown_employee_auth_v1');
    return saved === 'true';
  });

  const [employeePortalUser, setEmployeePortalUser] = useState<Employee>(() => {
    const savedId = localStorage.getItem('sugartown_employee_user_id_v1');
    if (savedId) {
      const found = employees.find(e => e.id === savedId);
      if (found) return found;
    }
    return employees.find(e => e.id === 'ST-1005') || employees[0];
  });

  const employeePortalLogin = (empIdOrPhone: string): { success: boolean; employee?: Employee; error?: string } => {
    const query = empIdOrPhone.trim().toLowerCase();
    const cleanDigits = query.replace(/\D/g, '');
    const found = employees.find(e => 
      e.id.toLowerCase() === query || 
      (cleanDigits.length >= 7 && e.phone.replace(/\D/g, '').includes(cleanDigits)) ||
      e.email.toLowerCase() === query
    );
    if (found) {
      setEmployeePortalUser(found);
      setIsEmployeeLoggedIn(true);
      localStorage.setItem('sugartown_employee_auth_v1', 'true');
      localStorage.setItem('sugartown_employee_user_id_v1', found.id);
      logAction('Employee Signed In', `${found.fullName} (${found.id}) logged into Employee Portal`, 'Employee');
      triggerConfetti();
      return { success: true, employee: found };
    }
    return { success: false, error: 'Employee not found. Please enter valid Employee ID (e.g. ST-1005) or phone number.' };
  };

  const employeeLogout = () => {
    setIsEmployeeLoggedIn(false);
    localStorage.removeItem('sugartown_employee_auth_v1');
    localStorage.removeItem('sugartown_employee_user_id_v1');
    setActiveTab('dashboard');
    logAction('Employee Logged Out', `${employeePortalUser.fullName} logged out`, 'Employee');
  };

  const logAction = (action: string, details: string, category: AuditLog['category']) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: formattedDate,
      actorName: currentUser.fullName,
      actorRole: currentUser.designation,
      action,
      details,
      category
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E66A1F', '#A4CDBD', '#EDEAD9', '#FFB74D', '#D97706']
      });
    } catch {
      // fallback safe
    }
  };

  const switchRole = (role: RoleType) => {
    setCurrentRole(role);
    if (role === 'employee') {
      // If switching to store employee, default to Maya's store filter
      setSelectedLocationFilter('loc_cafe_brooklyn');
    } else if (role === 'store_manager') {
      setSelectedLocationFilter('loc_cafe_brooklyn');
    } else {
      setSelectedLocationFilter('all');
    }
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'attendanceStreak' | 'badges'>) => {
    const newId = `ST-${1000 + employees.length + 1}`;
    const newEmployee: Employee = {
      ...employeeData,
      id: newId,
      attendanceStreak: 1,
      badges: []
    };
    setEmployees(prev => [newEmployee, ...prev]);
    logAction('Added New Employee', `Enrolled ${newEmployee.fullName} (${newEmployee.designation}) at ${newEmployee.locationName}`, 'Employee');
    triggerConfetti();
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
    logAction('Updated Employee Profile', `Modified record for ${id}`, 'Employee');
  };

  const isEmployeeCheckedIn = (employeeId: string): boolean => {
    const todayStr = '2026-09-18';
    const record = attendanceRecords.find(r => r.employeeId === employeeId && r.date === todayStr);
    return !!record && !!record.checkInTime && !record.checkOutTime;
  };

  const getTodayAttendance = (employeeId: string): AttendanceRecord | undefined => {
    const todayStr = '2026-09-18';
    return attendanceRecords.find(r => r.employeeId === employeeId && r.date === todayStr);
  };

  const checkIn = (employeeId: string, selfieUrl?: string, customDistance = 12) => {
    const todayStr = '2026-09-18';
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return { success: false, message: 'Employee not found.' };

    const existing = attendanceRecords.find(r => r.employeeId === employeeId && r.date === todayStr);
    if (existing && existing.checkInTime) {
      return { success: false, message: 'Already checked in for today.' };
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Check late arrival
    const isLate = now.getHours() >= 9 && now.getMinutes() > 15;
    const lateMinutes = isLate ? (now.getHours() - 9) * 60 + now.getMinutes() : 0;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      employeeName: emp.fullName,
      locationId: emp.locationId,
      date: todayStr,
      checkInTime: timeStr,
      shift: 'Morning Sweet (7AM - 3PM)',
      status: isLate ? 'late' : 'present',
      lateMinutes,
      overtimeHours: 0,
      verifiedBySelfie: !!selfieUrl,
      selfieUrl: selfieUrl || emp.avatar,
      verifiedByGps: true,
      gpsDistanceMeters: customDistance,
      notes: `Verified at ${emp.locationName} (${customDistance}m from store beacon)`
    };

    setAttendanceRecords(prev => [newRecord, ...prev.filter(r => !(r.employeeId === employeeId && r.date === todayStr))]);
    
    // Increment attendance streak
    setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, attendanceStreak: (e.attendanceStreak || 0) + 1 } : e));

    logAction('Geofenced Check-In', `${emp.fullName} clocked in at ${emp.locationName} with selfie & GPS validation`, 'Attendance');
    triggerConfetti();

    return { success: true, message: `Sweet! Checked in at ${timeStr}. Attendance streak updated!` };
  };

  const checkOut = (employeeId: string) => {
    const todayStr = '2026-09-18';
    const existing = attendanceRecords.find(r => r.employeeId === employeeId && r.date === todayStr);
    if (!existing || !existing.checkInTime) {
      return { success: false, message: 'You have not checked in yet today.' };
    }
    if (existing.checkOutTime) {
      return { success: false, message: 'Already checked out for today.' };
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setAttendanceRecords(prev => prev.map(r => {
      if (r.employeeId === employeeId && r.date === todayStr) {
        return {
          ...r,
          checkOutTime: timeStr,
          overtimeHours: r.overtimeHours > 0 ? r.overtimeHours : 0.5
        };
      }
      return r;
    }));

    const emp = employees.find(e => e.id === employeeId);
    logAction('Check-Out Recorded', `${emp?.fullName || employeeId} checked out at ${timeStr}`, 'Attendance');
    return { success: true, message: `Checked out safely at ${timeStr}. Have a lovely evening!` };
  };

  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `leave-${Date.now()}`,
      status: 'pending',
      appliedOn: '2026-09-18'
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    logAction('Leave Applied', `${leaveData.employeeName} submitted ${leaveData.leaveType} (${leaveData.daysCount} days)`, 'Leave');
    
    // Add an announcement or toast
    setAnnouncements(prev => [
      {
        id: `ann-${Date.now()}`,
        title: `📝 New Leave Request: ${leaveData.employeeName}`,
        content: `${leaveData.employeeName} applied for ${leaveData.leaveType} (${leaveData.daysCount} days from ${leaveData.startDate} to ${leaveData.endDate}). Reason: ${leaveData.reason}`,
        category: 'HR Update',
        author: 'Sugartown HR System',
        authorRole: 'Automated Notification',
        date: '2026-09-18',
        pinned: false
      },
      ...prev
    ]);
  };

  const reviewLeave = (leaveId: string, status: 'approved' | 'rejected', comment?: string) => {
    const targetLeave = leaveRequests.find(l => l.id === leaveId);
    if (!targetLeave) return;

    setLeaveRequests(prev => prev.map(l => {
      if (l.id === leaveId) {
        return {
          ...l,
          status,
          reviewedBy: currentUser.fullName,
          reviewComment: comment || (status === 'approved' ? 'Approved by Manager' : 'Declined per shift schedule')
        };
      }
      return l;
    }));

    // If approved, deduct leave balance
    if (status === 'approved') {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === targetLeave.employeeId) {
          const typeKey = targetLeave.leaveType === 'Annual Paid Leave' 
            ? 'annual' 
            : targetLeave.leaveType === 'Casual Leave' 
            ? 'casual' 
            : targetLeave.leaveType === 'Sick Leave' 
            ? 'sick' 
            : 'sweetSabbatical';

          const currentBalance = emp.leaveBalance[typeKey] || 0;
          return {
            ...emp,
            leaveBalance: {
              ...emp.leaveBalance,
              [typeKey]: Math.max(0, currentBalance - targetLeave.daysCount)
            }
          };
        }
        return emp;
      }));
      triggerConfetti();
    }

    logAction(
      `${status === 'approved' ? 'Approved' : 'Rejected'} Leave Request`,
      `${currentUser.fullName} ${status} request #${leaveId} for ${targetLeave.employeeName}`,
      'Leave'
    );
  };

  const processPayrollBatch = (month: string) => {
    // Generate/refresh payroll for all current employees for the given month
    const updatedPayroll: PayrollRecord[] = employees.map(emp => {
      const basic = emp.salary.baseSalary;
      const hra = emp.salary.hraAllowance;
      const sweetAllowance = emp.salary.sugartownSweetAllowance;
      const transport = emp.salary.transportAllowance;
      const otHours = emp.role === 'employee' ? 6 : emp.role === 'store_manager' ? 8 : 0;
      const otPay = otHours * (emp.salary.overtimeHourlyRate || 25);
      const bonus = emp.role === 'store_manager' ? 450 : 350;

      const gross = basic + hra + sweetAllowance + transport + otPay + bonus;
      const taxRate = emp.salary.taxDeductionsRate / 100;
      const incomeTax = Math.round(gross * taxRate);
      const health = emp.salary.healthInsuranceDeduction;
      const pf = Math.round(basic * 0.07);
      const deductionsTotal = incomeTax + health + pf;

      return {
        id: `pay-${month.replace(/\s+/g, '-').toLowerCase()}-${emp.id}`,
        month,
        employeeId: emp.id,
        employeeName: emp.fullName,
        designation: emp.designation,
        department: emp.department,
        locationName: emp.locationName,
        bankAccountMasked: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)} (Direct Deposit)`,
        workingDays: 22,
        presentDays: 22,
        leaveDays: 0,
        absentDays: 0,
        overtimeHours: otHours,
        earnings: {
          basic,
          hra,
          confectioneryAllowance: sweetAllowance,
          transport,
          overtimePay: otPay,
          incentivesBonus: bonus
        },
        deductions: {
          incomeTax,
          unpaidLeaveDeduction: 0,
          healthInsurance: health,
          providentFund: pf
        },
        netSalary: gross - deductionsTotal,
        status: 'Processed',
        paymentDate: '2026-09-30',
        transactionRef: `SUGAR-TXN-${Math.floor(10000 + Math.random() * 90000)}-${emp.id.replace('ST-', '')}`
      };
    });

    setPayrollRecords(updatedPayroll);
    logAction('Processed Full Payroll Batch', `Generated monthly salary calculations for ${employees.length} employees (${month})`, 'Payroll');
    triggerConfetti();
  };

  const markPayrollPaid = (payrollId: string) => {
    setPayrollRecords(prev => prev.map(p => {
      if (p.id === payrollId) {
        return {
          ...p,
          status: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
    logAction('Salary Disbursed', `Direct deposit issued for record ${payrollId}`, 'Payroll');
    triggerConfetti();
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      date: '2026-09-18'
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAction('Created Announcement', `Posted "${annData.title}" under ${annData.category}`, 'Employee');
    triggerConfetti();
  };

  const awardBadge = (employeeId: string, badgeId: string, customMessage?: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    if (!emp.badges.includes(badgeId)) {
      setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, badges: [...e.badges, badgeId] } : e));
    }

    logAction('Awarded Sugartown Recognition Badge', `Conferred badge [${badgeId}] on ${emp.fullName}`, 'Badge');
    
    // Post to team announcement feed
    setAnnouncements(prev => [
      {
        id: `ann-${Date.now()}`,
        title: `🎖️ Recognition Spotlight: ${emp.fullName}`,
        content: customMessage || `Congratulations to ${emp.fullName} at ${emp.locationName} for receiving a new Sugartown Sweet Badge!`,
        category: 'Sweet Milestone',
        author: currentUser.fullName,
        authorRole: currentUser.designation,
        date: '2026-09-18',
        pinned: false,
        badgeName: badgeId
      },
      ...prev
    ]);

    triggerConfetti();
  };

  const addCandidate = (candData: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const newCand: Candidate = {
      ...candData,
      id: `cand-${Date.now()}`,
      appliedDate: '2026-09-18'
    };
    setCandidates(prev => [newCand, ...prev]);
    logAction('Candidate Enrolled', `Added ${newCand.fullName} for role ${newCand.jobTitle}`, 'Hiring');
  };

  const updateCandidateStage = (candidateId: string, newStage: CandidateStage) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return {
          ...c,
          currentStage: newStage,
          ...(newStage === 'Hired' && !c.onboardingChecklist ? {
            onboardingChecklist: {
              welcomeKitSent: true,
              uniformFitted: false,
              foodSafetyCompleted: false,
              bankDetailsSubmitted: false,
              recipeHandbookGiven: true
            }
          } : {})
        };
      }
      return c;
    }));
    logAction('Updated Candidate Hiring Stage', `Moved candidate ${candidateId} to stage: ${newStage}`, 'Hiring');
    if (newStage === 'Hired') {
      triggerConfetti();
    }
  };

  const updateOnboardingItem = (candidateId: string, key: string, val: boolean) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId && c.onboardingChecklist) {
        return {
          ...c,
          onboardingChecklist: {
            ...c.onboardingChecklist,
            [key]: val
          }
        };
      }
      return c;
    }));
  };

  const addJobOpening = (jobData: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => {
    const newJob: JobOpening = {
      ...jobData,
      id: `job-${Date.now()}`,
      applicantsCount: 0,
      postedDate: '2026-09-18'
    };
    setJobOpenings(prev => [newJob, ...prev]);
    logAction('Posted Job Opening', `Created opening for ${jobData.title} at ${jobData.locationName}`, 'Hiring');
  };

  const uploadEmployeeDocument = (employeeId: string, doc: { name: string; type: Employee['documents'][0]['type']; size: string }) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: doc.name,
      type: doc.type,
      uploadDate: new Date().toISOString().split('T')[0],
      size: doc.size,
      status: 'Verified' as const
    };
    setEmployees(prev => prev.map(e => {
      if (e.id === employeeId) {
        return {
          ...e,
          documents: [newDoc, ...e.documents]
        };
      }
      return e;
    }));
    logAction('Uploaded Staff Document', `Uploaded ${doc.name} (${doc.type}) for staff ${employeeId}`, 'Employee');
    triggerConfetti();
  };

  const verifyEmployeeDocument = (employeeId: string, docId: string, status: 'Verified' | 'Pending Review' | 'Needs Renewal') => {
    setEmployees(prev => prev.map(e => {
      if (e.id === employeeId) {
        return {
          ...e,
          documents: e.documents.map(d => d.id === docId ? { ...d, status } : d)
        };
      }
      return e;
    }));
    logAction('Verified Staff Document', `Updated document status to ${status} for staff ${employeeId}`, 'Employee');
    triggerConfetti();
  };

  const createCustomPayrollRecord = (payrollData: {
    employeeId: string;
    month: string;
    bonus: number;
    overtimeHours: number;
    confectioneryAllowance?: number;
  }) => {
    const emp = employees.find(e => e.id === payrollData.employeeId);
    if (!emp) return;
    const basic = emp.salary.baseSalary;
    const hra = emp.salary.hraAllowance;
    const sweetAllowance = payrollData.confectioneryAllowance ?? emp.salary.sugartownSweetAllowance;
    const transport = emp.salary.transportAllowance;
    const otPay = payrollData.overtimeHours * (emp.salary.overtimeHourlyRate || 25);
    const gross = basic + hra + sweetAllowance + transport + otPay + payrollData.bonus;
    const taxRate = emp.salary.taxDeductionsRate / 100;
    const incomeTax = Math.round(gross * taxRate);
    const health = emp.salary.healthInsuranceDeduction;
    const pf = Math.round(basic * 0.07);
    const deductionsTotal = incomeTax + health + pf;

    const newRecord: PayrollRecord = {
      id: `pay-${payrollData.month.replace(/\s+/g, '-').toLowerCase()}-${emp.id}`,
      month: payrollData.month,
      employeeId: emp.id,
      employeeName: emp.fullName,
      designation: emp.designation,
      department: emp.department,
      locationName: emp.locationName,
      bankAccountMasked: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)} (Direct Deposit)`,
      workingDays: 22,
      presentDays: 22,
      leaveDays: 0,
      absentDays: 0,
      overtimeHours: payrollData.overtimeHours,
      earnings: {
        basic,
        hra,
        confectioneryAllowance: sweetAllowance,
        transport,
        overtimePay: otPay,
        incentivesBonus: payrollData.bonus
      },
      deductions: {
        incomeTax,
        unpaidLeaveDeduction: 0,
        healthInsurance: health,
        providentFund: pf
      },
      netSalary: gross - deductionsTotal,
      status: 'Processed',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionRef: `SUGAR-TXN-${Math.floor(10000 + Math.random() * 90000)}-${emp.id.replace('ST-', '')}`
    };

    setPayrollRecords(prev => [newRecord, ...prev.filter(p => !(p.month === payrollData.month && p.employeeId === emp.id))]);
    logAction('Created Custom Payroll', `Generated payroll for ${emp.fullName} (${payrollData.month})`, 'Payroll');
    triggerConfetti();
  };

  const submitJobApplication = (candData: {
    jobId: string;
    jobTitle: string;
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    resumeSummary: string;
    notes: string;
    department?: string;
    iqScore: number;
    iqPassed: boolean;
    appliedLocations?: string[];
    preferredShift?: string;
    cvFileName?: string;
    cvFileSize?: string;
    documentsCount?: number;
    qualification?: string;
    expectedSalary?: string;
  }) => {
    const newCand: Candidate = {
      ...candData,
      id: `cand-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      currentStage: 'Applied',
      rating: candData.iqScore >= 90 ? 5 : candData.iqScore >= 80 ? 4 : 3,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      onboardingChecklist: {
        welcomeKitSent: false,
        uniformFitted: false,
        foodSafetyCompleted: false,
        bankDetailsSubmitted: false,
        recipeHandbookGiven: false
      }
    };
    setCandidates(prev => [newCand, ...prev]);
    setJobOpenings(prev => prev.map(j => j.id === candData.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));
    logAction('Candidate Applied', `${candData.fullName} applied for ${candData.jobTitle} (IQ: ${candData.iqScore}%)`, 'Hiring');
    triggerConfetti();
    return { success: true, message: 'Application submitted successfully with verified IQ score!' };
  };

  const adminLogin = (phone: string, pass: string): { success: boolean; error?: string } => {
    if (phone.trim() === '9145448010' && pass === 'Chikoo@0205') {
      const session: AdminSession = {
        phone: '9145448010',
        loginTime: new Date().toISOString(),
        role: 'Master Executive Administrator'
      };
      setIsAdminLoggedIn(true);
      setAdminSession(session);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      setCurrentRole('super_admin');
      logAction('Admin Authenticated', 'Master Administrator authenticated via secure phone login (9145448010)', 'Security');
      triggerConfetti();
      return { success: true };
    } else {
      logAction('Admin Auth Failed', `Failed admin login attempt using phone number: ${phone || 'Empty'}`, 'Security');
      return { success: false, error: 'Invalid admin phone number or password. Access denied.' };
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminSession(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    setActiveTab('dashboard');
    logAction('Admin Logged Out', 'Master Administrator session closed (9145448010)', 'Security');
  };

  const batchApproveAllPendingLeaves = (): number => {
    const pending = leaveRequests.filter(l => l.status === 'pending');
    if (pending.length === 0) return 0;
    pending.forEach(l => {
      reviewLeave(l.id, 'approved', 'Batch authorized by Master Administrator (9145448010)');
    });
    triggerConfetti();
    return pending.length;
  };

  const broadcastEmergencyAnnouncement = (title: string, message: string) => {
    setAnnouncements(prev => [
      {
        id: `ann-${Date.now()}`,
        title: `🚨 ${title}`,
        content: message,
        category: 'Store Update',
        author: 'Executive Admin (9145448010)',
        authorRole: 'Master Administrator',
        date: new Date().toISOString().split('T')[0],
        pinned: true
      },
      ...prev
    ]);
    logAction('Admin Emergency Broadcast', `Broadcast alert: ${title}`, 'Store Update');
    triggerConfetti();
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setEmployees(INITIAL_EMPLOYEES);
    setAttendanceRecords(INITIAL_ATTENDANCE_TODAY);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setPayrollRecords(INITIAL_PAYROLL_RECORDS);
    setJobOpenings(INITIAL_JOB_OPENINGS);
    setCandidates(INITIAL_CANDIDATES);
    setPerformanceReviews(INITIAL_PERFORMANCE_REVIEWS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentRole('super_admin');
    setSelectedLocationFilter('all');
    setActiveTab('dashboard');
    setIsAdminLoggedIn(false);
    setAdminSession(null);
    setIsEmployeeLoggedIn(false);
  };

  return (
    <HRMSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentRole,
        switchRole,
        currentUser,
        selectedLocationFilter,
        setSelectedLocationFilter,
        globalSearch,
        setGlobalSearch,
        isEmployeeLoggedIn,
        employeePortalUser,
        setEmployeePortalUser,
        employeePortalLogin,
        employeeLogout,
        isAdminLoggedIn,
        adminSession,
        adminLogin,
        adminLogout,
        batchApproveAllPendingLeaves,
        broadcastEmergencyAnnouncement,
        locations,
        employees,
        attendanceRecords,
        leaveRequests,
        payrollRecords,
        jobOpenings,
        candidates,
        performanceReviews,
        announcements,
        auditLogs,
        addEmployee,
        updateEmployee,
        uploadEmployeeDocument,
        verifyEmployeeDocument,
        checkIn,
        checkOut,
        isEmployeeCheckedIn,
        getTodayAttendance,
        applyLeave,
        reviewLeave,
        processPayrollBatch,
        createCustomPayrollRecord,
        markPayrollPaid,
        addAnnouncement,
        awardBadge,
        addCandidate,
        submitJobApplication,
        updateCandidateStage,
        updateOnboardingItem,
        addJobOpening,
        resetToDefaults,
        triggerConfetti
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};
