const gulp = require('gulp');

//converts Sass files to CSS
//Here we are requiring sass aswell, as gulp has no default sass compiler, so we have to define our own css compiler, either sass or node-sass
const sass = require('gulp-sass')(require('sass'));

//Minfies the CSS
const minify = require('gulp-clean-css');

//Pre-fixing the css
const prefix = require('gulp-autoprefixer');

const imagemin = require('gulp-imagemin');

//Revisions the file name
const rev = require('gulp-rev');

const terser = require('gulp-terser');
// const imagemin = require('gulp-imagemin');
const del = require('del');

//Creating a gulp task, in gulp each functionality is performed through a task
gulp.task('css', function (done) {
  console.log('minifying CSS');

  //Here we are defining the source folder of scss files. **/*.scss - means any folder inside scss folder containing any .scss file
  gulp
    .src('./assets/scss/**/*.scss')
    //Now we are telling gulp to convert scss to css, using sass compiler
    .pipe(sass())

    .pipe(prefix())
    //Now we are telling gulp to minify those css files
    .pipe(minify())
    //Now we are telling gulp to put those css files in the assets/css folder
    .pipe(gulp.dest('./assets/css'));

  // Task Callback - It tells the gulp that task has been completed
  done();
});

// Uglify JS
gulp.task('js', function (done) {
  console.log('minifying js...');
  // Here we are defining the source directory for performing task
  gulp
    .src('./assets/**/*.js')
    //We are using terser here to uglify our js
    .pipe(terser())
    //Now we are telling gulp to store the uglified js in public/assets folder
    .pipe(gulp.dest('./public/assets'));

  // Task Callback - It tells the gulp that task has been completed
  done();
});

// Compress Images
gulp.task('images', function (done) {
  console.log('compressing images...');
  gulp
    .src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/assets'));
  done();
});

gulp.task('rev', () =>
  // By default, Gulp would pick `assets/css` as the base,
  // so we need to set it explicitly:
  gulp
    .src(
      [
        'assets/css/*.css',
        'assets/js/*.js',
        'assets/images/*.{jpg,png,jpeg,gif}',
      ],
      { base: 'assets' }
    )
    //Now we are telling gulp to revision all the file names, by adding hashes to them
    .pipe(rev())

    //Now we are telling gulp to store the revisioned files in public/assets folder
    .pipe(gulp.dest('public/assets'))

    //Now we are telling the gulp to create a manifest for keeping record of revision of filenames
    .pipe(
      rev.manifest({
        cwd: 'public',
        merge: true, // Merge with the existing manifest if one exists
      })
    )
    //Now we tell gulp to store the manifest file inside the public/assets folder
    .pipe(gulp.dest('public/assets'))
);

// empty the public/assets directory
gulp.task('clean:assets', function (done) {
  // Deleting all data from public/assets directory
  del.sync('./public/assets');
  done();
});

// Instead of calling each task individually we created a task named build, which calls the tasks in series and we just have to call this individual task
gulp.task(
  'build',
  gulp.series('clean:assets', 'css', 'js', 'images', 'rev'),
  function (done) {
    console.log('Building assets');
    done();
  }
);

// gulp.task('default', ['clean:assets', 'css','js']);
