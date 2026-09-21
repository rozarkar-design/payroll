import React from 'react';
import {
  UserCheck,
  ShieldCheck,
  Brain,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SugartownLogo } from './SugartownLogo';

export const DashboardPortalGateway: React.FC = () => {
  const {
    setActiveTab,
    isEmployeeLoggedIn,
    employeePortalUser,
    employeeLogout,
    isAdminLoggedIn,
    adminLogout,
    adminSession
  } = useHRMS();

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-8 animate-in fade-in duration-300">
      <div className="max-w-3xl w-full flex flex-col items-center">
        
        {/* Brand Logo Emblem */}
        <div className="mb-3 flex justify-center">
          <SugartownLogo size="lg" showBadge={false} />
        </div>

        {/* Bold Primary Caption */}
        <h1 
          id="home-page-main-caption"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#201D1A] font-display tracking-tight mb-8 sm:mb-10 text-center"
        >
          Sugartown HRMS & Payroll
        </h1>

        {/* Action Buttons: Employee Login, Admin Login, Apply Job */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-2xl">
          
          {/* 1. Employee Login Button */}
          <button
            id="home-employee-login-btn"
            onClick={() => setActiveTab('employee_portal')}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#396B5A] hover:bg-[#2C5245] text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer group"
          >
            <UserCheck className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform shrink-0" />
            <span>Employee Login</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform ml-0.5" />
          </button>

          {/* 2. Admin Login Button */}
          <button
            id="home-admin-login-btn"
            onClick={() => setActiveTab('admin')}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#201D1A] hover:bg-[#38332E] text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer group"
          >
            <ShieldCheck className="w-5 h-5 text-[#E66A1F] group-hover:scale-110 transition-transform shrink-0" />
            <span>Admin Login</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform ml-0.5" />
          </button>

          {/* 3. Apply Job Button */}
          <button
            id="home-apply-job-btn"
            onClick={() => setActiveTab('careers')}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#E66A1F] hover:bg-[#D25A12] text-white font-bold text-base shadow-sm shadow-[#E66A1F]/20 hover:shadow-md hover:shadow-[#E66A1F]/25 transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer group"
          >
            <Brain className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform shrink-0" />
            <span>Apply Job</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform ml-0.5" />
          </button>

        </div>

        {/* Active Session Badges (if user is currently logged in) */}
        {(isEmployeeLoggedIn || isAdminLoggedIn) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pt-2">
            {isEmployeeLoggedIn && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF7F4] border border-[#A4CDBD]/50 text-xs font-semibold text-[#396B5A]">
                <span className="w-2 h-2 rounded-full bg-[#396B5A] animate-pulse" />
                <span>Logged in: <strong>{employeePortalUser.fullName}</strong></span>
                <button
                  onClick={employeeLogout}
                  className="ml-1 text-[#6B655D] hover:text-red-600 transition-colors"
                  title="Sign out of Employee Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {isAdminLoggedIn && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF4ED] border border-[#E66A1F]/30 text-xs font-semibold text-[#E66A1F]">
                <span className="w-2 h-2 rounded-full bg-[#E66A1F] animate-pulse" />
                <span>Executive Admin Session Active</span>
                <button
                  onClick={adminLogout}
                  className="ml-1 text-[#6B655D] hover:text-red-600 transition-colors"
                  title="Sign out of Admin Console"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
