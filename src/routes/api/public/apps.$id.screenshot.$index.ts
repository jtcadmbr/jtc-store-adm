import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { resolveStoredUrl } from "@/lib/public-apps.server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const Route = createFileRoute("/api/public/apps/$id/screenshot/$index")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ params }) => {
        const idx = Number(params.index);
        if (!Number.isInteger(idx) || idx < 0) {
          return new Response("Bad index", { status: 400, headers: CORS });
        }
        const { data, error } = await supabaseAdmin
          .from("apps")
          .select("screenshots")
          .eq("id", params.id)
          .maybeSingle();

        if (error || !data) return new Response("Not found", { status: 404, headers: CORS });
        const shots = (data.screenshots ?? []) as string[];
        const path = shots[idx];
        if (!path) return new Response("Not found", { status: 404, headers: CORS });

        const url = await resolveStoredUrl("app-screenshots", path);
        if (!url) return new Response("Unavailable", { status: 404, headers: CORS });

        return new Response(null, {
          status: 302,
          headers: { Location: url, "Cache-Control": "public, max-age=300", ...CORS },
        });
      },
    },
  },
});
