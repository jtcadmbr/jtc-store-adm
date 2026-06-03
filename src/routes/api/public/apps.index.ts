import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildStableUrls } from "@/lib/public-apps.server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/apps/")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { data, error } = await supabaseAdmin
          .from("apps")
          .select("id, name, description, category, version, created_at, updated_at")
          .order("created_at", { ascending: false });

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        }

        const apps = (data ?? []).map((row) => ({
          ...row,
          ...buildStableUrls(origin, row.id),
        }));

        return new Response(JSON.stringify({ apps }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=60",
            ...CORS,
          },
        });
      },
    },
  },
});
