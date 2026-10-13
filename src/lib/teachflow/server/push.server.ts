import webpush from "web-push";
import type { Sql } from "@/lib/db";

function configured() {
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim();
  if (!publicKey || !privateKey || !subject) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function sendPushToUser(sql: Sql, userId: string, payload: { title: string; body: string; href?: string | null }) {
  if (!configured()) return;
  const subscriptions = await sql<{ endpoint: string; p256dh: string; auth: string }>`
    select endpoint, p256dh, auth from push_subscriptions where user_id = ${userId}`;
  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, JSON.stringify(payload));
    } catch (error: unknown) {
      const status = typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : 0;
      if (status === 404 || status === 410) {
        await sql`delete from push_subscriptions where endpoint = ${subscription.endpoint} and user_id = ${userId}`;
      } else {
        console.error("[teachflow] push delivery failed");
      }
    }
  }));
}
