var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var webpack = require('webpack');
var log = require('fancy-log');
var PluginError = require('plugin-error');

var DEBUG = process.env.NODE_ENV === 'debug';
var CI = process.env.CI === 'true';

var vfsBefore = "this.pdfMake = this.pdfMake || {}; this.pdfMake.vfs = ";
var vfsAfter = ";";

gulp.task('build', function (callback) {
	webpack(require('./webpack.config.js'), function (err, stats) {
		if (err) {
			throw new PluginError("webpack", err);
		}
		log("[webpack]", stats.toString({}));
		callback();
	});
});

gulp.task('buildWithStandardFonts', function (callback) {
	webpack(require('./webpack-standardfonts.config.js'), function (err, stats) {
		if (err) {
			throw new PluginError("webpack", err);
		}
		log("[webpack]", stats.toString({}));
		callback();
	});
});

gulp.task('test', function () {
	return gulp.src(['./tests/**/*.js'])
		.pipe($.spawnMocha({
			debugBrk: DEBUG,
			R: CI ? 'spec' : 'nyan'
		}));
});

gulp.task('lint', function () {
	return gulp.src(['./src/**/*.js'])
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError());
});

gulp.task('buildFonts', function () {
	return gulp.src(['./examples/fonts/*.*'])
		.pipe($.each(function (content, file, callback) {
			var newContent = new Buffer(content).toString('base64');
			callback(null, newContent);
		}, 'buffer'))
		.pipe($.fileContentsToJson('vfs_fonts.js', {flat: true}))
		.pipe($.each(function (content, file, callback) {
			var newContent = vfsBefore + content + vfsAfter;
			callback(null, newContent);
		}, 'buffer'))
		.pipe(gulp.dest('build'));
});

gulp.task('default', gulp.series(/*'lint',*/ 'test', 'build', 'buildFonts'));
