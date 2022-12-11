const { parallel, series } = require('gulp');
const ts = require('gulp-typescript');
const gulp = require('gulp');

const {
  views, clean, server, styles, images, fonts, scripts, svgSprite, favicon,
} = require('./gulp/tasks');

const build = series(clean, parallel(views, styles, scripts, fonts, images, svgSprite, favicon));
const start = series(build, server);

const tsProject = ts.createProject('tsconfig.json');

gulp.task('default', () => tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist')));

module.exports = {
  start,
  build,
};
