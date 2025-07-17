import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <AppSidebar />
        <main className="flex-1 transition-all duration-300 min-w-0">
          <div className="h-screen overflow-y-auto p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};