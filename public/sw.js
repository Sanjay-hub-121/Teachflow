self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = {}; }
  const title = data.title || "TeachFlow reminder";
  const options = {
    body: data.body || "You have an update in TeachFlow.",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: data.tag || "teachflow-notification",
    data: { href: data.href || "/app/notifications" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = event.notification.data?.href || "/app/notifications";
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    const existing = list.find((client) => "focus" in client);
    if (existing) return existing.navigate(href).then(() => existing.focus());
    return self.clients.openWindow(href);
  }));
});
