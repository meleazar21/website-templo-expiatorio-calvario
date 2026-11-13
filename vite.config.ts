import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * In development, folders under public/ with their own index.html (/admin/, /radio/)
 * fall into the single-page "fallback" and return the public site instead of their
 * page. This rewrites them to their real file before Vite reaches that fallback.
 *
 * /radio without the slash is redirected rather than rewritten: the radio app's files
 * are relative (./assets/...) and only resolve from the folder itself. Its manifest
 * opens the installed app at /radio/, so without this, testing the install on a phone
 * against `npm run dev` opened the whole website instead of the radio.
 *
 * Only affects `npm run dev`; on the published site, vercel.json handles both.
 */
function serveFolderPages(): Plugin {
  return {
    name: "serve-folder-pages",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [path, query = ""] = (req.url ?? "").split("?");
        const q = query ? `?${query}` : "";
        if (path === "/admin" || path === "/admin/") {
          req.url = `/admin/index.html${q}`;
        } else if (path === "/radio") {
          res.statusCode = 301;
          res.setHeader("Location", `/radio/${q}`);
          res.end();
          return;
        } else if (path === "/radio/") {
          req.url = `/radio/index.html${q}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), serveFolderPages()],
});
