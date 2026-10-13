import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { AppError, rethrowKnown } from "../errors.ts";
import { db } from "./common.ts";

export const savePushSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { endpoint?: string; p256dh?: string; auth?: string; userAgent?: string }) => {
    const endpoint = String(input.endpoint ?? "").trim();
    const p256dh = String(input.p256dh ?? "").trim();
    const auth = String(input.auth ?? "").trim();
    if (!endpoint || !p256dh || !auth || endpoint.length > 2000) throw new AppError("That notification device could not be registered.");
    return { endpoint, p256dh, auth, userAgent: String(input.userAgent ?? "").slice(0, 500) };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      await sql`
        insert into push_subscriptions (id, user_id, endpoint, p256dh, auth, user_agent)
        values (${crypto.randomUUID()}, ${context.userId}, ${data.endpoint}, ${data.p256dh}, ${data.auth}, ${data.userAgent})
        on conflict (endpoint) do update set user_id = excluded.user_id, p256dh = excluded.p256dh,
          auth = excluded.auth, user_agent = excluded.user_agent, updated_at = now()`;
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const removePushSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { endpoint?: string }) => ({ endpoint: String(input.endpoint ?? "").trim() }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      await sql`delete from push_subscriptions where endpoint = ${data.endpoint} and user_id = ${context.userId}`;
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });
