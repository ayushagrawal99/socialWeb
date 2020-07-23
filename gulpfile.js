// optimizing of assets mean compress or minifying the static files like css,js,images while sending them server to browser.
// compress file send faster, minifying files have no extra spaces available

// gulp has a number of library which perform diff-diff operations
const gulp = require('gulp');

// convert scss into css
const sass =  require('gulp-sass');
// now css file will compress in one line using cssnano
const cssnano = require('gulp-cssnano');
// it will rename the file with a # along with tha file name
const rev = require('gulp-rev');
// it is use for minifying the javaScript file
const uglify = require('gulp-uglify-es').default
// it will use for minifying the image file
const imagemin = require('gulp-imagemin')
// Since we’re generating files automatically, we’ll want to make sure that files that are no longer used don’t remain anywhere without us knowing.
// so we use del here
const del = require('del');


// now we create task for compress css files
gulp.task('css', function(done){
    console.log('minifying css...');
    // gulp.src() tell what files will use for perform the task
    gulp.src('./assets/scss/**/*.scss')
    // pipe function is used for calling all the sub-middleware function which we are declare here like sass,cssnano,rev
    // now we convert scss into css then compress the css file using sass,cssnano
    .pipe(sass())
    .pipe(cssnano())
    // now we put the compress file into a folder, so we define here destination folder
    .pipe(gulp.dest('./assets/css'));

    // <------ yaha tak humne scss file ko css mein convert kiya ab hm css file ka name change krenge ------>

    // now we change the name of the css file
    gulp.src('./assets/**/*.css')
    // it will attached a # or a string to the file
    .pipe(rev())
    // now we put the new (name changed) css file in public-assets folder
    .pipe(gulp.dest('./public/assets'))
    // now we create manifest. manifest is a file which have the old file and new file name as a key-value pair
    .pipe(rev.manifest({
        // cwd : 'public',     <-- this is Old command
        base:'./public/assets',
        merge : true
    }))
    // now we put all of this in this folder
    .pipe(gulp.dest('./public/assets'));
    done();
})

// for the production mode we change the assets path little bit we put assets folder in public folder. public -> assets -> (css,js,images)


// now we convert JS files. so we will do same work as we have done in css part
gulp.task('js', function(done){
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        base:'./public/assets',
        merge : true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
})


// now we convert images files. so we will do same work as we have done in css part
gulp.task('images', function(done){
    console.log('minifying images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')                // +(png|jpg|gif|svg|jpeg) it is a regular expression which matches the name
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        base:'./public/assets',
        merge : true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
})

// when we built a project then we clear the previous build assets and then build it from scratch so this fun will do empty the public asset directory
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
})

// this will run all 4 task by using a single command. gulp build
gulp.task('build', gulp.series('clean:assets','css','js','images'), function(done){
    console.log('Building assets...');
    done();
})
