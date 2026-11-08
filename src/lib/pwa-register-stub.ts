// Pengganti `virtual:pwa-register/react` saat build prerender (SSR).
// Service worker hanya berjalan di browser.
export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}] as [boolean, (v: boolean) => void],
    offlineReady: [false, () => {}] as [boolean, (v: boolean) => void],
    updateServiceWorker: async () => {},
  };
}
