// --------------------------------------------------
// Load Plugins
// --------------------------------------------------

var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync'),
    consolidate   = require('gulp-consolidate'),
    fs            = require('fs'),
    gutil         = require('gulp-util'),
    htmlmin       = require('gulp-htmlmin'),
    iconfont      = require('gulp-iconfont'),
    minifycss     = require('gulp-minify-css'),
    notify        = require('gulp-notify'),
    prettify      = require('gulp-jsbeautifier'),
    rename        = require('gulp-rename'),
    spawn         = require('child_process').spawn,
    template      = require('gulp-template'),
    sass          = require('gulp-ruby-sass'),
    s3            = require("gulp-s3");

// --------------------------------------------------
// General Config
// --------------------------------------------------

var config = {
  // the jekyll site destination
  docRoot: '_site/',
  // main scss files that import partials
  scssSrc: 'assets/scss/*.scss',
  // all scss files in the scss directory
  allScss: 'assets/scss/**/*.scss',
  // the destination directory for our css
  cssDest: 'assets/css/',
  // all js files the js directory
  allJs: 'assets/js/**/*.js'
};

// --------------------------------------------------
// Custom Messages
// --------------------------------------------------

/**
 * Adding custom messages to output to the browserSync status
 */
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> jekyll build',
  sassBuild: '<span style="color: grey">Running:</span> sass'
};

// --------------------------------------------------
// Jekyll
// --------------------------------------------------

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

// --------------------------------------------------
// Browser Sync
// --------------------------------------------------

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: config.docRoot
    },
    xip: true
  });
});

// --------------------------------------------------
// Sass
// --------------------------------------------------

/**
 * Compile scss files from into both:
 *   _site/assets/css (for live injecting)
 *   assets/css (for future jekyll builds)
 */
gulp.task('sass', function() {
  browserSync.notify(messages.sassBuild);
  return gulp.src(config.scssSrc)
    .pipe(sass({
      style: 'expanded',
      bundleExec: true,
      // Hack to disable sourcemaps, can be removed once 
      // next version of gulp-ruby-sass is released
      // https://github.com/sindresorhus/gulp-ruby-sass/issues/130#issuecomment-55579060
      'sourcemap=none': true
    }))
    .on('error', function (err) {
      browserSync.notify(err);
    })
    .pipe(autoprefixer(
      'last 2 version',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ))
    // for live injecting
    .pipe(gulp.dest(config.docRoot + config.cssDest))
    .pipe(browserSync.reload({stream: true}))
    // for future jekyll builds
    .pipe(gulp.dest(config.cssDest));
});

// --------------------------------------------------
// Icon Font
// --------------------------------------------------

var iconfontSettings = {
  // the svg source files to be converted to iconfont
  iconsSrc: 'assets/icons/**/*.svg',
  // the font name
  fontName: 'icons',
  // the destination directory for the generated icon font files
  fontsDir: 'assets/fonts/',
  // the directory that contains the icon font styles template
  templatesDir: 'assets/icons/templates/',
  // the template to use for generating the icon font css
  template: 'foundation-style'
}

gulp.task('iconfont', function() {
  gulp.src([iconfontSettings.iconsSrc])
    .pipe(iconfont({
      fontName: iconfontSettings.fontName
    }))
    .on('codepoints', function(codepoints) {
      var options = {
        glyphs: codepoints,
        fontName: iconfontSettings.fontName,
        fontPath: '../fonts/', // set path to font (from your CSS file if relative)
        className: 'icon' // set class name in your SCSS
      };
      gulp.src(iconfontSettings.templatesDir + iconfontSettings.template + '.scss')
        .pipe(consolidate('lodash', options))
        .pipe(rename({
          basename: '_' + iconfontSettings.fontName
        }))
        .pipe(gulp.dest('assets/scss/base/')); // set path to export your SCSS
    })
    .pipe(gulp.dest('assets/fonts/'));
});

// --------------------------------------------------
// Cleanup HTML
// --------------------------------------------------

/**
 * Minify HTML files
 */
gulp.task('minify-html', function() {
  gulp.src(config.docRoot + '**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.docRoot))
});

/**
 * Prettify HTML files
 */
gulp.task('prettify-html', function(cb) {
  return gulp.src(config.docRoot + '**/*.html')
    .pipe(prettify({
      config: './.jsbeautifyrc'
    }))
    .pipe(gulp.dest(config.docRoot))
    cb(onError);
});

// --------------------------------------------------
// Deploy
// --------------------------------------------------

// Push _site docroot to S3 Bucket
gulp.task('push-to-s3', function() {
  var aws = JSON.parse(fs.readFileSync('./.s3config'));
  var awsOptions = {
    headers: {'Cache-Control': 'max-age=315360000, no-transform, public'}
  };
  return gulp.src(config.docRoot + '**')
    .pipe(s3(aws, awsOptions));
});

// Prettify HTML then push to S3 Bucket
gulp.task('deploy', ['prettify-html', 'push-to-s3']);


// --------------------------------------------------
// Watch
// --------------------------------------------------

/**
 * Watch scss files for changes & recompile
 * Watch html, md, and js files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
  gulp.watch(config.allScss, ['sass']);
  gulp.watch(iconfontSettings.iconsSrc, ['iconfont']);
  gulp.watch(['*.html', '*/*.html', '*/*/*.html', '*/*.md', '!_site/**', '!_site/*/**', config.allJs], ['jekyll-rebuild']);
});

// --------------------------------------------------
// Default
// --------------------------------------------------

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);