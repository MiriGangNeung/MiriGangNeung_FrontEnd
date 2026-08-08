import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createWalkingRouteDevMiddleware } from './api/walking-route-dev.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), walkingRouteDevApi(env.KAKAO_REST_API_KEY)],
  };
});

function walkingRouteDevApi(apiKey: string | undefined): Plugin {
  return {
    name: 'walking-route-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(createWalkingRouteDevMiddleware({ apiKey, fetch: globalThis.fetch }));
    },
  };
}
