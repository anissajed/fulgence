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
          "default-tasks-lifecycle": resolve(__dirname, "lib/tasks-lifecycle/default/index.ts"),
          "default-transport": resolve(__dirname, "lib/transport/default/index.ts"),
        },
        formats: ["es", "cjs"],
        fileName: (format, entryName) => `${entryName}.${format}.js`,
      },
      sourcemap: true,
      minify: false,
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
