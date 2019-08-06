import json from 'rollup-plugin-json';

export default {
  input: "src/js/main.js",
  output: {
    file: "bundle.js",
    format: "umd",
    name: "goma"
  },
  plugins: [
    json()
  ]
};
