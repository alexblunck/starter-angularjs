/**
 * starter-angular
 * gulpfile.babel.js
 */

import path from 'path'
import gulp from 'gulp'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import del from 'del'
import {argv} from 'yargs'
import browserify from 'browserify'
import watchify from 'watchify'
import babelify from 'babelify'
import browserSync from 'browser-sync'

const $ = require('gulp-load-plugins')()

/**
 * Arguments
 */
const ARGS = {
    production: argv.production,
    sourcemaps: argv.sourcemaps
}

/**
 * Paths
 */
const PATHS = {
    src: './src',
    sass: './src/sass',
    build: './build'
};

/**
 * Config
 */
const CONFIG = {
    proxyHost: 'localhost:8083'
};

/**
 * Task: Build
 * Build production ready version of the app.
 */
gulp.task('build', gulp.series(
    clean,
    gulp.parallel(
        bundleApp,
        templates,
        sass,
        copy
    ),
    size,
    revision,
    revisionReplace,
    compress
))

/**
 * Task: Watch
 * build complete app, start development server &
 * watch for changes.
 */
gulp.task('watch', gulp.series(
    clean,
    gulp.parallel(
        bundleAppAndWatch,
        templates,
        sass,
        copy
    ),
    server,
    watch
))

/**
 * Bundle app with ./src/index.js as the
 * entry point.
 *
 * @return {stream}
 */
function bundleApp () {
    return bundle(src('index.js'))
}

/**
 * Use browserify to bundle the application..
 *
 * @param  {string} entry - Path to entry file
 *
 * @return {stream}
 */
function bundle (entry) {
    let bundler = browserify(entry, {debug: ARGS.sourcemaps})

    bundler.transform('bulkify')
    bundler.transform(babelify.configure({
        presets: ['es2015']
    }))

    return bundler
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
            .pipe($.if(ARGS.sourcemaps, $.sourcemaps.init({loadMaps: true})))
                .pipe($.ngAnnotate())
                .pipe($.uglify())
            .pipe($.if(ARGS.sourcemaps, $.sourcemaps.write('./')))
            .pipe(gulp.dest(PATHS.build))
}

/**
 * Bundle app with ./src/index.js as the
 * entry point, watch for changes and rebundle.
 *
 * @return {stream}
 */
function bundleAppAndWatch () {
    return watchBundle(src('index.js'))
}

/**
 * Use watchify / browserify to bundle the
 * application, watch for changes and rebundle.
 *
 * @param  {string} entry - Path to entry file
 *
 * @return {stream}
 */
function watchBundle (entry) {
    let options = watchify.args
    options.debug = true

    let bundler = watchify(browserify(entry, options))

    bundler.transform('bulkify')
    bundler.transform(babelify.configure({
        presets: ['es2015']
    }))

    function rebundle () {
        return bundler
            .bundle()
            .on('error', errorHandler)
            .pipe(source('bundle.js'))
            .pipe(buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.sourcemaps.write('./'))
                .pipe(gulp.dest(PATHS.build))
                .pipe(browserSync.stream())
    }

    bundler.on('update', rebundle);
    return rebundle();
}

/**
 * Watch for changes to certain files and
 * run appropriate tasks,
 *
 * @param  {Function} done
 *
 * @return {stream}
 */
function watch (done) {
    gulp.watch([
        src('index.html')
    ], copy)

    gulp.watch([
        path.join(PATHS.sass, '**/*.scss')
    ], sass)

    gulp.watch([
        src('**/*.tpl.html'),
        src('**/*.svg')
    ], templates)

    done()
}

/**
 * Copy files into build dir.
 *
 * @return {void}
 */
function copy () {
    const glob = [
        src('index.html')
    ]

    return gulp.src(glob)
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(PATHS.build))
        .pipe(browserSync.stream())
}

/**
 * Add all .tpl.html & .svg file to angular's
 * $templateCache.
 *
 * @return {void}
 */
