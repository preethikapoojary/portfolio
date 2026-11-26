import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data: settings } = await supabase
      .from("site_settings")
      .select("github_username")
      .limit(1)
      .maybeSingle();

    const username = settings?.github_username || process.env.GITHUB_USERNAME || "";
    if (!username) {
      return ok({ username: "", user: null, repos: [] });
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-unified",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`,
        { headers, next: { revalidate: 3600 } }
      ),
    ]);

    const user = userRes.ok ? await userRes.json() : null;
    const repos = reposRes.ok ? await reposRes.json() : [];

    return ok({ username, user, repos: Array.isArray(repos) ? repos : [] });
  } catch (err: any) {
    return fail(err.message || "Failed to fetch GitHub data", 500);
  }
}
