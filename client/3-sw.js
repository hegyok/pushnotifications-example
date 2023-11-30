// instantní aktivace workeru
self.addEventListener("install", evt => self.skipWaiting());
 
// získání kontroly
self.addEventListener("activate", evt => self.clients.claim());
 
// poslouchej na push
self.addEventListener("push", evt => {
  const data = evt.data.json();
  console.log("Push", data);
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    image: data.image
  });
});