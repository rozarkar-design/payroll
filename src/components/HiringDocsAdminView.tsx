import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Send,
  Printer,
  Copy,
  CheckCircle2,
  Sparkles,
  Building,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  ShieldAlert,
  Award,
  BookOpen,
  ArrowRight,
  Download,
  AlertCircle,
  FileCheck,
  RotateCcw,
  Clock,
  Phone,
  Check
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { SugartownLogo } from './SugartownLogo';

export type DocTemplateType = 'offer_letter' | 'welcome_letter' | 'policies';

interface SalaryBreakup {
  annualCtc: number;
  monthlyBasic: number;
  monthlyHra: number;
  monthlySpecialAllowance: number;
  monthlySweetAllowance: number;
  employerPf: number;
  employerEsic: number;
  employeePf: number;
  employeeEsic: number;
  monthlyGross: number;
  netInHand: number;
  annualBonus: number;
}

interface DispatchedDoc {
  id: string;
  candidateName: string;
  position: string;
  templateType: DocTemplateType;
  recipientEmail: string;
  sentDate: string;
  status: 'Sent' | 'Delivered' | 'Accepted';
  ctcFormatted: string;
}

export const HiringDocsAdminView: React.FC = () => {
  const { employees, triggerConfetti } = useHRMS();

  // Active Template Tab
  const [activeTemplate, setActiveTemplate] = useState<DocTemplateType>('offer_letter');

  // Candidate Details (Admin can replace name and employee position)
  const [candidateName, setCandidateName] = useState('Aarav Mehta');
  const [position, setPosition] = useState('Store Executive & Confectionery Specialist');
  const [department, setDepartment] = useState('Store Operations');
  const [storeLocation, setStoreLocation] = useState('Bandra Flagship Store, Mumbai');
  const [joiningDate, setJoiningDate] = useState('2026-10-01');
  const [reportingManager, setReportingManager] = useState('Eleanor Vance (Operations Director)');
  const [candidateEmail, setCandidateEmail] = useState('aarav.mehta@example.com');
  const [candidatePhone, setCandidatePhone] = useState('+91 98201 54321');
  const [refNumber, setRefNumber] = useState('ST-HR/2026/OFF-1082');

  // Salary Breakup
  const [salaryPreset, setSalaryPreset] = useState<'specialist' | 'associate' | 'manager' | 'custom'>('specialist');
  const [monthlyBasic, setMonthlyBasic] = useState(16000);
  const [monthlyHra, setMonthlyHra] = useState(6400);
  const [monthlySpecialAllowance, setMonthlySpecialAllowance] = useState(4100);
  const [monthlySweetAllowance, setMonthlySweetAllowance] = useState(1500);
  const [annualBonus, setAnnualBonus] = useState(20000);

  // Derived Salary Calculations
  const monthlyGross = monthlyBasic + monthlyHra + monthlySpecialAllowance + monthlySweetAllowance; // e.g. 28,000
  const employerPf = Math.round(monthlyBasic * 0.12); // 1,920
  const employerEsic = monthlyGross <= 21000 ? Math.round(monthlyGross * 0.0325) : 0;
  const employeePf = Math.round(monthlyBasic * 0.12); // 1,920
  const employeeEsic = monthlyGross <= 21000 ? Math.round(monthlyGross * 0.0075) : 0;
  const professionalTax = 200;
  const netInHand = monthlyGross - employeePf - employeeEsic - professionalTax;
  const annualCtc = (monthlyGross + employerPf + employerEsic) * 12 + annualBonus;

  // UI States
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState('');
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Dispatched Records History
  const [dispatchedDocs, setDispatchedDocs] = useState<DispatchedDoc[]>([
    {
      id: 'DOC-8821',
      candidateName: 'Maya Lin',
      position: 'Senior Chocolatier',
      templateType: 'offer_letter',
      recipientEmail: 'maya.lin@sugartown.in',
      sentDate: '2026-08-15',
      status: 'Accepted',
      ctcFormatted: '₹4,80,000 LPA'
    },
    {
      id: 'DOC-8820',
      candidateName: 'Marco Rossi',
      position: 'Bakery Specialist & Barista',
      templateType: 'welcome_letter',
      recipientEmail: 'marco.rossi@sugartown.in',
      sentDate: '2026-08-20',
      status: 'Delivered',
      ctcFormatted: '₹3,60,000 LPA'
    }
  ]);

  // Apply Quick Presets for Position & Salary
  const handleApplyPreset = (type: 'associate' | 'specialist' | 'manager') => {
    setSalaryPreset(type);
    if (type === 'associate') {
      setPosition('Store Associate & Cashier');
      setMonthlyBasic(12000);
      setMonthlyHra(4800);
      setMonthlySpecialAllowance(3200);
      setMonthlySweetAllowance(1000);
      setAnnualBonus(15000);
    } else if (type === 'specialist') {
      setPosition('Store Executive & Confectionery Specialist');
      setMonthlyBasic(16000);
      setMonthlyHra(6400);
      setMonthlySpecialAllowance(4100);
      setMonthlySweetAllowance(1500);
      setAnnualBonus(20000);
    } else if (type === 'manager') {
      setPosition('Assistant Store Manager');
      setMonthlyBasic(25000);
      setMonthlyHra(10000);
      setMonthlySpecialAllowance(9000);
      setMonthlySweetAllowance(2000);
      setAnnualBonus(35000);
    }
  };

  // Quick select an existing employee to generate document for
  const handleSelectExistingEmployee = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setCandidateName(emp.fullName);
      setPosition(emp.designation);
      setDepartment(emp.department);
      setCandidateEmail(emp.email);
      setCandidatePhone(emp.phone);
      setJoiningDate(emp.joiningDate);
      setMonthlyBasic(Math.round(emp.salary.baseSalary * 0.5));
      setMonthlyHra(Math.round(emp.salary.baseSalary * 0.2));
      setMonthlySpecialAllowance(Math.round(emp.salary.baseSalary * 0.25));
      setMonthlySweetAllowance(1500);
    }
  };

  // Send to Candidate
  const handleSendToCandidate = () => {
    if (!candidateName.trim() || !candidateEmail.trim()) {
      alert('Please provide both candidate name and recipient email address.');
      return;
    }

    setIsSending(true);
    setSendSuccessMsg('');

    setTimeout(() => {
      setIsSending(false);
      const newDoc: DispatchedDoc = {
        id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
        candidateName,
        position,
        templateType: activeTemplate,
        recipientEmail: candidateEmail,
        sentDate: new Date().toISOString().split('T')[0],
        status: 'Sent',
        ctcFormatted: `₹${(annualCtc).toLocaleString('en-IN')} LPA`
      };

      setDispatchedDocs([newDoc, ...dispatchedDocs]);
      setSendSuccessMsg(
        `Document successfully dispatched to ${candidateName} (${candidateEmail}) with official Sugartown verification stamp!`
      );
      triggerConfetti();
    }, 800);
  };

  // Print Document
  const handlePrint = () => {
    window.print();
  };

  // Copy Plain Text
  const handleCopyText = () => {
    const letterText = `
SUGARTOWN RETAIL PRIVATE LIMITED
CIN: ${SUGARTOWN_CORPORATE_INFO.cin}
Registered Office: ${SUGARTOWN_CORPORATE_INFO.registeredAddress.fullFormatted}

Reference: ${refNumber}
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

To,
${candidateName}
Mobile: ${candidatePhone}
Email: ${candidateEmail}

Subject: ${activeTemplate === 'offer_letter' ? `Offer of Employment for ${position}` : activeTemplate === 'welcome_letter' ? `Welcome to Sugartown Retail Pvt Ltd` : `Employee Code of Conduct & Policies`}

Dear ${candidateName},

${activeTemplate === 'offer_letter' 
  ? `With reference to your application and subsequent interviews, Sugartown Retail Private Limited is pleased to offer you the position of ${position} in the ${department} department, based at our ${storeLocation}. Your target Date of Joining will be ${joiningDate}.

SALARY BREAKUP (ANNEXURE A):
- Basic Salary: ₹${monthlyBasic.toLocaleString('en-IN')} / month (₹${(monthlyBasic * 12).toLocaleString('en-IN')} / year)
- HRA: ₹${monthlyHra.toLocaleString('en-IN')} / month (₹${(monthlyHra * 12).toLocaleString('en-IN')} / year)
- Special Allowance: ₹${monthlySpecialAllowance.toLocaleString('en-IN')} / month (₹${(monthlySpecialAllowance * 12).toLocaleString('en-IN')} / year)
- Confectionery / Sweet Allowance: ₹${monthlySweetAllowance.toLocaleString('en-IN')} / month
- Gross Monthly Salary: ₹${monthlyGross.toLocaleString('en-IN')} / month
- Estimated Net Take-Home: ₹${netInHand.toLocaleString('en-IN')} / month
- Total Cost to Company (CTC): ₹${annualCtc.toLocaleString('en-IN')} per annum

Terms & Conditions:
1. Probation Period: 90 days from joining date.
2. Notice Period: 30 days during probation, 60 days post confirmation.
3. Strict adherence to FSSAI hygiene standards, biometrics, and recipe non-disclosure.`
  : `Welcome to Sugartown Retail Private Limited! We are delighted to have you join our team as ${position}. Your reporting date is ${joiningDate} at ${storeLocation} reporting to ${reportingManager}.`}

Authorized Signatory:
Eleanor Vance
Director of People & Retail Operations
SUGARTOWN RETAIL PRIVATE LIMITED
    `.trim();

    navigator.clipboard.writeText(letterText);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#201D1A] via-[#2A2622] to-[#1A1816] text-white border border-stone-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E66A1F]/20 text-[#FF7A29] text-xs font-bold border border-[#E66A1F]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Administrative Hiring & Document Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            Standard Hiring Documents, Letters & Policies
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            Quickly customize candidate name, employee designation, and salary breakup. Generate official offer letters, welcome kits, and store conduct policies with real-time preview and instant digital dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            title="Copy letter text to clipboard"
          >
            {copiedMsg ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMsg ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            id="hiring-docs-send-btn"
            onClick={handleSendToCandidate}
            disabled={isSending}
            className="px-4 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#E66A1F]/30 transition-all disabled:opacity-50"
          >
            {isSending ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send to Candidate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {sendSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#EEF7F4] border border-[#396B5A]/40 text-xs text-[#396B5A] flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#396B5A]" />
            <span className="font-semibold">{sendSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSendSuccessMsg('')}
            className="text-xs font-bold text-[#396B5A] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Template Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDEAD9] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTemplate('offer_letter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTemplate === 'offer_letter'
              ? 'bg-[#E66A1F] text-white shadow-xs'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] border border-[#E5E0D2]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Standard Offer Letter (with Salary Annexure)</span>
        </button>

        <button
          onClick={() => setActiveTemplate('welcome_letter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTemplate === 'welcome_letter'
              ? 'bg-[#E66A1F] text-white shadow-xs'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] border border-[#E5E0D2]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Welcome Letter & Day-1 Induction</span>
        </button>

        <button
          onClick={() => setActiveTemplate('policies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTemplate === 'policies'
              ? 'bg-[#E66A1F] text-white shadow-xs'
              : 'bg-white text-[#6B655D] hover:bg-[#FAF8F2] border border-[#E5E0D2]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Store Operations & Employee Policies</span>
        </button>
      </div>

      {/* Main 2-Column Work Area: Customizer on Left, Live Printable Document on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ---------------------------------------------------- */}
        {/* LEFT COLUMN: ADMIN REPLACEMENT CONTROLS (5 cols) */}
        {/* ---------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Quick Select Existing Staff */}
          <div className="p-4 bg-white rounded-3xl border border-[#E5E0D2] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B655D] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#E66A1F]" />
                Autofill from Active Employee
              </span>
              <span className="text-[10px] text-[#6B655D]">Optional</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {employees.slice(0, 4).map(emp => (
                <button
                  key={emp.id}
                  onClick={() => handleSelectExistingEmployee(emp.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF8F2] hover:bg-[#FEF4ED] hover:text-[#E66A1F] border border-[#EDEAD9] text-[#201D1A] transition-colors"
                >
                  {emp.fullName.split(' ')[0]} ({emp.id})
                </button>
              ))}
            </div>
          </div>

          {/* Form: Candidate & Position Customizer */}
          <div className="p-5 bg-white rounded-3xl border border-[#E5E0D2] shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#201D1A] flex items-center gap-2 border-b border-[#EDEAD9] pb-2.5">
              <Briefcase className="w-4 h-4 text-[#E66A1F]" />
              Candidate & Position Details
            </h3>

            {/* Candidate Name */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                Candidate / Employee Name *
              </label>
              <input
                id="doc-candidate-name-input"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                className="w-full px-3.5 py-2 text-xs font-bold text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
              />
            </div>

            {/* Position / Designation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#6B655D] uppercase tracking-wider">
                  Employee Position / Title *
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('associate')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${salaryPreset === 'associate' ? 'bg-[#E66A1F] text-white' : 'bg-[#EDEAD9] text-[#6B655D]'}`}
                  >
                    Associate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('specialist')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${salaryPreset === 'specialist' ? 'bg-[#E66A1F] text-white' : 'bg-[#EDEAD9] text-[#6B655D]'}`}
                  >
                    Specialist
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('manager')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${salaryPreset === 'manager' ? 'bg-[#E66A1F] text-white' : 'bg-[#EDEAD9] text-[#6B655D]'}`}
                  >
                    Manager
                  </button>
                </div>
              </div>
              <input
                id="doc-position-input"
                type="text"
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                  setSalaryPreset('custom');
                }}
                placeholder="e.g. Confectionery Specialist"
                className="w-full px-3.5 py-2 text-xs font-semibold text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                Store Location / Base
              </label>
              <input
                type="text"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                  Candidate Email (to send)
                </label>
                <input
                  id="doc-email-input"
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                  Candidate Phone
                </label>
                <input
                  type="tel"
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B655D] uppercase tracking-wider mb-1">
                Reporting Authority
              </label>
              <input
                type="text"
                value={reportingManager}
                onChange={(e) => setReportingManager(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#E66A1F] focus:outline-none"
              />
            </div>
          </div>

          {/* Form: Salary Breakup Customizer (Only shown for offer letter) */}
          {activeTemplate === 'offer_letter' && (
            <div className="p-5 bg-white rounded-3xl border border-[#E5E0D2] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDEAD9] pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#201D1A] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#396B5A]" />
                  Salary Breakup Customizer
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A]">
                  CTC: ₹{annualCtc.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B655D] uppercase mb-1">
                    Basic Salary (Monthly ₹)
                  </label>
                  <input
                    type="number"
                    value={monthlyBasic}
                    onChange={(e) => {
                      setMonthlyBasic(Number(e.target.value) || 0);
                      setSalaryPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-xs font-bold text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#396B5A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B655D] uppercase mb-1">
                    HRA (Monthly ₹)
                  </label>
                  <input
                    type="number"
                    value={monthlyHra}
                    onChange={(e) => {
                      setMonthlyHra(Number(e.target.value) || 0);
                      setSalaryPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-xs font-bold text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#396B5A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B655D] uppercase mb-1">
                    Special Allowance (₹)
                  </label>
                  <input
                    type="number"
                    value={monthlySpecialAllowance}
                    onChange={(e) => {
                      setMonthlySpecialAllowance(Number(e.target.value) || 0);
                      setSalaryPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-xs font-bold text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#396B5A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B655D] uppercase mb-1">
                    Sweet Tasting Perk (₹)
                  </label>
                  <input
                    type="number"
                    value={monthlySweetAllowance}
                    onChange={(e) => {
                      setMonthlySweetAllowance(Number(e.target.value) || 0);
                      setSalaryPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-xs font-bold text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#396B5A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B655D] uppercase mb-1">
                  Annual Performance & Festival Bonus (₹)
                </label>
                <input
                  type="number"
                  value={annualBonus}
                  onChange={(e) => setAnnualBonus(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-bold text-[#201D1A] bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:bg-white focus:border-[#396B5A] focus:outline-none"
                />
              </div>

              {/* Calculated summary pills */}
              <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B655D]">Monthly Gross Salary:</span>
                  <span className="font-bold text-[#201D1A]">₹{monthlyGross.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B655D]">Employer PF Contribution (12%):</span>
                  <span className="font-semibold text-[#201D1A]">₹{employerPf.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B655D]">Employee PF & Tax Deductions:</span>
                  <span className="font-semibold text-red-600">-₹{(employeePf + employeeEsic + professionalTax).toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-1.5 border-t border-[#EDEAD9] flex items-center justify-between text-xs font-bold">
                  <span className="text-[#396B5A]">Estimated Take-Home (Net):</span>
                  <span className="text-sm text-[#396B5A]">₹{netInHand.toLocaleString('en-IN')} / mo</span>
                </div>
              </div>
            </div>
          )}

          {/* Dispatch Log Card */}
          <div className="p-5 bg-white rounded-3xl border border-[#E5E0D2] shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#201D1A] flex items-center justify-between">
              <span>Recently Dispatched Documents</span>
              <span className="text-[10px] text-[#6B655D]">{dispatchedDocs.length} records</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {dispatchedDocs.map(doc => (
                <div
                  key={doc.id}
                  className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#201D1A] block">{doc.candidateName}</span>
                    <span className="text-[10px] text-[#6B655D]">
                      {doc.position} · {doc.sentDate}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'Accepted'
                        ? 'bg-[#EEF7F4] text-[#396B5A]'
                        : 'bg-[#FEF4ED] text-[#E66A1F]'
                    }`}>
                      {doc.status}
                    </span>
                    <span className="text-[10px] text-[#6B655D] block mt-0.5">{doc.ctcFormatted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* RIGHT COLUMN: LIVE PRINTABLE DOCUMENT PREVIEW (7 cols) */}
        {/* ---------------------------------------------------- */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#E5E0D2] shadow-sm p-6 sm:p-8 space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none">

            {/* Official Letterhead Header */}
            <div className="border-b-2 border-[#201D1A] pb-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <SugartownLogo size="md" showBadge={false} />
                  <div>
                    <h1 className="text-base sm:text-lg font-black tracking-tight text-[#201D1A] font-display">
                      {SUGARTOWN_CORPORATE_INFO.legalName}
                    </h1>
                    <p className="text-[11px] font-semibold text-[#E66A1F]">
                      {SUGARTOWN_CORPORATE_INFO.tradeName}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-[10px] text-[#6B655D]">
                  <span className="font-mono font-bold text-[#201D1A] block">
                    CIN: {SUGARTOWN_CORPORATE_INFO.cin}
                  </span>
                  <span>GSTIN: 27AAECS4912K1ZT</span>
                </div>
              </div>

              <div className="text-[10px] text-[#6B655D] leading-relaxed pt-1">
                <strong>Registered Office:</strong> {SUGARTOWN_CORPORATE_INFO.registeredAddress.fullFormatted} · 
                <strong> Email:</strong> {SUGARTOWN_CORPORATE_INFO.hrEmail} · <strong>Phone:</strong> {SUGARTOWN_CORPORATE_INFO.phone}
              </div>
            </div>

            {/* Reference & Date */}
            <div className="flex items-center justify-between text-xs text-[#6B655D] border-b border-[#EDEAD9] pb-3">
              <div>
                <span>Ref: </span>
                <strong className="text-[#201D1A] font-mono">{refNumber}</strong>
              </div>
              <div>
                <span>Date: </span>
                <strong className="text-[#201D1A]">
                  {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </strong>
              </div>
            </div>

            {/* ==================================================== */}
            {/* DOCUMENT 1: OFFER LETTER CONTENT */}
            {/* ==================================================== */}
            {activeTemplate === 'offer_letter' && (
              <div className="space-y-4 text-xs text-[#201D1A] leading-relaxed">
                
                {/* Candidate Address */}
                <div className="bg-[#FAF8F2] p-3.5 rounded-2xl border border-[#EDEAD9]">
                  <p className="font-bold text-[#201D1A]">{candidateName}</p>
                  <p className="text-[11px] text-[#6B655D]">Contact: {candidatePhone} | {candidateEmail}</p>
                  <p className="text-[11px] text-[#6B655D]">Designation: <strong>{position}</strong></p>
                  <p className="text-[11px] text-[#6B655D]">Location: <strong>{storeLocation}</strong></p>
                </div>

                <div className="text-center py-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#201D1A] border-b border-[#201D1A] inline-block pb-0.5">
                    Formal Letter of Employment Offer
                  </h3>
                </div>

                <p>
                  Dear <strong>{candidateName}</strong>,
                </p>

                <p>
                  With reference to your application and subsequent discussions with our hiring panel, we are delighted to offer you employment with <strong>{SUGARTOWN_CORPORATE_INFO.legalName}</strong> as <strong>{position}</strong> in the <strong>{department}</strong> department, based at our <strong>{storeLocation}</strong>.
                </p>

                <p>
                  Your targeted Date of Joining will be <strong>{new Date(joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>. You will report directly to <strong>{reportingManager}</strong>.
                </p>

                {/* Salary Annexure - A */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#201D1A]">
                      Annexure A: Compensation & Benefits Structure
                    </h4>
                    <span className="text-[10px] font-bold text-[#396B5A]">
                      Annual CTC: ₹{annualCtc.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-[#EDEAD9] overflow-hidden">
                    <table className="w-full text-[11px]">
                      <thead className="bg-[#FAF8F2] text-[#6B655D] border-b border-[#EDEAD9] font-bold">
                        <tr>
                          <th className="px-3 py-2 text-left">Salary Component</th>
                          <th className="px-3 py-2 text-right">Monthly (₹)</th>
                          <th className="px-3 py-2 text-right">Annualized (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDEAD9]">
                        <tr>
                          <td className="px-3 py-1.5 font-medium">Basic Salary</td>
                          <td className="px-3 py-1.5 text-right font-semibold">₹{monthlyBasic.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-1.5 text-right">₹{(monthlyBasic * 12).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 font-medium">House Rent Allowance (HRA)</td>
                          <td className="px-3 py-1.5 text-right font-semibold">₹{monthlyHra.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-1.5 text-right">₹{(monthlyHra * 12).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 font-medium">Special & Statutory Allowance</td>
                          <td className="px-3 py-1.5 text-right font-semibold">₹{monthlySpecialAllowance.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-1.5 text-right">₹{(monthlySpecialAllowance * 12).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 font-medium">Confectionery & Sweet Tasting Allowance</td>
                          <td className="px-3 py-1.5 text-right font-semibold">₹{monthlySweetAllowance.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-1.5 text-right">₹{(monthlySweetAllowance * 12).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="bg-[#FAF8F2] font-bold text-[#201D1A]">
                          <td className="px-3 py-2">Gross Monthly Earnings (A)</td>
                          <td className="px-3 py-2 text-right text-[#E66A1F]">₹{monthlyGross.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-2 text-right">₹{(monthlyGross * 12).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 text-[#6B655D]">Employer Provident Fund (12% of Basic)</td>
                          <td className="px-3 py-1.5 text-right text-[#6B655D]">₹{employerPf.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-1.5 text-right text-[#6B655D]">₹{(employerPf * 12).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 text-[#6B655D]">Annual Performance & Festive Bonus</td>
                          <td className="px-3 py-1.5 text-right text-[#6B655D]">-</td>
                          <td className="px-3 py-1.5 text-right text-[#6B655D]">₹{annualBonus.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="bg-[#EEF7F4] font-bold text-[#396B5A]">
                          <td className="px-3 py-2">Total Cost to Company (CTC)</td>
                          <td className="px-3 py-2 text-right">-</td>
                          <td className="px-3 py-2 text-right">₹{annualCtc.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="text-[#6B655D] bg-stone-50">
                          <td className="px-3 py-1.5 italic">Estimated Monthly Net In-Hand (after PF & PT)</td>
                          <td className="px-3 py-1.5 text-right font-bold text-[#396B5A]">₹{netInHand.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-1.5 text-right">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Key Terms */}
                <div className="space-y-1.5 pt-2 text-[11px] text-[#6B655D]">
                  <p><strong>1. Probation:</strong> You will be on probation for 90 days from the joining date.</p>
                  <p><strong>2. Working Hours & Shifts:</strong> As a retail confectionery team member, your shift roster consists of 9 daily hours (inclusive of 1 meal hour), with one rotational weekly off.</p>
                  <p><strong>3. Notice Period:</strong> 30 days during probation, and 60 days following confirmation.</p>
                  <p><strong>4. Confidentiality:</strong> All artisan pastry formulations, syrups, confectionery processes, and retail financials are strictly proprietary.</p>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* DOCUMENT 2: WELCOME LETTER & DAY-1 KIT */}
            {/* ==================================================== */}
            {activeTemplate === 'welcome_letter' && (
              <div className="space-y-4 text-xs text-[#201D1A] leading-relaxed">
                <div className="text-center py-2 bg-[#FEF4ED] rounded-2xl border border-[#E66A1F]/30 p-4">
                  <span className="text-2xl">🍬</span>
                  <h3 className="text-base font-extrabold text-[#201D1A] font-display mt-1">
                    Welcome to the Sugartown Family!
                  </h3>
                  <p className="text-xs text-[#E66A1F] font-semibold mt-0.5">
                    Official Onboarding & Day 1 Induction Briefing
                  </p>
                </div>

                <p>
                  Dear <strong>{candidateName}</strong>,
                </p>

                <p>
                  On behalf of the entire confectionery and management team at <strong>{SUGARTOWN_CORPORATE_INFO.legalName}</strong>, we are thrilled to welcome you to our family as <strong>{position}</strong>.
                </p>

                {/* Day 1 Logistics */}
                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#201D1A]">
                    Day 1 Reporting Details:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#6B655D]">Reporting Date: </span>
                      <strong>{new Date(joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                    </div>
                    <div>
                      <span className="text-[#6B655D]">Reporting Time: </span>
                      <strong>09:30 AM IST Sharp</strong>
                    </div>
                    <div>
                      <span className="text-[#6B655D]">Store Location: </span>
                      <strong>{storeLocation}</strong>
                    </div>
                    <div>
                      <span className="text-[#6B655D]">Orientation Lead: </span>
                      <strong>{reportingManager}</strong>
                    </div>
                  </div>
                </div>

                {/* What to Bring */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#201D1A]">
                    Documents Required on Day 1 (For HR Verification):
                  </h4>
                  <ul className="list-disc list-inside text-[11px] text-[#6B655D] space-y-1">
                    <li>Self-attested copies of Aadhaar Card and PAN Card.</li>
                    <li>Cancelled Cheque or Bank Passbook copy for direct salary NEFT transfers.</li>
                    <li>FSSAI Food Handler Medical Fitness Certificate (or undergo store physical check).</li>
                    <li>Relieving letter & salary slips from previous employer (if applicable).</li>
                    <li>2 passport-size photographs for your Sugartown Staff ID badge.</li>
                  </ul>
                </div>

                {/* Induction Schedule */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#201D1A]">
                    First Week Orientation Milestones:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                    <div className="p-3 rounded-xl bg-white border border-[#EDEAD9]">
                      <span className="font-bold text-[#E66A1F] block">Day 1: Staff Intro</span>
                      <span className="text-[#6B655D]">Uniform & apron fitting, face biometrics enrollment, and kitchen walkthrough.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#EDEAD9]">
                      <span className="font-bold text-[#396B5A] block">Day 2-3: Tasting & POS</span>
                      <span className="text-[#6B655D]">Flavor profile workshops, confectionery notes, and iPad billing training.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#EDEAD9]">
                      <span className="font-bold text-[#201D1A] block">Day 4-7: Counter Shift</span>
                      <span className="text-[#6B655D]">Shadowing senior chocolatier with real-time customer service experience.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* DOCUMENT 3: POLICIES & CODE OF CONDUCT */}
            {/* ==================================================== */}
            {activeTemplate === 'policies' && (
              <div className="space-y-4 text-xs text-[#201D1A] leading-relaxed">
                <div className="text-center py-2 border-b border-[#EDEAD9]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#201D1A]">
                    Sugartown Retail Store Operations & Employee Conduct Policy
                  </h3>
                  <p className="text-[11px] text-[#6B655D] mt-0.5">
                    Binding operational standard applicable to all store staff, managers, and confectionery artisans
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9]">
                    <h4 className="font-bold text-[#201D1A] flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#E66A1F]" />
                      1. FSSAI Food Safety, Hygiene & Grooming Protocol
                    </h4>
                    <p className="text-[11px] text-[#6B655D]">
                      Every team member must wear a clean, pressed Sugartown apron, chef cap or hairnet, and name badge. Strict handwashing with sanitizer is mandatory before handling confectionery, pastries, or packaging. Nails must be kept trimmed without nail polish in food handling areas.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9]">
                    <h4 className="font-bold text-[#201D1A] flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#396B5A]" />
                      2. Biometric Attendance, Punctuality & Grace Periods
                    </h4>
                    <p className="text-[11px] text-[#6B655D]">
                      Staff must punch in via the mobile GPS & selfie portal within store geofence. A maximum 15-minute grace period applies to opening shifts. Continued unexcused late arrivals impact the monthly attendance streak reward.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9]">
                    <h4 className="font-bold text-[#201D1A] flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#E66A1F]" />
                      3. Cash Handling, POS Invoicing & Sweet Tasting Integrity
                    </h4>
                    <p className="text-[11px] text-[#6B655D]">
                      All sales must be invoiced on the POS iPad with printed or WhatsApp GST receipt. Cash drawer reconciliation occurs twice daily. Sampling of sweets is permitted strictly as per the official Daily Tasting Allowance guidelines.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9]">
                    <h4 className="font-bold text-[#201D1A] flex items-center gap-1.5 mb-1">
                      <FileCheck className="w-3.5 h-3.5 text-[#396B5A]" />
                      4. Leave Entitlements & Advance Shift Notice
                    </h4>
                    <p className="text-[11px] text-[#6B655D]">
                      Staff accrue 1.5 days Earned Leave per completed month, alongside 6 annual Casual Leaves and 6 Sick Leaves. All non-emergency leaves must be submitted via the Employee Self-Service portal at least 48 hours in advance for roster adjustments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Signatures & Verification Stamp */}
            <div className="pt-6 border-t-2 border-[#201D1A] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div className="space-y-1">
                <div className="w-36 h-10 border-b border-stone-400 font-serif italic text-base text-[#201D1A] flex items-end">
                  Eleanor Vance
                </div>
                <p className="text-xs font-bold text-[#201D1A]">Eleanor Vance</p>
                <p className="text-[10px] text-[#6B655D]">Director of People & Retail Operations</p>
                <p className="text-[10px] text-[#E66A1F] font-semibold">
                  For {SUGARTOWN_CORPORATE_INFO.legalName}
                </p>
                <span className="inline-block text-[9px] font-mono text-[#396B5A] bg-[#EEF7F4] px-1.5 py-0.5 rounded mt-1">
                  ✓ Digital Master Verification Stamp
                </span>
              </div>

              <div className="space-y-1 text-left sm:text-right">
                <div className="w-44 h-10 border-b border-stone-400 flex items-end justify-end">
                  <span className="text-[10px] text-stone-400 italic">Candidate Acceptance</span>
                </div>
                <p className="text-xs font-bold text-[#201D1A]">{candidateName}</p>
                <p className="text-[10px] text-[#6B655D]">Signature & Date of Acceptance</p>
                <p className="text-[9px] text-[#6B655D] italic">
                  I accept the terms and conditions outlined above.
                </p>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-[9px] text-[#6B655D] pt-2 border-t border-[#EDEAD9]">
              This is an official corporate communication issued under the authority of {SUGARTOWN_CORPORATE_INFO.legalName} (CIN: {SUGARTOWN_CORPORATE_INFO.cin}). Valid for electronic transmission and digital acceptance.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
