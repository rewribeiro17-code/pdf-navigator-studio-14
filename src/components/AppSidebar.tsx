import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Brain, 
  AlertCircle, 
  Target, 
  CheckCircle, 
  Gift,
  LogOut,
  User,
  BookOpen,
  Activity,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { bookContent } from '@/data/bookContent';
import { cn } from '@/lib/utils';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const mainNavItems = [
    { title: 'Início', url: '/app', icon: Home },
    { title: 'Introdução', url: '/app/intro', icon: User },
    { title: 'O que é Nomofobia?', url: '/app/nomophobia', icon: Brain },
    { title: 'Malefícios do Vício', url: '/app/impacts', icon: AlertCircle },
    { title: 'O Método', url: '/app/method', icon: Target },
  ];

  const stageItems = [
    { title: 'Etapa 1: Diagnóstico', url: '/app/stage1', icon: Activity },
    { title: 'Etapa 2: Limitação', url: '/app/stage2', icon: CheckCircle },
    { title: 'Etapa 3: Substituição', url: '/app/stage3', icon: Sparkles },
    { title: 'Etapa 4: Reforço', url: '/app/stage4', icon: MessageSquare },
  ];

  const bonusItems = bookContent.bonusBooks.map(book => ({
    title: book.title,
    url: `/app/bonus/${book.id}`,
    icon: Gift,
    emoji: book.icon
  }));

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border/50 bg-gradient-to-b from-sidebar-background to-background">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">Digital Detox Kids</span>
            <span className="text-xs text-muted-foreground">Guia Completo</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Conteúdo Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent",
                        isActive(item.url) && "bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            ETAPAS DO MÉTODO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {stageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent",
                        isActive(item.url) && "bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            📚 Bônus Exclusivos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bonusItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent",
                        isActive(item.url) && "bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary font-medium"
                      )}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/app/conclusion"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent",
                    isActive('/app/conclusion') && "bg-gradient-to-r from-accent/20 to-accent/10 text-accent font-medium"
                  )}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Conclusão</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium truncate">{user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;