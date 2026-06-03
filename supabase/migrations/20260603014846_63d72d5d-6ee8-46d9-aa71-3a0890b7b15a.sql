ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS screenshots text[] NOT NULL DEFAULT '{}';

-- Storage policies for the three buckets used by the admin panel.
DO $$
DECLARE b text;
BEGIN
  FOR b IN SELECT unnest(ARRAY['app-icons','app-apks','app-screenshots']) LOOP
    EXECUTE format($p$
      DROP POLICY IF EXISTS "auth read %1$s" ON storage.objects;
      CREATE POLICY "auth read %1$s" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = %2$L);
      DROP POLICY IF EXISTS "auth upload %1$s" ON storage.objects;
      CREATE POLICY "auth upload %1$s" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = %2$L);
      DROP POLICY IF EXISTS "auth update %1$s" ON storage.objects;
      CREATE POLICY "auth update %1$s" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = %2$L);
      DROP POLICY IF EXISTS "auth delete %1$s" ON storage.objects;
      CREATE POLICY "auth delete %1$s" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = %2$L);
    $p$, b, b);
  END LOOP;
END $$;