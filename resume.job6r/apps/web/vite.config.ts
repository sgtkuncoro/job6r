import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
    // Allow importing the canonical CV from job6r/resolved_cv (outside the monorepo).
    fs: { allow: ["../.."] },
  },
  // @resume/md-pdf is a just-in-time TS workspace package: let Vite transpile it
  // (instead of externalizing) on the server, and treat it as source on the client.
  ssr: {
    noExternal: ["@resume/md-pdf"],
  },
  optimizeDeps: {
    exclude: ["@resume/md-pdf"],
  },
  // Cloudflare plugin must come first; it runs the SSR build on the Workers
  // (workerd) runtime. See wrangler.jsonc for the deploy config.
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    viteReact(),
  ],
});
