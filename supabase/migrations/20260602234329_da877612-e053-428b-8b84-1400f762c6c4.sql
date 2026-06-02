
-- Tabela de servidores de armazenamento
CREATE TABLE public.storage_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.storage_servers TO authenticated;
GRANT ALL ON public.storage_servers TO service_role;

ALTER TABLE public.storage_servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read servers" ON public.storage_servers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert servers" ON public.storage_servers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update servers" ON public.storage_servers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete servers" ON public.storage_servers FOR DELETE TO authenticated USING (true);

-- Tabela de aplicativos
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  version TEXT NOT NULL,
  icon_url TEXT,
  apk_url TEXT NOT NULL,
  server_id UUID REFERENCES public.storage_servers(id) ON DELETE SET NULL,
  server_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.apps TO authenticated;
GRANT ALL ON public.apps TO service_role;

ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read apps" ON public.apps FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert apps" ON public.apps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update apps" ON public.apps FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete apps" ON public.apps FOR DELETE TO authenticated USING (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER apps_updated_at BEFORE UPDATE ON public.apps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER servers_updated_at BEFORE UPDATE ON public.storage_servers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
