import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Server, Upload, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [{ count: apps }, { count: servers }] = await Promise.all([
        supabase.from("apps").select("*", { count: "exact", head: true }),
        supabase.from("storage_servers").select("*", { count: "exact", head: true }),
      ]);
      const { data: recent } = await supabase
        .from("apps")
        .select("id,name,version,icon_url,server_name,created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return { apps: apps ?? 0, servers: servers ?? 0, recent: recent ?? [] };
    },
  });

  const stats = [
    { label: "Aplicativos publicados", value: data?.apps ?? 0, icon: Package, color: "text-primary" },
    { label: "Servidores conectados", value: data?.servers ?? 0, icon: Server, color: "text-accent" },
    { label: "Última atualização", value: data?.recent[0]?.name ?? "—", icon: TrendingUp, color: "text-primary", small: true },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Visão geral</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua loja de aplicativos JTC Store.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "var(--gradient-glow)" }} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className={`mt-2 font-bold ${s.small ? "text-lg truncate max-w-[180px]" : "text-3xl"}`}>{s.value}</p>
              </div>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <Link to="/apps/new" className="md:col-span-1 rounded-xl border border-border bg-gradient-surface p-5 hover:border-primary transition group">
          <Upload className="w-5 h-5 text-primary mb-3" />
          <h3 className="font-semibold">Postar novo APK</h3>
          <p className="text-sm text-muted-foreground mt-1">Publique um aplicativo na loja.</p>
        </Link>
        <Link to="/servers" className="rounded-xl border border-border bg-gradient-surface p-5 hover:border-primary transition">
          <Server className="w-5 h-5 text-accent mb-3" />
          <h3 className="font-semibold">Gerenciar servidores</h3>
          <p className="text-sm text-muted-foreground mt-1">Configure os destinos de armazenamento.</p>
        </Link>
        <Link to="/apps" className="rounded-xl border border-border bg-gradient-surface p-5 hover:border-primary transition">
          <Package className="w-5 h-5 text-primary mb-3" />
          <h3 className="font-semibold">Ver biblioteca</h3>
          <p className="text-sm text-muted-foreground mt-1">Liste e edite seus apps publicados.</p>
        </Link>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Atividade recente</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {(data?.recent ?? []).length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nenhum aplicativo publicado ainda.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data!.recent.map((app) => (
                <li key={app.id} className="flex items-center gap-3 p-4">
                  {app.icon_url ? (
                    <img src={app.icon_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><Package className="w-4 h-4 text-muted-foreground" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{app.name}</p>
                    <p className="text-xs text-muted-foreground">v{app.version} · {app.server_name ?? "—"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString("pt-BR")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
