import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'apps/web',
  plugins: [
    react(),
    {
      name: 'hono-api-dev-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            try {
              // Dynamically import the worker app from root
              const workerPath = path.resolve(__dirname, 'src/worker/index.ts');
              const { app } = await server.ssrLoadModule(workerPath);
              const protocol = req.headers['x-forwarded-proto'] || 'http';
              const host = req.headers.host || 'localhost:5173';
              const fullUrl = `${protocol}://${host}${req.url}`;

              // Read body if method has body
              let body: any = null;
              if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                  chunks.push(chunk);
                }
                body = Buffer.concat(chunks);
              }

              const headers = new Headers();
              for (const [key, value] of Object.entries(req.headers)) {
                if (value) {
                  if (Array.isArray(value)) {
                    value.forEach(v => headers.append(key, v));
                  } else {
                    headers.set(key, value);
                  }
                }
              }

              const fetchReq = new Request(fullUrl, {
                method: req.method,
                headers,
                body: body && body.length > 0 ? body : undefined,
              });

              // Execute Hono handler with mock/local environment bindings
              const response = await app.fetch(fetchReq, process.env);
              res.statusCode = response.status;
              response.headers.forEach((val: string, key: string) => {
                res.setHeader(key, val);
              });

              const responseBuffer = Buffer.from(await response.arrayBuffer());
              res.end(responseBuffer);
              return;
            } catch (err: any) {
              console.error('API Dev Server Error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@web': path.resolve(__dirname, './apps/web/src'),
    },
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true,
  },
});
