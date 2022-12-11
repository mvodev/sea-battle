const { src, dest } = require('gulp');
const browserSync = require('browser-sync');

const { paths } = require('../config');

const favicon = () => {
  return (
    src(paths.favicon.src)
      .pipe(dest(paths.favicon.dist))
      .pipe(browserSync.stream())
  )
}

module.exports = favicon;
