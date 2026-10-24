import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import "./index.css";

// Netlify Identity's emails (invitation, password reset) link to the site's root with a
// token in the hash; the sign-in widget lives in /admin, so pass the token on to it.
if (/(invite|recovery|confirmation|email_change)_token=/.test(window.location.hash)) {
  window.location.replace("/admin/" + window.location.hash);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    {/* Vercel Web Analytics: anonymous page views, no cookies. Its script and
        reports go to /_vercel/insights on this same domain, so the CSP's
        'self' already allows them. */}
    <Analytics />
  </React.StrictMode>
);
