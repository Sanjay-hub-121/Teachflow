import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { loadProfile, processDue } from "@/lib/teachflow/server/common";

export const Route = createFileRoute("/api/cron/reminders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET?.trim();
        const authorization = request.headers.get("authorization") ?? "";
        if (!secret || authorization !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
        const sql = await getSql();
        const users = await sql<{ user_id: string }>`select distinct user_id from reminders where status in ('scheduled', 'snoozed') and fire_at <= now()`;
        for (const user of users) {
          const profile = await loadProfile(sql, user.user_id);
          await processDue(sql, user.user_id, profile.timezone);
        }
        return Response.json({ ok: true, users: users.length });
      },
    },
  },
});
