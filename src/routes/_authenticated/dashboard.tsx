import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Package, BookOpen, Gamepad2, Upload, ArrowUpRight, Clock, Plus, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type Row = { id: string; name: string; version: string; icon_url: string | null; category: string; created_at: string; screenshots: string[] };

function DashboardPage() {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("dash-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "apps" }, () => {
        qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: all } = await supabase
        .from("apps")
        .select("id,name,version,icon_url,category,screenshots,created_at")
        .order("created_at", { ascending: false });
      const rows = (all ?? []) as Row[];
      const byCat = (c: string) => rows.filter((r) => r.category === c).length;
      return {
        total: rows.length,
        counts: { Apps: byCat("Apps"), Jogos: byCat("Jogos"), Livros: byCat("Livros") },
        recent: rows.slice(0, 6),
      };
    },
  });

  const last = data?.recent[0];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">01 / Visão geral</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            JTC Store Console
          </h1>
          <p className="mt-2 text-muted-foreground max-w-lg">
            Apps, jogos e livros — tudo o que você publicar aqui vai pra loja em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <Activity className="w-3.5 h-3.5 text-primary" /> realtime ativo
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-px bg-border border border-border rounded-xl overflow-hidden md:grid-cols-4">
        <StatCell label="Total publicado" value={String(data?.total ?? 0).padStart(2, "0")} hint="catálogo" icon={Package} />
        <StatCell label="Apps" value={String(data?.counts.Apps ?? 0).padStart(2, "0")} hint="aplicativos" icon={Package} />
        <StatCell label="Jogos" value={String(data?.counts.Jogos ?? 0).padStart(2, "0")} hint="games" icon={Gamepad2} />
        <StatCell label="Livros" value={String(data?.counts.Livros ?? 0).padStart(2, "0")} hint="biblioteca" icon={BookOpen} />
      </section>

      {/* Categorias / atalhos */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Suas seções</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">três pilares</span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <SectionCard to="/apps" newTo="/apps/new" code="A" title="Aplicativos & Jogos" desc="Publique APKs, gerencie versões, prints e descrições." icon={Package} count={(data?.counts.Apps ?? 0) + (data?.counts.Jogos ?? 0)} />
          <SectionCard to="/books" newTo="/books/new" code="B" title="Livros" desc="Capa, sinopse, arquivo e prints da prévia." icon={BookOpen} count={data?.counts.Livros ?? 0} />
          <QuickPublishCard />
        </div>
      </section>

      {/* Atividade */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Últimas publicações</h2>
          {last && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <Clock className="w-3 h-3" /> {new Date(last.created_at).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {!data?.recent.length ? (
            <div className="p-10 text-center">
              <Package className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">Nada publicado ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Use os atalhos acima para começar.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data.recent.map((row, i) => {
                const isBook = row.category === "Livros";
                const editTo = isBook ? "/books/$id/edit" : "/apps/$id/edit";
                return (
                  <li key={row.id}>
                    <Link to={editTo} params={{ id: row.id }} className="flex items-center gap-4 px-4 md:px-6 py-4 hover:bg-muted/40 transition">
                      <span className="hidden sm:block font-mono text-xs text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                      {row.icon_url ? (
                        <img src={`/api/public/apps/${row.id}/icon`} alt="" className={`object-cover border border-border ${isBook ? "w-9 h-12 rounded" : "w-10 h-10 rounded-md"}`} />
                      ) : (
                        <div className={`bg-muted flex items-center justify-center ${isBook ? "w-9 h-12 rounded" : "w-10 h-10 rounded-md"}`}>
                          {isBook ? <BookOpen className="w-4 h-4 text-muted-foreground" /> : <Package className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{row.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground truncate">
                          {row.category} · {row.version} · {row.screenshots?.length ?? 0} print(s)
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCell({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="bg-card px-6 py-7 relative">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="mt-4 font-display font-semibold tracking-tight text-4xl md:text-5xl">{value}</p>
      <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function SectionCard({ to, newTo, code, title, desc, icon: Icon, count }: {
  to: string; newTo: string; code: string; title: string; desc: string;
  icon: React.ComponentType<{ className?: string }>; count: number;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 hover:border-primary/60 transition relative overflow-hidden flex flex-col">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/15 transition">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{code}</span>
      </div>
      <h3 className="mt-5 font-display font-semibold text-lg tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-3">{count} item(ns)</p>
      <div className="mt-4 flex gap-2">
        <Link to={to} className="flex-1 inline-flex items-center justify-center h-9 rounded-md bg-muted hover:bg-muted/70 text-sm font-medium transition">Abrir</Link>
        <Link to={newTo} className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition">
          <Plus className="w-3.5 h-3.5 mr-1" /> Novo
        </Link>
      </div>
    </div>
  );
}

function QuickPublishCard() {
  return (
    <div className="rounded-xl border border-border bg-gradient-primary text-primary-foreground p-5 relative overflow-hidden flex flex-col">
      <Upload className="w-8 h-8" />
      <h3 className="mt-5 font-display font-semibold text-lg tracking-tight">Atalhos rápidos</h3>
      <p className="text-sm text-primary-foreground/80 mt-1">Publique sem sair daqui.</p>
      <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
        <Link to="/apps/new" className="inline-flex items-center justify-center h-9 rounded-md bg-background/15 hover:bg-background/25 text-sm font-medium transition">APK</Link>
        <Link to="/books/new" className="inline-flex items-center justify-center h-9 rounded-md bg-background/15 hover:bg-background/25 text-sm font-medium transition">Livro</Link>
      </div>
    </div>
  );
}
