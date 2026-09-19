import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  IndianRupee,
  AlertCircle,
  Award,
  ChevronRight,
  X,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Download,
  Eye,
  Trash2,
  UserMinus
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { Employee, DepartmentType, StoreLocationId, EmploymentStatus } from '../types';
import { SUGARTOWN_BADGES } from '../mockData';

interface EmployeeViewProps {
  initialSelectedId?: string;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({ initialSelectedId }) => {
  const {
    employees,
    addEmployee,
    removeEmployee,
    isAdminLoggedIn,
    currentRole,
    currentUser,
    locations,
    awardBadge,
    triggerConfetti
  } = useHRMS();

  const canAdminRemove = isAdminLoggedIn || currentRole === 'super_admin' || currentRole === 'hr_manager';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Employee Removal State
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('Administrative Offboarding');
  const [actionFeedback, setActionFeedback] = useState<string>('');

  // Selected employee for detail modal
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(() => {
    if (initialSelectedId) {
      return employees.find(e => e.id === initialSelectedId) || null;
    }
    return null;
  });

  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'contact' | 'documents' | 'salary' | 'badges'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAwardBadgeModal, setShowAwardBadgeModal] = useState(false);
  const [selectedBadgeToAward, setSelectedBadgeToAward] = useState(SUGARTOWN_BADGES[0].id);
  const [badgeNote, setBadgeNote] = useState('');

  // Add Employee Form State
  const [newEmp, setNewEmp] = useState({
    fullName: '',
    designation: '',
    department: 'Retail & Store Operations' as DepartmentType,
    locationId: 'loc_cafe_brooklyn' as StoreLocationId,
    email: '',
    phone: '',
    joiningDate: '2026-09-18',
    employmentStatus: 'Full-Time' as EmploymentStatus,
    role: 'employee' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    baseSalary: 42000,
    hraAllowance: 9000,
    sugartownSweetAllowance: 4000,
    transportAllowance: 2500,
    overtimeHourlyRate: 280,
    emergencyName: '',
    emergencyRelationship: 'Family',
    emergencyPhone: '',
    notes: 'Sweet confectioner onboarded via recruitment pipeline.'
  });

  const departments: DepartmentType[] = [
    'Confectionery Production',
    'Retail & Store Operations',
    'Kitchen & Barista',
    'Logistics & Supply',
    'Quality & Food Safety',
    'People & Culture',
    'Finance & Brand Management'
  ];

  // Filtering
  const filteredEmployees = employees.filter(emp => {
    // If role is employee, restrict or allow seeing directory
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchesLoc = selectedLocation === 'all' || emp.locationId === selectedLocation;
    const matchesStatus = selectedStatus === 'all' || emp.employmentStatus === selectedStatus;

    return matchesSearch && matchesDept && matchesLoc && matchesStatus;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLoc = locations.find(l => l.id === newEmp.locationId);

    addEmployee({
      fullName: newEmp.fullName,
      avatar: newEmp.avatar,
      role: newEmp.role,
      designation: newEmp.designation,
      department: newEmp.department,
      locationId: newEmp.locationId,
      locationName: targetLoc ? targetLoc.name : 'Sugartown Store',
      email: newEmp.email,
      phone: newEmp.phone,
      joiningDate: newEmp.joiningDate,
      employmentStatus: newEmp.employmentStatus,
      salary: {
        baseSalary: Number(newEmp.baseSalary),
        hraAllowance: Number(newEmp.hraAllowance),
        sugartownSweetAllowance: Number(newEmp.sugartownSweetAllowance),
        transportAllowance: Number(newEmp.transportAllowance),
        overtimeHourlyRate: Number(newEmp.overtimeHourlyRate),
        taxDeductionsRate: 12,
        healthInsuranceDeduction: 150
      },
      emergencyContact: {
        name: newEmp.emergencyName || 'Primary Contact',
        relationship: newEmp.emergencyRelationship,
        phone: newEmp.emergencyPhone || '+1 (555) 019-2811'
      },
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: `${newEmp.fullName.replace(/\s+/g, '_')}_Signed_Offer.pdf`,
          type: 'Contract',
          uploadDate: '2026-09-18',
          size: '640 KB',
          status: 'Verified'
        }
      ],
      leaveBalance: {
        annual: 14,
        casual: 6,
        sick: 8,
        sweetSabbatical: 7
      },
      notes: newEmp.notes
    });

