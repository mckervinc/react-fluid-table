import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import analyze from "rollup-plugin-analyzer";
import bundleSize from "rollup-plugin-bundle-size";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { visualizer } from "rollup-plugin-visualizer";

import pkg from "./package.json" assert { type: "json" };

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const config = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: process.env.BUILD === "development"
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: process.env.BUILD === "development"
    }
  ],
  plugins: [
    postcss({
      plugins: []
    }),
    svgr(),
    external(),
    url({ exclude: ["**/*.svg"] }),
    babel({
      extensions,
      exclude: "node_modules/**",
      babelHelpers: "bundled"
    }),
    resolve({ extensions }),
    commonjs(),
    bundleSize(),
    analyze({ summaryOnly: true })
  ]
};

if (process.env.BUILD === "production") {
  config.plugins.push(terser());
} else {
  config.plugins.push(visualizer());
}

export default config;
