import React from 'react';
import { DashboardPortalGateway } from './DashboardPortalGateway';

interface DashboardViewProps {
  onOpenQuickAction?: (action: 'checkin' | 'leave' | 'payslip' | 'employee' | 'announcement') => void;
  onSelectEmployee?: (employeeId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  return (
    <div className="py-2 animate-in fade-in duration-200">
      {/* Exclusively show Employee Login, Admin Login, and Apply Job */}
      <DashboardPortalGateway />
    </div>
  );
};
