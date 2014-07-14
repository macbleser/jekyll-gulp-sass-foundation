// --------------------------------------------------
// Load Plugins
// --------------------------------------------------

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    browsersync = require('browser-sync'),
    gutil = require('gulp-util'),
    childprocess = require('child_process');

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
// Error Handling
// --------------------------------------------------

/**
 * Beep on error and log message
 */
var onError = function(err) {
    gutil.beep();
    console.log(err);
};

// --------------------------------------------------
// Custom Messages
// --------------------------------------------------

/**
 * Adding custom messages to output to the browsersync status
 */
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> jekyll build'
};

// --------------------------------------------------
// Jekyll
// --------------------------------------------------

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
    browsersync.notify(messages.jekyllBuild);
    return childprocess.spawn('jekyll', ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browsersync.reload();
});

// --------------------------------------------------
// Browser Sync
// --------------------------------------------------

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browsersync.init(null, {
        server: {
            baseDir: config.docRoot
        },
        host: "localhost",
        // proxy: config.devUrl,
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
    return gulp.src(config.scssSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass({
            style: 'expanded'
        }))
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
        .pipe(browsersync.reload({
            stream: true
        }))
        // for future jekyll builds
        .pipe(gulp.dest(config.cssDest));
});

// --------------------------------------------------
// Watch
// --------------------------------------------------

/**
 * Watch scss files for changes & recompile
 * Watch html, md, and js files, run jekyll & reload Browsersync
 */
gulp.task('watch', function() {
    gulp.watch(config.allScss, ['sass']);
    gulp.watch(['index.html', '**/index.html', '_data/*', '_includes/**/*', '_layouts/*', '_posts/*', '**/_posts/*', config.allJs], ['jekyll-rebuild']);
});

// --------------------------------------------------
// Default
// --------------------------------------------------

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch Browsersync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);