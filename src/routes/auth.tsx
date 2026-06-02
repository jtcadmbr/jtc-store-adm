import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Package, Server, Zap } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { ensureAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — JTC Store" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const ensure = useServerFn(ensureAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensure().catch((e) => console.warn("ensureAdmin:", e));
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [ensure, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast.error("Credenciais inválidas", { description: "Confira o e-mail e a senha." });
      return;
    }
    toast.success("Sessão iniciada");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] noise">
      {/* Brand panel */}
      <section className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border bg-sidebar">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-primary flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="font-display font-bold tracking-tight text-lg">JTC Store</div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-sm px-1.5 py-0.5 ml-1">admin</span>
        </div>

        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Console / v1.0</p>
          <h2 className="font-display text-5xl xl:text-6xl font-bold leading-[0.95] tracking-tight">
            Publique. Versione.<br />
            <span className="text-gradient">Distribua.</span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">
            O painel da JTC Store unifica publicação de APKs, gerenciamento de servidores e
            biblioteca de aplicativos em um só lugar — feito sob medida para sua operação.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-px bg-border/60 border border-border rounded-md overflow-hidden">
            {[
              { i: Package, l: "Catálogo" },
              { i: Server, l: "Servidores" },
              { i: ShieldCheck, l: "Seguro" },
            ].map(({ i: Icon, l }) => (
              <div key={l} className="bg-sidebar px-4 py-5 flex flex-col items-start gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative font-mono text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} JTC Store · acesso restrito ao administrador
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-md bg-gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="font-display font-bold text-lg">JTC Store</div>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">01 / Autenticação</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Entrar no painel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use suas credenciais de administrador para acessar o console.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@dominio.com"
                  className="pl-9 h-11 bg-card border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password" type="password" autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 h-11 bg-card border-border"
                />
              </div>
            </div>

            <Button
              type="submit" disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium group"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando…</>
              ) : (
                <>Acessar console <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition" /></>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Conexão criptografada · sessão isolada por dispositivo</span>
          </div>
        </div>
      </section>
    </main>
  );
}
