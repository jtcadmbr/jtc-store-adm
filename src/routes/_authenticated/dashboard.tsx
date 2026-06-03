import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Upload, ArrowUpRight, Clock, HardDrive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { count: apps } = await supabase.from("apps").select("*", { count: "exact", head: true });
      const { data: recent } = await supabase
        .from("apps")
        .select("id,name,version,icon_url,category,created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return { apps: apps ?? 0, recent: recent ?? [] };
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">01 / Visão geral</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Bom trabalho hoje.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-lg">
            Acompanhe sua operação e publique APKs direto no armazenamento interno da JTC Store.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/apps/new">
            <button className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition">
              <Upload className="w-4 h-4" /> Publicar APK
            </button>
          </Link>
        </div>
      </header>

      {/* Stat grid */}
      <section className="grid gap-px bg-border border border-border rounded-xl overflow-hidden md:grid-cols-3">
        <StatCell label="Aplicativos publicados" value={String(data?.apps ?? 0).padStart(2, "0")} hint="no catálogo" icon={Package} />
        <StatCell label="Storage interno" value="ativo" hint="upload automático" icon={HardDrive} small />
        <StatCell label="Última publicação" value={data?.recent[0]?.name ?? "—"} hint={data?.recent[0] ? new Date(data.recent[0].created_at).toLocaleDateString("pt-BR") : "aguardando"} icon={Clock} small />
      </section>

      {/* Quick actions */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Ações rápidas</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">atalhos</span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <QuickCard to="/apps/new" code="A" title="Publicar novo APK" desc="Envie um aplicativo para a loja." icon={Upload} />
          <QuickCard to="/apps" code="B" title="Gerenciar biblioteca" desc="Edite versões e descrições." icon={Package} />
          <QuickCard to="/apps/new" code="C" title="Upload interno" desc="Logo e APK já ficam conectados." icon={HardDrive} />
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Atividade recente</h2>
          <Link to="/apps" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition">
            ver tudo →
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {(data?.recent ?? []).length === 0 ? (
            <div className="p-10 text-center">
              <Package className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">Nenhum aplicativo publicado ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Comece sua biblioteca enviando o primeiro APK.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data!.recent.map((app, i) => (
                <li key={app.id} className="flex items-center gap-4 px-4 md:px-6 py-4 hover:bg-muted/40 transition">
                  <span className="hidden sm:block font-mono text-xs text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                  {app.icon_url ? (
                    <img src={`/api/public/apps/${app.id}/icon`} alt="" className="w-10 h-10 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                      <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{app.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground truncate">
                      v{app.version} · {app.category} · storage interno
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCell({ label, value, hint, icon: Icon, small }: {
  label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }>; small?: boolean;
}) {
  return (
    <div className="bg-card px-6 py-7 relative">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className={`mt-4 font-display font-semibold tracking-tight ${small ? "text-xl truncate" : "text-4xl md:text-5xl"}`}>
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function QuickCard({ to, code, title, desc, icon: Icon }: {
  to: string; code: string; title: string; desc: string; icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link to={to} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/60 hover:bg-card/80 transition relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/15 transition">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{code}</span>
      </div>
      <h3 className="mt-5 font-display font-semibold text-lg tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      <ArrowUpRight className="w-4 h-4 absolute bottom-5 right-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
    </Link>
  );
}
