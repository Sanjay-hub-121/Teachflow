export async function registerTeachFlowWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  return Notification.requestPermission();
}

function base64ToBytes(value: string): Uint8Array {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const raw = atob((value + padding).replaceAll("-", "+").replaceAll("_", "/"));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export async function subscribeForPush(save: (data: { endpoint: string; p256dh: string; auth: string; userAgent: string }) => Promise<unknown>) {
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim();
  if (!publicKey) throw new Error("Push notifications are not configured yet.");
  const registration = await registerTeachFlowWorker();
  if (!registration) throw new Error("This browser does not support push notifications.");
  const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64ToBytes(publicKey) as BufferSource });
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) throw new Error("The browser returned an incomplete notification subscription.");
  await save({ endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth, userAgent: navigator.userAgent });
  return subscription;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}
