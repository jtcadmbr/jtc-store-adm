import { useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Server, Upload, Package, LogOut, Menu, X, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/apps", label: "Aplicativos", icon: Package },
  { to: "/apps/new", label: "Postar APK", icon: Upload },
  { to: "/servers", label: "Servidores", icon: Server },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen flex w-full text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <BrandHeader />
        <NavList pathname={pathname} onNavigate={() => {}} />
        <FooterActions onLogout={logout} />
      </aside>

      {/* Mobile overlay sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border flex flex-col animate-in slide-in-from-left"
          >
            <div className="flex items-center justify-between p-4">
              <BrandHeader inline />
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            <FooterActions onLogout={logout} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-border bg-background/80 backdrop-blur">
          <button onClick={() => setOpen(true)} className="p-2 -ml-2">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-bold text-gradient">JTC Store</span>
          </div>
          <div className="w-8" />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function BrandHeader({ inline }: { inline?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", inline ? "" : "px-5 py-6 border-b border-sidebar-border")}>
      <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
        <Zap className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <div className="font-bold text-lg leading-none text-gradient">JTC Store</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Admin Panel</div>
      </div>
    </div>
  );
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {nav.map((item) => {
        const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-primary shadow-glow"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function FooterActions({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="p-3 border-t border-sidebar-border">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    </div>
  );
}
