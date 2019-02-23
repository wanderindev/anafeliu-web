let settings = {
    clean: true,
    scripts: true,
    polyfills: true,
    styles: true,
    imgs: true,
    svgs: true,
    inject: true,
    copy: true,
    reload: true
};


/**
 * Paths to project folders
 */

let paths = {
    input: 'src/',
    output: 'dist/',
    scripts: {
        input: 'src/js/*',
        polyfills: '.polyfill.js',
        output: 'dist/js/'
    },
    styles: {
        input: 'src/sass/*.{scss,sass}',
        output: 'dist/css/'
    },
    imgs: {
        input: 'src/img/*.{gif,jpg,png}',
        output: 'dist/img/'
    },
    svgs: {
        input: 'src/svg/*.svg',
        output: 'dist/svg/'
    },
    inject: {
        target: 'src/*.html',
        devsrc: ['dist/js/*.js', 'dist/css/*.css', '!dist/js/*.min.js', '!dist/css/*.min.css'],
        prodsrc: ['dist/js/*.min.js', 'dist/css/*.min.css'],
        output: 'dist/'
    },
    copy: {
        input: 'src/copy/**/*',
        output: 'dist/'
    },
    reload: './dist/'
};


/**
 * Template for banner to add to file headers
 */

let banner = {
    full:
        '/*!\n' +
        ' * <%= package.name %> v<%= package.version %>\n' +
        ' * <%= package.description %>\n' +
        ' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
        ' * <%= package.license %> License\n' +
        ' * <%= package.repository.url %>\n' +
        ' */\n\n',
    min:
        '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | <%= package.license %> License' +
        ' | <%= package.repository.url %>' +
        ' */\n'
};


/**
 * Gulp Packages
 */

// General
let {src, dest, watch, series, parallel} = require('gulp');
let del = require('del');
let flatmap = require('gulp-flatmap');
let lazypipe = require('lazypipe');
let rename = require('gulp-rename');
let header = require('gulp-header');
let _package = require('./package.json');

// Scripts
let jshint = require('gulp-jshint');
let stylish = require('jshint-stylish');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let optimizejs = require('gulp-optimize-js');

// Styles
let sass = require('gulp-sass');
let prefix = require('gulp-autoprefixer');
let minify = require('gulp-cssnano');

// Imgs
let imagemin = require('gulp-imagemin');
let cache = require('gulp-cache');

// SVGs
let svgmin = require('gulp-svgmin');

// Inject
let inject = require('gulp-inject');

// BrowserSync
let browserSync = require('browser-sync');

/**
 * Gulp Tasks
 */

// Remove pre-existing content from output folders
let cleanDist = function (done) {

    // Make sure this feature is activated before running
    if (!settings.clean) return done();

    // Clean the dist folder
    del.sync([
        paths.output
    ]);

    // Clear all cache files
    cache.clearAll();

    // Signal completion
    return done();

};

// Repeated JavaScript tasks
// noinspection JSUnresolvedFunction
let jsTasks = lazypipe()
    .pipe(header, banner.full, {package: _package})
    .pipe(optimizejs)
    .pipe(dest, paths.scripts.output)
    .pipe(rename, {suffix: '.min'})
    .pipe(uglify)
    .pipe(optimizejs)
    .pipe(header, banner.min, {package: _package})
    .pipe(dest, paths.scripts.output);

// Lint, minify, and concatenate scripts
let buildScripts = function (done) {

    // Make sure this feature is activated before running
    if (!settings.scripts) return done();

    // Run tasks on script files
    src(paths.scripts.input)
        .pipe(flatmap(function(stream, file) {

            // If the file is a directory
            if (file.isDirectory()) {

                // Setup a suffix variable
                let suffix = '';

                // If separate polyfill files enabled
                if (settings.polyfills) {

                    // Update the suffix
                    suffix = '.polyfills';

                    // Grab files that aren't polyfills, concatenate them, and process them
                    src([file.path + '/*.js', '!' + file.path + '/*' + paths.scripts.polyfills])
                        .pipe(concat(file.relative + '.js'))
                        .pipe(jsTasks());

                }

                // Grab all files and concatenate them
                // If separate polyfills enabled, this will have .polyfills in the filename
                src(file.path + '/*.js')
                    .pipe(concat(file.relative + suffix + '.js'))
                    .pipe(jsTasks());

                return stream;

            }

            // Otherwise, process the file
            return stream.pipe(jsTasks());

        }));

    // Signal completion
    done();

};

