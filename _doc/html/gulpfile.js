var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	concat = require('gulp-concat'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	gutil = require('gulp-util'),
	rename = require('gulp-rename'),
	del = require('del'),
	runSequence = require('run-sequence'),
	nib = require('nib'),
	axis = require('axis'),
	browserSync = require('browser-sync').create();


// =======================
// = Configure directories here =
// =======================
var path = {

	"src_css" : "src/assets/css/",
	"src_js" : "src/assets/js/",
	"src_img" : "src/assets/img/",
	"src_fonts" : "src/assets/fonts/",
	"src_data" : "src/assets/data/",
	"src_styl" : "src/assets/styl/",
	"src" : "src/",


	"wp_css" : "../../src/assets/css/",
	"wp_js" : "../../src/assets/js/",
	"wp_img" : "../../src/assets/img/",
	"wp_fonts" : "../../src/assets/fonts/",
	"wp" : "../../src/",

};

var path_development = 'localhost/miekl/'; // point to your project folder in localhost


// =========================
// = Compile stylus to css =
// =========================
gulp.task('stylus', function(){
	return gulp.src(path.src_styl + 'app.styl')
		.pipe(plumber({ errorHandler: function(err) {
			notify.onError({
				title: 'Gulp error in ' + err.plugin,
				message: err.toString()
			})(err);
			gutil.beep(); // play beep sound once
			this.emit('end');
		}}))
		.pipe(sourcemaps.init()) // Using gulp-sourcemaps
		.pipe(stylus({ // Using gulp-stylus
			paths:  ['node_modules'],
			import: ['jeet/stylus/jeet', 'nib', 'rupture/rupture'], // import jeet,nib,rupture
          	use: [nib(), axis()],
          	'include css': true
		}))
		.pipe(postcss([ autoprefixer() ]))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write('./maps')) // start write sourcemaps
		.pipe(gulp.dest(path.src_css))
		.pipe(gulp.dest(path.wp_css))
		//.pipe(gulp.dest(path.build_css))
		.pipe(browserSync.reload({ // browser sync
	     	stream: true
	    }))
});

// ===================
// = Gulp watch task =
// ===================
gulp.task('watch', ['browserSync', 'stylus', 'minify-app-js'], function(){
	gulp.watch(path.src_styl + '**/*.styl', ['stylus']);
	gulp.watch(path.src_js + '**/*.js', ['minify-app-js']);
});

// browsersync
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'src/'
		},
		files: [
			//'**/*.html',
			'**/*.php',
			'includes/**/*.php',
			path.src_js + '**/*.js',
			path.src_css + 'app.css'
		]
	})
});

// vendor js
gulp.task('concat-vendor-js', function(){
	return gulp.src(
		[
			path.src_js+'vendor/jquery.min.js', 
			path.src_js+'vendor/modernizr.js', 
			path.src_js+'vendor/*.js'
		])
		.pipe(concat('vendor.js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest(path.src_js))
		.pipe(gulp.dest(path.wp_js))
		//.pipe(gulp.dest(path.build_js))
});

// app js
gulp.task('minify-app-js', function(){
	return gulp.src([path.src_js + 'app.js'])
		.pipe(concat('app.js'))
	    .pipe(rename({
	    	suffix: '.min'
	    }))
	    .pipe(uglify())
	    .pipe(gulp.dest(path.src_js))
	    .pipe(gulp.dest(path.wp_js))
	    //.pipe(gulp.dest(path.build_js))
});

// ==========================
// = Optimizing images task =
// ==========================
gulp.task('images', function(){
	return gulp.src(path.src_img + '**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({ // create cache for images
			interlaced: true
		})))
		//.pipe(gulp.dest(path.build_img))
		.pipe(gulp.dest(path.wp_img))
});

 
// ===============
// = Clear cache =
// ===============
gulp.task('cache:clear', function (callback) {
	return cache.clearAll(callback)
});


// =============================
// = Copy fonts to build folder =
// =============================
gulp.task('fonts', function() {
  	return gulp.src(path.src_fonts + '**/*')
	//.pipe(gulp.dest(path.build_fonts))
	.pipe(gulp.dest(path.wp_fonts))
});



// =============================
// = Copy html to build folder =
// =============================
gulp.task('html', function() {
  	return gulp.src(path.src + '**/*.html')
	.pipe(gulp.dest(path.build))
});

// ===========================
// = Cleaning in build folder =
// ===========================
gulp.task('clean:build', function() {
  	return del.sync(path.build);
});


// ===============
// = Development =
// ===============
gulp.task('default', function(callback) {
  	runSequence('clean:build', ['stylus', 'concat-vendor-js', 'minify-app-js', 'images', 'fonts' , 'browserSync', 'watch'], callback)
})