import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * In development, /admin and /admin/ fall into the single-page "fallback" and return
 * the public site instead of the panel. This rewrites them to their real file before
 * Vite reaches that fallback.
 *
 * Only affects `npm run dev`: on the published site, /admin/ is resolved by the
 * hosting, which does serve the folder's index.html.
 */
function serveAdminPage(): Plugin {
  return {
    name: "serve-admin-page",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === "/admin" || req.url === "/admin/") {
          req.url = "/admin/index.html";
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), serveAdminPage()],
});
