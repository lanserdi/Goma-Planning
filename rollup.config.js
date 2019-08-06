import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";

export default {
  input: "src/js/main.js",
  output: {
    file: "demo/js/main.js",
    format: "iife",
    name: "goma"
  },
  plugins: [
    json(),
    resolve(),
    babel({
      exclude: "node_modules/**"
    })
  ]
};
