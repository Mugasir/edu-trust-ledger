import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, Users, FileText, Search, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "admin" | "organization";
  title: string;
}

const adminNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Learners", href: "/admin/learners" },
  { icon: FileText, label: "Documents", href: "/admin/documents" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const orgNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/organization" },
  { icon: Search, label: "Search Learners", href: "/organization/search" },
  { icon: FileText, label: "Reports", href: "/organization/reports" },
  { icon: Settings, label: "Account", href: "/organization/settings" },
];

const DashboardLayout = ({ children, role, title }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const navItems = role === "admin" ? adminNav : orgNav;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">EduTrack</span>
            <span className="text-[9px] font-mono-id text-sidebar-muted bg-sidebar-accent px-1 py-0.5 rounded ml-1">UG</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-subtle relative ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-sidebar-accent rounded-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-subtle w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3 md:hidden">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary text-sm">EduTrack</span>
          </div>
          <h1 className="hidden md:block text-lg font-semibold text-foreground">{title}</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative group">
              <Bell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-subtle" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent rounded-full animate-pulse" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-subtle cursor-pointer">
              <span className="text-xs font-semibold text-primary">
                {role === "admin" ? "IN" : "OR"}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
