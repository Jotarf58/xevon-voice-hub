
import React, { useState, useMemo } from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Ticket, 
  Phone, 
  MessageSquare,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Users,
  Settings
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserModules } from "@/hooks/useModules";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Map module names to navigation items
const getModuleNavItem = (moduleName: string) => {
  const moduleMap: Record<string, { title: string; url: string; icon: any }> = {
    'dashboard': { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    'calls': { title: 'Chamadas', url: '/dashboard/calls', icon: Phone },
    'messages': { title: 'Mensagens', url: '/dashboard/messages', icon: MessageSquare },
    'tasks': { title: 'Tarefas', url: '/dashboard/tasks', icon: CheckSquare },
    'tickets': { title: 'Tickets', url: '/dashboard/tickets', icon: Ticket },
    'users': { title: 'Utilizadores', url: '/dashboard/users', icon: Users },
    'settings': { title: 'Configurações', url: '/dashboard/settings', icon: Settings },
  };
  
  return moduleMap[moduleName?.toLowerCase()] || null;
};

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const { modules, loading: modulesLoading } = useUserModules();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate navigation items based on user modules
  const navigationItems = useMemo(() => {
    if (modulesLoading) {
      // Default items while loading
      return [{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard }];
    }

    // Check if user has access to modules (paid user or XEVON role)
    const hasModuleAccess = user?.isPaidUser || user?.role === 'XEVON';
    
    if (!hasModuleAccess) {
      // Default items for non-paid users without XEVON role
      return [{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard }];
    }

    const items = modules
      .map(module => getModuleNavItem(module.name || ''))
      .filter(item => item !== null);

    // Always include dashboard as first item
    const dashboardExists = items.some(item => item?.url === '/dashboard');
    if (!dashboardExists) {
      items.unshift({ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard });
    }

    return items;
  }, [modules, modulesLoading, user?.isPaidUser, user?.role]);

  // Check if should show limited access info
  const showLimitedAccess = !user?.isPaidUser && user?.role !== 'XEVON';

  return (
    <Sidebar 
      className={`${collapsed ? "w-20" : "w-64"} border-r border-border bg-card transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Header with Logo and Toggle */}
        <div className="p-4 border-b border-border">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
              <img 
                src="/lovable-uploads/18bd00ac-7312-4fae-9241-d12230e20fe4.png" 
                alt="Xevon Logo" 
                className="object-contain flex-shrink-0 w-8 h-8"
              />
              {!collapsed && (
                <div className="flex flex-col animate-fade-in">
                  <span className="font-bold text-lg text-foreground">Xevon</span>
                  <span className="text-xs text-muted-foreground">Automation Hub</span>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-6 w-6 p-0 hover:bg-muted transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          {/* Collapsed toggle button */}
          {collapsed && (
            <div className="flex justify-center mt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-6 w-6 p-0 hover:bg-muted transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1 px-3 py-2">
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                     <NavLink 
                       to={item.url} 
                       end 
                       className={`
                         flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 w-full relative
                         ${active 
                           ? "bg-black text-white font-medium shadow-lg" 
                           : "text-foreground hover:bg-nav-hover hover:text-nav-hover-foreground"
                         }
                         ${collapsed ? "justify-center px-2" : ""}
                       `}
                       title={collapsed ? item.title : undefined}
                     >
                       <item.icon className="h-5 w-5 flex-shrink-0" />
                       {!collapsed && <span className="truncate">{item.title}</span>}
                     </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Info for non-paid users (only show if not XEVON) */}
        {showLimitedAccess && (
          <SidebarGroup className="px-3 py-2">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
                Info
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {!collapsed && "Acesso limitado - Usuário não pago"}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Info & Logout */}
        <div className="border-t border-border p-4">
          {!collapsed && user && (
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-muted/30">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role === 'XEVON' ? 'Administrador' : user.isPaidUser ? 'Usuário Pago' : 'Usuário Gratuito'}
                </p>
              </div>
            </div>
          )}
          
          {collapsed && user && (
            <div className="flex justify-center mb-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-2 
              hover:bg-destructive hover:text-destructive-foreground 
              border-border transition-all duration-300
              ${collapsed ? 'px-2 justify-center' : 'px-4'}
            `}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
