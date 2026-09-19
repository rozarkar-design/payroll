import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  FileSpreadsheet,
  PieChart,
  Calendar,
  Users,
  IndianRupee,
  Clock,
  Printer,
  Sparkles
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

export const ReportsView: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    payrollRecords,
    leaveRequests,
    locations,
    triggerConfetti
  } = useHRMS();

  const [activeReportTab, setActiveReportTab] = useState<'attendance' | 'payroll' | 'workforce'>('attendance');

  // Computed data
  const totalEmployees = employees.length;
  const totalPayroll = payrollRecords.reduce((acc, c) => acc + c.netSalary, 0);
  const totalOTHours = attendanceRecords.reduce((acc, c) => acc + (c.overtimeHours || 0), 0);
  const totalLeavesTaken = leaveRequests.filter(l => l.status === 'approved').reduce((acc, c) => acc + c.daysCount, 0);

  // Department payroll breakdown
  const deptBreakdown = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + emp.salary.baseSalary;
    return acc;
  }, {} as Record<string, number>);

  const exportReport = (reportName: string) => {
    const csvContent = `data:text/csv;charset=utf-8,Report,${reportName}\nDate,${new Date().toISOString()}\nTotal Employees,${totalEmployees}\nMonthly Payroll Expenditure,₹${totalPayroll}\nOvertime Logged,${totalOTHours} hrs\nApproved Leave Days,${totalLeavesTaken}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sugartown_${reportName}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerConfetti();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#201D1A] font-display">Analytics & HR Operations Reports</h1>
            <span className="text-xs font-bold text-[#396B5A] bg-[#EEF7F4] px-2.5 py-0.5 rounded-full">
              Q3 2026 Audit Ready
            </span>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Cross-location labor expense audits, punctuality variance, overtime logs, and workforce retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-comprehensive-report-btn"
            onClick={() => exportReport('Comprehensive_HR_Audit')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit</span>
          </button>
        </div>
      </div>

      {/* High-Level Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B655D]">Labor Expenditure</span>
          <p className="text-2xl font-black text-[#201D1A] font-display mt-1">
            ₹{totalPayroll.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#396B5A]">Monthly base + allowances</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B655D]">Punctuality Rate</span>
          <p className="text-2xl font-black text-[#396B5A] font-display mt-1">
            97.8%
          </p>
          <span className="text-[10px] text-[#6B655D]">+1.4% from last quarter</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B655D]">Overtime Accumulated</span>
          <p className="text-2xl font-black text-[#E66A1F] font-display mt-1">
            {totalOTHours} hrs
          </p>
          <span className="text-[10px] text-[#6B655D]">Across rush tasting hours</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B655D]">Staff Retention Rate</span>
          <p className="text-2xl font-black text-[#396B5A] font-display mt-1">
            94.2%
          </p>
          <span className="text-[10px] text-[#396B5A]">Well above retail industry avg</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EDEAD9] gap-4 text-xs font-bold text-[#6B655D]">
        <button
          id="tab-rep-attendance-btn"
          onClick={() => setActiveReportTab('attendance')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeReportTab === 'attendance'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Attendance & Overtime Audit
        </button>
        <button
          id="tab-rep-payroll-btn"
          onClick={() => setActiveReportTab('payroll')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeReportTab === 'payroll'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Departmental Payroll Allocation
        </button>
        <button
          id="tab-rep-workforce-btn"
          onClick={() => setActiveReportTab('workforce')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeReportTab === 'workforce'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Store Headcount & Geofence Health
        </button>
      </div>

      {/* TAB 1: ATTENDANCE AUDIT */}
      {activeReportTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-[#E5E0D2] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              September 2026 Store Attendance Log
            </h3>
            <span className="text-xs text-[#E66A1F] font-bold">100% Geofence Precision</span>
          </div>

          <div className="space-y-3">
            {locations.map(loc => {
              const locRecs = attendanceRecords.filter(r => r.locationId === loc.id);
              const locTotal = locRecs.length;
              const locLate = locRecs.filter(r => r.status === 'late').length;
              const punctuality = locTotal > 0 ? Math.round(((locTotal - locLate) / locTotal) * 100) : 100;

              return (
                <div key={loc.id} className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#201D1A]">{loc.name}</span>
                      <span className="font-bold text-[#396B5A]">{punctuality}% on-time</span>
                    </div>
                    <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#EDEAD9]">
                      <div className="bg-[#396B5A] h-full rounded-full" style={{ width: `${punctuality}%` }} />
                    </div>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <span className="text-[#6B655D] block text-[11px]">{locLate} late arrivals</span>
                    <span className="font-mono font-bold text-[#201D1A]">Radius: {loc.geofenceRadiusMeters}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PAYROLL ALLOCATION */}
      {activeReportTab === 'payroll' && (
        <div className="bg-white rounded-2xl border border-[#E5E0D2] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              Department Monthly Base Salary Weight
            </h3>
            <span className="text-xs text-[#396B5A] font-bold">Total: ₹{totalPayroll.toLocaleString('en-IN')}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(deptBreakdown).map(([dept, cost]) => {
              const pct = Math.round((cost / totalPayroll) * 100);
              return (
                <div key={dept} className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#201D1A]">{dept}</span>
                    <span className="text-[#E66A1F]">₹{cost.toLocaleString('en-IN')} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#EDEAD9]">
                    <div className="bg-[#E66A1F] h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: WORKFORCE & GEOFENCE */}
      {activeReportTab === 'workforce' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              Headcount by Employment Model
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F2] flex justify-between items-center">
                <span className="font-semibold text-[#201D1A]">Full-Time Craft Personnel</span>
                <span className="font-bold text-[#396B5A]">6 Members (60%)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F2] flex justify-between items-center">
                <span className="font-semibold text-[#201D1A]">Part-Time Baristas & Retail Assistants</span>
                <span className="font-bold text-[#E66A1F]">3 Members (30%)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F2] flex justify-between items-center">
                <span className="font-semibold text-[#201D1A]">Seasonal Tasting Associates</span>
                <span className="font-bold text-[#6B655D]">1 Member (10%)</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              Leave Balance Health
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F2] flex justify-between items-center">
                <span className="font-semibold text-[#201D1A]">Total Accrued PTO Remaining</span>
                <span className="font-bold text-[#201D1A]">142 Days Available</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F2] flex justify-between items-center">
                <span className="font-semibold text-[#201D1A]">Approved Leaves Taken (YTD)</span>
                <span className="font-bold text-[#396B5A]">{totalLeavesTaken} Days</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F2] flex justify-between items-center">
                <span className="font-semibold text-[#201D1A]">Sweet Sabbatical Utilization</span>
                <span className="font-bold text-[#E66A1F]">18 Days Claimed</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
