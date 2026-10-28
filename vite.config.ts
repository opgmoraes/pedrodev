import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: { allowedHosts: ["terminal.local"] },
  plugins: [react(), {
    name: 'public-pages-preview',
    // Vite's SPA preview otherwise serves the homepage HTML for /portifolio.
    // Match the production routing so direct-load hydration can be tested locally.
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url || '/', 'http://localhost');
        if (url.pathname === '/portfolio' || url.pathname === '/portifolio/') {
          response.statusCode = 308;
          response.setHeader('Location', '/portifolio' + url.search);
          response.end();
          return;
        }
        if (url.pathname === '/portifolio') request.url = '/portifolio/index.html' + url.search;
        else if (/^\/(admin|login|cliente|proposta|contrato)(\/|$)/.test(url.pathname)) request.url = '/private-shell.html' + url.search;
        else if (url.pathname !== '/' && !url.pathname.includes('.')) request.url = '/app-shell.html' + url.search;
        next();
      });
    },
  }],
});
