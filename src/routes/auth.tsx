import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { ensureAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Login — JTC Store" }],
  }),
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
      toast.error("Credenciais inválidas", { description: "Verifique seu e-mail e senha." });
      return;
    }
    toast.success("Bem-vindo à JTC Store");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 grid-bg">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "var(--gradient-glow)" }} />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Acesso restrito ao administrador
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            <span className="text-gradient">JTC</span> Store
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Painel administrativo</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6 shadow-elevated space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jtc.adm.br@gmail.com"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando…</> : "Entrar no painel"}
          </Button>
        </form>
      </div>
    </main>
  );
}