    setShowAddModal(false);
  };

  const handleAwardBadge = () => {
    if (!activeEmployee) return;
    awardBadge(activeEmployee.id, selectedBadgeToAward, badgeNote);
    setShowAwardBadgeModal(false);
    setBadgeNote('');
  };

  const exportEmployeeCSV = () => {
    const headers = ['Employee ID,Full Name,Designation,Department,Location,Joining Date,Status,Email,Phone\n'];
    const rows = filteredEmployees.map(e => 
      `"${e.id}","${e.fullName}","${e.designation}","${e.department}","${e.locationName}","${e.joiningDate}","${e.employmentStatus}","${e.email}","${e.phone}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sugartown_Staff_Directory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    triggerConfetti();
  };

  return (
    <div className="space-y-6">

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#201D1A] font-display">Employee Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EDEAD9] text-xs font-bold text-[#6B655D]">
              {filteredEmployees.length} Staff Members
            </span>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Profiles, roles, documents, emergency contacts, and sweet compensation structures.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="export-employees-csv-btn"
            onClick={exportEmployeeCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E0D2] bg-white hover:bg-[#FAF8F2] text-xs font-semibold text-[#201D1A] shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#6B655D]" />
            <span>Export CSV</span>
          </button>

          {currentRole !== 'employee' && (
            <button
              id="add-employee-trigger-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-[#EEF7F4] border border-[#396B5A]/30 flex items-center justify-between text-xs text-[#396B5A] animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#396B5A] shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button
            onClick={() => setActionFeedback('')}
            className="text-[#396B5A] hover:text-[#2B5244] text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="employee-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, job title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:border-[#E66A1F] focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              id="filter-department-select"
              aria-label="Filter by Department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:border-[#E66A1F] focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              id="filter-location-select"
              aria-label="Filter by Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:border-[#E66A1F] focus:outline-none"
            >
              <option value="all">All Locations</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end gap-1">
            <button
              id="viewmode-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'grid' ? 'bg-[#E66A1F] text-white' : 'bg-[#FAF8F2] text-[#6B655D]'
              }`}
            >
              Grid
            </button>
            <button
              id="viewmode-table-btn"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'table' ? 'bg-[#E66A1F] text-white' : 'bg-[#FAF8F2] text-[#6B655D]'
              }`}
            >
              Table
            </button>
          </div>

        </div>
      </div>

      {/* Employees Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => {
            const isMe = emp.id === currentUser.id;
            return (
              <div
                key={emp.id}
                id={`employee-card-${emp.id}`}
                onClick={() => setActiveEmployee(emp)}
                className="bg-white rounded-2xl border border-[#E5E0D2] p-4.5 hover:border-[#E66A1F]/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#EDEAD9]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-bold text-[#201D1A] group-hover:text-[#E66A1F] transition-colors font-display">
                            {emp.fullName}
                          </h2>
                          {isMe && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#FEF4ED] text-[#E66A1F]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B655D] font-medium">{emp.designation}</p>
                        <span className="text-[10px] text-[#6B655D] font-mono">{emp.id}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      emp.employmentStatus === 'Full-Time'
                        ? 'bg-[#EEF7F4] text-[#396B5A]'
                        : emp.employmentStatus === 'Part-Time'
                        ? 'bg-[#FAF8F2] text-[#6B655D]'
                        : 'bg-[#FEF4ED] text-[#E66A1F]'
                    }`}>
                      {emp.employmentStatus}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#6B655D] pt-2 border-t border-[#FAF8F2]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#E66A1F] shrink-0" />
                      <span className="truncate">{emp.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#A4CDBD] shrink-0" />
                      <span>Joined {emp.joiningDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-[#E66A1F] shrink-0" />
                      <span>{emp.attendanceStreak} Days On-Time Streak</span>
                    </div>
                  </div>
                </div>

                {/* Bottom badges & View profile trigger */}
                <div className="mt-4 pt-3 border-t border-[#EDEAD9] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {emp.badges.slice(0, 3).map(bId => {
                      const badge = SUGARTOWN_BADGES.find(b => b.id === bId);
                      return (
                        <span
                          key={bId}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: badge?.color || '#E66A1F' }}
                          title={badge?.name}
                        >
                          🍬
                        </span>
                      );
                    })}
                    {emp.badges.length === 0 && (
                      <span className="text-[11px] text-[#6B655D]">New team member</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FAF8F2]">
                    {canAdminRemove && (
                      <button
                        id={`card-remove-btn-${emp.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmployeeToDelete(emp);
                          setDeleteReason('Administrative Offboarding');
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                        title={`Remove ${emp.fullName} from directory`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Remove</span>
                      </button>
                    )}

                    <button
                      id={`view-profile-${emp.id}-btn`}
                      className="text-xs font-bold text-[#E66A1F] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 ml-auto"
                    >
                      <span>Inspect Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#E5E0D2] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-[#E5E0D2] text-[11px] font-bold text-[#6B655D] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role & ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Store Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEAD9]">
                {filteredEmployees.map(emp => (
                  <tr 
                    key={emp.id}
                    onClick={() => setActiveEmployee(emp)}
                    className="hover:bg-[#FAF8F2] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.fullName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-[#201D1A]">{emp.fullName}</p>
                          <p className="text-[11px] text-[#6B655D]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#201D1A]">{emp.designation}</p>
                      <p className="text-[10px] font-mono text-[#6B655D]">{emp.id}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#6B655D]">{emp.department}</td>
                    <td className="py-3 px-4 text-[#201D1A] font-medium">{emp.locationName}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A]">
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-[#E66A1F] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {emp.attendanceStreak}d
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`table-view-btn-${emp.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#EDEAD9] hover:bg-[#E66A1F] hover:text-white text-xs font-bold text-[#201D1A] transition-colors"
                        >
                          Inspect
                        </button>

                        {canAdminRemove && (
                          <button
                            id={`table-remove-btn-${emp.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEmployeeToDelete(emp);
                              setDeleteReason('Administrative Offboarding');
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                            title={`Remove ${emp.fullName} from directory`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail Modal / Profile Drawer */}
      {activeEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E5E0D2] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#FAF8F2] via-[#EDEAD9] to-[#FEF4ED] p-6 border-b border-[#E5E0D2] flex items-start justify-between relative">
              <div className="flex items-center gap-4">
                <img
                  src={activeEmployee.avatar}
                  alt={activeEmployee.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#201D1A] font-display">
                      {activeEmployee.fullName}
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#E5E0D2] text-[#6B655D]">
                      {activeEmployee.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#E66A1F] font-bold">{activeEmployee.designation}</p>
                  <p className="text-[11px] text-[#6B655D]">{activeEmployee.department} · {activeEmployee.locationName}</p>
                </div>
              </div>

              <button
                id="close-employee-profile-modal-btn"
                onClick={() => setActiveEmployee(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#6B655D] hover:text-[#201D1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Nav Tabs */}
            <div className="flex border-b border-[#EDEAD9] px-6 bg-[#FAF8F2] text-xs font-bold text-[#6B655D] gap-4 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'contact', label: 'Contact & Emergency' },
                { id: 'documents', label: 'Documents & Verification' },
                { id: 'salary', label: 'Salary Structure' },
                { id: 'badges', label: 'Recognition & Badges' }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`profile-tab-${tab.id}-btn`}
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`py-3 border-b-2 font-semibold transition-colors shrink-0 ${
                    activeProfileTab === tab.id
                      ? 'border-[#E66A1F] text-[#E66A1F]'
                      : 'border-transparent hover:text-[#201D1A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* TAB 1: OVERVIEW */}
              {activeProfileTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] uppercase font-bold">Joining Date</span>
                      <p className="text-xs font-bold text-[#201D1A] mt-1">{activeEmployee.joiningDate}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] uppercase font-bold">Status</span>
                      <p className="text-xs font-bold text-[#396B5A] mt-1">{activeEmployee.employmentStatus}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] uppercase font-bold">Streak</span>
                      <p className="text-xs font-bold text-[#E66A1F] mt-1 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {activeEmployee.attendanceStreak} Days
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
                      <span className="text-[10px] text-[#6B655D] uppercase font-bold">Annual PTO</span>
                      <p className="text-xs font-bold text-[#201D1A] mt-1">{activeEmployee.leaveBalance.annual} days left</p>
                    </div>
                  </div>

                  {activeEmployee.notes && (
                    <div className="p-4 rounded-xl bg-[#FEF4ED] border border-[#E66A1F]/20">
                      <h3 className="text-xs font-bold text-[#E66A1F] mb-1">Supervisor & Talent Notes</h3>
                      <p className="text-xs text-[#6B655D] leading-relaxed">{activeEmployee.notes}</p>
                    </div>
                  )}

                  {/* Leave Balances Breakdown */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D] mb-2">
                      Leave Balances (2026 Quota)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 rounded-lg border border-[#EDEAD9] text-center">
                        <span className="text-xs font-bold text-[#201D1A] block">{activeEmployee.leaveBalance.annual}d</span>
                        <span className="text-[10px] text-[#6B655D]">Annual Paid</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#EDEAD9] text-center">
                        <span className="text-xs font-bold text-[#201D1A] block">{activeEmployee.leaveBalance.casual}d</span>
                        <span className="text-[10px] text-[#6B655D]">Casual</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#EDEAD9] text-center">
                        <span className="text-xs font-bold text-[#201D1A] block">{activeEmployee.leaveBalance.sick}d</span>
                        <span className="text-[10px] text-[#6B655D]">Sick Leave</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#EDEAD9] text-center">
                        <span className="text-xs font-bold text-[#E66A1F] block">{activeEmployee.leaveBalance.sweetSabbatical}d</span>
                        <span className="text-[10px] text-[#6B655D]">Sweet Sabbatical</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT */}
              {activeProfileTab === 'contact' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] space-y-3">
                    <h3 className="font-bold text-[#201D1A] text-sm">Direct Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[#6B655D] block text-[11px]">Official Email</span>
                        <span className="font-semibold text-[#201D1A]">{activeEmployee.email}</span>
                      </div>
                      <div>
                        <span className="text-[#6B655D] block text-[11px]">Direct Phone</span>
                        <span className="font-semibold text-[#201D1A]">{activeEmployee.phone}</span>
                      </div>
                      <div>
                        <span className="text-[#6B655D] block text-[11px]">Store Location</span>
                        <span className="font-semibold text-[#201D1A]">{activeEmployee.locationName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] space-y-3">
                    <h3 className="font-bold text-[#201D1A] text-sm flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#E66A1F]" />
                      <span>Emergency Contact (Mandatory)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[#6B655D] block text-[11px]">Contact Person</span>
                        <span className="font-semibold text-[#201D1A]">{activeEmployee.emergencyContact.name}</span>
                      </div>
                      <div>
                        <span className="text-[#6B655D] block text-[11px]">Relationship</span>
                        <span className="font-semibold text-[#201D1A]">{activeEmployee.emergencyContact.relationship}</span>
                      </div>
                      <div>
                        <span className="text-[#6B655D] block text-[11px]">Phone Number</span>
                        <span className="font-semibold text-[#201D1A]">{activeEmployee.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {activeProfileTab === 'documents' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
                      Onboarding & Compliance Files
                    </h3>
                    <span className="text-[10px] text-[#396B5A] font-bold bg-[#EEF7F4] px-2 py-0.5 rounded-full">
                      HACCP & Labor Compliant
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeEmployee.documents.map(doc => (
                      <div key={doc.id} className="p-3 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#E66A1F]" />
                          <div>
                            <p className="text-xs font-bold text-[#201D1A]">{doc.name}</p>
                            <span className="text-[10px] text-[#6B655D]">
                              {doc.type} · {doc.size} · Uploaded {doc.uploadDate}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#EEF7F4] text-[#396B5A] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SALARY STRUCTURE */}
              {activeProfileTab === 'salary' && (
                <div className="space-y-4">
                  {currentRole === 'employee' && activeEmployee.id !== currentUser.id ? (
                    <div className="p-6 text-center text-xs text-[#6B655D]">
                      <ShieldAlert className="w-8 h-8 mx-auto text-[#E66A1F] mb-2" />
                      Salary details are confidential and restricted to HR and Direct Managers.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]">
                        <span className="text-[11px] text-[#6B655D] uppercase font-bold">Monthly Base Pay</span>
                        <p className="text-2xl font-black text-[#201D1A] font-display">
                          ₹{activeEmployee.salary.baseSalary.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-[#6B655D] ml-1">/ month</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl border border-[#EDEAD9]">
                          <span className="text-[#6B655D] block">HRA & Housing</span>
                          <span className="font-bold text-[#201D1A]">₹{activeEmployee.salary.hraAllowance.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 rounded-xl border border-[#EDEAD9] bg-[#FEF4ED]/50">
                          <span className="text-[#E66A1F] font-bold block">Sugartown Sweet Allowance 🍬</span>
                          <span className="font-bold text-[#201D1A]">₹{activeEmployee.salary.sugartownSweetAllowance.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 rounded-xl border border-[#EDEAD9]">
                          <span className="text-[#6B655D] block">Transit / Commute Stipend</span>
                          <span className="font-bold text-[#201D1A]">₹{activeEmployee.salary.transportAllowance.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3 rounded-xl border border-[#EDEAD9]">
                          <span className="text-[#6B655D] block">Overtime Hourly Rate</span>
                          <span className="font-bold text-[#396B5A]">₹{activeEmployee.salary.overtimeHourlyRate}/hr</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF8F2] text-[11px] text-[#6B655D] flex items-center justify-between">
                        <span>Statutory Deductions: Income Tax ({activeEmployee.salary.taxDeductionsRate}%) + Health (₹{activeEmployee.salary.healthInsuranceDeduction.toLocaleString('en-IN')})</span>
                        <span className="font-semibold text-[#201D1A]">Automated Payroll</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: RECOGNITION & BADGES */}
              {activeProfileTab === 'badges' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
                      Earned Sugartown Badges
                    </h3>
                    {currentRole !== 'employee' && (
                      <button
                        id="award-badge-open-btn"
                        onClick={() => setShowAwardBadgeModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#E66A1F] text-white text-xs font-bold hover:bg-[#D25A12] flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Award Badge</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeEmployee.badges.map(bId => {
                      const badge = SUGARTOWN_BADGES.find(b => b.id === bId);
                      if (!badge) return null;
                      return (
                        <div key={bId} className="p-3.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                            style={{ backgroundColor: badge.color }}
                          >
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#201D1A]">{badge.name}</h4>
                            <p className="text-[11px] text-[#6B655D] leading-tight mt-0.5">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}

                    {activeEmployee.badges.length === 0 && (
                      <div className="col-span-2 text-center py-6 text-xs text-[#6B655D]">
                        No badges awarded yet. Be the first to recognize their sweet contributions!
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F2] border-t border-[#E5E0D2] flex items-center justify-between">
              {canAdminRemove ? (
                <button
                  id={`modal-remove-emp-btn-${activeEmployee.id}`}
                  onClick={() => {
                    const emp = activeEmployee;
                    setEmployeeToDelete(emp);
                    setDeleteReason('Administrative Offboarding');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Permanently remove employee from company records"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Employee</span>
                </button>
              ) : (
                <div />
              )}

              <button
                id="close-profile-bottom-btn"
                onClick={() => setActiveEmployee(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E5E0D2] text-xs font-bold text-[#201D1A] hover:bg-[#EDEAD9]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Badge Sub-Modal */}
      {showAwardBadgeModal && activeEmployee && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-[#E5E0D2] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#E66A1F]" />
                <h3 className="text-sm font-bold text-[#201D1A]">Award Sugartown Badge</h3>
              </div>
              <button onClick={() => setShowAwardBadgeModal(false)} className="text-[#6B655D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B655D] block mb-1">Select Recognition Badge</label>
              <select
                id="award-badge-select"
                value={selectedBadgeToAward}
                onChange={(e) => setSelectedBadgeToAward(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] focus:outline-none"
              >
                {SUGARTOWN_BADGES.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B655D] block mb-1">Praise Note (Optional)</label>
              <textarea
                id="award-badge-note-input"
                value={badgeNote}
                onChange={(e) => setBadgeNote(e.target.value)}
                rows={2}
                placeholder={`Tell ${activeEmployee.fullName} why they shine at Sugartown...`}
                className="w-full text-xs p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAwardBadgeModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#6B655D]"
              >
                Cancel
              </button>
              <button
                id="confirm-award-badge-btn"
                onClick={handleAwardBadge}
                className="px-4 py-1.5 text-xs font-bold bg-[#E66A1F] hover:bg-[#D25A12] text-white rounded-xl shadow-xs"
              >
                Confer Badge 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E5E0D2] overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="p-5 border-b border-[#EDEAD9] flex items-center justify-between bg-[#FAF8F2]">
              <div>
                <h3 className="text-sm font-bold text-[#201D1A]">Onboard New Sugartown Employee</h3>
                <p className="text-[11px] text-[#6B655D]">Create personnel profile, store assignment, and salary tier</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#6B655D] hover:text-[#201D1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#201D1A] block mb-1">Full Name *</label>
                  <input
                    id="new-emp-name"
                    required
                    type="text"
                    value={newEmp.fullName}
                    onChange={(e) => setNewEmp({ ...newEmp, fullName: e.target.value })}
                    placeholder="e.g. Sophie Dubois"
                    className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#201D1A] block mb-1">Designation *</label>
                  <input
                    id="new-emp-designation"
                    required
                    type="text"
                    value={newEmp.designation}
                    onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                    placeholder="e.g. Artisan Baker & Pastry Cook"
                    className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#201D1A] block mb-1">Department</label>
                  <select
                    id="new-emp-dept"
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value as DepartmentType })}
                    className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#201D1A] block mb-1">Store / Location</label>
                  <select
                    id="new-emp-loc"
                    value={newEmp.locationId}
                    onChange={(e) => setNewEmp({ ...newEmp, locationId: e.target.value as StoreLocationId })}
                    className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#201D1A] block mb-1">Work Email</label>
                  <input
                    id="new-emp-email"
                    required
                    type="email"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="employee@sugartown.in"
                    className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#201D1A] block mb-1">Phone Number</label>
                  <input
                    id="new-emp-phone"
                    required
                    type="tel"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    placeholder="+1 (212) 555-0188"
                    className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
                  />
                </div>
              </div>

              {/* Salary Setup */}
              <div className="pt-2 border-t border-[#EDEAD9]">
                <h4 className="font-bold text-[#201D1A] mb-2 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#396B5A]" />
                  <span>Salary Structure (INR / Month - ₹)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-[#6B655D] block">Base Salary</label>
                    <input
                      type="number"
                      value={newEmp.baseSalary}
                      onChange={(e) => setNewEmp({ ...newEmp, baseSalary: Number(e.target.value) })}
                      className="w-full p-1.5 bg-[#FAF8F2] rounded-lg border border-[#EDEAD9]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B655D] block">HRA</label>
                    <input
                      type="number"
                      value={newEmp.hraAllowance}
                      onChange={(e) => setNewEmp({ ...newEmp, hraAllowance: Number(e.target.value) })}
                      className="w-full p-1.5 bg-[#FAF8F2] rounded-lg border border-[#EDEAD9]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#E66A1F] font-bold block">Sweet Allowance</label>
                    <input
                      type="number"
                      value={newEmp.sugartownSweetAllowance}
                      onChange={(e) => setNewEmp({ ...newEmp, sugartownSweetAllowance: Number(e.target.value) })}
                      className="w-full p-1.5 bg-[#FEF4ED] rounded-lg border border-[#E66A1F]/30 text-[#E66A1F] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B655D] block">OT Rate / Hr</label>
                    <input
                      type="number"
                      value={newEmp.overtimeHourlyRate}
                      onChange={(e) => setNewEmp({ ...newEmp, overtimeHourlyRate: Number(e.target.value) })}
                      className="w-full p-1.5 bg-[#FAF8F2] rounded-lg border border-[#EDEAD9]"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-[#EDEAD9]">
                <h4 className="font-bold text-[#201D1A] mb-2">Emergency Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    placeholder="Contact Name"
                    value={newEmp.emergencyName}
                    onChange={(e) => setNewEmp({ ...newEmp, emergencyName: e.target.value })}
                    className="p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
                  />
                  <input
                    placeholder="Relationship"
                    value={newEmp.emergencyRelationship}
                    onChange={(e) => setNewEmp({ ...newEmp, emergencyRelationship: e.target.value })}
                    className="p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
                  />
                  <input
                    placeholder="Contact Phone"
                    value={newEmp.emergencyPhone}
                    onChange={(e) => setNewEmp({ ...newEmp, emergencyPhone: e.target.value })}
                    className="p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F2] border-t border-[#E5E0D2] -mx-6 -mb-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B655D]"
                >
                  Cancel
                </button>
                <button
                  id="submit-create-employee-btn"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: REMOVE EMPLOYEE */}
      {employeeToDelete && (
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
                    Administrator Action
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="p-1 rounded-lg text-[#6B655D] hover:text-[#201D1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center gap-3">
              <img
                src={employeeToDelete.avatar}
                alt={employeeToDelete.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-[#EDEAD9]"
              />
              <div>
                <p className="font-bold text-sm text-[#201D1A]">{employeeToDelete.fullName}</p>
                <p className="text-xs text-[#6B655D]">{employeeToDelete.designation} · {employeeToDelete.department}</p>
                <p className="text-[11px] font-mono text-[#E66A1F]">{employeeToDelete.id} · {employeeToDelete.locationName}</p>
              </div>
            </div>

            <div className="text-xs text-[#6B655D] leading-relaxed space-y-2">
              <p>
                Are you sure you want to remove <strong className="text-[#201D1A]">{employeeToDelete.fullName}</strong> from Sugartown Retail Pvt. Ltd.?
              </p>
              <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/60 text-[11px] text-red-700 space-y-1">
                <p>● Employee portal credentials and mobile shift access will be revoked.</p>
                <p>● Associated payroll batches and shift schedules will cease generation.</p>
                <p>● Action will be permanently logged in the Company Audit Trail.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201D1A] mb-1">
                Offboarding Reason / Category:
              </label>
              <select
                id="employee-view-removal-reason-select"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
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
                id="cancel-employee-view-removal-btn"
                onClick={() => setEmployeeToDelete(null)}
                className="py-2 px-4 rounded-xl border border-[#EDEAD9] text-[#6B655D] font-bold text-xs hover:bg-[#FAF8F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-employee-view-removal-btn"
                onClick={() => {
                  const targetId = employeeToDelete.id;
                  const res = removeEmployee(targetId, deleteReason);
                  setEmployeeToDelete(null);
                  if (activeEmployee?.id === targetId) {
                    setActiveEmployee(null);
                  }
                  if (res.success) {
                    setActionFeedback(res.message);
                    setTimeout(() => setActionFeedback(''), 6000);
                  }
                }}
                className="py-2 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
