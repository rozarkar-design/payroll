import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Store,
  Briefcase,
  Award,
  Megaphone,
  BarChart3,
  Smartphone,
  ShieldCheck,
  UserCheck,
  Brain
} from 'lucide-react';
import { useHRMS, NavigationTab } from '../context/HRMSContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, currentRole, leaveRequests, isAdminLoggedIn } = useHRMS();

  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    minRole?: 'all' | 'manager_plus' | 'hr_plus';
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, minRole: 'all' },
    { 
      id: 'employee_portal', 
      label: 'Employee Portal', 
      icon: UserCheck, 
      badge: 'Self-Service', 
      badgeColor: '#396B5A', 
      minRole: 'all',
      highlight: true 
    },
    { 
      id: 'admin', 
      label: 'Admin Panel', 
      icon: ShieldCheck, 
      badge: isAdminLoggedIn ? 'Active' : 'Secure', 
      badgeColor: isAdminLoggedIn ? '#396B5A' : '#E66A1F', 
      minRole: 'all',
      highlight: true 
    },
    { 
      id: 'careers', 
      label: 'Apply for Jobs (IQ Test)', 
      icon: Brain, 
      badge: 'Hiring', 
      badgeColor: '#E66A1F', 
      minRole: 'all' 
    },
    { id: 'employees', label: 'Employees', icon: Users, minRole: 'all' },
    { id: 'attendance', label: 'Attendance & Shifts', icon: Clock, minRole: 'all' },
    { 
      id: 'leave', 
      label: 'Leave Management', 
      icon: CalendarCheck, 
      badge: pendingLeaves > 0 && currentRole !== 'employee' ? pendingLeaves : undefined,
      badgeColor: '#E66A1F',
      minRole: 'all' 
    },
    { id: 'payroll', label: 'Payroll & Payslips', icon: CreditCard, minRole: 'all' },
    { id: 'stores', label: 'Stores & Teams', icon: Store, minRole: 'all' },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase, minRole: 'manager_plus' },
    { id: 'performance', label: 'Performance & Badges', icon: Award, minRole: 'all' },
    { id: 'communication', label: 'Announcements', icon: Megaphone, minRole: 'all' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, minRole: 'manager_plus' },
    { id: 'mobile_view', label: 'Staff Mobile Mode', icon: Smartphone, minRole: 'all' }
  ];

  const isAccessible = (item: NavItem) => {
    if (item.minRole === 'all') return true;
    if (item.minRole === 'manager_plus') {
      return currentRole !== 'employee';
    }
    if (item.minRole === 'hr_plus') {
      return ['super_admin', 'hr_manager', 'director'].includes(currentRole);
    }
    return true;
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`w-64 shrink-0 bg-[#FAF8F2] border-r border-[#E5E0D2] min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between fixed lg:static inset-y-0 left-0 z-40 transition-transform lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="space-y-4">
        
        {/* Role Pill */}
        <div className="px-3 py-2 rounded-xl bg-[#EDEAD9]/60 border border-[#E5E0D2] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B655D] block">Current Access</span>
            <span className="text-xs font-bold text-[#201D1A] capitalize">
              {currentRole.replace('_', ' ')}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#396B5A]"></span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const allowed = isAccessible(item);
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}-btn`}
                disabled={!allowed}
                onClick={() => allowed && setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  !allowed
                    ? 'opacity-45 cursor-not-allowed text-[#6B655D]'
                    : isActive
                    ? 'bg-[#E66A1F] text-white shadow-sm shadow-[#E66A1F]/20'
                    : 'text-[#201D1A] hover:bg-[#EDEAD9]/70 hover:text-[#E66A1F]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-[#6B655D] group-hover:text-[#E66A1F]'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span 
                    className="px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white shadow-xs shrink-0"
                    style={{ backgroundColor: item.badgeColor || '#E66A1F' }}
                  >
                    {item.badge}
                  </span>
                )}

                {!allowed && (
                  <span className="text-[9px] text-[#6B655D] uppercase font-bold tracking-tight">Admin</span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Sugartown Sweet Culture Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-[#FEF4ED] to-[#FAF8F2] border border-[#E66A1F]/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🍬</span>
          <span className="text-xs font-bold text-[#E66A1F]">Sugartown Culture</span>
        </div>
        <p className="text-[11px] text-[#6B655D] leading-relaxed">
          Crafting joy one candy at a time across 5 locations with care and passion.
        </p>
        <div className="mt-2 pt-2 border-t border-[#E66A1F]/15 flex items-center justify-between text-[10px] text-[#201D1A] font-semibold">
          <span>Active Staff</span>
          <span className="text-[#E66A1F]">12 on duty</span>
        </div>
      </div>
    </aside>
    </>
  );
};
