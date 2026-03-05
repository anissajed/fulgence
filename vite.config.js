import {defineConfig} from "vite";
import {resolve} from "path";
import dts from "vite-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, "index.ts"),
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format}.js`,
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
