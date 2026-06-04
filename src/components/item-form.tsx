import { useState } from "react";
import { Upload, Loader2, Image as ImageIcon, FileArchive, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type Kind = "app" | "book";

export type ItemRecord = {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  icon_url: string | null;
  apk_url: string;
  screenshots: string[];
  rating: number;
  is_featured: boolean;
};

const CATEGORIES_BY_KIND: Record<Kind, string[]> = {
  app: ["Apps", "Jogos"],
  book: ["Livros"],
};

const FILE_FIELD_BY_KIND: Record<Kind, { label: string; accept: string; hint: string }> = {
  app: {
    label: "Arquivo APK",
    accept: ".apk,application/vnd.android.package-archive",
    hint: "Arquivo .apk",
  },
  book: {
    label: "Arquivo do livro",
    accept: ".pdf,.epub,application/pdf,application/epub+zip",
    hint: "PDF ou EPUB",
  },
};

async function uploadTo(bucket: string, file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export function ItemForm({
  kind,
  initial,
  onDoneRedirect,
}: {
  kind: Kind;
  initial?: ItemRecord;
  onDoneRedirect: string;
}) {
  const navigate = useNavigate();
  const editing = !!initial;
  const cats = CATEGORIES_BY_KIND[kind];
  const fileMeta = FILE_FIELD_BY_KIND[kind];

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category && cats.includes(initial.category) ? initial.category : cats[0]);
  const [version, setVersion] = useState(initial?.version ?? "");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [existingShots, setExistingShots] = useState<string[]>(initial?.screenshots ?? []);
  const [newShots, setNewShots] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing && !mainFile) { toast.error(`Selecione o ${fileMeta.label.toLowerCase()}`); return; }
    setSubmitting(true);
    try {
      let iconUrl: string | null = initial?.icon_url ?? null;
      if (iconFile) {
        setProgress("Enviando ícone…");
        iconUrl = await uploadTo("app-icons", iconFile);
      }

      let mainUrl = initial?.apk_url ?? "";
      if (mainFile) {
        setProgress(`Enviando ${fileMeta.label.toLowerCase()}…`);
        mainUrl = await uploadTo("app-apks", mainFile);
      }

      let screenshots = [...existingShots];
      if (newShots.length) {
        setProgress("Enviando prints…");
        for (const f of newShots) {
          const path = await uploadTo("app-screenshots", f);
          screenshots.push(path);
        }
      }

      setProgress("Salvando…");
      const payload = {
        name, description, category, version,
        icon_url: iconUrl, apk_url: mainUrl, screenshots,
      };

      const { error } = editing
        ? await supabase.from("apps").update(payload).eq("id", initial!.id)
        : await supabase.from("apps").insert(payload);
      if (error) throw error;

      toast.success(editing ? "Atualizado com sucesso!" : "Publicado com sucesso!");
      navigate({ to: onDoneRedirect });
    } catch (err: any) {
      toast.error("Erro ao salvar", { description: err.message });
    } finally {
      setSubmitting(false);
      setProgress("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{kind === "book" ? "Edição / versão" : "Versão"}</Label>
          <Input required value={version} onChange={(e) => setVersion(e.target.value)} placeholder={kind === "book" ? "1ª edição" : "1.0.0"} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder={kind === "book" ? "Sinopse do livro…" : "Descreva o aplicativo…"} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Label>Storage</Label>
          <p className="text-sm font-medium">Conectado à JTC Store</p>
          <p className="text-xs text-muted-foreground">Tudo é salvo no armazenamento interno.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FileField
          label={editing ? "Substituir ícone" : "Ícone"}
          accept="image/*"
          file={iconFile}
          onChange={setIconFile}
          icon={<ImageIcon className="w-5 h-5" />}
          hint={editing ? "Opcional — mantém o atual" : "PNG ou JPG"}
        />
        <FileField
          label={editing ? `Substituir ${fileMeta.label.toLowerCase()}` : fileMeta.label}
          accept={fileMeta.accept}
          file={mainFile}
          onChange={setMainFile}
          icon={<FileArchive className="w-5 h-5" />}
          hint={editing ? "Opcional — mantém o atual" : fileMeta.hint}
        />
      </div>

      {/* Screenshots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Prints / capturas de tela</Label>
          <span className="text-xs text-muted-foreground">{existingShots.length + newShots.length} no total</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {existingShots.map((path, i) => (
            <ShotThumb key={path} src={`/api/public/apps/${initial?.id}/screenshot/${i}`} onRemove={() => setExistingShots(existingShots.filter((_, idx) => idx !== i))} />
          ))}
          {newShots.map((f, i) => (
            <ShotThumb key={i} src={URL.createObjectURL(f)} label="novo" onRemove={() => setNewShots(newShots.filter((_, idx) => idx !== i))} />
          ))}
          <label className="aspect-[9/16] rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 cursor-pointer text-muted-foreground hover:text-primary transition">
            <Plus className="w-6 h-6" />
            <span className="text-xs font-medium">Adicionar print</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setNewShots((prev) => [...prev, ...files]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-muted-foreground min-h-[1rem]">{progress}</p>
        <Button type="submit" disabled={submitting} className="bg-gradient-primary text-primary-foreground shadow-glow">
          {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando…</> : <><Upload className="w-4 h-4 mr-2" /> {editing ? "Salvar alterações" : "Publicar"}</>}
        </Button>
      </div>
    </form>
  );
}

function FileField({ label, accept, file, onChange, icon, hint }: {
  label: string; accept: string; file: File | null; onChange: (f: File | null) => void;
  icon: React.ReactNode; hint: string;
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

function ShotThumb({ src, label, onRemove }: { src: string; label?: string; onRemove: () => void }) {
  return (
    <div className="relative group aspect-[9/16] rounded-lg overflow-hidden border border-border bg-muted">
      <img src={src} alt="" className="w-full h-full object-cover" />
      {label && <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-mono uppercase">{label}</span>}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
