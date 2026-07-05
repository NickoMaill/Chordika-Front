/// <reference lib="webworker" />
export {}; // keep the file a module

/* eslint-env serviceworker */
declare const self: ServiceWorkerGlobalScope;
const clients = self.clients;

import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('Push reçu :', data);
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/pwa-192x192.png',
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
