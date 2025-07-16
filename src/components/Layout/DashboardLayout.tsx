import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          {/* Header with Sidebar Trigger */}
          <header className="h-12 flex items-center border-b border-border bg-card/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          </header>
          
          <div className="h-[calc(100vh-3rem)] overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};