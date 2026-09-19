import React, { useState } from 'react';
import {
  Calendar,
  X,
  Sparkles,
  CheckCircle2,
  Coffee,
  Heart,
  CalendarCheck
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { LeaveType } from '../types';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, applyLeave, triggerConfetti } = useHRMS();

  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Paid Leave');
  const [startDate, setStartDate] = useState('2026-09-24');
  const [endDate, setEndDate] = useState('2026-09-26');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  // Calculate days count
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyLeave({
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      department: currentUser.department,
      locationName: currentUser.locationName,
      leaveType,
      startDate,
      endDate,
      daysCount: diffDays,
      reason: reason || 'Scheduled personal leave'
    });
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#E5E0D2] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#FAF8F2] via-white to-[#FEF4ED] p-5 border-b border-[#EDEAD9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E66A1F] text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#201D1A]">Request Leave</h3>
              <p className="text-[11px] text-[#6B655D]">Automatic balance tracking & manager routing</p>
            </div>
          </div>

          <button onClick={onClose} className="text-[#6B655D] hover:text-[#201D1A] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Remaining balance pills */}
          <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] text-center">
            <div>
              <span className="text-[9px] text-[#6B655D] uppercase block">Annual</span>
              <span className="font-bold text-[#201D1A]">{currentUser.leaveBalance.annual}d</span>
            </div>
            <div>
              <span className="text-[9px] text-[#6B655D] uppercase block">Casual</span>
              <span className="font-bold text-[#201D1A]">{currentUser.leaveBalance.casual}d</span>
            </div>
            <div>
              <span className="text-[9px] text-[#6B655D] uppercase block">Sick</span>
              <span className="font-bold text-[#201D1A]">{currentUser.leaveBalance.sick}d</span>
            </div>
            <div>
              <span className="text-[9px] text-[#E66A1F] uppercase block font-bold">Sweet</span>
              <span className="font-bold text-[#E66A1F]">{currentUser.leaveBalance.sweetSabbatical}d</span>
            </div>
          </div>

          {/* Leave Type */}
          <div>
            <label className="text-[11px] font-bold text-[#6B655D] block mb-1">Leave Category</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] font-medium text-[#201D1A] focus:outline-none"
            >
              <option value="Annual Paid Leave">Annual Paid Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick & Medical Leave</option>
              <option value="Sweet Sabbatical">Sweet Sabbatical 🍬</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#6B655D] block mb-1">From Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#6B655D] block mb-1">To Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
              />
            </div>
          </div>

          {/* Calculated duration badge */}
          <div className="p-3 rounded-xl bg-[#FEF4ED] border border-[#E66A1F]/20 flex items-center justify-between">
            <span className="text-xs font-bold text-[#E66A1F]">Total Duration</span>
            <span className="text-xs font-black text-[#E66A1F]">{diffDays} Day{diffDays > 1 ? 's' : ''} requested</span>
          </div>

          {/* Reason */}
          <div>
            <label className="text-[11px] font-bold text-[#6B655D] block mb-1">Reason for Absence</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a brief explanation for store planning..."
              className="w-full p-2.5 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B655D] hover:bg-[#EDEAD9]"
            >
              Cancel
            </button>
            <button
              id="submit-leave-request-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/30"
            >
              Submit Application
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
