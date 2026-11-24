const CACHE = "moventhy-0.1.1";
const FILES = ["./", "index.html", "styles.css", "data.js", "engine.js", "fig.js", "app.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/logo-dark.png", "icons/logo-light.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x!==CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
 if (e.request.method!=="GET" || new URL(e.request.url).origin!==location.origin) return;
 e.respondWith(fetch(e.request).then(r => { if (r && r.ok){ const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })
  .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("./index.html"))));
});
