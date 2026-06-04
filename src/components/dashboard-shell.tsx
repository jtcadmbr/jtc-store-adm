import { useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Upload, Package, BookOpen, LogOut, Menu, X, Zap, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadProgressDock } from "@/components/upload-progress-dock";

const nav = [
  { to: "/dashboard", label: "Visão geral", icon: LayoutDashboard, code: "01" },
  { to: "/apps", label: "Apps & Jogos", icon: Package, code: "02" },
  { to: "/books", label: "Livros", icon: BookOpen, code: "03" },
] as const;

const titles: Record<string, string> = {
  "/dashboard": "Visão geral",
  "/apps": "Apps & Jogos",
  "/apps/new": "Novo aplicativo",
  "/books": "Livros",
  "/books/new": "Novo livro",
};

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  const currentTitle = titles[pathname] ?? "Console";

  return (
    <div className="min-h-screen flex w-full text-foreground noise">
      <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <BrandHeader />
        <NavList pathname={pathname} onNavigate={() => {}} />
        <FooterActions onLogout={logout} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 bottom-0 w-[78%] max-w-xs bg-sidebar border-r border-sidebar-border flex flex-col animate-in slide-in-from-left"
          >
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
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
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 h-14 border-b border-border bg-background/85 backdrop-blur-md">
          <button onClick={() => setOpen(true)} className="md:hidden p-2 -ml-2">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden md:inline font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">JTC / Console</span>
            <ChevronRight className="hidden md:inline w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium truncate">{currentTitle}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="dot" />online
            </span>
            <Link to="/apps/new" className="hidden sm:block">
              <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Novo APK
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-10">{children}</main>
      </div>
      <UploadProgressDock />
    </div>
  );
}

function BrandHeader({ inline }: { inline?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", inline ? "" : "px-5 py-5 border-b border-sidebar-border")}>
      <div className="w-9 h-9 rounded-md bg-gradient-primary flex items-center justify-center shadow-glow">
        <Zap className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <div className="font-display font-bold text-[15px] leading-none">JTC Store</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-1.5">Admin Console</div>
      </div>
    </div>
  );
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
      <p className="px-3 pt-2 pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Navegação</p>
      {nav.map((item) => {
        const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to + "/"));
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all relative",
              active
                ? "bg-sidebar-accent text-foreground"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
            )}
          >
            {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary" />}
            <span className="font-mono text-[10px] text-muted-foreground/80 w-5">{item.code}</span>
            <Icon className={cn("w-4 h-4", active ? "text-primary" : "")} />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function FooterActions({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="p-3 border-t border-sidebar-border space-y-2">
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center font-mono text-xs font-semibold text-primary">JT</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium truncate">Administrador</p>
          <p className="font-mono text-[10px] text-muted-foreground truncate">jtc.adm.br@gmail.com</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition"
      >
        <LogOut className="w-4 h-4" />
        Encerrar sessão
      </button>
    </div>
  );
}
