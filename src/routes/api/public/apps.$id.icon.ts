import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { resolveStoredUrl } from "@/lib/public-apps.server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const Route = createFileRoute("/api/public/apps/$id/icon")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ params }) => {
        const { data, error } = await supabaseAdmin
          .from("apps")
          .select("icon_url")
          .eq("id", params.id)
          .maybeSingle();

        if (error || !data) return new Response("Not found", { status: 404, headers: CORS });

        const url = await resolveStoredUrl("app-icons", data.icon_url);
        if (!url) return new Response("Icon unavailable", { status: 404, headers: CORS });

        return new Response(null, {
          status: 302,
          headers: { Location: url, "Cache-Control": "public, max-age=300", ...CORS },
        });
      },
    },
  },
});
