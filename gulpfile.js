var gulp = require('gulp'),
	//nunjucks
    njkRender = require('gulp-nunjucks-render'),
    prettify = require('gulp-html-prettify'),
	less       = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
	concat     = require('gulp-concat'),
	cleanCSS   = require('gulp-clean-css'),
	csso 	   = require('gulp-csso'), // Минификация CSS
	gulpif 	   = require('gulp-if'),
	svgSprite  = require('gulp-svg-sprite'),
	svgmin 	   = require('gulp-svgmin'),
	cheerio    = require('gulp-cheerio'), // Clear svg from elements like '&gt;'
	replace    = require('gulp-replace'),
	argv 	   = require('yargs').argv,
	debug 	   = require('gulp-debug'),
	prefixer   = require('gulp-autoprefixer');

// nunjucks from /src to build
gulp.task('nunjucks', function() {
    return gulp.src('./src/**.njk')
	.pipe( njkRender())
	.pipe( prettify({
	    indent_size : 4 // отступ - 4 пробела
		}))
	.pipe(gulp.dest(config.destDir + '/')
	);
});

// gulp.watch nunjucks
gulp.task('watchnjk', function() {
    gulp.watch(
		'./src/**/*.njk',
		gulp.parallel(['nunjucks'])
	);
});

//copy js
gulp.task('copyjs', function() {
	return gulp.src('./src/js/**/*.*')
		.pipe(gulp.dest( config.destDir + '/js') );

} );

//copy fonts
gulp.task('copyfonts', function() {
	return gulp.src('./src/fonts/**.*')
		.pipe(gulp.dest( config.destDir + '/fonts' ) );

} );

//copy images
gulp.task('copyimages', function() {
	return gulp.src('./src/images/**/**.*')
		.pipe(gulp.dest( config.destDir + '/images' ) );

} );

let
	config = {
		srcDir: './src/less',
		destDir: './build',
		stylePattern: '/**/*.+(less|css)'
	},
	app = {};

app.addStyle = function(paths, outputFilename) {
	return Promise.all([
		gulp.src(paths)
			.pipe(sourcemaps.init())
			.pipe(less())
			.pipe(debug({title: 'sass:'}))
			.pipe(prefixer())
			.pipe(concat(outputFilename))
			.pipe(debug({title: 'concat:'}))
			.pipe(gulpif(argv.prod, cleanCSS()))
			.pipe(csso({
				restructure: false,
				sourceMap: true,
				//debug: true
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest( config.destDir) )
	]);
};

gulp.task('styles', function() {
	return Promise.all([
		//less
		app.addStyle([
			config.srcDir+'/main.less',
		], 'css/style.css'),

	]);
});

//svg
gulp.task('svgSpriteBuild', function () {
	return gulp.src('./src/svg/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				//$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				//$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						scss: {
							dest:'./build/svg',
							//template: "./build/svg/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('./build/svg'));
});

//less
gulp.task('watch', function () {
	gulp.watch([
			config.srcDir + '/**/*.less',
			config.srcDir + '/**/*.css',
		],
		gulp.parallel('styles')
	)
});


gulp.task('watchjs', function () {
	gulp.watch([
			'./src/js/**/*.*',
		],
		gulp.parallel('copyjs')
	)
});

gulp.task('default',
	gulp.parallel(
		'copyfonts',
		'copyjs',
		'copyimages',
		'styles',
		'watch',
		'watchjs',
		'nunjucks',
		'watchnjk',
	)
);

























