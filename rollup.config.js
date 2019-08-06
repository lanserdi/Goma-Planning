import json from 'rollup-plugin-json';

export default {
  input: "src/js/main.js",
  output: {
    file: "site/public/js/main.js",
    format: "umd",
    name: "goma"
  },
  plugins: [
    json()
  ]
};
