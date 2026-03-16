import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Clean up old service workers and caches to prevent stale content
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      caches.delete(cacheName);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
