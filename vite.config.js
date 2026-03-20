import {defineConfig} from "vite";
import {resolve} from "path";
import dts from "vite-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";

const __dirname = import.meta.dirname;

export default defineConfig({
  build: {
    lib: {
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "cjs" ? "cjs" : "mjs"}`,
      entry: {
        "client/index": resolve(__dirname, "lib/client/index.ts"),
        "server/index": resolve(__dirname, "lib/server/index.ts"),
      },
    },
    minify: false,

    emptyOutDir: true,
  },
  output: {
    exports: "named",
  },
  plugins: [
    {...nodeExternals(), enforce: "pre"},
    dts({
      include: ["lib", "client.ts"],
      insertTypesEntry: true,
    }),
  ],
});
