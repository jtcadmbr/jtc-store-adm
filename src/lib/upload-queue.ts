import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UploadStatus = "pending" | "uploading" | "saving" | "done" | "error";

export type UploadJob = {
  id: string;
  name: string;
  kind: "app" | "book";
  editing: boolean;
  status: UploadStatus;
  progress: number; // 0..100
  step: string;
  error?: string;
  startedAt: number;
};

type Listener = () => void;

const jobs = new Map<string, UploadJob>();
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function update(id: string, patch: Partial<UploadJob>) {
  const j = jobs.get(id);
  if (!j) return;
  jobs.set(id, { ...j, ...patch });
  emit();
}

function snapshot(): UploadJob[] {
  return Array.from(jobs.values()).sort((a, b) => b.startedAt - a.startedAt);
}

let cached: UploadJob[] = [];
let cachedKey = "";
function getSnapshot() {
  const list = snapshot();
  const key = list.map((j) => `${j.id}:${j.status}:${j.progress}`).join("|");
  if (key !== cachedKey) {
    cached = list;
    cachedKey = key;
  }
  return cached;
}

export function useUploadJobs() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getSnapshot,
    getSnapshot,
  );
}

export function dismissJob(id: string) {
  jobs.delete(id);
  emit();
}

async function uploadTo(bucket: string, file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export type EnqueuePayload = {
  kind: "app" | "book";
  editing: boolean;
  recordId?: string;
  name: string;
  description: string;
  category: string;
  version: string;
  rating: number;
  is_featured: boolean;
  existingIconUrl: string | null;
  existingApkUrl: string;
  existingScreenshots: string[];
  iconFile: File | null;
  mainFile: File | null;
  newShots: File[];
};

export function enqueueItemUpload(p: EnqueuePayload) {
  const id = crypto.randomUUID();
  const job: UploadJob = {
    id,
    name: p.name,
    kind: p.kind,
    editing: p.editing,
    status: "pending",
    progress: 0,
    step: "Aguardando…",
    startedAt: Date.now(),
  };
  jobs.set(id, job);
  emit();

  // Total steps for progress
  const steps =
    (p.iconFile ? 1 : 0) +
    (p.mainFile ? 1 : 0) +
    p.newShots.length +
    1; // +1 for DB save
  let done = 0;
  const advance = (step: string) => {
    done += 1;
    update(id, { progress: Math.min(99, Math.round((done / steps) * 100)), step });
  };

  (async () => {
    try {
      update(id, { status: "uploading", step: "Iniciando…", progress: 1 });

      let iconUrl = p.existingIconUrl;
      if (p.iconFile) {
        update(id, { step: "Enviando ícone…" });
        iconUrl = await uploadTo("app-icons", p.iconFile);
        advance("Ícone enviado");
      }

      let mainUrl = p.existingApkUrl;
      if (p.mainFile) {
        update(id, { step: p.kind === "book" ? "Enviando livro…" : "Enviando APK…" });
        mainUrl = await uploadTo("app-apks", p.mainFile);
        advance(p.kind === "book" ? "Livro enviado" : "APK enviado");
      }

      const screenshots = [...p.existingScreenshots];
      for (let i = 0; i < p.newShots.length; i++) {
        update(id, { step: `Enviando print ${i + 1}/${p.newShots.length}…` });
        const path = await uploadTo("app-screenshots", p.newShots[i]);
        screenshots.push(path);
        advance(`Print ${i + 1} enviado`);
      }

      update(id, { status: "saving", step: "Salvando no banco…" });
      const payload = {
        name: p.name,
        description: p.description,
        category: p.category,
        version: p.version,
        icon_url: iconUrl,
        apk_url: mainUrl,
        screenshots,
        rating: p.rating,
        is_featured: p.is_featured,
      };
      const { error } = p.editing && p.recordId
        ? await supabase.from("apps").update(payload).eq("id", p.recordId)
        : await supabase.from("apps").insert(payload);
      if (error) throw error;

      update(id, { status: "done", progress: 100, step: "Finalizado" });
      toast.success(`${p.name} publicado com sucesso!`);
      setTimeout(() => dismissJob(id), 6000);
    } catch (err: any) {
      update(id, { status: "error", step: "Falhou", error: err.message ?? String(err) });
      toast.error(`Erro ao publicar ${p.name}`, { description: err.message });
    }
  })();

  return id;
}
