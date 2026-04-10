/* Temp fix for https://github.com/qmhc/unplugin-dts/issues/417:
 * Manually add extensions to import/export paths after types generation
 */
import replace from "replace";
import recursive from "recursive-readdir";

const PATH = "dist";

const all_paths = await recursive(PATH);
const ts_paths = all_paths.filter((path) => path.match(/\..?ts.?$/))
if (process.env.DEBUG || process.env.VERBOSE) {
  console.log({all_paths, ts_paths});
}

replace({
  regex: /from ('|")(\.[^'"]+[^'".]{3,3})('|")/im,
  replacement: "from $1$2.js$3",
  paths: ts_paths,
  recursive: false,
});
