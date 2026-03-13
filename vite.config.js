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
      fileName: (format, entryName) => `${entryName}.${format}.js`,
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
        "index": resolve(__dirname, "index.ts"),
        "tasks-lifecycle/default/index": resolve(__dirname, "lib/tasks-lifecycle/default/index.ts"),
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

export const browser_config = mergeConfig(base_config, {
  build: {
    lib: {
      entry: {
        "client": resolve(__dirname, "client.ts"),
      },
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      path: resolve(__dirname, "lib/primitives/path.js"),
      "./default-file-loader.js": resolve(__dirname, "lib/config/default-file-loader.browser.js"),
      "../transport/server/default/index.js": "lib/primitives/unimplemented.js",
    },
  },
  plugins: [
    configuredDtsPlugin({include: ["lib", "client.ts"]}),
  ],
});
