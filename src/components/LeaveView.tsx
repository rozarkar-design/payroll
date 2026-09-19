import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Heart,
  Sparkles,
  ChevronRight,
  Filter,
  User,
  Coffee
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { LeaveType, LeaveRequest } from '../types';
import { HOLIDAY_CALENDAR } from '../mockData';

interface LeaveViewProps {
  onOpenApplyLeaveModal: () => void;
}

export const LeaveView: React.FC<LeaveViewProps> = ({ onOpenApplyLeaveModal }) => {
  const {
    currentUser,
    currentRole,
    leaveRequests,
    reviewLeave,
    triggerConfetti
  } = useHRMS();

  const [activeTab, setActiveTab] = useState<'requests' | 'approvals' | 'holidays'>('requests');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter requests
  const myRequests = leaveRequests.filter(l => l.employeeId === currentUser.id);
  const pendingApprovals = leaveRequests.filter(l => l.status === 'pending');

  const handleApprove = (id: string) => {
    reviewLeave(id, 'approved', 'Approved by Manager. Enjoy your time off!');
  };

  const handleReject = (id: string) => {
    reviewLeave(id, 'rejected', 'Declined due to heavy scheduled retail store rush.');
  };

  return (
    <div className="space-y-6">

      {/* Header & Balance Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#201D1A] font-display">Leave & Holiday Management</h1>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Track annual allocations, manage sweet sabbaticals, approve team requests, and holiday calendars.
          </p>
        </div>

        <button
          id="apply-leave-trigger-btn"
          onClick={onOpenApplyLeaveModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards for Current User */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Annual Paid Leave</span>
            <CalendarCheck className="w-4 h-4 text-[#396B5A]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">
            {currentUser.leaveBalance.annual} <span className="text-xs font-normal text-[#6B655D]">days left</span>
          </p>
          <span className="text-[10px] text-[#396B5A] block mt-1">Full-pay allowance</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Casual Leave</span>
            <Coffee className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">
            {currentUser.leaveBalance.casual} <span className="text-xs font-normal text-[#6B655D]">days left</span>
          </p>
          <span className="text-[10px] text-[#6B655D] block mt-1">Personal errands</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sick & Medical</span>
            <Heart className="w-4 h-4 text-[#C2541A]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">
            {currentUser.leaveBalance.sick} <span className="text-xs font-normal text-[#6B655D]">days left</span>
          </p>
          <span className="text-[10px] text-[#6B655D] block mt-1">Emergency healthcare</span>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#FEF4ED] to-white rounded-2xl border border-[#E66A1F]/30 shadow-2xs">
          <div className="flex items-center justify-between text-[#E66A1F] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sweet Sabbatical 🍬</span>
            <Sparkles className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <p className="text-2xl font-black text-[#E66A1F] font-display">
            {currentUser.leaveBalance.sweetSabbatical} <span className="text-xs font-normal text-[#6B655D]">days left</span>
          </p>
          <span className="text-[10px] text-[#E66A1F] font-semibold block mt-1">Pastry research & craft rest</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EDEAD9] gap-4 text-xs font-bold text-[#6B655D]">
        <button
          id="tab-my-leaves-btn"
          onClick={() => setActiveTab('requests')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === 'requests'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          {currentRole === 'employee' ? 'My Leave Applications' : 'All Leave Requests'} ({currentRole === 'employee' ? myRequests.length : leaveRequests.length})
        </button>

        {currentRole !== 'employee' && (
          <button
            id="tab-manager-approvals-btn"
            onClick={() => setActiveTab('approvals')}
            className={`py-2.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'border-[#E66A1F] text-[#E66A1F]'
                : 'border-transparent hover:text-[#201D1A]'
            }`}
          >
            <span>Manager Approval Queue</span>
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#E66A1F] text-white text-[10px] font-bold">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        )}

        <button
          id="tab-holiday-calendar-btn"
          onClick={() => setActiveTab('holidays')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === 'holidays'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          2026 Holiday & Sweet Calendar
        </button>
      </div>

      {/* TAB 1: MY / ALL REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {(currentRole === 'employee' ? myRequests : leaveRequests).map(req => (
            <div key={req.id} className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#201D1A]">{req.employeeName}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDEAD9] text-[#6B655D]">
                    {req.leaveType}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === 'approved'
                      ? 'bg-[#EEF7F4] text-[#396B5A]'
                      : req.status === 'rejected'
                      ? 'bg-[#FAF8F2] text-[#C2541A]'
                      : 'bg-[#FEF4ED] text-[#E66A1F]'
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#6B655D]">
                  <span className="font-semibold text-[#201D1A]">{req.daysCount} days</span> from {req.startDate} to {req.endDate} · Applied on {req.appliedOn}
                </p>
                <p className="text-xs text-[#201D1A] italic mt-1">"{req.reason}"</p>
                {req.reviewComment && (
                  <p className="text-[11px] text-[#396B5A] font-medium mt-1">
                    Manager Note: {req.reviewComment} (by {req.reviewedBy})
                  </p>
                )}
              </div>

              {currentRole !== 'employee' && req.status === 'pending' && (
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    id={`approve-leave-${req.id}-btn`}
                    onClick={() => handleApprove(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#396B5A] text-white text-xs font-bold hover:bg-[#2D5D4E] transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    id={`reject-leave-${req.id}-btn`}
                    onClick={() => handleReject(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF8F2] text-[#C2541A] border border-[#EDEAD9] text-xs font-bold hover:bg-[#FEF4ED] transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MANAGER APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E0D2]">
              <CheckCircle2 className="w-10 h-10 text-[#396B5A] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#201D1A]">All caught up!</p>
              <p className="text-xs text-[#6B655D] mt-1">No pending leave requests requiring managerial approval.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map(req => (
                <div key={req.id} className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#201D1A]">{req.employeeName}</span>
                      <span className="text-[10px] font-mono text-[#6B655D]">({req.employeeId})</span>
                      <span className="text-xs font-semibold text-[#E66A1F] bg-[#FEF4ED] px-2 py-0.5 rounded-full">
                        {req.leaveType}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B655D]">
                      Store: <span className="font-semibold text-[#201D1A]">{req.locationName}</span> · Duration: {req.daysCount} day(s) ({req.startDate} to {req.endDate})
                    </p>
                    <p className="text-xs text-[#201D1A] bg-[#FAF8F2] p-2.5 rounded-xl border border-[#EDEAD9]">
                      Reason: "{req.reason}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      id={`queue-approve-${req.id}-btn`}
                      onClick={() => handleApprove(req.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#396B5A] hover:bg-[#2D5D4E] text-white text-xs font-bold transition-all shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Request</span>
                    </button>
                    <button
                      id={`queue-reject-${req.id}-btn`}
                      onClick={() => handleReject(req.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF8F2] hover:bg-[#FEF4ED] text-[#C2541A] border border-[#EDEAD9] text-xs font-bold transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HOLIDAY CALENDAR */}
      {activeTab === 'holidays' && (
        <div className="bg-white rounded-2xl border border-[#E5E0D2] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              Sugartown 2026 Observances & Holidays
            </h3>
            <span className="text-xs text-[#E66A1F] font-bold">Paid Public & Festive Days</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HOLIDAY_CALENDAR.map(h => (
              <div key={h.date} className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#201D1A]">{h.name}</h4>
                  <span className="text-[11px] text-[#6B655D]">{h.date}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  h.type.includes('Sugartown') ? 'bg-[#FEF4ED] text-[#E66A1F]' : 'bg-[#EEF7F4] text-[#396B5A]'
                }`}>
                  {h.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
