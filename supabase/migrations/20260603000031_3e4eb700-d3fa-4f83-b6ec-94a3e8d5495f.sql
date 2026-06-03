CREATE POLICY "Public read app icons"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'app-icons');

CREATE POLICY "Public read app apks"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'app-apks');