// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Change this per project: site: "https://<your-subdomain>.anysigma.com"
  site: "https://example.anysigma.com",
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
