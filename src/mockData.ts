import {
  Employee,
  StoreLocation,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  JobOpening,
  Candidate,
  PerformanceReview,
  SugartownBadge,
  Announcement,
  AuditLog
} from './types';

export const INITIAL_LOCATIONS: StoreLocation[] = [
  {
    id: 'loc_corp',
    name: 'Sugartown Corporate HQ',
    type: 'Corporate Office',
    address: '428 Broome St, SoHo',
    city: 'New York, NY',
    managerId: 'ST-1002',
    managerName: 'Clara Dupont',
    phone: '+1 (212) 555-0191',
    coordinates: { lat: 40.7209, lng: -73.9992 },
    geofenceRadiusMeters: 100,
    activeShiftsCount: 2,
    openTime: '08:30',
    closeTime: '18:30'
  },
  {
    id: 'loc_factory',
    name: 'Artisan Confectionery Factory',
    type: 'Factory',
    address: '38-12 24th St, Long Island City',
    city: 'Queens, NY',
    managerId: 'ST-1004',
    managerName: 'Antoine Bell',
    phone: '+1 (718) 555-0145',
    coordinates: { lat: 40.7538, lng: -73.9372 },
    geofenceRadiusMeters: 150,
    activeShiftsCount: 3,
    openTime: '06:00',
    closeTime: '22:00'
  },
  {
    id: 'loc_cafe_brooklyn',
    name: 'Sugartown Candy Café',
    type: 'Candy Café',
    address: '68 Water St, DUMBO',
    city: 'Brooklyn, NY',
    managerId: 'ST-1003',
    managerName: 'Marco Rossi',
    phone: '+1 (718) 555-0182',
    coordinates: { lat: 40.7033, lng: -73.9912 },
    geofenceRadiusMeters: 80,
    activeShiftsCount: 3,
    openTime: '07:00',
    closeTime: '21:00'
  },
  {
    id: 'loc_store_broadway',
    name: 'Downtown Flagship Store',
    type: 'Store',
    address: '568 Broadway, SoHo',
    city: 'New York, NY',
    managerId: 'ST-1007',
    managerName: 'Sienna Brooks',
    phone: '+1 (212) 555-0164',
    coordinates: { lat: 40.7243, lng: -73.9972 },
    geofenceRadiusMeters: 80,
    activeShiftsCount: 2,
    openTime: '09:00',
    closeTime: '21:30'
  },
  {
    id: 'loc_boutique_uptown',
    name: 'Uptown Sweet Boutique',
    type: 'Boutique',
    address: '840 Lexington Ave',
    city: 'New York, NY',
    managerId: 'ST-1009',
    managerName: 'Aria Montgomery',
    phone: '+1 (212) 555-0133',
    coordinates: { lat: 40.7651, lng: -73.9644 },
    geofenceRadiusMeters: 60,
    activeShiftsCount: 2,
    openTime: '10:00',
    closeTime: '20:00'
  }
];

