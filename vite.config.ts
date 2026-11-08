import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    // Build SSR (prerender) hanya butuh React; PWA & kompresi khusus build klien
    !isSsrBuild && compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      deleteOriginFile: false,
    }),
    !isSsrBuild && VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png", "images/qm-logo.webp"],
      manifest: {
        name: "Katalog British Propolis – Mbak Tila",
        short_name: "Katalog BP",
        description: "Katalog British Propolis asli bersama Mbak Tila, Malang. Konsultasi produk gratis via WhatsApp.",
        theme_color: "#0f766e",
        background_color: "#F8FAFC",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/images/qm-logo.webp",
            sizes: "192x192",
            type: "image/webp",
          },
          {
            src: "/images/qm-logo.webp",
            sizes: "512x512",
            type: "image/webp",
          },
          {
            src: "/images/qm-logo.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /\.[^/?]+$/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...(isSsrBuild
        ? { "virtual:pwa-register/react": path.resolve(__dirname, "./src/lib/pwa-register-stub.ts") }
        : {}),
    },
  },
  build: {
    reportCompressedSize: false,
    // Folder public cukup disalin sekali (build klien)
    copyPublicDir: !isSsrBuild,
    chunkSizeWarningLimit: 1000,
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          // Pisahkan tiap library React agar tidak circular
          if (id.includes("react-dom")) return "vendor-react-dom";
          if (id.includes("react-router-dom")) return "vendor-router";
          if (id.includes("/react/") || id.includes("/react@")) return "vendor-react";
          if (id.includes("@radix-ui")) return "vendor-ui";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("recharts")) return "vendor-charts";
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("@tanstack")) return "vendor-query";
          return "vendor";
        },
      },
    },
  },
}));

