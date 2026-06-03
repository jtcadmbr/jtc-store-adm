import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Plus, Trash2, Download, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/apps")({
  component: AppsListPage,
});

type App = {
  id: string; name: string; description: string; category: string;
  version: string; icon_url: string | null; apk_url: string;
  created_at: string;
};

function AppsListPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: async () => {
      const { data, error } = await supabase.from("apps").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as App[];
    },
  });

  const [editing, setEditing] = useState<App | null>(null);

  async function remove(app: App) {
    if (!confirm(`Excluir "${app.name}"?`)) return;
    const { error } = await supabase.from("apps").delete().eq("id", app.id);
    if (error) { toast.error("Erro ao excluir"); return; }
    toast.success("Aplicativo removido");
    qc.invalidateQueries({ queryKey: ["apps"] });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Biblioteca</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">Aplicativos</h1>
          <p className="text-muted-foreground mt-1">Todos os apps publicados na JTC Store.</p>
        </div>
        <Link to="/apps/new">
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="w-4 h-4 mr-2" /> Novo aplicativo</Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : !data?.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Package className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">Nenhum aplicativo ainda</p>
          <p className="text-sm text-muted-foreground mt-1">Comece publicando seu primeiro APK.</p>
          <Link to="/apps/new" className="inline-block mt-4">
            <Button className="bg-gradient-primary text-primary-foreground">Postar APK</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((app) => (
            <article key={app.id} className="rounded-xl border border-border bg-card p-4 shadow-elevated hover:border-primary/50 transition group">
              <div className="flex items-start gap-3">
                {app.icon_url ? (
                  <img src={`/api/public/apps/${app.id}/icon`} alt="" className="w-14 h-14 rounded-xl object-cover border border-border" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{app.name}</h3>
                  <p className="text-xs text-muted-foreground">v{app.version} · {app.category}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">Storage interno JTC Store</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2 min-h-[2.5rem]">{app.description || "Sem descrição."}</p>
              <div className="flex gap-2 mt-4">
                <a href={`/api/public/apps/${app.id}/download`} target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full"><Download className="w-3.5 h-3.5 mr-1" /> APK</Button>
                </a>
                <Button size="icon" variant="ghost" onClick={() => setEditing(app)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => remove(app)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <EditDialog app={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function EditDialog({ app, onClose }: { app: App | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  if (!app) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!app) return;
    const fd = new FormData(e.target as HTMLFormElement);
    setSaving(true);
    const { error } = await supabase.from("apps").update({
      name: String(fd.get("name")),
      description: String(fd.get("description")),
      category: String(fd.get("category")),
      version: String(fd.get("version")),
    }).eq("id", app.id);
    setSaving(false);
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Aplicativo atualizado");
    qc.invalidateQueries({ queryKey: ["apps"] });
    onClose();
  }

  return (
    <Dialog open={!!app} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Editar aplicativo</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2"><Label>Nome</Label><Input name="name" defaultValue={app.name} required /></div>
          <div className="space-y-2"><Label>Versão</Label><Input name="version" defaultValue={app.version} required /></div>
          <div className="space-y-2"><Label>Categoria</Label><Input name="category" defaultValue={app.category} required /></div>
          <div className="space-y-2"><Label>Descrição</Label><Textarea name="description" defaultValue={app.description} rows={4} /></div>
          <DialogFooter>
            <Button type="submit" disabled={saving} className="bg-gradient-primary text-primary-foreground">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
