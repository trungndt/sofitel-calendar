var gulp = require('gulp');
var sass = require('gulp-sass');
var haml = require('gulp-haml');
var lite = require('lite-server');
var exec = require('gulp-exec');

gulp.task('sass', function() {
  return gulp.src(['assets/scss/**/*.scss'])
    .pipe(sass())
    .on('error', onError)
    .pipe(gulp.dest('assets/css'))
});

// Get one .haml file and render 
gulp.task('haml-one', function() {
  gulp.src('./haml/index.haml')
    .pipe(haml())
    .pipe(gulp.dest('.'));
});

// Get all .haml files in one folder and render 
gulp.task('haml', function() {
  return gulp.src('haml/**/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch('assets/scss/**/*.scss', ['sass']);
  // Other watchers
  gulp.watch('haml/**/*.haml', ['haml']);
});

gulp.task('lite', function() {
  return gulp.src('./**/**')
    .pipe(exec('lite-server'));
});

gulp.task('default', function() {
  gulp.run('lite');
  gulp.run('watch');
});


function onError(err) {
  console.log(err);
  this.emit('end');
}