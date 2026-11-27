import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowToCamel, rowsToCamel } from "@/lib/mappers";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("status", "approved")
      .eq("is_visible", true)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (error) return fail(error.message, 500);
    return ok(rowsToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch testimonials", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      role = "",
      company = "",
      email = "",
      linkedinUrl = "",
      githubUrl = "",
      message,
      avatar = { url: null, publicId: null, alt: "" },
      rating = 5,
    } = body;

    if (!name?.trim() || !message?.trim()) {
      return fail("Name and message are required", 400);
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        email: email.trim(),
        linkedin_url: linkedinUrl.trim(),
        github_url: githubUrl.trim(),
        message: message.trim(),
        avatar,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        status: "pending",
        is_visible: true,
      })
      .select()
      .single();

    if (error) return fail(error.message, 400);
    return ok(rowToCamel(data), 201);
  } catch (err: any) {
    return fail(err.message || "Failed to submit testimonial", 500);
  }
}
