self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: data.icon || "/images/PWA-Icon.png",
            badge: "/images/PWA-Icon.png",
            vibrate: [100, 50, 100],
            data: {
                dataOfArrival: Date.now(),
                primaryKey: "2"
            },
        }
        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', function (event) {
    console.log("通知をクリックして受け取りました")
    event.notification.close()
    event.waitUntil(clients.openWindow(
        "http://localhost:3000/",
        "https://new-u22-next-js-git-development-pwa-hayasin2004s-projects.vercel.app/"
    ))
})