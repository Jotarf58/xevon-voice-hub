import { useState } from "react";
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Star } from "@/components/ui/star";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tarefas", url: "/dashboard/tasks", icon: CheckSquare },
  { title: "Tickets", url: "/dashboard/tickets", icon: Ticket },
  { title: "Chamadas", url: "/dashboard/calls", icon: Phone },
  { title: "Mensagens", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Utilizadores", url: "/dashboard/users", icon: Users },
];

const developerMenuItems = [
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-foreground))] font-medium shadow-sm" 
      : "text-foreground hover:bg-[hsl(var(--nav-hover))] hover:text-[hsl(var(--nav-hover-foreground))] transition-all duration-300";

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

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-border bg-card transition-all duration-300`}>
      <SidebarContent className="flex flex-col h-full">
        {/* Header with Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/18bd00ac-7312-4fae-9241-d12230e20fe4.png" 
              alt="Xevon Logo" 
              className="w-8 h-8 object-contain" 
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground">Xevon</span>
                <span className="text-xs text-muted-foreground">Automation Hub</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                     <NavLink 
                       to={item.url} 
                       end 
                       className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105`}
                     >
                       <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${collapsed ? '' : 'group-hover:scale-110'}`} />
                       {!collapsed && <span className="truncate transition-all duration-300">{item.title}</span>}
                     </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Developer Menu */}
        {user?.role === 'developer' && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {developerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="w-full">
                         <NavLink 
                           to={item.url} 
                           end 
                           className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105`}
                         >
                           <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${collapsed ? '' : 'group-hover:scale-110'}`} />
                           {!collapsed && <span className="truncate transition-all duration-300">{item.title}</span>}
                         </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
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
                  {user.role} • {user.team}
                </p>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className={`w-full ${collapsed ? 'px-2' : 'px-4'} flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground border-border`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}