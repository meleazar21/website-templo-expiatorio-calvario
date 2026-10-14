import fs from "node:fs";
import path from "node:path";
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

/**
 * The panel is used ONLY on this computer (`npm run admin`), so it isn't published: on
 * the deployed site it would show a login that can't work, because there's no identity
 * service behind it.
 *
 * It's deleted at the end of the build instead of moving the folder out of `public/`,
 * so that in development it keeps being served on its own and there aren't two
 * different paths to maintain.
 *
 * Publish it someday? Remove this plugin from the list and give it a real `backend` in
 * public/admin/config.yml (today it only works for local mode).
 */
function excludeAdminFromBuild(): Plugin {
  return {
    name: "exclude-admin-from-build",
    apply: "build",
    closeBundle() {
      fs.rmSync(path.resolve("dist/admin"), { recursive: true, force: true });
      console.log("  /admin panel not published (local use only)");
    },
  };
}

export default defineConfig({
  plugins: [react(), serveAdminPage(), excludeAdminFromBuild()],
});
