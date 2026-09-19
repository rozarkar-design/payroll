import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Globe,
  Lock,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { SugartownLogo } from './SugartownLogo';
import { useHRMS } from '../context/HRMSContext';

export const CorporateFooter: React.FC = () => {
  const { setActiveTab } = useHRMS();
  const [showFullEntityModal, setShowFullEntityModal] = useState(false);
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  return (
    <>
      <footer className="border-t border-[#E5E0D2] bg-[#FAF8F2] text-[#201D1A] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Column 1: Brand & Official Legal Entity */}
            <div className="md:col-span-5 space-y-3">
              <SugartownLogo 
                size="md" 
                subtext="Sugartown Retail Pvt. Ltd."
              />
              
              <div className="space-y-1 text-xs text-[#6B655D]">
                <p className="font-black text-sm text-[#201D1A] tracking-wide">
                  Sugartown Retail Pvt. Ltd.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] bg-[#EDEAD9] text-[#201D1A] px-2 py-0.5 rounded-md border border-[#E5E0D2]">
                    CIN: {SUGARTOWN_CORPORATE_INFO.cin}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#396B5A] bg-[#EEF7F4] px-2 py-0.5 rounded-md border border-[#A4CDBD]/40">
                    <ShieldCheck className="w-3 h-3" /> Ministry of Corporate Affairs Registered
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#6B655D] leading-relaxed max-w-md">
                Sugartown HRMS is the enterprise human capital operations platform powering our flagship boutique candy stores, confectioneries, artisan production kitchen, and supply network.
              </p>

              <div className="flex items-center gap-4 text-xs pt-1">
                <a 
                  href="https://sugartown.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#E66A1F] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>sugartown.in</span>
                </a>
                <a 
                  href="tel:+919145448010" 
                  className="inline-flex items-center gap-1.5 font-semibold text-[#201D1A] hover:text-[#E66A1F]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#396B5A]" />
                  <span>+91 91454 48010</span>
                </a>
              </div>
            </div>

            {/* Column 2: Registered Office Address */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>Corporate Office Address</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E5E0D2] text-xs text-[#201D1A] space-y-1 shadow-2xs">
                <p className="font-bold text-[#201D1A] leading-snug">
                  Sugartown Retail Pvt. Ltd.
                </p>
                <p className="text-[#6B655D] leading-relaxed">
                  702, Workflo Icon Tower, Baner, Pune – 411045, Maharashtra, India
                </p>
                <div className="pt-2 border-t border-[#EDEAD9] flex items-center justify-between text-[11px]">
                  <span className="text-[#6B655D]">Website:</span>
                  <a href="https://sugartown.in" target="_blank" rel="noreferrer" className="font-bold text-[#E66A1F] hover:underline">
                    sugartown.in
                  </a>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6B655D]">Phone:</span>
                  <a href="tel:+919145448010" className="font-bold text-[#201D1A] hover:text-[#E66A1F]">
                    +91 91454 48010
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Corporate Communications & Emails */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>Official Contact & Email</span>
              </div>

              <ul className="space-y-1.5 text-xs">
                <li>
                  <a 
                    href={`mailto:${SUGARTOWN_CORPORATE_INFO.email}`} 
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E0D2] text-[#201D1A] hover:border-[#E66A1F] hover:text-[#E66A1F] transition-colors"
                  >
                    <span className="truncate">Email: <span className="font-semibold">{SUGARTOWN_CORPORATE_INFO.email}</span></span>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+919145448010" 
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E0D2] text-[#201D1A] hover:border-[#E66A1F] hover:text-[#E66A1F] transition-colors"
                  >
                    <span className="truncate">Phone: <span className="font-semibold">+91 91454 48010</span></span>
                  </a>
                </li>
              </ul>

              <button
                id="footer-open-corporate-modal-btn"
                onClick={() => setShowFullEntityModal(true)}
                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#EDEAD9]/70 hover:bg-[#EDEAD9] text-xs font-semibold text-[#201D1A] flex items-center justify-center gap-1.5 border border-[#E5E0D2] transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>View Full Corporate Filing Details</span>
              </button>
            </div>

          </div>

          {/* Links Row: Privacy Policy | Terms | Careers | Contact HR */}
          <div className="mt-8 pt-6 border-t border-[#EDEAD9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-[#6B655D] text-[11px] text-center sm:text-left">
              © {new Date().getFullYear()} <strong className="text-[#201D1A]">Sugartown Retail Pvt. Ltd.</strong> · 702, Workflo Icon Tower, Baner, Pune – 411045, Maharashtra, India.
            </div>

            <div className="flex items-center gap-3 font-semibold text-xs flex-wrap justify-center">
              <button
                id="footer-privacy-btn"
                onClick={() => setModalType('privacy')}
                className="text-[#6B655D] hover:text-[#E66A1F] transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-[#EDEAD9]">|</span>
              <button
                id="footer-terms-btn"
                onClick={() => setModalType('terms')}
                className="text-[#6B655D] hover:text-[#E66A1F] transition-colors"
              >
                Terms
              </button>
              <span className="text-[#EDEAD9]">|</span>
              <button
                id="footer-careers-btn"
                onClick={() => setActiveTab('careers')}
                className="text-[#E66A1F] font-bold hover:underline transition-all"
              >
                Careers
              </button>
              <span className="text-[#EDEAD9]">|</span>
              <button
                id="footer-contact-hr-btn"
                onClick={() => setModalType('contact')}
                className="text-[#396B5A] font-bold hover:underline transition-all"
              >
                Contact HR
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {modalType === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E5E0D2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#E66A1F]" />
                <h3 className="font-bold text-base text-[#201D1A]">Privacy Policy</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#FAF8F2] hover:bg-[#EDEAD9] flex items-center justify-center text-[#6B655D]">✕</button>
            </div>
            <div className="text-xs text-[#6B655D] space-y-2.5 max-h-96 overflow-y-auto leading-relaxed">
              <p>
                <strong>Sugartown Retail Pvt. Ltd.</strong> (“Sugartown”) is dedicated to protecting the personal data and employment records of all retail staff, bakery specialists, store managers, and corporate employees.
              </p>
              <p>
                <strong>Data Collected:</strong> Personal identification, biometric/selfie attendance timestamps, geofence coordinates during punch-in/out, bank account details for payroll disbursal, and statutory compliance documents (PF, ESI, TDS).
              </p>
              <p>
                <strong>Data Usage:</strong> All stored records are strictly utilized for legitimate HRMS operations, salary calculation, statutory tax reporting, and employment verification. We do not sell or monetize personal records.
              </p>
              <p>
                <strong>Data Protection:</strong> Encrypted in transit and rest per IT Act, 2000 and the Digital Personal Data Protection (DPDP) Act, 2023.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EDEAD9] flex justify-end">
              <button onClick={() => setModalType(null)} className="px-5 py-2 bg-[#201D1A] text-white rounded-xl text-xs font-bold hover:bg-[#332F2A]">Understood & Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {modalType === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E5E0D2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#396B5A]" />
                <h3 className="font-bold text-base text-[#201D1A]">Terms of Employment & Service</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#FAF8F2] hover:bg-[#EDEAD9] flex items-center justify-center text-[#6B655D]">✕</button>
            </div>
            <div className="text-xs text-[#6B655D] space-y-2.5 max-h-96 overflow-y-auto leading-relaxed">
              <p>
                These terms govern the use of the Sugartown HRMS portal by staff and administrators of <strong>Sugartown Retail Pvt. Ltd.</strong> (702, Workflo Icon Tower, Baner, Pune – 411045, Maharashtra, India).
              </p>
              <p>
                <strong>Attendance & Shifts:</strong> Employees must punch in upon arriving at their designated store, factory, or corporate unit. Duplicate punches are prevented, and late arrivals are recorded automatically.
              </p>
              <p>
                <strong>Payroll & Leaves:</strong> Monthly salaries are processed on the 28th/last working day based on verified biometric/geofenced attendance and approved leave balances.
              </p>
              <p>
                <strong>Code of Conduct:</strong> Unapproved sharing of administrator or colleague credentials is strictly prohibited.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EDEAD9] flex justify-end">
              <button onClick={() => setModalType(null)} className="px-5 py-2 bg-[#201D1A] text-white rounded-xl text-xs font-bold hover:bg-[#332F2A]">I Acknowledge</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact HR Modal */}
      {modalType === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E5E0D2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#E66A1F]" />
                <h3 className="font-bold text-base text-[#201D1A]">Contact HR & People Team</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#FAF8F2] hover:bg-[#EDEAD9] flex items-center justify-center text-[#6B655D]">✕</button>
            </div>
            <div className="space-y-3 text-xs text-[#201D1A]">
              <div className="p-3.5 bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] space-y-2">
                <div className="font-bold text-[#E66A1F] uppercase tracking-wider text-[11px]">
                  Sugartown People & Culture Desk
                </div>
                <p className="text-[#6B655D]">
                  For assistance regarding payslip rectifications, leave queries, PF/ESI registration, or hiring paperwork, reach out directly:
                </p>
                <div className="space-y-1.5 pt-1 font-medium">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#E66A1F]" />
                    <span>Email: <a href="mailto:info@sugartown.in" className="font-bold text-[#201D1A] hover:underline">info@sugartown.in</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#396B5A]" />
                    <span>Direct Helpline: <a href="tel:+919145448010" className="font-bold text-[#201D1A] hover:underline">+91 91454 48010</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6B655D]" />
                    <span>Desk: 702, Workflo Icon Tower, Baner, Pune – 411045</span>
                  </p>
                </div>
              </div>
              <div className="p-3 bg-[#EEF7F4] rounded-xl border border-[#A4CDBD]/40 flex items-center gap-2 text-[#396B5A] text-[11px] font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Working Hours: Mon – Sat, 9:00 AM to 6:30 PM IST</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#EDEAD9] flex justify-end">
              <button onClick={() => setModalType(null)} className="px-5 py-2 bg-[#201D1A] text-white rounded-xl text-xs font-bold hover:bg-[#332F2A]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Full Corporate Registration Details Modal */}
      {showFullEntityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E5E0D2] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF8F2] border border-[#E5E0D2] flex items-center justify-center text-[#E66A1F]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#201D1A]">Corporate Identification & Registration</h3>
                  <p className="text-xs text-[#E66A1F] font-bold">Sugartown Retail Pvt. Ltd.</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullEntityModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8F2] hover:bg-[#EDEAD9] flex items-center justify-center text-[#6B655D] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6B655D] font-semibold">Company Name:</span>
                  <span className="col-span-2 font-bold text-[#201D1A]">Sugartown Retail Pvt. Ltd.</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6B655D] font-semibold">Corporate ID (CIN):</span>
                  <span className="col-span-2 font-mono font-bold text-[#E66A1F] bg-white px-2 py-0.5 rounded border border-[#EDEAD9] inline-block w-fit">
                    {SUGARTOWN_CORPORATE_INFO.cin}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6B655D] font-semibold">Entity Type:</span>
                  <span className="col-span-2 text-[#201D1A] font-medium">Private Limited Company (Retail Confectionery)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6B655D] font-semibold">Corporate Email:</span>
                  <span className="col-span-2 text-[#201D1A] font-medium font-mono">info@sugartown.in</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6B655D] font-semibold">Phone:</span>
                  <span className="col-span-2 text-[#201D1A] font-medium">+91 91454 48010</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6B655D] font-semibold">Website:</span>
                  <span className="col-span-2 text-[#E66A1F] font-bold">sugartown.in</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF4ED]/50 border border-[#E66A1F]/20 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#E66A1F] uppercase text-[11px] tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Corporate Office Address</span>
                </div>
                <p className="text-xs text-[#201D1A] leading-relaxed font-medium">
                  702, Workflo Icon Tower, Baner, Pune – 411045, Maharashtra, India
                </p>
              </div>

              <div className="p-3 bg-[#EEF7F4] rounded-xl border border-[#A4CDBD]/40 flex items-start gap-2 text-[11px] text-[#396B5A]">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  All employee contracts, payroll disbursements, PF/ESI compliances, and statutory tax filings are administered under <strong>Sugartown Retail Pvt. Ltd.</strong>
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFullEntityModal(false)}
                className="px-5 py-2 bg-[#201D1A] text-white rounded-xl text-xs font-bold hover:bg-[#332F2A] transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

