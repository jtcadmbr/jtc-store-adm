import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ItemForm, type ItemRecord } from "@/components/item-form";

export const Route = createFileRoute("/_authenticated/apps/$id/edit")({
  component: EditAppPage,
});

function EditAppPage() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("apps").select("*").eq("id", id).single();
      if (error) throw error;
      return data as ItemRecord;
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/apps" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="w-4 h-4" /> Voltar para aplicativos
      </Link>
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Edição completa</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold mt-2">{data?.name ?? "Editar aplicativo"}</h1>
        <p className="text-muted-foreground mt-1">Atualize nome, descrição, ícone, APK e prints.</p>
      </header>
      {isLoading || !data ? (
        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <ItemForm kind="app" initial={data} onDoneRedirect="/apps" />
      )}
    </div>
  );
}
