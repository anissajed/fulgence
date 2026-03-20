import {defineConfig, mergeConfig} from "vite";
import {resolve} from "path";
import dts from "vite-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";

const __dirname = import.meta.dirname;

const configuredDtsPlugin = ({include}) => dts({
  include,
  insertTypesEntry: true,
})

const base_config = defineConfig({
  build: {
    lib: {
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "cjs" ? "cjs" : "mjs"}`,
    },
    minify: false,

    // The 2 configs generate 2 separate build process,
    // they must not delete the outher one output.
    emptyOutDir: false,
  },
  output: {
    exports: "named",
  },
});

export const node_config = mergeConfig(base_config, {
  build: {
    lib: {
      entry: {
        "transport/client/default/index": resolve(__dirname, "lib/transport/client/default/index.ts"),
        "transport/server/default/index": resolve(__dirname, "lib/transport/server/default/index.ts"),
      },
    },
  },
  plugins: [
    {...nodeExternals(), enforce: "pre"},
    configuredDtsPlugin({include: ["lib", "client.ts", "index.ts"]}),
  ],
});