export const SUGARTOWN_BADGES: SugartownBadge[] = [
  {
    id: 'badge_chocolatier',
    name: 'Master Chocolatier',
    description: 'Expertise in silky tempering, ganaches, and praline artistry',
    icon: 'Sparkles',
    color: '#E66A1F'
  },
  {
    id: 'badge_sweet_smile',
    name: 'Customer Delight Star',
    description: 'Brings immense warmth and joy to every store guest',
    icon: 'Heart',
    color: '#396B5A'
  },
  {
    id: 'badge_streak_master',
    name: 'Punctuality Guru',
    description: '30+ consecutive days of timely check-ins & precision',
    icon: 'Zap',
    color: '#E66A1F'
  },
  {
    id: 'badge_recipe_wizard',
    name: 'Recipe Alchemist',
    description: 'Developed best-selling seasonal confectionery recipes',
    icon: 'Award',
    color: '#A4CDBD'
  },
  {
    id: 'badge_safety_champion',
    name: 'Food Safety Champion',
    description: 'Flawless safety audit ratings and hygiene guardianship',
    icon: 'ShieldCheck',
    color: '#201D1A'
  },
  {
    id: 'badge_mentor',
    name: 'Sweet Mentor',
    description: 'Outstanding training and warm onboarding of new team members',
    icon: 'Users',
    color: '#E66A1F'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'ST-1001',
    fullName: 'Eleanor Sugartown',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'super_admin',
    designation: 'Founder & Managing Director',
    department: 'People & Culture',
    locationId: 'loc_corp',
    locationName: 'Sugartown Corporate HQ',
    email: 'eleanor@sugartown.in',
    phone: '+91 98220 55100',
    joiningDate: '2021-03-15',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 95000,
      hraAllowance: 22000,
      sugartownSweetAllowance: 8000,
      transportAllowance: 4500,
      overtimeHourlyRate: 0,
      taxDeductionsRate: 18,
      healthInsuranceDeduction: 2800
    },
    emergencyContact: {
      name: 'Thomas Sugartown',
      relationship: 'Spouse',
      phone: '+91 98220 55101',
      email: 'thomas@sugartown.in'
    },
    documents: [
      { id: 'doc-1', name: 'Articles of Incorporation.pdf', type: 'Contract', uploadDate: '2021-03-15', size: '1.4 MB', status: 'Verified' },
      { id: 'doc-2', name: 'Executive Agreement.pdf', type: 'Contract', uploadDate: '2021-03-15', size: '920 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 24, casual: 10, sick: 12, sweetSabbatical: 30 },
    attendanceStreak: 45,
    badges: ['badge_recipe_wizard', 'badge_mentor'],
    notes: 'Oversees brand vision, store expansions, and confectionery innovation.'
  },
  {
    id: 'ST-1002',
    fullName: 'Clara Dupont',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'hr_manager',
    designation: 'Head of People & HR Operations',
    department: 'People & Culture',
    locationId: 'loc_corp',
    locationName: 'Sugartown Corporate HQ',
    email: 'clara.dupont@sugartown.in',
    phone: '+91 98220 55102',
    joiningDate: '2022-01-10',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 68000,
      hraAllowance: 14000,
      sugartownSweetAllowance: 5000,
      transportAllowance: 3500,
      overtimeHourlyRate: 0,
      taxDeductionsRate: 15,
      healthInsuranceDeduction: 2200
    },
    emergencyContact: {
      name: 'Julian Dupont',
      relationship: 'Brother',
      phone: '+91 98220 55103'
    },
    documents: [
      { id: 'doc-3', name: 'HR Leadership Contract.pdf', type: 'Contract', uploadDate: '2022-01-10', size: '850 KB', status: 'Verified' },
      { id: 'doc-4', name: 'W-4 Tax Certificate 2026.pdf', type: 'Tax W-4', uploadDate: '2026-01-05', size: '420 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 18, casual: 7, sick: 9, sweetSabbatical: 14 },
    attendanceStreak: 32,
    badges: ['badge_mentor'],
    notes: 'Leads multi-store hiring, payroll audit, and cultural initiatives.'
  },
  {
    id: 'ST-1003',
    fullName: 'Marco Rossi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'store_manager',
    designation: 'Store & Café General Manager',
    department: 'Retail & Store Operations',
    locationId: 'loc_cafe_brooklyn',
    locationName: 'Sugartown Candy Café',
    email: 'marco.rossi@sugartown.in',
    phone: '+91 98220 55120',
    joiningDate: '2022-05-18',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 52000,
      hraAllowance: 11000,
      sugartownSweetAllowance: 4500,
      transportAllowance: 3000,
      overtimeHourlyRate: 400,
      taxDeductionsRate: 14,
      healthInsuranceDeduction: 1900
    },
    emergencyContact: {
      name: 'Sofia Rossi',
      relationship: 'Spouse',
      phone: '+91 98220 55121'
    },
    documents: [
      { id: 'doc-5', name: 'Store Manager Agreement.pdf', type: 'Contract', uploadDate: '2022-05-18', size: '780 KB', status: 'Verified' },
      { id: 'doc-6', name: 'NYC Food Protection Card.pdf', type: 'Food Safety License', uploadDate: '2025-06-12', size: '610 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 14, casual: 6, sick: 8, sweetSabbatical: 10 },
    attendanceStreak: 28,
    badges: ['badge_sweet_smile', 'badge_safety_champion'],
    notes: 'Oversees DUMBO Candy Café barista and confectionery store staff.'
  },
  {
    id: 'ST-1004',
    fullName: 'Antoine Bell',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'store_manager',
    designation: 'Factory Operations Director',
    department: 'Confectionery Production',
    locationId: 'loc_factory',
    locationName: 'Artisan Confectionery Factory',
    email: 'antoine.bell@sugartown.in',
    phone: '+91 98220 55146',
    joiningDate: '2021-08-01',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 64000,
      hraAllowance: 13000,
      sugartownSweetAllowance: 5000,
      transportAllowance: 3200,
      overtimeHourlyRate: 0,
      taxDeductionsRate: 15,
      healthInsuranceDeduction: 2100
    },
    emergencyContact: {
      name: 'Camille Bell',
      relationship: 'Spouse',
      phone: '+91 98220 55147'
    },
    documents: [
      { id: 'doc-7', name: 'Factory Master Safety Cert.pdf', type: 'Food Safety License', uploadDate: '2024-04-10', size: '1.1 MB', status: 'Verified' }
    ],
    leaveBalance: { annual: 16, casual: 5, sick: 10, sweetSabbatical: 20 },
    attendanceStreak: 40,
    badges: ['badge_safety_champion', 'badge_chocolatier'],
    notes: 'Supervises industrial candy mixers, cacao roasters, packaging lines.'
  },
  {
    id: 'ST-1005',
    fullName: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'employee',
    designation: 'Lead Confectioner & Senior Barista',
    department: 'Kitchen & Barista',
    locationId: 'loc_cafe_brooklyn',
    locationName: 'Sugartown Candy Café',
    email: 'maya.lin@sugartown.in',
    phone: '+91 98220 55155',
    joiningDate: '2023-04-12',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 39000,
      hraAllowance: 8000,
      sugartownSweetAllowance: 3500,
      transportAllowance: 2200,
      overtimeHourlyRate: 280,
      taxDeductionsRate: 11,
      healthInsuranceDeduction: 1400
    },
    emergencyContact: {
      name: 'David Lin',
      relationship: 'Father',
      phone: '+91 98220 55156'
    },
    documents: [
      { id: 'doc-8', name: 'Employment Offer Letter.pdf', type: 'Contract', uploadDate: '2023-04-12', size: '540 KB', status: 'Verified' },
      { id: 'doc-9', name: 'Barista & Food Handler Cert.pdf', type: 'Food Safety License', uploadDate: '2025-08-19', size: '480 KB', status: 'Verified' },
      { id: 'doc-10', name: 'Direct Deposit Form.pdf', type: 'Bank Proof', uploadDate: '2023-04-15', size: '310 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 12, casual: 4, sick: 6, sweetSabbatical: 7 },
    attendanceStreak: 19,
    badges: ['badge_chocolatier', 'badge_sweet_smile', 'badge_streak_master'],
    notes: 'Crafts specialty seasonal truffles and lattes. Star employee at DUMBO!'
  },
  {
    id: 'ST-1006',
    fullName: 'Oliver Vance',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'director',
    designation: 'Chief Commercial Officer & Director',
    department: 'Finance & Brand Management',
    locationId: 'loc_corp',
    locationName: 'Sugartown Corporate HQ',
    email: 'oliver.vance@sugartown.in',
    phone: '+91 98220 55180',
    joiningDate: '2021-06-01',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 88000,
      hraAllowance: 19000,
      sugartownSweetAllowance: 7000,
      transportAllowance: 4000,
      overtimeHourlyRate: 0,
      taxDeductionsRate: 17,
      healthInsuranceDeduction: 2600
    },
    emergencyContact: {
      name: 'Rachel Vance',
      relationship: 'Spouse',
      phone: '+91 98220 55181'
    },
    documents: [
      { id: 'doc-11', name: 'Director Agreement.pdf', type: 'Contract', uploadDate: '2021-06-01', size: '1.2 MB', status: 'Verified' }
    ],
    leaveBalance: { annual: 20, casual: 8, sick: 10, sweetSabbatical: 25 },
    attendanceStreak: 15,
    badges: ['badge_mentor'],
    notes: 'Analyzes multi-store revenue, store margins, retail headcount strategy.'
  },
  {
    id: 'ST-1007',
    fullName: 'Sienna Brooks',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'store_manager',
    designation: 'Store Manager - Broadway Flagship',
    department: 'Retail & Store Operations',
    locationId: 'loc_store_broadway',
    locationName: 'Downtown Flagship Store',
    email: 'sienna.brooks@sugartown.in',
    phone: '+91 98220 55165',
    joiningDate: '2023-02-01',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 51000,
      hraAllowance: 10500,
      sugartownSweetAllowance: 4000,
      transportAllowance: 2800,
      overtimeHourlyRate: 380,
      taxDeductionsRate: 13,
      healthInsuranceDeduction: 1800
    },
    emergencyContact: {
      name: 'Marcus Brooks',
      relationship: 'Brother',
      phone: '+1 (212) 555-0166'
    },
    documents: [
      { id: 'doc-12', name: 'Manager Contract.pdf', type: 'Contract', uploadDate: '2023-02-01', size: '690 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 13, casual: 5, sick: 7, sweetSabbatical: 8 },
    attendanceStreak: 24,
    badges: ['badge_sweet_smile'],
    notes: 'Broadway flagship retail leader with top customer satisfaction scores.'
  },
  {
    id: 'ST-1008',
    fullName: 'Liam Thorne',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'employee',
    designation: 'Master Fudge & Caramel Artisan',
    department: 'Confectionery Production',
    locationId: 'loc_factory',
    locationName: 'Artisan Confectionery Factory',
    email: 'liam.thorne@sugartown.in',
    phone: '+91 98220 55172',
    joiningDate: '2022-09-15',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 42000,
      hraAllowance: 8500,
      sugartownSweetAllowance: 3800,
      transportAllowance: 2400,
      overtimeHourlyRate: 300,
      taxDeductionsRate: 12,
      healthInsuranceDeduction: 1500
    },
    emergencyContact: {
      name: 'Grace Thorne',
      relationship: 'Mother',
      phone: '+91 98220 55173'
    },
    documents: [
      { id: 'doc-13', name: 'Production Specialist Agreement.pdf', type: 'Contract', uploadDate: '2022-09-15', size: '710 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 11, casual: 3, sick: 6, sweetSabbatical: 5 },
    attendanceStreak: 34,
    badges: ['badge_recipe_wizard', 'badge_streak_master'],
    notes: 'Creator of the award-winning Salted Caramel Cashew Fudge.'
  },
  {
    id: 'ST-1009',
    fullName: 'Aria Montgomery',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'store_manager',
    designation: 'Boutique Manager - Uptown',
    department: 'Retail & Store Operations',
    locationId: 'loc_boutique_uptown',
    locationName: 'Uptown Sweet Boutique',
    email: 'aria.montgomery@sugartown.in',
    phone: '+91 98220 55134',
    joiningDate: '2023-09-01',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 49000,
      hraAllowance: 10000,
      sugartownSweetAllowance: 4000,
      transportAllowance: 2800,
      overtimeHourlyRate: 360,
      taxDeductionsRate: 13,
      healthInsuranceDeduction: 1750
    },
    emergencyContact: {
      name: 'Ethan Montgomery',
      relationship: 'Partner',
      phone: '+91 98220 55135'
    },
    documents: [
      { id: 'doc-14', name: 'Employment Agreement.pdf', type: 'Contract', uploadDate: '2023-09-01', size: '640 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 14, casual: 5, sick: 8, sweetSabbatical: 6 },
    attendanceStreak: 21,
    badges: ['badge_sweet_smile'],
    notes: 'Handles luxury confectionery hampers and corporate gifting accounts.'
  },
  {
    id: 'ST-1010',
    fullName: 'Noah Kim',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'employee',
    designation: 'Store Sales & Confectionery Host',
    department: 'Retail & Store Operations',
    locationId: 'loc_store_broadway',
    locationName: 'Downtown Flagship Store',
    email: 'noah.kim@sugartown.in',
    phone: '+91 98220 55195',
    joiningDate: '2024-03-10',
    employmentStatus: 'Part-Time',
    salary: {
      baseSalary: 28000,
      hraAllowance: 5000,
      sugartownSweetAllowance: 2500,
      transportAllowance: 1800,
      overtimeHourlyRate: 220,
      taxDeductionsRate: 9,
      healthInsuranceDeduction: 1100
    },
    emergencyContact: {
      name: 'Sun Kim',
      relationship: 'Mother',
      phone: '+91 98220 55196'
    },
    documents: [
      { id: 'doc-15', name: 'Part-Time Agreement.pdf', type: 'Contract', uploadDate: '2024-03-10', size: '490 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 8, casual: 3, sick: 5, sweetSabbatical: 0 },
    attendanceStreak: 12,
    badges: ['badge_sweet_smile'],
    notes: 'Great at sampling stations and weekend rush hours.'
  },
  {
    id: 'ST-1011',
    fullName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    role: 'employee',
    designation: 'Food Safety & Quality Inspector',
    department: 'Quality & Food Safety',
    locationId: 'loc_factory',
    locationName: 'Artisan Confectionery Factory',
    email: 'elena.rostova@sugartown.in',
    phone: '+91 98220 55198',
    joiningDate: '2023-06-20',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 46000,
      hraAllowance: 9500,
      sugartownSweetAllowance: 3800,
      transportAllowance: 2600,
      overtimeHourlyRate: 320,
      taxDeductionsRate: 12,
      healthInsuranceDeduction: 1600
    },
    emergencyContact: {
      name: 'Alexei Rostov',
      relationship: 'Father',
      phone: '+91 98220 55199'
    },
    documents: [
      { id: 'doc-16', name: 'HACCP Auditor Certificate.pdf', type: 'Food Safety License', uploadDate: '2023-06-20', size: '920 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 15, casual: 6, sick: 8, sweetSabbatical: 10 },
    attendanceStreak: 38,
    badges: ['badge_safety_champion'],
    notes: 'Monitors batch purity, microbiological tests, and allergen labelling.'
  },
  {
    id: 'ST-1012',
    fullName: 'Tariq Hassan',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'employee',
    designation: 'Logistics & Store Dispatch Coordinator',
    department: 'Logistics & Supply',
    locationId: 'loc_factory',
    locationName: 'Artisan Confectionery Factory',
    email: 'tariq.hassan@sugartown.in',
    phone: '+91 98220 55210',
    joiningDate: '2022-11-05',
    employmentStatus: 'Full-Time',
    salary: {
      baseSalary: 41000,
      hraAllowance: 8200,
      sugartownSweetAllowance: 3500,
      transportAllowance: 3000,
      overtimeHourlyRate: 290,
      taxDeductionsRate: 11,
      healthInsuranceDeduction: 1450
    },
    emergencyContact: {
      name: 'Amina Hassan',
      relationship: 'Spouse',
      phone: '+91 98220 55211'
    },
    documents: [
      { id: 'doc-17', name: 'Logistics Dispatch Agreement.pdf', type: 'Contract', uploadDate: '2022-11-05', size: '580 KB', status: 'Verified' }
    ],
    leaveBalance: { annual: 10, casual: 4, sick: 7, sweetSabbatical: 4 },
    attendanceStreak: 29,
    badges: ['badge_streak_master'],
    notes: 'Coordinates morning fresh confectionery deliveries across all stores.'
  }
];

export const INITIAL_ATTENDANCE_TODAY: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'ST-1005',
    employeeName: 'Maya Lin',
    locationId: 'loc_cafe_brooklyn',
    date: '2026-09-18',
    checkInTime: '06:54',
    shift: 'Morning Sweet (7AM - 3PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 0,
    verifiedBySelfie: true,
    selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verifiedByGps: true,
    gpsDistanceMeters: 14,
    notes: 'On time for espresso machine warm-up and fresh pastry delivery.'
  },
  {
    id: 'att-2',
    employeeId: 'ST-1003',
    employeeName: 'Marco Rossi',
    locationId: 'loc_cafe_brooklyn',
    date: '2026-09-18',
    checkInTime: '06:48',
    shift: 'Morning Sweet (7AM - 3PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 0.5,
    verifiedBySelfie: true,
    verifiedByGps: true,
    gpsDistanceMeters: 6
  },
  {
    id: 'att-3',
    employeeId: 'ST-1002',
    employeeName: 'Clara Dupont',
    locationId: 'loc_corp',
    date: '2026-09-18',
    checkInTime: '08:25',
    shift: 'General (9AM - 6PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 0,
    verifiedByGps: true,
    gpsDistanceMeters: 22
  },
  {
    id: 'att-4',
    employeeId: 'ST-1008',
    employeeName: 'Liam Thorne',
    locationId: 'loc_factory',
    date: '2026-09-18',
    checkInTime: '06:12',
    shift: 'Morning Sweet (7AM - 3PM)',
    status: 'late',
    lateMinutes: 12,
    overtimeHours: 0,
    verifiedBySelfie: true,
    verifiedByGps: true,
    gpsDistanceMeters: 18,
    notes: 'Subway signal delay on Queens Blvd.'
  },
  {
    id: 'att-5',
    employeeId: 'ST-1004',
    employeeName: 'Antoine Bell',
    locationId: 'loc_factory',
    date: '2026-09-18',
    checkInTime: '05:50',
    shift: 'Morning Sweet (7AM - 3PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 1.0,
    verifiedByGps: true,
    gpsDistanceMeters: 10
  },
  {
    id: 'att-6',
    employeeId: 'ST-1007',
    employeeName: 'Sienna Brooks',
    locationId: 'loc_store_broadway',
    date: '2026-09-18',
    checkInTime: '08:45',
    shift: 'General (9AM - 6PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 0,
    verifiedByGps: true,
    gpsDistanceMeters: 15
  },
  {
    id: 'att-7',
    employeeId: 'ST-1010',
    employeeName: 'Noah Kim',
    locationId: 'loc_store_broadway',
    date: '2026-09-18',
    checkInTime: '09:18',
    shift: 'General (9AM - 6PM)',
    status: 'late',
    lateMinutes: 18,
    overtimeHours: 0,
    verifiedByGps: true,
    gpsDistanceMeters: 19
  },
  {
    id: 'att-8',
    employeeId: 'ST-1009',
    employeeName: 'Aria Montgomery',
    locationId: 'loc_boutique_uptown',
    date: '2026-09-18',
    checkInTime: '09:50',
    shift: 'General (9AM - 6PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 0,
    verifiedByGps: true,
    gpsDistanceMeters: 8
  },
  {
    id: 'att-9',
    employeeId: 'ST-1011',
    employeeName: 'Elena Rostova',
    locationId: 'loc_factory',
    date: '2026-09-18',
    status: 'on_leave',
    shift: 'General (9AM - 6PM)',
    lateMinutes: 0,
    overtimeHours: 0,
    notes: 'Approved Annual Confectionery Research leave.'
  },
  {
    id: 'att-10',
    employeeId: 'ST-1012',
    employeeName: 'Tariq Hassan',
    locationId: 'loc_factory',
    date: '2026-09-18',
    checkInTime: '06:05',
    shift: 'Morning Sweet (7AM - 3PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 1.5,
    verifiedByGps: true,
    gpsDistanceMeters: 12
  },
  {
    id: 'att-11',
    employeeId: 'ST-1006',
    employeeName: 'Oliver Vance',
    locationId: 'loc_corp',
    date: '2026-09-18',
    checkInTime: '08:55',
    shift: 'General (9AM - 6PM)',
    status: 'present',
    lateMinutes: 0,
    overtimeHours: 0,
    verifiedByGps: true,
    gpsDistanceMeters: 30
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-101',
    employeeId: 'ST-1005',
    employeeName: 'Maya Lin',
    department: 'Kitchen & Barista',
    locationName: 'Sugartown Candy Café',
    leaveType: 'Annual Paid Leave',
    startDate: '2026-09-24',
    endDate: '2026-09-26',
    daysCount: 3,
    reason: 'Family visit and attending an artisan pastry expo in Boston.',
    status: 'pending',
    appliedOn: '2026-09-17'
  },
  {
    id: 'leave-102',
    employeeId: 'ST-1011',
    employeeName: 'Elena Rostova',
    department: 'Quality & Food Safety',
    locationName: 'Artisan Confectionery Factory',
    leaveType: 'Sweet Sabbatical',
    startDate: '2026-09-18',
    endDate: '2026-09-20',
    daysCount: 3,
    reason: 'Attending European Food Safety Summit on organic natural flavorings.',
    status: 'approved',
    appliedOn: '2026-09-10',
    reviewedBy: 'Clara Dupont',
    reviewComment: 'Approved! Please share highlights with the production team upon return.'
  },
  {
    id: 'leave-103',
    employeeId: 'ST-1010',
    employeeName: 'Noah Kim',
    department: 'Retail & Store Operations',
    locationName: 'Downtown Flagship Store',
    leaveType: 'Casual Leave',
    startDate: '2026-09-22',
    endDate: '2026-09-22',
    daysCount: 1,
    reason: 'University final semester thesis submission.',
    status: 'approved',
    appliedOn: '2026-09-14',
    reviewedBy: 'Sienna Brooks',
    reviewComment: 'Good luck with the thesis Noah!'
  },
  {
    id: 'leave-104',
    employeeId: 'ST-1008',
    employeeName: 'Liam Thorne',
    department: 'Confectionery Production',
    locationName: 'Artisan Confectionery Factory',
    leaveType: 'Sick Leave',
    startDate: '2026-09-08',
    endDate: '2026-09-09',
    daysCount: 2,
    reason: 'Seasonal flu rest.',
    status: 'approved',
    appliedOn: '2026-09-08',
    reviewedBy: 'Antoine Bell',
    reviewComment: 'Get well soon Liam.'
  }
];

export const HOLIDAY_CALENDAR = [
  { date: '2026-01-01', name: "New Year's Day Celebration", type: 'Public Holiday' },
  { date: '2026-02-14', name: "Valentine's Sweet Rush Day (Store Bonus)", type: 'Sugartown Special' },
  { date: '2026-05-25', name: 'Memorial Day', type: 'Public Holiday' },
  { date: '2026-07-07', name: 'World Chocolate Day 🍫', type: 'Sugartown Festival' },
  { date: '2026-09-07', name: 'Labor Day', type: 'Public Holiday' },
  { date: '2026-10-31', name: 'Halloween Candy Extravaganza', type: 'Sugartown Special' },
  { date: '2026-11-26', name: 'Thanksgiving Day', type: 'Public Holiday' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'Public Holiday' }
];

export const INITIAL_PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: 'pay-2026-09-1005',
    month: 'September 2026',
    employeeId: 'ST-1005',
    employeeName: 'Maya Lin',
    designation: 'Lead Confectioner & Senior Barista',
    department: 'Kitchen & Barista',
    locationName: 'Sugartown Candy Café',
    bankAccountMasked: '•••• •••• •••• 4892 (HDFC Bank - FC Road)',
    workingDays: 22,
    presentDays: 22,
    leaveDays: 0,
    absentDays: 0,
    overtimeHours: 6.5,
    earnings: {
      basic: 39000,
      hra: 8000,
      confectioneryAllowance: 3500,
      transport: 2200,
      overtimePay: 1820,
      incentivesBonus: 3000
    },
    deductions: {
      incomeTax: 5750,
      unpaidLeaveDeduction: 0,
      healthInsurance: 1400,
      providentFund: 2800
    },
    netSalary: 47570,
    status: 'Processed',
    paymentDate: '2026-09-30',
    transactionRef: 'SUGAR-TXN-90214-ML'
  },
  {
    id: 'pay-2026-09-1003',
    month: 'September 2026',
    employeeId: 'ST-1003',
    employeeName: 'Marco Rossi',
    designation: 'Store & Café General Manager',
    department: 'Retail & Store Operations',
    locationName: 'Sugartown Candy Café',
    bankAccountMasked: '•••• •••• •••• 8812 (ICICI Bank - Shivaji Nagar)',
    workingDays: 22,
    presentDays: 21,
    leaveDays: 1,
    absentDays: 0,
    overtimeHours: 8,
    earnings: {
      basic: 52000,
      hra: 11000,
      confectioneryAllowance: 4500,
      transport: 3000,
      overtimePay: 3200,
      incentivesBonus: 4500
    },
    deductions: {
      incomeTax: 7800,
      unpaidLeaveDeduction: 0,
      healthInsurance: 1900,
      providentFund: 3640
    },
    netSalary: 61860,
    status: 'Processed',
    paymentDate: '2026-09-30',
    transactionRef: 'SUGAR-TXN-90215-MR'
  },
  {
    id: 'pay-2026-09-1008',
    month: 'September 2026',
    employeeId: 'ST-1008',
    employeeName: 'Liam Thorne',
    designation: 'Master Fudge & Caramel Artisan',
    department: 'Confectionery Production',
    locationName: 'Artisan Confectionery Factory',
    bankAccountMasked: '•••• •••• •••• 3144 (State Bank of India - Bund Garden)',
    workingDays: 22,
    presentDays: 20,
    leaveDays: 2,
    absentDays: 0,
    overtimeHours: 12,
    earnings: {
      basic: 42000,
      hra: 8500,
      confectioneryAllowance: 3800,
      transport: 2400,
      overtimePay: 3600,
      incentivesBonus: 4000
    },
    deductions: {
      incomeTax: 5800,
      unpaidLeaveDeduction: 0,
      healthInsurance: 1500,
      providentFund: 2940
    },
    netSalary: 54060,
    status: 'Processed',
    paymentDate: '2026-09-30',
    transactionRef: 'SUGAR-TXN-90216-LT'
  },
  {
    id: 'pay-2026-09-1007',
    month: 'September 2026',
    employeeId: 'ST-1007',
    employeeName: 'Sienna Brooks',
    designation: 'Store Manager - Broadway Flagship',
    department: 'Retail & Store Operations',
    locationName: 'Downtown Flagship Store',
    bankAccountMasked: '•••• •••• •••• 9011 (Axis Bank - Koregaon Park)',
    workingDays: 22,
    presentDays: 22,
    leaveDays: 0,
    absentDays: 0,
    overtimeHours: 4,
    earnings: {
      basic: 51000,
      hra: 10500,
      confectioneryAllowance: 4000,
      transport: 2800,
      overtimePay: 1520,
      incentivesBonus: 5000
    },
    deductions: {
      incomeTax: 7600,
      unpaidLeaveDeduction: 0,
      healthInsurance: 1800,
      providentFund: 3570
    },
    netSalary: 61850,
    status: 'Processed',
    paymentDate: '2026-09-30',
    transactionRef: 'SUGAR-TXN-90217-SB'
  }
];

export const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-store-staff',
    title: 'Store Staff & Confectionery Barista',
    department: 'Operation',
    locationName: 'Sugartown Candy Café - Brooklyn',
    type: 'Full-Time',
    openingsCount: 5,
    applicantsCount: 32,
    status: 'Active',
    postedDate: '2026-09-14',
    description: 'Provide radiant customer service, prepare specialty artisan beverages, handle checkout POS, and merchandise fresh hand-crafted candies.',
    requirements: ['High school diploma or equivalent', 'Customer-first mindset', 'Pass mandatory 10-min IQ & logic evaluation (≥ 70%)', 'Weekend shift flexibility']
  },
  {
    id: 'job-store-manager',
    title: 'Store Manager',
    department: 'Operation',
    locationName: 'Downtown Flagship Store - Broadway',
    type: 'Full-Time',
    openingsCount: 2,
    applicantsCount: 16,
    status: 'Active',
    postedDate: '2026-09-10',
    description: 'Lead entire daily store retail operations, inventory replenishment, daily cash audits, staff shift scheduling, and team performance development.',
    requirements: ['2+ years retail management experience', 'Inventory & food hygiene certification', 'Strong team leadership', 'Pass mandatory 10-min IQ test (≥ 70%)']
  },
  {
    id: 'job-cluster-manager',
    title: 'Cluster Manager (Multi-Store Retail Operations)',
    department: 'Operation',
    locationName: 'New York City Cluster (All 5 Locations)',
    type: 'Full-Time',
    openingsCount: 1,
    applicantsCount: 8,
    status: 'Active',
    postedDate: '2026-09-05',
    description: 'Drive multi-store operational excellence across all retail outlets, monitor P&L metrics, ensure brand compliance, and coach store managers.',
    requirements: ['4+ years multi-unit or district retail leadership', 'Demonstrated P&L stewardship', 'Cognitive aptitude qualification (≥ 70%)', 'Bachelor degree or equivalent']
  },
  {
    id: 'job-sales-exec',
    title: 'Corporate Gifting & B2B Sales Executive',
    department: 'Sales',
    locationName: 'Sugartown Corporate HQ',
    type: 'Full-Time',
    openingsCount: 2,
    applicantsCount: 21,
    status: 'Active',
    postedDate: '2026-09-11',
    description: 'Drive high-volume enterprise gifting contracts, luxury holiday hampers, and catering partnerships with corporate clients and luxury brands.',
    requirements: ['2+ years B2B corporate sales experience', 'Demonstrated pipeline generation', 'Aptitude & quantitative evaluation (≥ 70%)', 'Excellent presentation skills']
  },
  {
    id: 'job-marketing-lead',
    title: 'Digital Marketing & Social Brand Strategist',
    department: 'Marketing',
    locationName: 'Sugartown Corporate HQ',
    type: 'Full-Time',
    openingsCount: 1,
    applicantsCount: 27,
    status: 'Active',
    postedDate: '2026-09-12',
    description: 'Spearhead digital marketing campaigns, influencer confectionery collaborations, viral product launches, and omnichannel customer acquisition.',
    requirements: ['3+ years consumer brand/F&B marketing', 'Proficient in creative content and analytics', 'Problem solving & IQ test (≥ 70%)']
  },
  {
    id: 'job-backend-eng',
    title: 'Backend Systems Engineer (HRMS & Cloud Inventory)',
    department: 'Backend',
    locationName: 'Sugartown Corporate HQ & Remote Hybrid',
    type: 'Full-Time',
    openingsCount: 2,
    applicantsCount: 14,
    status: 'Active',
    postedDate: '2026-09-08',
    description: 'Architect and scale backend REST/GraphQL microservices for real-time store inventory, IoT kitchen temperature logs, and HRMS payroll systems.',
    requirements: ['3+ years TypeScript/Node.js/Go backend experience', 'Relational & distributed database design', 'Analytical & logical evaluation (≥ 70%)']
  },
  {
    id: 'job-corporate-finance',
    title: 'Corporate Finance & Regulatory Compliance Associate',
    department: 'Corporate',
    locationName: 'Sugartown Corporate HQ',
    type: 'Full-Time',
    openingsCount: 1,
    applicantsCount: 11,
    status: 'Active',
    postedDate: '2026-09-07',
    description: 'Oversee corporate treasury, payroll reconciliations, statutory tax filings, multi-state labor compliance, and retail financial reporting.',
    requirements: ['CPA / Accounting degree or equivalent', '2+ years corporate finance/payroll compliance', 'Cognitive & numerical reasoning test (≥ 70%)']
  },
  {
    id: 'job-chocolatier',
    title: 'Senior Artisan Chocolatier & Pastry Specialist',
    department: 'Operation',
    locationName: 'Artisan Confectionery Factory',
    type: 'Full-Time',
    openingsCount: 2,
    applicantsCount: 14,
    status: 'Active',
    postedDate: '2026-09-02',
    description: 'Lead tempering, molded bonbons, and innovative holiday fillings in our Long Island City production facility.',
    requirements: ['3+ years in craft chocolate', 'HACCP food safety cert', 'Mandatory cognitive & hygiene test (≥ 70%)']
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    jobTitle: 'Senior Artisan Chocolatier',
    fullName: 'Lucas Martin',
    email: 'lucas.martin@craftcacao.org',
    phone: '+1 (917) 555-0321',
    experience: '4 years at Valrhona partner boutique',
    currentStage: 'Tasting & Trial',
    rating: 5,
    appliedDate: '2026-09-04',
    resumeSummary: 'Expert in bean-to-bar micro-batches, silky ganache textures, and airbrush cocoa butter techniques.',
    notes: 'Tasting session scheduled for Tuesday at Queens factory. Trial recipe: Yuzu-Pistachio Praline.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    onboardingChecklist: {
      welcomeKitSent: false,
      uniformFitted: false,
      foodSafetyCompleted: true,
      bankDetailsSubmitted: false,
      recipeHandbookGiven: false
    }
  },
  {
    id: 'cand-2',
    jobId: 'job-2',
    jobTitle: 'Store Supervisor & Guest Experience Lead',
    fullName: 'Chloe Zhao',
    email: 'chloe.zhao@gmail.com',
    phone: '+1 (646) 555-0782',
    experience: '3 years Assistant Manager at Brooklyn Bakeries',
    currentStage: 'Store Manager Round',
    rating: 4,
    appliedDate: '2026-09-09',
    resumeSummary: 'Dynamic shift leader with proven record of boosting average store ticket size by 18%.',
    notes: 'Marco Rossi reviewed CV and found great energy. Second round interview this Friday.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cand-3',
    jobId: 'job-1',
    jobTitle: 'Senior Artisan Chocolatier',
    fullName: 'Gabriel Santos',
    email: 'gabriel.santos@sweets.com',
    phone: '+1 (347) 555-0914',
    experience: '2.5 years hotel pastry chef',
    currentStage: 'Screening',
    rating: 4,
    appliedDate: '2026-09-14',
    resumeSummary: 'Strong foundation in sugar pulling, nougat, and bonbon decoration.',
    notes: 'Phone screening conducted by Clara. Friendly cultural fit.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cand-4',
    jobId: 'job-3',
    jobTitle: 'Seasonal Pastry & Fudge Assistant',
    fullName: 'Harper Jenkins',
    email: 'harper.j@outlook.com',
    phone: '+1 (917) 555-0623',
    experience: 'Culinary Arts Graduate, ICE NY',
    currentStage: 'Offer Extended',
    rating: 5,
    appliedDate: '2026-09-13',
    resumeSummary: 'Fast learner, passionate about artisan caramel chemistry and fudge swirling.',
    notes: 'Offer letter dispatched on Sept 17. Awaiting signed contract.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    onboardingChecklist: {
      welcomeKitSent: true,
      uniformFitted: true,
      foodSafetyCompleted: true,
      bankDetailsSubmitted: true,
      recipeHandbookGiven: false
    }
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🍬 Welcome Autumn! Seasonal Cinnamon Butter Fudge Launch',
    content: 'Starting Monday Sept 22, all Sugartown retail stores & Candy Café will receive the first harvest batch of our Cinnamon Butter Pecan Fudge! Store staff please review display guidelines and complimentary customer tasting cubes.',
    category: 'Store Update',
    author: 'Eleanor Sugartown',
    authorRole: 'Founder',
    date: '2026-09-18',
    pinned: true
  },
  {
    id: 'ann-2',
    title: '🎉 Happy Sugartown Birthday, Maya Lin!',
    content: 'Wishing our lead confectioner and DUMBO barista Maya Lin the sweetest of birthdays today! Thank you for lighting up the café every single morning with genuine smiles and the crunchiest honeycomb lattes! Stop by the kitchen for birthday cake slices.',
    category: 'Birthday',
    author: 'Marco Rossi',
    authorRole: 'Candy Café Store Manager',
    date: '2026-09-18',
    pinned: true,
    celebrationPersonName: 'Maya Lin',
    celebrationPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'ann-3',
    title: '🏆 Sweet Recognition: Liam Thorne awarded Recipe Alchemist',
    content: 'Huge congratulations to Liam Thorne at the Long Island City Factory for inventing the Roasted Almond Toffee Caramel crunch! It has broken all company reorder records this month!',
    category: 'Sweet Milestone',
    author: 'Clara Dupont',
    authorRole: 'Head of People',
    date: '2026-09-16',
    pinned: false,
    badgeName: 'Recipe Alchemist'
  },
  {
    id: 'ann-4',
    title: '📚 Mandatory Food Safety & Allergen Refresher Workshop',
    content: 'Quarterly allergen protocol training will take place virtually this Thursday at 4:00 PM EST for all retail staff and kitchen assistants. Attendance is paid and required.',
    category: 'Training',
    author: 'Elena Rostova',
    authorRole: 'Quality & Food Safety',
    date: '2026-09-15',
    pinned: false
  }
];

