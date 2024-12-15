import browserSync from "browser-sync";
import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import htmlmin from "gulp-htmlmin";
import imagemin from "gulp-imagemin";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import dartSass from "sass";

const sass = gulpSass(dartSass);

const paths = {
  html: "./src/**/*.html",
  scss: "./src/styles/*.scss",
  js: "./src/scripts/**/*.js",
  assets: "./src/assets/**/*",
};

function html() {
  return gulp
    .src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"));
}

function styles() {
  return gulp
    .src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/styles"))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(paths.js)
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/scripts"))
    .pipe(browserSync.stream());
}

function assets() {
  return gulp
    .src(paths.assets, { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/assets"));
}
function fonts() {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./dist/fonts"));
}

function watchFiles() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false,
  });
  gulp.watch(paths.html, html).on("change", browserSync.reload);
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts).on("change", browserSync.reload);
  gulp.watch(paths.assets, assets).on("change", browserSync.reload);
}

const build = gulp.series(
  gulp.parallel(html, styles, scripts, assets, fonts),
  watchFiles
);

export default build;
