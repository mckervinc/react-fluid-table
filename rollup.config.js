import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import bundleSize from "rollup-plugin-bundle-size";
import analyze from "rollup-plugin-analyzer";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const config = {
  input: "src/index.js",
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
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    bundleSize(),
    analyze({ summaryOnly: true })
  ]
};

if (process.env.BUILD === "production") {
  config.plugins.push(terser());
}

export default config;