export const INITIAL_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: 'rev-1',
    employeeId: 'ST-1005',
    employeeName: 'Maya Lin',
    designation: 'Lead Confectioner & Senior Barista',
    period: 'Q3 2026',
    managerName: 'Marco Rossi',
    rating: 4.9,
    kpis: [
      { name: 'Customer Sweetness & Hospitality Rating', target: '92%', achieved: '98%', score: 98 },
      { name: 'Barista Punctuality & Shift Readiness', target: '95%', achieved: '99%', score: 99 },
      { name: 'Specialty Confectionery Order Accuracy', target: '98%', achieved: '99.5%', score: 100 },
      { name: 'Wastage & Food Prep Efficiency', target: '< 3%', achieved: '1.2%', score: 95 }
    ],
    managerFeedback: 'Maya brings infectious cheer to both customers and peers. Her new caramel praline latte recipe has become our #1 bestseller in DUMBO.',
    employeeGoals: [
      'Complete Level 2 Chocolate Aeration & Tempering certification',
      'Mentor 2 incoming seasonal kitchen associates for the winter rush',
      'Develop 2 seasonal hot chocolate recipes for Thanksgiving'
    ],
    sweetBadgeRecommended: 'Customer Delight Star'
  },
  {
    id: 'rev-2',
    employeeId: 'ST-1008',
    employeeName: 'Liam Thorne',
    designation: 'Master Fudge & Caramel Artisan',
    period: 'Q3 2026',
    managerName: 'Antoine Bell',
    rating: 4.8,
    kpis: [
      { name: 'Batch Consistency & Texture Standards', target: '96%', achieved: '99%', score: 99 },
      { name: 'Daily Factory Production Target Fulfillment', target: '95%', achieved: '97%', score: 97 },
      { name: 'Ingredient Yield & Moisture Optimization', target: '90%', achieved: '93%', score: 93 }
    ],
    managerFeedback: 'Liam is the backbone of our fudge boiling department. His meticulous temperature monitoring ensures silky, crystal-free caramel every single batch.',
    employeeGoals: [
      'Automate sugar cooling kettle calibration',
      'Test organic cane sugar alternative yields'
    ],
    sweetBadgeRecommended: 'Recipe Alchemist'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-18 08:30:12',
    actorName: 'Clara Dupont',
    actorRole: 'Head of People',
    action: 'Approved Leave Request',
    details: 'Approved 3 days Sweet Sabbatical for Elena Rostova (Quality & Food Safety)',
    category: 'Leave'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-18 06:54:02',
    actorName: 'Maya Lin',
    actorRole: 'Employee',
    action: 'Geofenced Check-In',
    details: 'Checked in at Sugartown Candy Café (DUMBO) - Geofence accuracy 14m, selfie verified',
    category: 'Attendance'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-17 17:15:40',
    actorName: 'Marco Rossi',
    actorRole: 'Store Manager',
    action: 'Published Announcement',
    details: 'Posted Birthday celebration announcement for Maya Lin',
    category: 'Employee'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-16 11:20:00',
    actorName: 'Clara Dupont',
    actorRole: 'Head of People',
    action: 'Processed Monthly Payroll Batch',
    details: 'Executed preliminary payroll calculations for September 2026 across 5 locations',
    category: 'Payroll'
  }
];
