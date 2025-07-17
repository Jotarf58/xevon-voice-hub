import React from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <main 
      className={`
        fixed right-0 top-0 transition-all duration-300 h-screen
        ${collapsed ? 'left-20' : 'left-64'}
      `}
    >
      <div className="h-full overflow-y-auto p-6 w-full">
        {children}
      </div>
    </main>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <AppSidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
};