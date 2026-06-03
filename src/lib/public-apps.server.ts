// Server-only helpers for the public catalog API.
// Resolves stored icon_url/apk_url values into fresh, downloadable URLs.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1h — endpoint redirects, so expiration is invisible to clients.

function isHttpUrl(value: string | null | undefined): value is string {
  return !!value && /^https?:\/\//i.test(value);
}

export async function resolveStoredUrl(
  bucket: "app-icons" | "app-apks",
  stored: string | null | undefined,
): Promise<string | null> {
  if (!stored) return null;
  if (isHttpUrl(stored)) return stored; // mantém compatibilidade com registros antigos
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(stored, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export type PublicAppItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  icon_url: string | null;
  download_url: string;
  created_at: string;
  updated_at: string;
};

export function buildStableUrls(origin: string, appId: string) {
  return {
    icon_url: `${origin}/api/public/apps/${appId}/icon`,
    download_url: `${origin}/api/public/apps/${appId}/download`,
  };
}
