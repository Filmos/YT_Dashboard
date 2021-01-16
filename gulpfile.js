"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/StartBootstrap/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./docs/"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/", "./docs/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap JS
  var bootstrapJS = gulp.src('./node_modules/bootstrap/dist/js/*')
    .pipe(gulp.dest('./vendor/bootstrap/js'));
  // Bootstrap SCSS
  var bootstrapSCSS = gulp.src('./node_modules/bootstrap/scss/**/*')
    .pipe(gulp.dest('./vendor/bootstrap/scss'));
  // ChartJS
  var chartJS = gulp.src('./node_modules/chart.js/dist/*.js')
    .pipe(gulp.dest('./vendor/chart.js'));
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    .pipe(replace('../webfonts', 'webfonts'))
    .pipe(gulp.dest('./vendor'));
  var fontAwesomeWebfonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('./docs/webfonts'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./vendor/jquery-easing'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
  return merge(bootstrapJS, bootstrapSCSS, chartJS, fontAwesome, fontAwesomeWebfonts, jquery, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(cleanCSS())
    .pipe(gulp.src("./vendor/fontawesome-free/css/all.min.css"))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest("./docs"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  var isMini = function (file) {
    return file.history[0].indexOf(".min") == -1;
  }

  return gulp.src([
      "vendor/jquery/jquery.min.js",
      "vendor/bootstrap/js/bootstrap.bundle.min.js",
      "vendor/jquery-easing/jquery.easing.min.js",
      "vendor/chart.js/Chart.min.js",
      "js/core.js",
      "js/tooltip.js",
      "js/charts/mmm.js",
      "js/charts/linePlot.js",
      "js/charts/heatMap.js",
      "js/charts/histogram.js",
      "js/youtube-api.js",
      "js/charts.js",
      "js/datatypes-definitions.js",
      "js/filters.js",
      "js/dataset-memory.js",
      "js/file-loading.js"
    ])
    .pipe(gulpif(isMini, babel({presets: ['@babel/env']})))
    .pipe(gulpif(isMini, uglify()))
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('docs'))
    .pipe(browsersync.stream());
};

// HTML task
function html() {
  return gulp.src('*.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('docs'))
    .pipe(browsersync.stream());
};

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch(["./js/**/*", "!./js/**/*.min.js"], js);
  gulp.watch("./*.html", html);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, css, js, html);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.js = js;
exports.html = html;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
