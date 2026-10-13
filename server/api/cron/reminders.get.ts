import { createError, defineEventHandler, getHeader, type H3Event } from "h3";
import { getSql } from "@/lib/db";
import { loadProfile, processDue } from "@/lib/teachflow/server/common";

function requireCronSecret(event: H3Event): void {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = getHeader(event, "authorization") ?? "";
  if (!secret || authorization !== `Bearer ${secret}`) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
}

export default defineEventHandler(async (event) => {
  requireCronSecret(event);
  const sql = await getSql();
  const users = await sql<{ user_id: string }>`
    select distinct user_id
    from reminders
    where status in ('scheduled', 'snoozed') and fire_at <= now()
  `;

  for (const user of users) {
    const profile = await loadProfile(sql, user.user_id);
    await processDue(sql, user.user_id, profile.timezone);
  }

  return { ok: true, users: users.length };
});
