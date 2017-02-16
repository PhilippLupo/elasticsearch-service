var config = require('./config');
var gulp = require('gulp');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var tsconfig = require('../tsconfig.json');
console.log(tsconfig);
gulp.task('scripts', function() {
    var b = browserify({
        entries:  config.src.js + '/main.ts',
        debug: true
    });
    b.plugin('tsify', tsconfig);
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(config.dest.js));
});

gulp.task('scripts:watch', function() {
    gulp.watch(config.src.js + '/**/*.ts', ['scripts']);
});