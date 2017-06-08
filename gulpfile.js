const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js');
const webpackExampleConfig = require('./webpack.example.config.js');
const less = require('gulp-less');


// Build the main library
gulp.task('build', function() {
	console.log("Building!");

	webpack(webpackConfig, function(err, stats) {
		if (err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		console.log("Build complete.");
	});
	return gulp.src('./src/**/*.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'dist') ]
		}))
		.pipe(gulp.dest('./dist'));
});

// Build the example
gulp.task('example', function() {
	console.log("Building examples!");

	webpack(webpackExampleConfig, function(err, stats) {
		if (err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		gulp.src('./dist/example.js')
			.pipe(gulp.dest('./example/js/dist'));
		gulp.src('./dist/example-alt.js')
			.pipe(gulp.dest('./example-alt/js/dist'));
		console.log("Build complete.");
	});

});

gulp.task('watch', ['build'], function() {
	gulp.watch('**/*.js*', ['build']);
});
