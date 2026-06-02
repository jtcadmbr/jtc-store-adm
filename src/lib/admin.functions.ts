import { createServerFn } from "@tanstack/react-start";

const ADMIN_EMAIL = "jtc.adm.br@gmail.com";
const ADMIN_PASSWORD = "Jardiel021.L";

/**
 * Ensure the single admin user exists in Supabase Auth.
 * Called once from the login page so signInWithPassword works on first run.
 */
export const ensureAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: list } = await supabaseAdmin.auth.admin.listUsers();
  const exists = list?.users?.some((u) => u.email === ADMIN_EMAIL);
  if (exists) return { ok: true };

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (error && !error.message.toLowerCase().includes("already")) {
    throw new Error(error.message);
  }
  return { ok: true };
});
