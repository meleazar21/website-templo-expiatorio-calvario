import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    {/* Vercel Web Analytics: anonymous page views, no cookies. Its script and
        reports go to /_vercel/insights on this same domain, so the CSP's
        'self' already allows them. */}
    <Analytics />
  </React.StrictMode>
);
