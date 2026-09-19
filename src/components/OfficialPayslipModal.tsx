import React from 'react';
import { 
  Printer, 
  X, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { PayrollRecord } from '../types';

interface OfficialPayslipModalProps {
  payslip: PayrollRecord;
  onClose: () => void;
}

export const OfficialPayslipModal: React.FC<OfficialPayslipModalProps> = ({
  payslip,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Calculate gross and deductions
  const grossEarnings = 
    payslip.earnings.basic + 
    payslip.earnings.hra + 
    payslip.earnings.confectioneryAllowance + 
    payslip.earnings.transport + 
    payslip.earnings.overtimePay + 
    payslip.earnings.incentivesBonus;

  const totalDeductions = 
    payslip.deductions.incomeTax + 
    payslip.deductions.healthInsurance + 
    payslip.deductions.providentFund + 
    payslip.deductions.unpaidLeaveDeduction;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E5E0D2] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 my-auto print:shadow-none print:border-none print:max-w-none print:w-full print:p-0">
        
        {/* Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-[#EDEAD9] pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B655D]">
            <FileText className="w-4 h-4 text-[#E66A1F]" />
            <span>Official Salary Disbursement Voucher</span>
            <span className="font-mono text-[11px] text-[#201D1A] bg-[#FAF8F2] px-2 py-0.5 rounded border border-[#EDEAD9]">
              Ref: {payslip.transactionRef || 'ST-PAY-202609-001'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="payslip-print-button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button
              id="payslip-close-button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-[#E5E0D2] hover:bg-[#FAF8F2] text-[#6B655D] transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===================== OFFICIAL PAYSLIP DOCUMENT BODY ===================== */}
        <div className="space-y-6 text-[#201D1A] print:space-y-4">
          
          {/* Official Corporate Letterhead */}
          <div className="border-b-2 border-[#201D1A] pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-black font-display text-lg sm:text-xl text-[#201D1A] tracking-tight">
                    {SUGARTOWN_CORPORATE_INFO.legalName}
                  </h1>
                </div>
                <p className="text-xs font-medium text-[#E66A1F] tracking-wide">
                  {SUGARTOWN_CORPORATE_INFO.tradeName}
                </p>
                
                {/* Statutory Registered Address */}
                <div className="text-[11px] text-[#555] leading-relaxed max-w-xl pt-1">
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E66A1F] shrink-0 mt-0.5 print:hidden" />
                    <span>
                      <strong>Registered Address:</strong> {SUGARTOWN_CORPORATE_INFO.registeredAddress.building}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.officeNo}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.surveyNo}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.city}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.state} - {SUGARTOWN_CORPORATE_INFO.registeredAddress.pincode}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.country}
                    </span>
                  </div>
                </div>

                {/* CIN & Contact Info */}
                <div className="flex items-center gap-4 text-[11px] text-[#444] pt-1 flex-wrap font-mono">
                  <span>
                    <strong>CIN:</strong> <span className="text-[#201D1A] font-bold">{SUGARTOWN_CORPORATE_INFO.cin}</span>
                  </span>
                  <span>·</span>
                  <span>
                    <strong>Email:</strong> {SUGARTOWN_CORPORATE_INFO.hrEmail}
                  </span>
                  <span>·</span>
                  <span>
                    <strong>Support:</strong> {SUGARTOWN_CORPORATE_INFO.email}
                  </span>
                  <span>·</span>
                  <span>
                    <strong>Tel:</strong> {SUGARTOWN_CORPORATE_INFO.phone}
                  </span>
                </div>
              </div>

              {/* Pay Period Block */}
              <div className="sm:text-right bg-[#FAF8F2] border border-[#E5E0D2] p-3 rounded-xl min-w-[160px] shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B655D] block">
                  Pay Period Voucher
                </span>
                <span className="text-base font-black text-[#201D1A] block">
                  {payslip.month}
                </span>
                <span className="text-[11px] font-semibold text-[#396B5A] block mt-0.5">
                  Disbursed: {payslip.paymentDate || 'September 18, 2026'}
                </span>
                <span className="text-[10px] text-[#6B655D] font-mono block mt-0.5">
                  {payslip.workingDays || 22} Working Days · {payslip.presentDays || 22} Present
                </span>
              </div>
            </div>
          </div>

          {/* Employee & Bank Summary Grid */}
          <div className="bg-[#FAF8F2] rounded-xl border border-[#E5E0D2] p-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Employee Name</span>
                <span className="font-bold text-sm text-[#201D1A]">{payslip.employeeName}</span>
                <span className="text-[11px] font-mono text-[#E66A1F] block">{payslip.employeeId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Designation</span>
                <span className="font-bold text-[#201D1A]">{payslip.designation}</span>
                <span className="text-[11px] text-[#6B655D] block">{payslip.department} · {payslip.locationName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Bank & Account</span>
                <span className="font-mono font-medium text-[#201D1A]">{payslip.bankAccountMasked}</span>
                <span className="text-[10px] text-[#6B655D] block">Direct Electronic Deposit</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Payment Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#396B5A] bg-[#EEF7F4] px-2 py-0.5 rounded-md border border-[#A4CDBD]/40 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> {payslip.status.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#6B655D] font-mono block mt-1">Ref: {payslip.transactionRef || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Accounting Table */}
          <div className="border border-[#E5E0D2] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EDEAD9]/60 border-b border-[#E5E0D2] font-bold text-[#201D1A]">
                  <th className="p-3 w-1/2">Earnings Description</th>
                  <th className="p-3 text-right">Amount (USD)</th>
                  <th className="p-3 w-1/2 border-l border-[#E5E0D2]">Statutory & Other Deductions</th>
                  <th className="p-3 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEAD9] text-[#201D1A]">
                <tr>
                  <td className="p-3 font-medium">Basic Pay</td>
                  <td className="p-3 text-right font-mono font-semibold">${payslip.earnings.basic.toLocaleString()}</td>
                  <td className="p-3 font-medium border-l border-[#E5E0D2]">Provident Fund (PF Contribution)</td>
                  <td className="p-3 text-right font-mono text-[#6B655D]">${payslip.deductions.providentFund}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">House Rent Allowance (HRA)</td>
                  <td className="p-3 text-right font-mono font-semibold">${payslip.earnings.hra}</td>
                  <td className="p-3 font-medium border-l border-[#E5E0D2]">Employee Health Insurance / ESI</td>
                  <td className="p-3 text-right font-mono text-[#6B655D]">${payslip.deductions.healthInsurance}</td>
                </tr>
                <tr className="bg-[#FEF4ED]/40">
                  <td className="p-3 font-bold text-[#E66A1F]">
                    Sugartown Sweet & Treat Allowance
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-[#E66A1F]">
                    ${payslip.earnings.confectioneryAllowance}
                  </td>
                  <td className="p-3 font-medium border-l border-[#E5E0D2]">Income Tax Withholding / TDS</td>
                  <td className="p-3 text-right font-mono text-[#6B655D]">${payslip.deductions.incomeTax}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">
                    Overtime Pay ({payslip.overtimeHours} hrs @ 1.5x)
                  </td>
                  <td className="p-3 text-right font-mono font-semibold">${payslip.earnings.overtimePay}</td>
                  <td className="p-3 font-medium border-l border-[#E5E0D2]">Unpaid Leave Deductions</td>
                  <td className="p-3 text-right font-mono text-[#6B655D]">${payslip.deductions.unpaidLeaveDeduction}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Transit Stipend</td>
                  <td className="p-3 text-right font-mono font-semibold">${payslip.earnings.transport}</td>
                  <td className="p-3 font-medium border-l border-[#E5E0D2]">-</td>
                  <td className="p-3 text-right font-mono text-[#6B655D]">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Performance / Festival Incentive</td>
                  <td className="p-3 text-right font-mono font-semibold">${payslip.earnings.incentivesBonus}</td>
                  <td className="p-3 font-medium border-l border-[#E5E0D2]">-</td>
                  <td className="p-3 text-right font-mono text-[#6B655D]">-</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-[#FAF8F2] border-t-2 border-[#E5E0D2] font-bold text-xs">
                  <td className="p-3 text-[#201D1A]">Gross Earnings</td>
                  <td className="p-3 text-right font-mono text-sm text-[#201D1A]">
                    ${grossEarnings.toLocaleString()}
                  </td>
                  <td className="p-3 border-l border-[#E5E0D2] text-[#6B655D]">Total Deductions</td>
                  <td className="p-3 text-right font-mono text-sm text-red-600">
                    -${totalDeductions.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* High-Contrast Net Disbursed Salary Highlight Banner */}
          <div className="p-4 rounded-xl bg-[#FAF8F2] border-2 border-[#396B5A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#396B5A] block">
                Net Disbursed Take-Home Salary
              </span>
              <span className="text-xs text-[#6B655D]">
                Transferred to employee deposit account · Fully cleared
              </span>
            </div>
            <div className="sm:text-right">
              <span className="font-mono text-2xl font-black text-[#201D1A] tracking-tight block">
                ${payslip.netSalary.toLocaleString()}.00
              </span>
              <span className="text-[10px] text-[#396B5A] font-semibold">
                USD (United States Dollars)
              </span>
            </div>
          </div>

          {/* Legal Compliance & Disclaimer Footer */}
          <div className="pt-3 border-t border-[#EDEAD9] text-[10px] text-[#6B655D] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#201D1A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#396B5A]" />
              <span>Statutory Compliance Declaration</span>
            </div>
            <p className="leading-relaxed">
              This salary slip is an official electronic record issued by <strong>{SUGARTOWN_CORPORATE_INFO.legalName}</strong> (CIN: {SUGARTOWN_CORPORATE_INFO.cin}) under the Indian Companies Act, 2013. Taxes and statutory deductions have been deposited in accordance with applicable labor regulations.
            </p>
            <div className="flex items-center justify-between pt-2 text-[9px] text-[#888] font-mono">
              <span>Ref: {payslip.transactionRef || 'ST-PAY-REF'}</span>
              <span>Generated via Sugartown HRMS Enterprise Platform</span>
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>

        </div>
        {/* ===================== END OFFICIAL PAYSLIP ===================== */}

      </div>
    </div>
  );
};
