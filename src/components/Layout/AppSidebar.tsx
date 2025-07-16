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
  useSidebar,
} from "@/components/ui/sidebar";
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
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
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

  return (
    <Sidebar 
      className={`${collapsed ? "w-20" : "w-64"} border-r border-border bg-card transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Header with Logo and Toggle */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/18bd00ac-7312-4fae-9241-d12230e20fe4.png" 
                alt="Xevon Logo" 
                className={`object-contain flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-8 h-8' : 'w-8 h-8'}`}
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
              {menuItems.map((item) => {
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
                        ${collapsed ? "justify-center" : ""}
                      `}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 relative z-10" />
                      {!collapsed && <span className="truncate transition-all duration-200 relative z-10">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Developer Menu */}
        {user?.role === 'developer' && (
          <SidebarGroup className="px-3 py-2">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
                Admin
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {developerMenuItems.map((item) => {
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
                           ${collapsed ? "justify-center" : ""}
                         `}
                         title={collapsed ? item.title : undefined}
                       >
                        <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 relative z-10" />
                        {!collapsed && <span className="truncate transition-all duration-200 relative z-10">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuItem>
                  );
                })}
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