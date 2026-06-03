import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Trash2, Download, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/books")({
  component: BooksRouteShell,
});

type Book = {
  id: string; name: string; description: string; category: string;
  version: string; icon_url: string | null; apk_url: string;
  screenshots: string[]; created_at: string;
};

function BooksRouteShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname === "/books" ? <BooksListPage /> : <Outlet />;
}

function BooksListPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["items", "books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .eq("category", "Livros")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Book[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("books-list-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "apps" }, () => {
        qc.invalidateQueries({ queryKey: ["items", "books"] });
        qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  async function remove(b: Book) {
    if (!confirm(`Excluir "${b.name}"?`)) return;
    const { error } = await supabase.from("apps").delete().eq("id", b.id);
    if (error) { toast.error("Erro ao excluir"); return; }
    toast.success("Removido");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">03 / Livros</p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold mt-2">Biblioteca de livros</h1>
          <p className="text-muted-foreground mt-1">Cada livro também aparece em tempo real na JTC Store.</p>
        </div>
        <Link to="/books/new">
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="w-4 h-4 mr-2" /> Novo livro</Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : !data?.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">Nenhum livro publicado ainda</p>
          <Link to="/books/new" className="inline-block mt-4">
            <Button className="bg-gradient-primary text-primary-foreground">Publicar primeiro</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((b) => (
            <article key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-elevated hover:border-primary/50 transition">
              <div className="flex items-start gap-3">
                {b.icon_url ? (
                  <img src={`/api/public/apps/${b.id}/icon`} alt="" className="w-14 h-20 rounded-md object-cover border border-border" />
                ) : (
                  <div className="w-14 h-20 rounded-md bg-gradient-primary flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{b.name}</h3>
                  <p className="text-xs text-muted-foreground">{b.version}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.screenshots?.length ?? 0} print(s)</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2 min-h-[2.5rem]">{b.description || "Sem sinopse."}</p>
              <div className="flex gap-2 mt-4">
                <a href={`/api/public/apps/${b.id}/download`} target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full"><Download className="w-3.5 h-3.5 mr-1" /> Baixar</Button>
                </a>
                <Link to="/books/$id/edit" params={{ id: b.id }}>
                  <Button size="icon" variant="ghost"><Pencil className="w-4 h-4" /></Button>
                </Link>
                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => remove(b)}>
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
