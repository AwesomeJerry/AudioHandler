var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

gulp.task('default', ['js'], function () {
	gulp.watch('./audioHandler.js', ['js']);
});

gulp.task('js', function () {
	gulp.src('./audioHandler.js')
		.pipe(concat('audioHandler.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./'));
});