function templates () {
    const glob = [
        src('**/*.tpl.html'),
        src('**/*.svg')
    ]

    return gulp.src(glob)
        .pipe($.naturalSort())
        .pipe($.plumber(errorHandler))
        .pipe($.imagemin())
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe($.ngTemplates({
            module: 'app',
            standalone: false,
            filename: 'templates.js',
            path: path => path.split(__dirname + '/src/')[1]
        }))
        .pipe($.uglify())
        .pipe(gulp.dest(PATHS.build))
        .pipe(browserSync.stream())
}

/**
 * Compile sass.
 *
 * @return {stream}
 */
function sass () {
    const glob = path.join(PATHS.sass, '*.scss')

    return gulp.src(glob)
        .pipe($.if(ARGS.sourcemaps, $.sourcemaps.init()))
            .pipe($.plumber(errorHandler))
            .pipe($.sass({
                outputStyle: ARGS.production ? 'compressed' : undefined
            }))
            .pipe($.autoprefixer())
            .pipe($.concat('bundle.css'))
        .pipe($.if(ARGS.sourcemaps, $.sourcemaps.write('./')))
        .pipe(gulp.dest(PATHS.build))
        .pipe(browserSync.stream({ match: '**/*.css' }))
}

/**
 * Version all js & css files in the build dir.
 *
 * @return {stream}
 */
function revision () {
    const glob = [
        path.join(PATHS.build, '*.js'),
        path.join(PATHS.build, '*.css')
    ]

    return gulp.src(glob)
        .pipe($.rev())
        .pipe(gulp.dest(PATHS.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(PATHS.build))
}

/**
 * Replace file references in index.html sing the
 * "rev-manifest.json" created by the "revision"
 * task.
 *
 * @return {stream}
 */
function revisionReplace () {
    const manifest = path.join(PATHS.build, 'rev-manifest.json')
    const manifestStream = gulp.src(manifest);

    return gulp.src(path.join(PATHS.build, 'index.html'))
        .pipe($.revReplace({manifest: manifestStream}))
        .pipe(gulp.dest(PATHS.build))
}

/**
 * Use gzip to compress all js & css files in
 * the build dir.
 *
 * @return {stream}
 */
function compress () {
    const glob = [
        path.join(PATHS.build, '*.js'),
        path.join(PATHS.build, '*.css')
    ]

    return gulp.src(glob)
        .pipe($.gzip())
        .pipe(gulp.dest(PATHS.build))
}

/**
 * Delete build dir.
 *
 * @return {void}
 */
function clean () {
    return del(PATHS.build)
}

/**
 * Start node server (server.js) & BrowserSync.
 *
 * @param  {function} done
 *
 * @return {stream}
 */
function server (done) {
    let options = {
        browser: 'google chrome',
        online: false,
        logSnippet: false,
        notify: false,
        ghostMode: false,
        server: {
            baseDir: PATHS.build
        }
    }

    if (CONFIG.proxyHost) {
        options.proxy = CONFIG.proxyHost
        delete options.server
    }

    $.nodemon({
        script: './server.js',
        ignore: ['**.*']
    });

    browserSync(options)
    done()
}

/**
 * Log the size of files in build dir.
 *
 * @return {stream}
 */
function size () {
    const glob = path.join(PATHS.build, '*')

    return gulp.src(glob)
        .pipe($.size({showFiles: true}))
        .pipe($.size({gzip: true}));
}

/**
 * gulp-plumber errorHandler.
 *
 * @param  {string} err
 *
 * @return {this}
 */
function errorHandler (err) {
    $.util.beep();
    $.util.log($.util.colors.red(err));
    this.emit('end');
    return this;
}

/**
 * Helper to join file path with src path
 *
 * @param  {string} p Filepath
 *
 * @return {string}
 */
function src (p) {
    return path.join(PATHS.src, p);
}
