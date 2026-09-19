import React, { useState } from 'react';
import {
  CreditCard,
  IndianRupee,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Eye,
  X,
  Candy
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { PayrollRecord } from '../types';
import { SugartownLogo } from './SugartownLogo';
import { OfficialPayslipModal } from './OfficialPayslipModal';

export const PayrollView: React.FC = () => {
  const {
    payrollRecords,
    employees,
    processPayrollBatch,
    markPayrollPaid,
    currentUser,
    currentRole,
    triggerConfetti
  } = useHRMS();

  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(() => {
    // If role is employee, default or allow view
    return payrollRecords.find(p => p.employeeId === currentUser.id) || payrollRecords[0] || null;
  });

  const [showPayslipModal, setShowPayslipModal] = useState(false);

  // Filter records based on role & month
  const visibleRecords = payrollRecords.filter(p => {
    if (currentRole === 'employee') {
      return p.employeeId === currentUser.id;
    }
    return p.month === selectedMonth;
  });

  // Aggregates
  const totalPayrollCost = visibleRecords.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalOvertimeHours = visibleRecords.reduce((acc, curr) => acc + curr.overtimeHours, 0);
  const totalOvertimeCost = visibleRecords.reduce((acc, curr) => acc + curr.earnings.overtimePay, 0);
  const totalBonusPaid = visibleRecords.reduce((acc, curr) => acc + curr.earnings.incentivesBonus, 0);

  const handleRunPayroll = () => {
    processPayrollBatch(selectedMonth);
  };

  const handleOpenPayslip = (record: PayrollRecord) => {
    setActivePayslip(record);
    setShowPayslipModal(true);
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#201D1A] font-display">Payroll & Compensation</h1>
            <span className="text-xs font-bold text-[#396B5A] bg-[#EEF7F4] px-2.5 py-0.5 rounded-full">
              Automated Calculation Engine
            </span>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Attendance-linked deductions, overtime multiplier, sweet allowances, and certified payslips.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            id="payroll-month-select"
            aria-label="Select Payroll Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold bg-white border border-[#E5E0D2] px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="September 2026">September 2026 (Active)</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>

          {currentRole !== 'employee' && (
            <button
              id="run-payroll-batch-btn"
              onClick={handleRunPayroll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Process Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {currentRole === 'employee' ? 'My Net Take-Home' : 'Total Net Disbursement'}
            </span>
            <IndianRupee className="w-4 h-4 text-[#396B5A]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">
            ₹{totalPayrollCost.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#396B5A] block mt-1">Direct deposit ready</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Overtime Total</span>
            <Clock className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">
            ₹{totalOvertimeCost.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#6B655D] block mt-1">{totalOvertimeHours} hours logged</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sweet Bonuses</span>
            <Sparkles className="w-4 h-4 text-[#E66A1F]" />
          </div>
          <p className="text-2xl font-black text-[#201D1A] font-display">
            ₹{totalBonusPaid.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#E66A1F] block mt-1">Store sales incentives</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B655D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Payroll Status</span>
            <CheckCircle2 className="w-4 h-4 text-[#396B5A]" />
          </div>
          <p className="text-base font-black text-[#396B5A] font-display mt-1">
            Ready & Processed
          </p>
          <span className="text-[10px] text-[#6B655D] block mt-1">Disbursement: Sep 30</span>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-[#E5E0D2] overflow-hidden shadow-2xs space-y-3">
        <div className="p-4 border-b border-[#EDEAD9] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              {selectedMonth} Payroll Records
            </h3>
            <span className="text-xs text-[#201D1A]">
              Showing {visibleRecords.length} statements
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F2] border-b border-[#E5E0D2] text-[11px] font-bold text-[#6B655D] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Base Pay</th>
                <th className="py-3 px-4">Allowances</th>
                <th className="py-3 px-4">Overtime & Bonus</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Take-Home</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEAD9]">
              {visibleRecords.map(record => {
                const totalAllowances = record.earnings.hra + record.earnings.confectioneryAllowance + record.earnings.transport;
                const totalExtra = record.earnings.overtimePay + record.earnings.incentivesBonus;
                const totalDeductions = record.deductions.incomeTax + record.deductions.healthInsurance + record.deductions.providentFund;

                return (
                  <tr key={record.id} className="hover:bg-[#FAF8F2] transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-[#201D1A]">{record.employeeName}</p>
                        <p className="text-[10px] text-[#6B655D]">{record.designation}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6B655D] font-medium">{record.locationName}</td>
                    <td className="py-3 px-4 font-mono font-medium text-[#201D1A]">
                      ₹{record.earnings.basic.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#201D1A]">
                      +₹{totalAllowances.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#396B5A]">
                      +₹{totalExtra.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#C2541A]">
                      -₹{totalDeductions.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-sm text-[#201D1A]">
                      ₹{record.netSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        record.status === 'Paid'
                          ? 'bg-[#EEF7F4] text-[#396B5A]'
                          : 'bg-[#FEF4ED] text-[#E66A1F]'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        id={`view-payslip-btn-${record.id}`}
                        onClick={() => handleOpenPayslip(record)}
                        className="px-3 py-1.5 rounded-xl bg-[#EDEAD9] hover:bg-[#E66A1F] hover:text-white text-xs font-bold text-[#201D1A] transition-colors"
                      >
                        View Payslip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable Payslip Modal */}
      {showPayslipModal && activePayslip && (
        <OfficialPayslipModal
          payslip={activePayslip}
          onClose={() => setShowPayslipModal(false)}
        />
      )}

    </div>
  );
};
