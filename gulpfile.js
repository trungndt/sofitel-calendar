var gulp = require('gulp');
var sass = require('gulp-sass');
var haml = require('gulp-haml');

gulp.task('sass', function () {
    return gulp.src(['assets/scss/**/*.scss'])
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .on('error', onError)
        .pipe(gulp.dest('assets/css'))
});

// Get one .haml file and render 
gulp.task('haml-one', function () {
  gulp.src('./haml/index.haml')
    .pipe(haml())
    .pipe(gulp.dest('.'));
});
 
// Get all .haml files in one folder and render 
gulp.task('haml', function () {
  return gulp.src('haml/**/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('./html'));
});

gulp.task('watch', function () {
    gulp.watch('assets/scss/**/*.scss', ['sass']);
    // Other watchers
    gulp.watch('haml/**/*.haml', ['haml', 'haml-one']);
});
 
gulp.task('default', function () {
    // gulp.watch('assets/scss/**/*.scss', ['sass']);
    gulp.run('watch');
    // Other watchers
});


function onError(err) {
    console.log(err);
    this.emit('end');
}