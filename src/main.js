// MarkLink Office — Entry Point
import { initApp } from './app.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initApp().catch(console.error);
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/marklink-office/sw.js').catch(() => {
      // SW registration failed — app works fine without it
    });
  });
}
