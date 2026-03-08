import {defineConfig} from "vite";
import {resolve} from "path";
import dts from "vite-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: {
          "index": resolve(__dirname, "index.ts"),
          "tasks-lifecycle/default/index": resolve(__dirname, "lib/tasks-lifecycle/default/index.ts"),
          "transport/client/default/index": resolve(__dirname, "lib/transport/client/default/index.ts"),
          "transport/server/default/index": resolve(__dirname, "lib/transport/server/default/index.ts"),
        },
        formats: ["es", "cjs"],
        fileName: (format, entryName) => `${entryName}.${format}.js`,
      },
      sourcemap: true,
      minify: false,
    },
    output: {
      exports: "named",
    },
    plugins: [
      {...nodeExternals(), enforce: "pre"},
      dts({
        include: ["lib", "index.ts"],
        insertTypesEntry: true,
        rollupTypes: true,
      }),
    ],
  };
});
