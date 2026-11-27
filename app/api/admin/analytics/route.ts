import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
} from "@/lib/adminAuth";

async function fetchAllRows(
  supabase: ReturnType<typeof getServiceSupabase>,
  tableName: string,
  startDate: string | undefined,
  selectFields: string
) {
  const pageSize = 1000;
  let allRows: any[] = [];
  let page = 0;

  while (true) {
    let query = supabase
      .from(tableName)
      .select(selectFields)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < pageSize || page >= 100) break;
    page += 1;
  }

  return allRows;
}

function formatDayLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") ?? 7);
    const isAllTime = !days || days <= 0;

    let startDate: string | undefined;
    if (!isAllTime) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (days - 1));
      startDate = start.toISOString();
    }

    const supabase = getServiceSupabase();
    const [pageViews, events, sectionViews] = await Promise.all([
      fetchAllRows(supabase, "page_views", startDate, "session_id, path, device_type, created_at"),
      fetchAllRows(supabase, "analytics_events", startDate, "type, event_type, created_at"),
      fetchAllRows(supabase, "section_views", startDate, "section_id, time_spent_ms, created_at"),
    ]);

    const totalViews = pageViews.length;
    const totalVisitors = new Set(pageViews.map((v) => v.session_id)).size;

    const trafficByDay: Record<string, number> = {};
    if (isAllTime) {
      if (pageViews.length > 0) {
        const sorted = [...pageViews].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        const earliest = new Date(sorted[0].created_at);
        earliest.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const spanDays = Math.max(Math.round((today.getTime() - earliest.getTime()) / 86400000) + 1, 1);
        for (let i = spanDays - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          trafficByDay[formatDayLabel(d)] = 0;
        }
        pageViews.forEach((v) => {
          const label = formatDayLabel(new Date(v.created_at));
          trafficByDay[label] = (trafficByDay[label] || 0) + 1;
        });
      }
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        trafficByDay[formatDayLabel(d)] = 0;
      }
      pageViews.forEach((v) => {
        const label = formatDayLabel(new Date(v.created_at));
        if (trafficByDay[label] !== undefined) {
          trafficByDay[label] += 1;
        }
      });
    }

    const trafficData = Object.entries(trafficByDay).map(([date, views]) => ({ date, views }));

    const pageCounts: Record<string, number> = {};
    pageViews.forEach((v) => {
      pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));

    const deviceCounts: Record<string, number> = {};
    pageViews.forEach((v) => {
      const dev = v.device_type || "Unknown";
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    });
    const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

    const sectionCounts: Record<string, { totalTime: number; count: number }> = {};
    sectionViews.forEach((v) => {
      if (!sectionCounts[v.section_id]) sectionCounts[v.section_id] = { totalTime: 0, count: 0 };
      sectionCounts[v.section_id].totalTime += v.time_spent_ms || 0;
      sectionCounts[v.section_id].count += 1;
    });
    const sectionData = Object.entries(sectionCounts)
      .map(([section, s]) => ({
        section,
        avgTimeSeconds: Math.round(s.totalTime / Math.max(s.count, 1) / 1000),
      }))
      .sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds);

    const eventCounts: Record<string, number> = {};
    events.forEach((e) => {
      const key = e.event_type || e.type || "event";
      eventCounts[key] = (eventCounts[key] || 0) + 1;
    });

    return ok({
      overview: { totalViews, totalVisitors },
      trafficData,
      topPages,
      deviceData,
      sectionData,
      eventCounts,
    });
  } catch (err: any) {
    return fail(err.message || "Failed to fetch analytics", 500);
  }
}
