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
  Info
} from 'lucide-react';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { SugartownLogo } from './SugartownLogo';

export const CorporateFooter: React.FC = () => {
  const [showFullEntityModal, setShowFullEntityModal] = useState(false);

  return (
    <>
      <footer className="border-t border-[#E5E0D2] bg-[#FAF8F2] text-[#201D1A] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Column 1: Brand & Official Legal Entity */}
            <div className="md:col-span-5 space-y-3">
              <SugartownLogo 
                size="md" 
                subtext="Sugartown Retail Pvt Ltd"
              />
              
              <div className="space-y-1 text-xs text-[#6B655D]">
                <p className="font-bold text-[#201D1A] tracking-wide">
                  {SUGARTOWN_CORPORATE_INFO.legalName}
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
            </div>

            {/* Column 2: Registered Office Address */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>Registered Office Address</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E5E0D2] text-xs text-[#201D1A] space-y-1 shadow-2xs">
                <p className="font-bold text-[#201D1A] leading-snug">
                  {SUGARTOWN_CORPORATE_INFO.legalName}
                </p>
                <p className="text-[#6B655D] leading-relaxed">
                  {SUGARTOWN_CORPORATE_INFO.registeredAddress.building}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.officeNo}
                </p>
                <p className="text-[#6B655D] text-[11px]">
                  {SUGARTOWN_CORPORATE_INFO.registeredAddress.surveyNo}
                </p>
                <p className="text-[#201D1A] font-semibold pt-1 border-t border-[#EDEAD9]">
                  {SUGARTOWN_CORPORATE_INFO.registeredAddress.city}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.state} - {SUGARTOWN_CORPORATE_INFO.registeredAddress.pincode}, {SUGARTOWN_CORPORATE_INFO.registeredAddress.country}
                </p>
              </div>
            </div>

            {/* Column 3: Corporate Communications & Emails */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#201D1A] uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#E66A1F]" />
                <span>Official Emails & Contact</span>
              </div>

              <ul className="space-y-1.5 text-xs">
                <li>
                  <a 
                    href={`mailto:${SUGARTOWN_CORPORATE_INFO.email}`} 
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E0D2] text-[#201D1A] hover:border-[#E66A1F] hover:text-[#E66A1F] transition-colors"
                  >
                    <span className="truncate">Corporate: <span className="font-semibold">{SUGARTOWN_CORPORATE_INFO.email}</span></span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`mailto:${SUGARTOWN_CORPORATE_INFO.hrEmail}`} 
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E0D2] text-[#201D1A] hover:border-[#E66A1F] hover:text-[#E66A1F] transition-colors"
                  >
                    <span className="truncate">HR Inquiries: <span className="font-semibold">{SUGARTOWN_CORPORATE_INFO.hrEmail}</span></span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`mailto:${SUGARTOWN_CORPORATE_INFO.careersEmail}`} 
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E0D2] text-[#201D1A] hover:border-[#E66A1F] hover:text-[#E66A1F] transition-colors"
                  >
                    <span className="truncate">Job Openings: <span className="font-semibold">{SUGARTOWN_CORPORATE_INFO.careersEmail}</span></span>
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

          {/* Bottom Copyright & Legal Line */}
          <div className="mt-8 pt-6 border-t border-[#EDEAD9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B655D]">
            <p>
              © {new Date().getFullYear()} <strong className="text-[#201D1A]">{SUGARTOWN_CORPORATE_INFO.legalName}</strong>. All rights reserved. CIN: {SUGARTOWN_CORPORATE_INFO.cin}.
            </p>
            <div className="flex items-center gap-4">
              <span>Pune Registered Office</span>
              <span>·</span>
              <span>Confectionery Retail Operations</span>
              <span>·</span>
              <span>Internal Enterprise HRMS</span>
            </div>
          </div>
        </div>
      </footer>

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
                  <p className="text-xs text-[#E66A1F] font-bold">SUGARTOWN RETAIL PRIVATE LIMITED</p>
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
                  <span className="col-span-2 font-bold text-[#201D1A]">{SUGARTOWN_CORPORATE_INFO.legalName}</span>
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
                  <span className="col-span-2 text-[#201D1A] font-medium font-mono">{SUGARTOWN_CORPORATE_INFO.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF4ED]/50 border border-[#E66A1F]/20 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#E66A1F] uppercase text-[11px] tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Statutory Registered Office</span>
                </div>
                <p className="text-xs text-[#201D1A] leading-relaxed font-medium">
                  {SUGARTOWN_CORPORATE_INFO.registeredAddress.fullFormatted}
                </p>
                <div className="text-[11px] text-[#6B655D] pt-1">
                  <strong>Building:</strong> {SUGARTOWN_CORPORATE_INFO.registeredAddress.building} · <strong>Unit:</strong> {SUGARTOWN_CORPORATE_INFO.registeredAddress.officeNo} · <strong>City:</strong> {SUGARTOWN_CORPORATE_INFO.registeredAddress.city}, Maharashtra - {SUGARTOWN_CORPORATE_INFO.registeredAddress.pincode}
                </div>
              </div>

              <div className="p-3 bg-[#EEF7F4] rounded-xl border border-[#A4CDBD]/40 flex items-start gap-2 text-[11px] text-[#396B5A]">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  All employee contracts, payroll disbursements, PF/ESI compliances, and statutory tax filings are administered under <strong>SUGARTOWN RETAIL PRIVATE LIMITED</strong>.
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
