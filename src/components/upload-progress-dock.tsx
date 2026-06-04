import { CheckCircle2, AlertCircle, Loader2, X, Package, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadJobs, dismissJob, type UploadJob } from "@/lib/upload-queue";
import { cn } from "@/lib/utils";

export function UploadProgressDock() {
  const jobs = useUploadJobs();
  if (!jobs.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] space-y-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: { job: UploadJob }) {
  const Icon = job.kind === "book" ? BookOpen : Package;
  return (
    <div className="rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            job.status === "done"
              ? "bg-emerald-500/15 text-emerald-400"
              : job.status === "error"
              ? "bg-destructive/15 text-destructive"
              : "bg-gradient-primary text-primary-foreground shadow-glow",
          )}
        >
          {job.status === "done" ? (
            <CheckCircle2 className="w-4.5 h-4.5" />
          ) : job.status === "error" ? (
            <AlertCircle className="w-4.5 h-4.5" />
          ) : (
            <Icon className="w-4.5 h-4.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{job.name}</p>
          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
            {job.status !== "done" && job.status !== "error" && (
              <Loader2 className="w-3 h-3 animate-spin" />
            )}
            {job.status === "done"
              ? "Publicado com sucesso"
              : job.status === "error"
              ? job.error ?? "Erro"
              : job.step}
          </p>
        </div>
        <button
          onClick={() => dismissJob(job.id)}
          className="p-1 -m-1 rounded text-muted-foreground hover:text-foreground transition"
          aria-label="Dispensar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="px-3 pb-3">
        <Progress value={job.status === "error" ? 100 : job.progress} className="h-1.5" />
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {job.status === "done"
              ? "100% — finalizado"
              : job.status === "error"
              ? "falhou"
              : `${job.progress}% — em progresso`}
          </span>
        </div>
      </div>
    </div>
  );
}
