import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Plus, Trash2, Download, Loader2, Pencil, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/apps")({
  component: AppsRouteShell,
});

type App = {
  id: string; name: string; description: string; category: string;
  version: string; icon_url: string | null; apk_url: string;
  screenshots: string[]; created_at: string;
};

function AppsRouteShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname === "/apps" ? <AppsListPage /> : <Outlet />;
}

function AppsListPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["items", "apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .neq("category", "Livros")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as App[];
    },
  });

  const categories = Array.from(new Set((data ?? []).map((a) => a.category))).sort();
  const [filter, setFilter] = useState<string>("Todos");
  const filtered = (data ?? []).filter((a) => filter === "Todos" || a.category === filter);

  useEffect(() => {
    const ch = supabase
      .channel("apps-list-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "apps" }, () => {
        qc.invalidateQueries({ queryKey: ["items", "apps"] });
        qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  async function remove(app: App) {
    if (!confirm(`Excluir "${app.name}"?`)) return;
    const { error } = await supabase.from("apps").delete().eq("id", app.id);
    if (error) { toast.error("Erro ao excluir"); return; }
    toast.success("Removido");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">02 / Aplicativos</p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold mt-2">Apps & Jogos</h1>
          <p className="text-muted-foreground mt-1">Tudo aparece em tempo real na JTC Store.</p>
        </div>
        <Link to="/apps/new">
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="w-4 h-4 mr-2" /> Publicar novo</Button>
        </Link>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["Todos", ...categories] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 h-9 rounded-full text-sm font-medium border transition ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {f}{f !== "Todos" && <span className="opacity-60 ml-1.5">{(data ?? []).filter((a) => a.category === f).length}</span>}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : !filtered.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Package className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">{data?.length ? `Nada em "${filter}"` : "Nenhum aplicativo ainda"}</p>
          <Link to="/apps/new" className="inline-block mt-4">
            <Button className="bg-gradient-primary text-primary-foreground">Publicar primeiro</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <article key={app.id} className="rounded-xl border border-border bg-card p-4 shadow-elevated hover:border-primary/50 transition">
              <div className="flex items-start gap-3">
                {app.icon_url ? (
                  <img src={`/api/public/apps/${app.id}/icon`} alt="" className="w-14 h-14 rounded-xl object-cover border border-border" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                    {app.category === "Jogos" ? <Gamepad2 className="w-6 h-6 text-primary-foreground" /> : <Package className="w-6 h-6 text-primary-foreground" />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{app.name}</h3>
                  <p className="text-xs text-muted-foreground">v{app.version} · {app.category}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{app.screenshots?.length ?? 0} print(s)</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2 min-h-[2.5rem]">{app.description || "Sem descrição."}</p>
              <div className="flex gap-2 mt-4">
                <a href={`/api/public/apps/${app.id}/download`} target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full"><Download className="w-3.5 h-3.5 mr-1" /> APK</Button>
                </a>
                <Link to="/apps/$id/edit" params={{ id: app.id }}>
                  <Button size="icon" variant="ghost"><Pencil className="w-4 h-4" /></Button>
                </Link>
                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => remove(app)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
