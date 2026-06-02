-- Allow public (anon) read access to apps catalog
GRANT SELECT ON public.apps TO anon;

CREATE POLICY "public read apps"
ON public.apps
FOR SELECT
TO anon
USING (true);