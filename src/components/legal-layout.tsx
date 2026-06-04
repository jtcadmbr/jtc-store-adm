import { Link } from "@tanstack/react-router";
import { Zap, ArrowLeft } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background noise">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-sm tracking-tight">JTC Store</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {subtitle}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-gradient">
            {title}
          </h1>
        </div>

        <article className="prose prose-invert prose-sm max-w-none">
          {children}
        </article>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-border/60 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link to="/privacidade" className="hover:text-foreground transition-colors">
            Política de Privacidade
          </Link>
          <span className="text-border">·</span>
          <Link to="/termos" className="hover:text-foreground transition-colors">
            Termos de Uso
          </Link>
          <span className="text-border">·</span>
          <span>
            © {new Date().getFullYear()} JTC Store
          </span>
        </div>
      </main>
    </div>
  );
}
