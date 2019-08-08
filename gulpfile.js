const { src, dest } = require("gulp");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

module.exports.default = async () => {
  console.log("Hi")
  return Promise.resolve("Hi")
}
module.exports.minijs = () => {
  return src("demo/js/main.js")
    .pipe(uglify())
    .pipe(rename(path => {
      path.basename += '.min'
    }))
    .pipe(dest("demo/js/"))
}