// Lint scripts
let lintScripts = function (done) {

    // Make sure this feature is activated before running
    if (!settings.scripts) return done();

    // Lint scripts
    src(paths.scripts.input)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));

    // Signal completion
    done();

};

// Process, lint, and minify Sass files
let buildStyles = function (done) {

    // Make sure this feature is activated before running
    if (!settings.styles) return done();

    // Run tasks on all Sass files
    src(paths.styles.input)
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
        }))
        .pipe(prefix({
            browsers: ['last 2 version', '> 0.25%'],
            cascade: true,
            remove: true
        }))
        .pipe(header(banner.full, { package : _package }))
        .pipe(dest(paths.styles.output))
        .pipe(rename({suffix: '.min'}))
        .pipe(minify({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(header(banner.min, { package : _package }))
        .pipe(dest(paths.styles.output));

    // Signal completion
    done();

};

// Optimize image files
let buildImgs = function (done) {

    // Make sure this feature is activated before running
    if (!settings.imgs) return done();

    // Optimize image files
    src(paths.imgs.input)
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
        ])))
        .pipe(dest(paths.svgs.output));

    // Signal completion
    done();

};

// Optimize SVG files
let buildSVGs = function (done) {

    // Make sure this feature is activated before running
    if (!settings.svgs) return done();

    // Optimize SVG files
    src(paths.svgs.input)
        .pipe(svgmin())
        .pipe(dest(paths.svgs.output));

    // Signal completion
    done();

};

// Inject references to css and js files
let injectDev = function(done) {

    // Make sure this feature is activated before running
    if (!settings.inject) return done();

    // Get target and sources
    let target = src(paths.inject.target);
    let sources = src(paths.inject.devsrc, {read: false});

    // Inject sources into target
    target
        .pipe(inject(sources, {relative: true, ignorePath: '../dist/'}))
        .pipe(dest(paths.inject.output));

    // Signal completion
    done()

};

// Inject references to css and js files
let injectProd = function(done) {

    // Make sure this feature is activated before running
    if (!settings.inject) return done();

    // Get target and sources
    let target = src(paths.inject.target);
    let sources = src(paths.inject.prodsrc, {read: false});

    // Inject sources into target
    target
        .pipe(inject(sources, {relative: true, ignorePath: '../dist/'}))
        .pipe(dest(paths.inject.output));

    // Signal completion
    done()

};

// Copy static files into output folder
let copyFiles = function (done) {

    // Make sure this feature is activated before running
    if (!settings.copy) return done();

    // Copy static files
    src(paths.copy.input)
        .pipe(dest(paths.copy.output));

    // Signal completion
    done();

};

// Watch for changes to the src directory
let startServer = function (done) {

    // Make sure this feature is activated before running
    if (!settings.reload) return done();

    // Initialize BrowserSync
    browserSync.init({
        server: {
            baseDir: paths.reload
        }
    });

    // Signal completion
    done();

};

// Reload the browser when files change
let reloadBrowser = function (done) {
    if (!settings.reload) return done();
    browserSync.reload();
    done();
};

// Watch for changes
let watchSource = function (done) {
    watch(paths.input, series(exports.default, reloadBrowser));
    done();
};


/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
    parallel(
        buildScripts,
        lintScripts,
        buildStyles,
        buildImgs,
        buildSVGs,
        copyFiles
    )
);

// Clear the dist folder
// gulp clear
exports.clean = series(
    cleanDist
);

// Inject css and js references
// gulp injectdev
exports.injectdev = series(
    injectDev
);

// Inject css and js references
// gulp injectprod
exports.injectprod = series(
    injectProd
);

// Watch and reload
// gulp watch
exports.watch = series(
    parallel(
        buildScripts,
        lintScripts,
        buildStyles,
        buildImgs,
        buildSVGs,
        copyFiles
    ),
    injectDev,
    startServer,
    watchSource
);
