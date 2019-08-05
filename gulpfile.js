const { src, dest } = require('gulp');
const babel = require('gulp-babel');

const compileJs = () => {
  return src('src/js/*.js')
          .pipe(babel({
            presets: ['@babel/env'],
            plugins: ['@babel/transform-runtime']
          }))
          .pipe(dest('site/public/js'))
}

module.exports.default = compileJs
module.exports.build = () => {
  return 'as'
}