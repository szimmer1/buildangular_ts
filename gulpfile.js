var gulp = require('gulp'),
    Config = require('./gulpfile.config'),
    sourcemaps = require('gulp-sourcemaps'),
    exec = require('child_process').exec,
    browserify = require('gulp-browserify'),
    ts = require('gulp-typescript');

var config = new Config();

gulp.task('compile', function() {
    var allTsSource = [config.allTypescript, config.libraryTypeScriptDefinitions];

    var tsObj = gulp.src(allTsSource)
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: true,
            sourceMaps: true,
            module: 'commonjs'
        }));

    tsObj.dts.pipe(gulp.dest(config.tsOutputPath));

    return tsObj
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

/**
gulp.task('test', ['compile'], function(done) {
    exec('karma start', function(err) {
        if (err) {
            return done(err);
        }
        done();
    })
});
 */

gulp.task('watch', ['compile'], function() {
    gulp.watch('src/**/*.ts', ['compile']);
});
