import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  ClockAlert,
  Briefcase,
  DollarSign,
  Sparkles,
  Flame,
  Cake,
  Award,
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserPlus,
  Megaphone,
  ArrowUpRight
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { DashboardPortalGateway } from './DashboardPortalGateway';

interface DashboardViewProps {
  onOpenQuickAction: (action: 'checkin' | 'leave' | 'payslip' | 'employee' | 'announcement') => void;
  onSelectEmployee?: (employeeId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickAction, onSelectEmployee }) => {
  const {
    currentUser,
    currentRole,
    employees,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    jobOpenings,
    announcements,
    locations,
    selectedLocationFilter,
    setActiveTab,
    triggerConfetti
  } = useHRMS();

  // Filter employees & records if store location is selected
  const filteredEmployees = selectedLocationFilter === 'all'
    ? employees
    : employees.filter(e => e.locationId === selectedLocationFilter);

  const totalEmployees = filteredEmployees.length;

  const todayStr = '2026-09-18';
  const todayAttendance = attendanceRecords.filter(r => {
    if (r.date !== todayStr) return false;
    if (selectedLocationFilter !== 'all') return r.locationId === selectedLocationFilter;
    return true;
  });

  const presentToday = todayAttendance.filter(r => r.status === 'present' || r.status === 'late').length;
  const lateArrivals = todayAttendance.filter(r => r.status === 'late').length;
  const onLeaveToday = todayAttendance.filter(r => r.status === 'on_leave').length + 
    leaveRequests.filter(l => l.status === 'approved' && l.startDate <= todayStr && l.endDate >= todayStr).length;
  const absentToday = Math.max(0, totalEmployees - presentToday - onLeaveToday);

  const openPositions = jobOpenings.filter(j => j.status === 'Active').reduce((acc, curr) => acc + curr.openingsCount, 0);
  const payrollStatus = payrollRecords.every(p => p.status === 'Paid') ? 'Disbursed' : 'Processed (Sep 2026)';

  // Determine greeting based on current local hour
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (currentHour >= 17) {
    timeGreeting = 'Good evening';
  }

  // Pending leaves
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending');
  // Birthday highlight
  const birthdayAnnouncement = announcements.find(a => a.category === 'Birthday');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Main Dashboard Portal Gateway: Employee Login, Admin Login & Apply Job (First UI) */}
      <DashboardPortalGateway />

      {/* Sugartown Confectionery Operations Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#EDEAD9] via-[#FAF8F2] to-[#FEF4ED] border border-[#E5E0D2] p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E66A1F]/10 border border-[#E66A1F]/20 text-xs font-bold text-[#E66A1F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sugartown HQ & Store Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201D1A] tracking-tight font-display">
              {timeGreeting}, <span className="text-[#E66A1F]">Team Sugartown!</span> 🍬
            </h1>
            <p className="text-sm text-[#6B655D] max-w-2xl leading-relaxed">
              Welcome to the confectionery operations hub. All 5 stores, bakery lines, and delivery fleets are synchronized.
            </p>
          </div>

          {/* Quick Streak & Culture highlight */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-[#E5E0D2] rounded-2xl p-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#FEF4ED] flex items-center justify-center text-[#E66A1F] shrink-0">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-[#201D1A]">
                  {currentRole === 'employee' ? `${currentUser.attendanceStreak} Days` : '98.4%'}
                </span>
                <span className="text-[10px] font-bold text-[#396B5A] bg-[#EEF7F4] px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#6B655D]">
                {currentRole === 'employee' ? 'Your On-Time Check-in Streak 🔥' : 'Company On-Time Record'}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative soft circles in background */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#A4CDBD]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#E66A1F]/15 blur-2xl pointer-events-none" />
      </div>

      {/* Primary 7 Metrics Bar (as explicitly requested) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        
        {/* Total Employees */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs hover:border-[#E66A1F]/40 transition-all">
          <div className="flex items-center justify-between text-[#6B655D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Staff</span>
            <Users className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">{totalEmployees}</p>
          <span className="text-[10px] text-[#6B655D] mt-1 block">5 locations active</span>
        </div>

        {/* Present Today */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs hover:border-[#396B5A]/40 transition-all">
          <div className="flex items-center justify-between text-[#6B655D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Present Today</span>
            <UserCheck className="w-4 h-4 text-[#396B5A]" />
          </div>
          <p className="text-2xl font-black text-[#396B5A] font-display">{presentToday}</p>
          <span className="text-[10px] text-[#396B5A] font-medium mt-1 block">
            {totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 100}% on shift
          </span>
        </div>

        {/* Absent */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs hover:border-[#E66A1F]/40 transition-all">
          <div className="flex items-center justify-between text-[#6B655D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Absent</span>
            <UserX className="w-4 h-4 text-[#C2541A]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">{absentToday}</p>
          <span className="text-[10px] text-[#6B655D] mt-1 block">Unscheduled</span>
        </div>

        {/* On Leave */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs hover:border-[#A4CDBD]/60 transition-all">
          <div className="flex items-center justify-between text-[#6B655D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">On Leave</span>
            <CalendarCheck className="w-4 h-4 text-[#396B5A]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">{onLeaveToday}</p>
          <span className="text-[10px] text-[#396B5A] font-medium mt-1 block">Approved PTO</span>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs hover:border-[#E66A1F]/40 transition-all">
          <div className="flex items-center justify-between text-[#6B655D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Late Arrivals</span>
            <ClockAlert className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <p className="text-2xl font-black text-[#E66A1F] font-display">{lateArrivals}</p>
          <span className="text-[10px] text-[#6B655D] mt-1 block">&gt; 15 mins delay</span>
        </div>

        {/* Open Positions */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs hover:border-[#E66A1F]/40 transition-all">
          <div className="flex items-center justify-between text-[#6B655D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Open Roles</span>
            <Briefcase className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">{openPositions}</p>
          <span className="text-[10px] text-[#396B5A] font-medium mt-1 block">4 active jobs</span>
        </div>

        {/* Payroll Status */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-white p-4 rounded-2xl border border-[#E5E0D2] shadow-2xs hover:border-[#396B5A]/40 transition-all">
          <div className="flex items-center justify-between text-[#6B655D] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Payroll</span>
            <DollarSign className="w-4 h-4 text-[#396B5A]" />
          </div>
          <p className="text-base font-black text-[#396B5A] font-display truncate">{payrollStatus}</p>
          <span className="text-[10px] text-[#6B655D] mt-1 block">Sep 2026 ready</span>
        </div>

      </div>

      {/* Quick Action Bar (as explicitly requested) */}
      <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E5E0D2]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">Quick Operations</span>
          <span className="text-[11px] text-[#E66A1F] font-semibold">One-click HR actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          
          <button
            id="quick-dash-checkin-btn"
            onClick={() => onOpenQuickAction('checkin')}
            className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white hover:bg-[#FEF4ED] border border-[#E5E0D2] hover:border-[#E66A1F] text-xs font-bold text-[#201D1A] hover:text-[#E66A1F] shadow-2xs transition-all group"
          >
            <ClockAlert className="w-4 h-4 text-[#E66A1F] group-hover:scale-110 transition-transform" />
            <span>Mark Attendance</span>
          </button>

          <button
            id="quick-dash-leave-btn"
            onClick={() => onOpenQuickAction('leave')}
            className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white hover:bg-[#FEF4ED] border border-[#E5E0D2] hover:border-[#E66A1F] text-xs font-bold text-[#201D1A] hover:text-[#E66A1F] shadow-2xs transition-all group"
          >
            <CalendarCheck className="w-4 h-4 text-[#A4CDBD] group-hover:scale-110 transition-transform" />
            <span>Apply Leave</span>
          </button>

          <button
            id="quick-dash-payslip-btn"
            onClick={() => onOpenQuickAction('payslip')}
            className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white hover:bg-[#FEF4ED] border border-[#E5E0D2] hover:border-[#E66A1F] text-xs font-bold text-[#201D1A] hover:text-[#E66A1F] shadow-2xs transition-all group"
          >
            <FileText className="w-4 h-4 text-[#396B5A] group-hover:scale-110 transition-transform" />
            <span>View Payslip</span>
          </button>

          {currentRole !== 'employee' && (
            <>
              <button
                id="quick-dash-employee-btn"
                onClick={() => onOpenQuickAction('employee')}
                className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white hover:bg-[#FEF4ED] border border-[#E5E0D2] hover:border-[#E66A1F] text-xs font-bold text-[#201D1A] hover:text-[#E66A1F] shadow-2xs transition-all group"
              >
                <UserPlus className="w-4 h-4 text-[#E66A1F] group-hover:scale-110 transition-transform" />
                <span>Add Employee</span>
              </button>

              <button
                id="quick-dash-announcement-btn"
                onClick={() => onOpenQuickAction('announcement')}
                className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white hover:bg-[#FEF4ED] border border-[#E5E0D2] hover:border-[#E66A1F] text-xs font-bold text-[#201D1A] hover:text-[#E66A1F] shadow-2xs transition-all group"
              >
                <Megaphone className="w-4 h-4 text-[#A4CDBD] group-hover:scale-110 transition-transform" />
                <span>Create Announcement</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* Main Grid: Store Attendance Pulse & Sweet Moments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Store-Wise Attendance & Shift Status (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E0D2] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E66A1F]" />
              <h2 className="text-sm font-bold text-[#201D1A] font-display">Store-Wise Live Attendance Pulse</h2>
            </div>
            <button
              id="view-all-attendance-btn"
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-[#E66A1F] hover:text-[#D25A12] flex items-center gap-1"
            >
              <span>Full Shift Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {locations.map(loc => {
              const locStaff = employees.filter(e => e.locationId === loc.id);
              const locAttendance = attendanceRecords.filter(r => r.locationId === loc.id && r.date === todayStr);
              const presentCount = locAttendance.filter(r => r.status === 'present' || r.status === 'late').length;
              const totalCount = locStaff.length;
              const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

              return (
                <div key={loc.id} className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#201D1A]">{loc.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDEAD9] text-[#6B655D]">
                        {loc.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B655D]">
                      Manager: <span className="font-medium text-[#201D1A]">{loc.managerName}</span> · Hours: {loc.openTime} - {loc.closeTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0">
                    <div className="w-32">
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span className="text-[#6B655D]">{presentCount}/{totalCount} Staff</span>
                        <span className="text-[#396B5A]">{percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#EDEAD9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E66A1F] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      id={`inspect-store-${loc.id}-btn`}
                      onClick={() => setActiveTab('stores')}
                      className="p-1.5 rounded-lg bg-white border border-[#E5E0D2] text-[#6B655D] hover:text-[#E66A1F] hover:border-[#E66A1F] transition-colors"
                      title="Inspect store team"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Approval notice for managers */}
          {currentRole !== 'employee' && pendingLeaves.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FEF4ED] border border-[#E66A1F]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#E66A1F]" />
                <div>
                  <p className="text-xs font-bold text-[#E66A1F]">
                    {pendingLeaves.length} Leave Request(s) Pending Approval
                  </p>
                  <p className="text-[11px] text-[#6B655D]">
                    Staff are waiting for manager review to finalize store shift allocations.
                  </p>
                </div>
              </div>
              <button
                id="review-pending-leaves-btn"
                onClick={() => setActiveTab('leave')}
                className="px-3 py-1.5 rounded-lg bg-[#E66A1F] text-white text-xs font-semibold hover:bg-[#D25A12] transition-colors shadow-2xs"
              >
                Review Requests
              </button>
            </div>
          )}
        </div>

        {/* Sweet Moments & Spotlight (1 Column) */}
        <div className="space-y-6">

          {/* Birthday & Anniversary Card */}
          {birthdayAnnouncement ? (
            <div className="bg-gradient-to-br from-[#FEF4ED] to-[#FAF8F2] rounded-2xl border border-[#E66A1F]/30 p-5 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E66A1F] text-white text-[10px] font-bold">
                  <Cake className="w-3 h-3" />
                  <span>Birthday Celebration</span>
                </div>
                <button
                  id="celebrate-confetti-btn"
                  onClick={triggerConfetti}
                  className="text-xs font-semibold text-[#E66A1F] hover:underline"
                >
                  Cheer 🎉
                </button>
              </div>

              {birthdayAnnouncement.celebrationPhoto && (
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={birthdayAnnouncement.celebrationPhoto}
                    alt={birthdayAnnouncement.celebrationPersonName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E66A1F]"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#201D1A]">
                      {birthdayAnnouncement.celebrationPersonName}
                    </h3>
                    <p className="text-xs text-[#6B655D]">Lead Confectioner, DUMBO</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-[#201D1A] leading-relaxed">
                {birthdayAnnouncement.content}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E0D2] p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#E66A1F]">
                <Cake className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Sugartown Moments</h3>
              </div>
              <p className="text-xs text-[#6B655D]">
                No birthdays today! Next sweet anniversary coming up next week at the Queens factory.
              </p>
            </div>
          )}

          {/* Top Recognition Badge Spotlight */}
          <div className="bg-white rounded-2xl border border-[#E5E0D2] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E66A1F]" />
                <h3 className="text-xs font-bold text-[#201D1A] uppercase tracking-wider">Sweet Badges Wall</h3>
              </div>
              <button
                id="view-all-badges-btn"
                onClick={() => setActiveTab('performance')}
                className="text-xs font-semibold text-[#E66A1F] hover:underline"
              >
                View Wall
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E66A1F]/15 flex items-center justify-center text-[#E66A1F] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#201D1A]">Master Chocolatier</p>
                <p className="text-[11px] text-[#6B655D]">Awarded to Maya Lin & Antoine Bell</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#EEF7F4] border border-[#A4CDBD]/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A4CDBD]/30 flex items-center justify-center text-[#396B5A] shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#201D1A]">Food Safety Champion</p>
                <p className="text-[11px] text-[#6B655D]">Zero audit findings in factory & café</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
