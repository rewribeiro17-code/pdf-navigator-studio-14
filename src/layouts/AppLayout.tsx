import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Menu } from 'lucide-react';

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center px-4 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10 lg:hidden">
            <SidebarTrigger className="hover:bg-primary/10 rounded-lg p-2 transition-colors">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <span className="ml-3 font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Digital Detox Kids
            </span>
          </header>
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-primary/5 to-accent/5">
            <div className="container max-w-5xl mx-auto p-6 animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;