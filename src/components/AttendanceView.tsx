import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Calendar,
  Search,
  Filter,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { AttendanceRecord, StoreLocationId } from '../types';

interface AttendanceViewProps {
  onOpenCheckInModal: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onOpenCheckInModal }) => {
  const {
    attendanceRecords,
    employees,
    locations,
    selectedLocationFilter,
    setSelectedLocationFilter,
    currentUser,
    checkIn,
    checkOut,
    isEmployeeCheckedIn,
    getTodayAttendance,
    triggerConfetti
  } = useHRMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'daily' | 'shifts' | 'monthly' | 'geofence'>('daily');

  const todayStr = '2026-09-18';
  const myRecord = getTodayAttendance(currentUser.id);
  const checkedIn = isEmployeeCheckedIn(currentUser.id);

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter(rec => {
    if (rec.date !== todayStr) return false;

    const matchesSearch = 
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLoc = selectedLocationFilter === 'all' || rec.locationId === selectedLocationFilter;
    const matchesShift = selectedShift === 'all' || rec.shift.includes(selectedShift);
    const matchesStatus = selectedStatus === 'all' || rec.status === selectedStatus;

    return matchesSearch && matchesLoc && matchesShift && matchesStatus;
  });

  // Calculate stats
  const totalCheckedIn = filteredRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const lateCount = filteredRecords.filter(r => r.status === 'late').length;
  const overtimeTotal = filteredRecords.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);
  const gpsVerifiedCount = filteredRecords.filter(r => r.verifiedByGps).length;

  const handleQuickCheckIn = () => {
    onOpenCheckInModal();
  };

  const handleQuickCheckOut = () => {
    const res = checkOut(currentUser.id);
    if (res.success) {
      triggerConfetti();
    }
  };

  const exportAttendanceCSV = () => {
    const headers = ['Date,Employee ID,Name,Location,Shift,Check-In,Check-Out,Status,Late Mins,OT Hours,GPS Distance\n'];
    const rows = filteredRecords.map(r => 
      `"${r.date}","${r.employeeId}","${r.employeeName}","${r.locationId}","${r.shift}","${r.checkInTime || '-'}","${r.checkOutTime || '-'}","${r.status}","${r.lateMinutes}","${r.overtimeHours}","${r.gpsDistanceMeters || '-'}m"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sugartown_Attendance_${todayStr}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">

      {/* Header & Status Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#201D1A] font-display">Daily Attendance & Shifts</h1>
            <span className="text-xs font-bold text-[#396B5A] bg-[#EEF7F4] px-2.5 py-0.5 rounded-full">
              Live Store Beacons Active
            </span>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Geofence validation (accuracy within store beacon), selfie smiling check, shift roster & overtime.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="export-attendance-csv-btn"
            onClick={exportAttendanceCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E0D2] bg-white hover:bg-[#FAF8F2] text-xs font-semibold text-[#201D1A] shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#6B655D]" />
            <span>Export Report</span>
          </button>

          {!checkedIn ? (
            <button
              id="header-clock-in-btn"
              onClick={handleQuickCheckIn}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/30 transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Check In Now</span>
            </button>
          ) : (
            <button
              id="header-clock-out-btn"
              onClick={handleQuickCheckOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF8F2] border border-[#E66A1F] hover:bg-[#FEF4ED] text-[#E66A1F] text-xs font-bold shadow-xs transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Clock Out ({myRecord?.checkInTime})</span>
            </button>
          )}
        </div>
      </div>

      {/* My Personal Shift Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF8F2] via-white to-[#FEF4ED] border border-[#E5E0D2] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-[#E5E0D2]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#201D1A]">{currentUser.fullName}</span>
              <span className="text-[10px] font-mono text-[#6B655D]">({currentUser.id})</span>
              <span className="text-[10px] font-bold text-[#E66A1F] bg-[#FEF4ED] px-2 py-0.5 rounded">
                {currentUser.attendanceStreak}d Streak 🔥
              </span>
            </div>
            <p className="text-xs text-[#6B655D]">
              Assigned Shift: <span className="font-semibold text-[#201D1A]">Morning Sweet (7:00 AM - 3:00 PM)</span> at {currentUser.locationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 px-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
            <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Status</span>
            <span className="font-bold text-[#396B5A]">
              {checkedIn ? `Clocked In (${myRecord?.checkInTime})` : myRecord?.checkOutTime ? `Completed (${myRecord?.checkOutTime})` : 'Awaiting Check-in'}
            </span>
          </div>

          <div className="p-2 px-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
            <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Store Geofence</span>
            <span className="font-bold text-[#201D1A] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E66A1F]" />
              Within 14m ✓
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B655D]">Present Staff</span>
          <p className="text-2xl font-black text-[#396B5A] font-display mt-1">{totalCheckedIn}</p>
          <span className="text-[10px] text-[#6B655D]">Across retail & production</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B655D]">Late Check-Ins</span>
          <p className="text-2xl font-black text-[#E66A1F] font-display mt-1">{lateCount}</p>
          <span className="text-[10px] text-[#6B655D]">Flagged for review</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B655D]">Total Overtime</span>
          <p className="text-2xl font-black text-[#201D1A] font-display mt-1">{overtimeTotal} hrs</p>
          <span className="text-[10px] text-[#396B5A]">Auto-accrued to payroll</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B655D]">GPS Geofence Verified</span>
          <p className="text-2xl font-black text-[#396B5A] font-display mt-1">100%</p>
          <span className="text-[10px] text-[#6B655D]">{gpsVerifiedCount} beacon check-ins</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#EDEAD9] gap-4 text-xs font-bold text-[#6B655D]">
        {[
          { id: 'daily', label: 'Daily Store Attendance' },
          { id: 'shifts', label: 'Shift Schedule Roster' },
          { id: 'monthly', label: 'Monthly Summary Matrix' },
          { id: 'geofence', label: 'Store Geofencing Beacons' }
        ].map(t => (
          <button
            key={t.id}
            id={`att-subtab-${t.id}-btn`}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-2.5 border-b-2 font-semibold transition-colors ${
              activeTab === t.id
                ? 'border-[#E66A1F] text-[#E66A1F]'
                : 'border-transparent hover:text-[#201D1A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DAILY ATTENDANCE */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          
          {/* Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-[#E5E0D2] shadow-2xs flex flex-wrap gap-2.5 items-center justify-between">
            <div className="flex flex-1 min-w-[240px] items-center relative">
              <Search className="w-4 h-4 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-attendance-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendee by name or ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                id="attendance-shift-select"
                aria-label="Filter Attendance by Shift"
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="text-xs bg-[#FAF8F2] px-3 py-1.5 rounded-xl border border-[#EDEAD9] focus:outline-none"
              >
                <option value="all">All Shifts</option>
                <option value="Morning">Morning Sweet (7AM-3PM)</option>
                <option value="Mid">Mid Day (11AM-7PM)</option>
                <option value="General">General (9AM-6PM)</option>
              </select>

              <select
                id="attendance-status-select"
                aria-label="Filter Attendance by Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-[#FAF8F2] px-3 py-1.5 rounded-xl border border-[#EDEAD9] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present On-Time</option>
                <option value="late">Late Arrival</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E5E0D2] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F2] border-b border-[#E5E0D2] text-[11px] font-bold text-[#6B655D] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Store Location</th>
                    <th className="py-3 px-4">Shift</th>
                    <th className="py-3 px-4">Clock In</th>
                    <th className="py-3 px-4">Clock Out</th>
                    <th className="py-3 px-4">Status & Lateness</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">OT Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEAD9]">
                  {filteredRecords.map(rec => {
                    const emp = employees.find(e => e.id === rec.employeeId);
                    return (
                      <tr key={rec.id} className="hover:bg-[#FAF8F2] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={emp?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={rec.employeeName}
                              className="w-7 h-7 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-bold text-[#201D1A]">{rec.employeeName}</p>
                              <span className="text-[10px] font-mono text-[#6B655D]">{rec.employeeId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#6B655D] font-medium">
                          {locations.find(l => l.id === rec.locationId)?.name || 'Sugartown'}
                        </td>
                        <td className="py-3 px-4 text-[#201D1A] font-medium">{rec.shift}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#201D1A]">
                          {rec.checkInTime || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#6B655D]">
                          {rec.checkOutTime || 'Active on shift'}
                        </td>
                        <td className="py-3 px-4">
                          {rec.status === 'present' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A]">
                              <CheckCircle2 className="w-3 h-3" />
                              On-Time
                            </span>
                          )}
                          {rec.status === 'late' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF4ED] text-[#E66A1F]">
                              <AlertTriangle className="w-3 h-3" />
                              Late ({rec.lateMinutes}m)
                            </span>
                          )}
                          {rec.status === 'on_leave' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F2] text-[#6B655D]">
                              Approved Leave
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {rec.verifiedByGps && (
                              <span className="text-[10px] font-bold text-[#396B5A] bg-[#EEF7F4] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5" />
                                {rec.gpsDistanceMeters || 12}m
                              </span>
                            )}
                            {rec.verifiedBySelfie && (
                              <span className="text-[10px] font-bold text-[#E66A1F] bg-[#FEF4ED] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Camera className="w-2.5 h-2.5" />
                                Selfie ✓
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#201D1A]">
                          {rec.overtimeHours > 0 ? `+${rec.overtimeHours}h` : '0h'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SHIFT SCHEDULE ROSTER */}
      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              shiftName: 'Morning Sweet Shift',
              timing: '07:00 AM - 03:00 PM',
              lead: 'Marco Rossi',
              description: 'Espresso machine warmup, fresh brioche & bonbon display setup, batch tempering.',
              staff: ['Maya Lin', 'Antoine Bell', 'Liam Thorne', 'Tariq Hassan']
            },
            {
              shiftName: 'Mid Day Confectionery Rush',
              timing: '11:00 AM - 07:00 PM',
              lead: 'Sienna Brooks',
              description: 'Lunch rush tasting flights, customer gift packaging, caramel counter refills.',
              staff: ['Noah Kim', 'Clara Dupont', 'Elena Rostova']
            },
            {
              shiftName: 'Evening Closing & Sanitation',
              timing: '02:00 PM - 10:00 PM',
              lead: 'Aria Montgomery',
              description: 'Chocolate kettle washdown, cash reconciliations, next-day pastry prep staging.',
              staff: ['Aria Montgomery', 'Oliver Vance']
            }
          ].map(shift => (
            <div key={shift.shiftName} className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#E66A1F] uppercase tracking-wider">{shift.shiftName}</span>
                <span className="text-[11px] font-mono text-[#6B655D] bg-[#FAF8F2] px-2 py-0.5 rounded-md">
                  {shift.timing}
                </span>
              </div>
              <p className="text-xs text-[#6B655D] leading-relaxed">{shift.description}</p>
              
              <div className="pt-2 border-t border-[#EDEAD9]">
                <span className="text-[11px] font-bold text-[#201D1A] block mb-1.5">Scheduled Staff ({shift.staff.length})</span>
                <div className="space-y-1">
                  {shift.staff.map(person => (
                    <div key={person} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-[#FAF8F2]">
                      <span className="font-medium text-[#201D1A]">{person}</span>
                      <span className="text-[10px] text-[#396B5A] font-bold">Confirmed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MONTHLY MATRIX */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-2xl border border-[#E5E0D2] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              September 2026 Attendance Heatmap
            </h3>
            <span className="text-xs text-[#E66A1F] font-bold">Average Store Punctuality: 97.8%</span>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[500px]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center font-bold text-[11px] text-[#6B655D] py-1 bg-[#FAF8F2] rounded-md">
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === 18;
                const isWeekend = (dayNum % 7 === 5) || (dayNum % 7 === 6);
                return (
                  <div
                    key={dayNum}
                    className={`h-16 p-1.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                      isToday
                        ? 'border-[#E66A1F] bg-[#FEF4ED] ring-1 ring-[#E66A1F]'
                        : isWeekend
                        ? 'border-[#EDEAD9] bg-[#FAF8F2]/60 text-[#6B655D]'
                        : 'border-[#EDEAD9] bg-white hover:border-[#A4CDBD]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${isToday ? 'text-[#E66A1F]' : 'text-[#201D1A]'}`}>{dayNum}</span>
                      {isToday && <span className="text-[8px] font-extrabold px-1 rounded bg-[#E66A1F] text-white">TODAY</span>}
                    </div>
                    <div className="text-[9px] font-semibold text-[#396B5A]">
                      {isWeekend ? 'Weekend Rush' : '100% Present'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE GEOFENCING */}
      {activeTab === 'geofence' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map(loc => (
            <div key={loc.id} className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E66A1F]" />
                  <h4 className="text-xs font-bold text-[#201D1A]">{loc.name}</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A]">
                  Beacon Operational
                </span>
              </div>
              <p className="text-xs text-[#6B655D]">{loc.address}, {loc.city}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-[#EDEAD9]">
                <div className="p-2 rounded-lg bg-[#FAF8F2]">
                  <span className="text-[10px] text-[#6B655D] block">Radius</span>
                  <span className="font-bold text-[#201D1A]">{loc.geofenceRadiusMeters} meters</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F2]">
                  <span className="text-[10px] text-[#6B655D] block">GPS Lat</span>
                  <span className="font-mono text-[11px] text-[#201D1A]">{loc.coordinates.lat.toFixed(4)}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F2]">
                  <span className="text-[10px] text-[#6B655D] block">GPS Lng</span>
                  <span className="font-mono text-[11px] text-[#201D1A]">{loc.coordinates.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
