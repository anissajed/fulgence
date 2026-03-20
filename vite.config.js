import {defineConfig} from "vite";
import {resolve} from "path";
import dts from "vite-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";

const __dirname = import.meta.dirname;

export const node_config = defineConfig({
  build: {
    lib: {
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "cjs" ? "cjs" : "mjs"}`,
      entry: {
        "transport/client/default/index": resolve(__dirname, "lib/transport/client/default/index.ts"),
        "transport/server/default/index": resolve(__dirname, "lib/transport/server/default/index.ts"),
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
      include: ["lib", "client.ts", "index.ts"],
      insertTypesEntry: true,
    }),
  ],
});
