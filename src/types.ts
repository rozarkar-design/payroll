export type RoleType = 'super_admin' | 'hr_manager' | 'director' | 'store_manager' | 'employee';

export type DepartmentType = 
  | 'Sales'
  | 'Marketing'
  | 'Operation'
  | 'Backend'
  | 'Corporate'
  | 'Confectionery Production'
  | 'Retail & Store Operations'
  | 'Kitchen & Barista'
  | 'Logistics & Supply'
  | 'Quality & Food Safety'
  | 'People & Culture'
  | 'Finance & Brand Management';

export type StoreLocationId = 
  | 'loc_corp'
  | 'loc_factory'
  | 'loc_cafe_brooklyn'
  | 'loc_store_broadway'
  | 'loc_boutique_uptown';

export interface StoreLocation {
  id: StoreLocationId;
  name: string;
  type: 'Corporate Office' | 'Factory' | 'Candy Café' | 'Store' | 'Boutique';
  address: string;
  city: string;
  managerId: string;
  managerName: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geofenceRadiusMeters: number;
  activeShiftsCount: number;
  openTime: string;
  closeTime: string;
}

export type EmploymentStatus = 'Full-Time' | 'Part-Time' | 'Probation' | 'Contract' | 'On Leave';

export interface EmployeeDocument {
  id: string;
  name: string;
  type: 'Contract' | 'Food Safety License' | 'Tax W-4' | 'ID Proof' | 'Bank Proof' | 'Health Certificate';
  uploadDate: string;
  size: string;
  status: 'Verified' | 'Pending Review' | 'Needs Renewal';
}

export interface SalaryStructure {
  baseSalary: number; // monthly
  hraAllowance: number;
  sugartownSweetAllowance: number; // special company perk
  transportAllowance: number;
  overtimeHourlyRate: number;
  taxDeductionsRate: number; // percentage, e.g. 12
  healthInsuranceDeduction: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Employee {
  id: string; // e.g. ST-1001
  fullName: string;
  avatar: string;
  role: RoleType;
  designation: string;
  department: DepartmentType;
  locationId: StoreLocationId;
  locationName: string;
  email: string;
  phone: string;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  salary: SalaryStructure;
  emergencyContact: EmergencyContact;
  documents: EmployeeDocument[];
  leaveBalance: {
    annual: number; // Paid
    casual: number;
    sick: number;
    sweetSabbatical: number;
  };
  attendanceStreak: number;
  badges: string[]; // badge IDs
  notes?: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'on_leave' | 'half_day';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  locationId: StoreLocationId;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  shift: 'Morning Sweet (7AM - 3PM)' | 'Mid Day (11AM - 7PM)' | 'Evening Rush (2PM - 10PM)' | 'General (9AM - 6PM)';
  status: AttendanceStatus;
  lateMinutes: number;
  overtimeHours: number;
  verifiedBySelfie?: boolean;
  selfieUrl?: string;
  verifiedByGps?: boolean;
  gpsDistanceMeters?: number;
  notes?: string;
}

export type LeaveType = 'Annual Paid Leave' | 'Casual Leave' | 'Sick Leave' | 'Sweet Sabbatical' | 'Bereavement';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: DepartmentType;
  locationName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface PayrollRecord {
  id: string;
  month: string; // "September 2026"
  employeeId: string;
  employeeName: string;
  designation: string;
  department: DepartmentType;
  locationName: string;
  bankAccountMasked: string;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  overtimeHours: number;
  earnings: {
    basic: number;
    hra: number;
    confectioneryAllowance: number;
    transport: number;
    overtimePay: number;
    incentivesBonus: number;
  };
  deductions: {
    incomeTax: number;
    unpaidLeaveDeduction: number;
    healthInsurance: number;
    providentFund: number;
  };
  netSalary: number;
  status: 'Draft' | 'Processed' | 'Paid';
  paymentDate?: string;
  transactionRef?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: DepartmentType;
  locationName: string;
  type: 'Full-Time' | 'Part-Time' | 'Seasonal';
  openingsCount: number;
  applicantsCount: number;
  status: 'Active' | 'Draft' | 'Closed';
  postedDate: string;
  description: string;
  requirements: string[];
}

export type CandidateStage = 'Applied' | 'Screening' | 'Tasting & Trial' | 'Store Manager Round' | 'Offer Extended' | 'Hired';

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  currentStage: CandidateStage;
  rating: number; // 1-5
  appliedDate: string;
  resumeSummary: string;
  notes: string;
  avatar: string;
  department?: string;
  iqScore?: number;
  iqPassed?: boolean;
  iqCompletedAt?: string;
  onboardingChecklist?: {
    welcomeKitSent: boolean;
    uniformFitted: boolean;
    foodSafetyCompleted: boolean;
    bankDetailsSubmitted: boolean;
    recipeHandbookGiven: boolean;
  };
}

export interface PerformanceKPI {
  name: string;
  target: string;
  achieved: string;
  score: number; // percentage 0-100
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  period: string;
  managerName: string;
  rating: number; // out of 5
  kpis: PerformanceKPI[];
  managerFeedback: string;
  employeeGoals: string[];
  sweetBadgeRecommended?: string;
}

export interface SugartownBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'HR Update' | 'Store Update' | 'Birthday' | 'Anniversary' | 'Training' | 'Sweet Milestone';
  author: string;
  authorRole: string;
  date: string;
  pinned: boolean;
  celebrationPersonName?: string;
  celebrationPhoto?: string;
  badgeName?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
  category: 'Attendance' | 'Leave' | 'Payroll' | 'Employee' | 'Hiring' | 'Badge' | 'Security' | 'Store Update';
}
