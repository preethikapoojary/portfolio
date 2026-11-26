import { SupabaseClient } from "@supabase/supabase-js";

export async function checkIsAdmin(
  supabase: SupabaseClient,
  userId?: string | null,
  email?: string | null
): Promise<boolean> {
  if (!userId) return false;

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  if (adminEmail && email && email.toLowerCase() === adminEmail.toLowerCase()) {
    return true;
  }

  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}
