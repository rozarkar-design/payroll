import React from 'react';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';

interface SugartownLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtext?: string;
  className?: string;
  textClassName?: string;
  showBadge?: boolean;
  showCorporateName?: boolean;
  singleLine?: boolean;
}

export const SugartownLogo: React.FC<SugartownLogoProps> = ({
  size = 'md',
  showText = true,
  subtext = 'Sugartown Retail Pvt Ltd',
  className = '',
  textClassName = '',
  showBadge = true,
  showCorporateName = false,
  singleLine = false
}) => {
  // Typography mapping without graphic logo
  const sizeMap = {
    xs: { font: 'text-sm', sub: 'text-[9px]' },
    sm: { font: 'text-base', sub: 'text-[10px]' },
    md: { font: 'text-lg', sub: 'text-[11px]' },
    lg: { font: 'text-2xl', sub: 'text-xs' },
    xl: { font: 'text-3xl', sub: 'text-sm' }
  };

  const current = sizeMap[size];

  if (!showText) {
    return null;
  }

  if (singleLine) {
    return (
      <div className={`inline-flex items-center gap-2 select-none whitespace-nowrap ${className}`}>
        <div className={`flex items-center gap-2 flex-nowrap ${textClassName}`}>
          <span className={`font-display font-black ${current.font} text-[#201D1A] tracking-tight shrink-0`}>
            <span className="text-[#E66A1F]">S</span>ugartown
          </span>
          {showBadge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#A4CDBD]/30 text-[#396B5A] border border-[#A4CDBD]/40 shrink-0">
              HRMS
            </span>
          )}
          {showCorporateName ? (
            <>
              <span className="text-[#C8C2B3] hidden sm:inline shrink-0">·</span>
              <span className="text-xs font-semibold text-[#6B655D] tracking-wide hidden sm:inline shrink-0">
                {SUGARTOWN_CORPORATE_INFO.legalName}
              </span>
            </>
          ) : subtext ? (
            <>
              <span className="text-[#C8C2B3] hidden sm:inline shrink-0">·</span>
              <span className="text-xs font-semibold text-[#6B655D] tracking-wide hidden sm:inline shrink-0">
                {subtext}
              </span>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Sugartown Pure Brand Typography & Legal Entity (No Graphic Logo) */}
      <div className={`leading-tight ${textClassName}`}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`font-display font-black ${current.font} text-[#201D1A] tracking-tight`}>
            <span className="text-[#E66A1F]">S</span>ugartown
          </span>
          {showBadge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#A4CDBD]/30 text-[#396B5A] border border-[#A4CDBD]/40">
              HRMS
            </span>
          )}
        </div>
        
        {showCorporateName ? (
          <p className="text-[10px] font-bold text-[#E66A1F] uppercase tracking-wider block">
            {SUGARTOWN_CORPORATE_INFO.legalName}
          </p>
        ) : subtext ? (
          <p className={`${current.sub} text-[#6B655D] font-medium hidden sm:block`}>
            {subtext}
          </p>
        ) : null}
      </div>
    </div>
  );
};
