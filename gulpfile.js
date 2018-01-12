var $           = require('gulp-load-plugins')();
var argv        = require('yargs').argv;
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var cleanCSS    = require('gulp-clean-css');

// Enter URL of your local server here
// Example: 'http://localwebsite.dev'
var URL = '';

// Check for --production flag
var isProduction = !!(argv.production);

// Browsers to target when prefixing CSS.
var COMPATIBILITY = [
  'last 2 versions',
  'ie >= 9',
  'Android >= 2.3'
];

// Compile Sass into CSS
gulp.task('sass', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
      .pipe($.sourcemaps.init())
      .pipe($.sass())
      .on('error', $.notify.onError({
          message: "<%= error.message %>",
          title: "Sass Error"
      }))
      .pipe($.autoprefixer({
        browsers: COMPATIBILITY
      }))
      // Minify CSS if run with --production flag
      .pipe($.if(isProduction, cleanCSS()))
      .pipe($.if(!isProduction, $.sourcemaps.write('.')))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
  });

gulp.task('js', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'src/js/custom/*.js'])
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('start', ['sass'], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch("*.php").on('change', browserSync.reload);
});

gulp.task('default', ['js', 'start']);