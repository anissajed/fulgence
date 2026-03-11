import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    testTimeout: 60_000, // important for Docker
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "examples/front-back/test/tests",
    ],
  },
});
