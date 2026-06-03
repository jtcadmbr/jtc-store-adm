import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Loader2, Image as ImageIcon, FileArchive } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Jogos", "Comunicação", "Produtividade", "Entretenimento", "Educação", "Ferramentas", "Redes Sociais", "Outros"];

export const Route = createFileRoute("/_authenticated/apps/new")({
  component: NewAppPage,
});

function NewAppPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [version, setVersion] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");

  async function uploadToInternalBucket(bucket: string, file: File) {
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) throw error;
    // Salva apenas o path no banco. Os endpoints públicos (/api/public/apps/:id/download
    // e /icon) geram uma signed URL fresca em cada chamada, então o link nunca expira.
    return path;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apkFile) { toast.error("Selecione o arquivo APK"); return; }
    setSubmitting(true);
    try {
      let iconUrl: string | null = null;
      if (iconFile) {
        setProgress("Enviando ícone…");
        iconUrl = await uploadToInternalBucket("app-icons", iconFile);
      }

      setProgress("Enviando APK para o armazenamento interno…");
      const apkUrl = await uploadToInternalBucket("app-apks", apkFile);

      setProgress("Salvando registro…");
      const { error } = await supabase.from("apps").insert({
        name, description, category, version,
        icon_url: iconUrl, apk_url: apkUrl,
        server_id: null,
        server_name: "JTC Store",
      });
      if (error) throw error;

      toast.success("Aplicativo publicado com sucesso!");
      navigate({ to: "/apps" });
    } catch (err: any) {
      toast.error("Erro ao publicar", { description: err.message });
    } finally {
      setSubmitting(false);
      setProgress("");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Publicação</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">Postar novo APK</h1>
        <p className="text-muted-foreground mt-1">Preencha os dados do aplicativo para publicação.</p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do aplicativo</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Versão</Label>
            <Input required value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descrição completa</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Descreva o aplicativo…" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Servidor de destino</Label>
            <Select value={serverId} onValueChange={setServerId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={INTERNAL_ID}>Armazenamento interno (JTC)</SelectItem>
                {servers?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FileField
            label="Ícone do app"
            accept="image/*"
            file={iconFile}
            onChange={setIconFile}
            icon={<ImageIcon className="w-5 h-5" />}
            hint="PNG ou JPG"
          />
          <FileField
            label="Arquivo APK"
            accept=".apk,application/vnd.android.package-archive"
            file={apkFile}
            onChange={setApkFile}
            icon={<FileArchive className="w-5 h-5" />}
            hint="Arquivo .apk"
            required
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-muted-foreground min-h-[1rem]">{progress}</p>
          <Button type="submit" disabled={submitting} className="bg-gradient-primary text-primary-foreground shadow-glow">
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publicando…</> : <><Upload className="w-4 h-4 mr-2" /> Publicar app</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FileField({ label, accept, file, onChange, icon, hint, required }: {
  label: string; accept: string; file: File | null; onChange: (f: File | null) => void;
  icon: React.ReactNode; hint: string; required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-muted/30 hover:border-primary cursor-pointer transition">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file ? file.name : `Selecionar ${label.toLowerCase()}`}</p>
          <p className="text-xs text-muted-foreground">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : hint}</p>
        </div>
        <input type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </label>
    </div>
  );
}
