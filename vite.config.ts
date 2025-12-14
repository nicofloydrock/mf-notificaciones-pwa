import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { notifyOnRebuild } from "@antdevx/vite-plugin-hmr-sync";
import { moduleFederationConfig } from "./module.federation.config";

export default defineConfig({
  plugins: [
    react(),
    moduleFederationConfig(),
    // Notifica al host cuando el remoto Notificaciones se recompila en dev.
    notifyOnRebuild({
      appName: "notificaciones",
      hostUrl: "http://localhost:5173",
      endpoint: "/on-child-rebuild",
      notifyOnSuccessOnly: true,
    }),
  ],
  server: {
    port: 5007,
    host: "0.0.0.0",
    allowedHosts: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["*"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  },
  preview: {
    port: 5007,
    host: "0.0.0.0",
    allowedHosts: ["mf-notificaciones-pwa-production.up.railway.app", ".railway.app"],
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["*"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  },
  build: {
    target: "esnext",
  },
});
