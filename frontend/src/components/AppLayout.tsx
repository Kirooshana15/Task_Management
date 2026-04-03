import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, ClipboardCheck, ListTodo, Code2,
  LogOut, AppWindow, ChevronLeft, ChevronRight, User, Sun, Moon,
  Plus
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import NewTaskModal from "@/components/NewTaskModal";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors">
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

import { BrandLogo } from "@/components/BrandLogo";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "coordinator"] },
    { to: "/requests", icon: FileText, label: "Service Requests", roles: ["admin", "coordinator"] },
    { to: "/review", icon: ClipboardCheck, label: "Review Panel", roles: ["admin", "coordinator"] },
    { to: "/work-items", icon: ListTodo, label: "Work Items", roles: ["admin", "coordinator"] },
    { to: "/developer", icon: Code2, label: "Dev Board", roles: ["developer"] },
  ].filter((item) => item.roles.includes(user.role));

  const pageTitles: Record<string, string> = {
    "/": "Dashboard Overview",
    "/requests": "Service Requests",
    "/review": "Review Panel",
    "/work-items": "Work Items",
    "/developer": "Developer Board",
  };

  const currentTitle = pageTitles[location.pathname] || "ServiceFlow";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: collapsed ? 72 : 260 }} 
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-sidebar flex flex-col border-r border-sidebar-border relative z-20 shrink-0 shadow-xl"
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 mt-2 mb-2">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="font-display text-2xl font-bold text-sidebar-foreground tracking-tight whitespace-nowrap">
                  ServiceFlow
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}>
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-sidebar-primary" />
                )}
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>



        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm">
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 lg:px-8 bg-background/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
             <motion.h1 
               key={currentTitle} 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="font-display text-2xl font-bold tracking-tight"
             >
               {currentTitle}
             </motion.h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user.role !== "developer" && (
              <Button size="sm" className="font-bold gap-2 shadow-lg shadow-primary/20" onClick={() => setIsNewTaskModalOpen(true)}>
                <Plus className="w-4 h-4" /> Create Service Request
              </Button>
            )}
            <ThemeToggle />
            
            {/* User Profile - Top Right */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{user.role}</p>
              </div>
              <button onClick={logout} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative bg-background/95">
          {/* Subtle Decorative Background Element */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>

      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onOpenChange={setIsNewTaskModalOpen} 
      />
    </div>
  );
};

export default AppLayout;
