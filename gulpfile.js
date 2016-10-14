var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var s3 = require("gulp-s3");
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var connect = require('gulp-connect');


gulp.task('default', function() {
	console.log('Default Task');
});

// gulp.task('processHtml', function() {
// 	gulp.src('./app/**/*.html')
// 	.pipe(gulp.dest('./build'))
// });
//
// gulp.task('processJs', function() {
// 	gulp.src('./app/js/*.js')
// 	.pipe(concat('all.js'))
// 	.pipe(uglify())
// 	.pipe(gulp.dest('./build/js'))
// });

gulp.task('processCss', function() {
	gulp.src('./app/css/*.css')
	.pipe(concat('all.css'))
	.pipe(cleanCss())
	.pipe(gulp.dest('./build/css'))
});


gulp.task('processImages', function() {
	gulp.src(['./app/images/*.jpg', './app/images/*.png'])
	.pipe(imagemin())
	.pipe(gulp.dest('./build/images'))
});

var tasks = ['processHtml', 'processJs', 'processCss', 'processImages']

aws = JSON.parse(`{
  "key": "AKIAJPZ56XFFOEUQFBZQ",
  "secret": "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",
  "bucket": "gulpdemo.vinsol.com",
  "region": "us-west-2"
}
`);

gulp.task('deploy', tasks, function() {
  gulp.src('./build/**')
  .pipe(s3(aws));
});

// var options = { headers: {'Cache-Control': 'max-age=315360000, public'} }
//
// gulp.task('deploy', tasks, function() {
//   gulp.src('./build/**')
//   .pipe(s3(aws, options));
// });

gulp.task('processJs', function() {
	gulp.src('./app/js/*.js')
	.pipe(concat('all.js'))
	.pipe(uglify())
	.pipe(rev())
	.pipe(gulp.dest('./build/js'))
	.pipe(rev.manifest({manifest: gulp.src('build/js/rev-manifest.json')}))
  .pipe(gulp.dest('build/js'));
});

gulp.task('processHtml', function() {
	gulp.src('./app/**/*.html')
 .pipe(revReplace({manifest: gulp.src('build/js/rev-manifest.json')}))
	.pipe(gulp.dest('./build'))
});


gulp.task('connect', ['watch'], function() {
  connect.server({
  root: ['build'],
  livereload: true
})});

// gulp.task('watch', function() {
//   gulp.watch('./app/**/*.*', tasks)
// })

var tasksWithReload = ['processHtml', 'processJs', 'processCss', 'processImages', 'reload']

gulp.task('watch', tasks, function() {
  gulp.watch('./app/**/*.*', tasksWithReload);
});

gulp.task('reload', tasks, function() {
  return   gulp.src('./build/**/*.*')
	.pipe(connect.reload())
});
