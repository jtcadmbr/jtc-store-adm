
CREATE POLICY "auth read app-icons" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'app-icons');
CREATE POLICY "auth write app-icons" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-icons');
CREATE POLICY "auth update app-icons" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'app-icons');
CREATE POLICY "auth delete app-icons" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'app-icons');

CREATE POLICY "auth read app-apks" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'app-apks');
CREATE POLICY "auth write app-apks" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-apks');
CREATE POLICY "auth update app-apks" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'app-apks');
CREATE POLICY "auth delete app-apks" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'app-apks');
