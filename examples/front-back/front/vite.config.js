import {defineConfig} from "vite";

export default defineConfig(() => {
  return {
    server: {
      port: process.env.PORT || 3000,
      host: true,
      allowedHosts: [process.env.CONTAINER_NAME],
      proxy: {
        "/api": {
          target: `http://${process.env.BACK_CONTAINER_NAME}:${process.env.BACK_PORT}`,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^/api"), ""),
        },
      },
    },
    build: {
      sourcemap: true,
      minify: false,
    },
    optimizeDeps: {
      exclude: ["fulgence"], // prevent Vite to pre-bundle and make the sourcemap disappear
    },
  };
});
