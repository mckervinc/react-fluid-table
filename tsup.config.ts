import { defineConfig } from "tsup";

export default defineConfig(options => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: !!options.watch,
  clean: true,
  minify: true,
  external: ["react", "react-dom"],
  outExtension({ format }) {
    return { js: format === "cjs" ? ".js" : ".es.js" };
  }
}));
