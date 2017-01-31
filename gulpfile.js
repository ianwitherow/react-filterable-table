const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js');
const less = require('gulp-less');


gulp.task('build', function() {
	console.log("Building!");

	webpack(webpackConfig, function(err, stats) {
		if (err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		gulp.src('./dist/example.min.js')
			.pipe(gulp.dest('./example/js'));
		console.log("Build complete.");
	});

	return gulp.src('./src/**/*.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'dist') ]
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function() {
	gulp.watch('**/*.js*', ['build']);
});
