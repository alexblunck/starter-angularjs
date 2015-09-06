/**
 * starter-angular
 * gulpfile.js
 */

var browserify = require('browserify'),
      watchify = require('watchify'),
       bulkify = require('bulkify'),
          gulp = require('gulp'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
         gutil = require('gulp-util'),
        uglify = require('gulp-uglify'),
           del = require('del'),
          sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
        concat = require('gulp-concat'),
   ngTemplates = require('gulp-ng-templates'),
    ngAnnotate = require('gulp-ng-annotate'),
       htmlmin = require('gulp-htmlmin'),
   browserSync = require('browser-sync');


/**
 * Options
 */
var options = {
    // proxyServer: 'http://localhost:8000'
    browser: 'google chrome canary'
};


/**
 * Task - Default (Watch)
 */
gulp.task('default', ['watch']);


/**
 * Task - Build
 */
gulp.task('build', [
    'clean',
    'browserify',
    'index',
    'templates',
    'sass',
    'assets'
]);


/**
 * Task - Watch
 */
gulp.task('watch', [
    'clean',
    'watchTask',
    'watchify',
    'index',
    'templates',
    'sass',
    'assets'
], function () {
    gulp.start(['browserSync']);
});


/**
 * Task - Browserify
 */
gulp.task('browserify', function () {

    var bundler = browserify('./src/app.js', {debug:true});

    // Transforms go here
    // e.g. bundler.transform(reactify);
    bundler.transform(bulkify);

    return bundler.bundle()
        .pipe( source('bundle.js') )
        .pipe( buffer() )
        .pipe( sourcemaps.init({loadMaps: true}) )
            .pipe( ngAnnotate() )
            .pipe( uglify() )
            .on('error', gutil.log)
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest('./dist') );
});


/**
 * Task - Watchify
 */
gulp.task('watchify', function () {

    var options = watchify.args;
    options.debug = true;

    var bundler = watchify( browserify('./src/app.js', options) );

    // Transforms go here
    // e.g. bundler.transform(reactify);
    bundler.transform(bulkify);

    function rebundle () {
        return bundler.bundle()
            .on('error', gutil.log)
            .pipe( source('bundle.js') )
            .pipe( buffer() )
            .pipe( sourcemaps.init({loadMaps: true}) )
            .pipe( sourcemaps.write('./') )
            .pipe( gulp.dest('./dist') )
            .pipe( browserSync.stream() );
    }

    bundler.on('update', rebundle);
    return rebundle();
});


/**
 * Task - BrowserSync
 */
gulp.task('browserSync', function () {

    var bsOptions = {
        browser: options.browser || 'google chrome',
        online: false,
        logSnippet: false,
        notify: false,
        ghostMode: false,
        server: {
            baseDir: './dist'
        }
    };

    if (options.proxyServer) {
        bsOptions.proxy = options.proxyServer;
        delete bsOptions.server;
    }

    browserSync(bsOptions);
});


/**
 * Task - WatchTask
 */
gulp.task('watchTask', function () {

    gulp.watch('./src/index.html', ['index']);
    gulp.watch('./src/assets/**/*.*', ['assets']);
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch([
        './src/components/**/*.tpl.html',
        './src/shared/**/*.tpl.html',
        './src/assets/**/*.svg'
    ], ['templates']);
});


/**
 * Task - Index
 */
gulp.task('index', function () {

    return gulp.src('./src/index.html')
        .pipe( htmlmin({
            removeComments: true,
            collapseWhitespace: false,
            preserveLineBreaks: true
        }) )
        .pipe( gulp.dest('./dist') )
        .pipe( browserSync.stream() );
});


/**
 * Task - Templates
 */
gulp.task('templates', function () {
    gulp.src([
        './src/shared/**/*.tpl.html',
        './src/components/**/*.tpl.html',
        './src/assets/**/*.svg',
    ])
    .pipe( htmlmin({
        removeComments: true,
        collapseWhitespace: true
    }) )
    .pipe( ngTemplates({
        module: 'app',
        standalone: false,
        filename: 'templates.js',
        path: function (path, base) {
            return path.split(__dirname + '/src/')[1];
        }
    }) )
    .pipe( uglify() )
    .pipe( gulp.dest('./dist') )
    .pipe( browserSync.stream() );
});


/**
 * Task - Sass
 */
gulp.task('sass', function () {

    return gulp.src('./src/sass/*.scss')
        .pipe( sourcemaps.init() )
            .pipe( sass({
                // outputStyle: 'compressed',
                errLogToConsole: true
            }) )
            .on('error', function(err) {
                  console.error(err.toString());
                  this.emit('end');
            })
            .pipe( autoprefixer() )
            .pipe( concat('app.css') )
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest('./dist') )
        .pipe( browserSync.stream({match: '**/*.css'}) );
});


/**
 * Task - Assets
 */
gulp.task('assets', function () {

    return gulp.src('./src/assets/**/*.*')
        .pipe( gulp.dest('./dist/assets') );
});


/**
 * Task - Clean
 */
gulp.task('clean', function (cb) {

    del.sync(['dist']);
    cb(null);
});