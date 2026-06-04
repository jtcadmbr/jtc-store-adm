import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Package, BookOpen, Gamepad2, Upload, ArrowUpRight, Clock, Plus, Zap,
  Layers, Sparkles,
} from "lucide-react";
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
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-border bg-gradient-surface p-8 md:p-10">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -bottom-32 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] font-semibold text-primary tracking-[0.25em]">01</span>
              <span className="w-10 h-px bg-border" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Visão geral</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              JTC Store <span className="text-gradient">Console</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
              Gerencie seu ecossistema digital. Publique e monitore aplicativos, jogos e livros em um ambiente centralizado, em tempo real.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur-sm shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Realtime ativo</span>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid gap-px bg-border border border-border rounded-2xl overflow-hidden md:grid-cols-4 shadow-elevated">
        <StatCell label="Total publicado" value={String(data?.total ?? 0).padStart(2, "0")} hint="catálogo" icon={Layers} accent />
        <StatCell label="Aplicativos" value={String(data?.counts.Apps ?? 0).padStart(2, "0")} hint="apps" icon={Package} />
        <StatCell label="Jogos" value={String(data?.counts.Jogos ?? 0).padStart(2, "0")} hint="games" icon={Gamepad2} />
        <StatCell label="Livros" value={String(data?.counts.Livros ?? 0).padStart(2, "0")} hint="biblioteca" icon={BookOpen} />
      </section>

      {/* Gestão */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-semibold">Gestão de conteúdo</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Três pilares que alimentam a JTC Store.</p>
          </div>
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Categorias principais</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <SectionCard to="/apps" newTo="/apps/new" code="A" title="Aplicativos & Jogos" desc="Publique APKs, gerencie versões, prints e descrições." icon={Package} count={(data?.counts.Apps ?? 0) + (data?.counts.Jogos ?? 0)} tone="primary" />
          <SectionCard to="/books" newTo="/books/new" code="B" title="Livros" desc="Capa, sinopse, arquivo e prints da prévia." icon={BookOpen} count={data?.counts.Livros ?? 0} tone="accent" />
          <QuickPublishCard />
        </div>
      </section>

      {/* Atividade */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-semibold">Histórico recente</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Últimas publicações sincronizadas.</p>
          </div>
          {last && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Clock className="w-3 h-3" /> {new Date(last.created_at).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-elevated">
          {!data?.recent.length ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
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
                    <Link to={editTo} params={{ id: row.id }} className="group flex items-center gap-4 px-5 md:px-6 py-4 hover:bg-muted/40 transition">
                      <span className="hidden sm:block font-mono text-[11px] font-semibold text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                      {row.icon_url ? (
                        <img src={`/api/public/apps/${row.id}/icon`} alt="" className={`object-cover border border-border ${isBook ? "w-10 h-12 rounded-md" : "w-11 h-11 rounded-lg"}`} />
                      ) : (
                        <div className={`bg-muted flex items-center justify-center ${isBook ? "w-10 h-12 rounded-md" : "w-11 h-11 rounded-lg"}`}>
                          {isBook ? <BookOpen className="w-4 h-4 text-muted-foreground" /> : <Package className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{row.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">
                          {row.category} · {row.version} · {row.screenshots?.length ?? 0} print(s)
                        </p>
                      </div>
                      <span className={`hidden md:inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isBook ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                        {row.category}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
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

function StatCell({ label, value, hint, icon: Icon, accent }: { label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }>; accent?: boolean }) {
  return (
    <div className="relative bg-card px-6 py-7 group hover:bg-card/70 transition">
      {accent && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${accent ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <p className="mt-5 font-display font-bold tracking-tight text-4xl md:text-5xl">{value}</p>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{hint}</p>
    </div>
  );
}

function SectionCard({ to, newTo, code, title, desc, icon: Icon, count, tone }: {
  to: string; newTo: string; code: string; title: string; desc: string;
  icon: React.ComponentType<{ className?: string }>; count: number; tone: "primary" | "accent";
}) {
  const toneClass = tone === "primary"
    ? "bg-primary/10 border-primary/20 text-primary"
    : "bg-accent/10 border-accent/20 text-accent";
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition relative overflow-hidden flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${toneClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-mono text-[10px] font-bold text-muted-foreground tracking-widest">TYPE {code}</span>
      </div>
      <h3 className="font-display font-semibold text-lg tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed flex-1">{desc}</p>
      <div className="flex items-center justify-between my-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{count} item(ns)</span>
      </div>
      <div className="flex gap-2">
        <Link to={to} className="flex-1 inline-flex items-center justify-center h-10 rounded-lg bg-secondary hover:bg-secondary/70 text-sm font-semibold transition">Abrir</Link>
        <Link to={newTo} className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition shadow-glow">
          <Plus className="w-3.5 h-3.5 mr-1" /> Novo
        </Link>
      </div>
    </div>
  );
}

function QuickPublishCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-primary text-primary-foreground p-6 flex flex-col shadow-glow">
      <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="relative w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
        <Zap className="w-5 h-5" />
      </div>
      <h3 className="relative font-display font-bold text-lg tracking-tight flex items-center gap-2">
        Atalhos rápidos <Sparkles className="w-4 h-4 opacity-80" />
      </h3>
      <p className="relative text-sm text-primary-foreground/80 mt-1.5 leading-relaxed flex-1">
        Inicie novas publicações instantaneamente, sem sair da visão geral.
      </p>
      <div className="relative mt-6 grid grid-cols-2 gap-2">
        <Link to="/apps/new" className="inline-flex items-center justify-center h-10 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/10 text-xs font-bold uppercase tracking-widest transition">
          <Upload className="w-3 h-3 mr-1.5" /> APK
        </Link>
        <Link to="/books/new" className="inline-flex items-center justify-center h-10 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/10 text-xs font-bold uppercase tracking-widest transition">
          <Upload className="w-3 h-3 mr-1.5" /> Livro
        </Link>
      </div>
    </div>
  );
}
