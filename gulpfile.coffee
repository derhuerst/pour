path		= require 'path'
gulp		= require 'gulp'
gutil		= require 'gulp-util'
fs			= require 'fs'

concat		= require 'gulp-concat'
buffer		= require 'gulp-buffer'
header		= require 'gulp-header'
size		= require 'gulp-size'
rename		= require 'gulp-rename'
browserify	= require 'browserify'
source		= require 'vinyl-source-stream'

streamify	= require 'gulp-streamify'
uglify		= require 'gulp-uglify'

gzip		= require 'gulp-gzip'

rimraf		= require 'gulp-rimraf'


# package metadata
pkg = require './package.json'




gulp.task 'concat', () ->
	return gulp.src './src/*.js'
	.pipe concat "#{pkg.name}.js", newLine: '\n\n'
	.pipe gulp.dest './src'




gulp.task 'build', ['concat'], () ->
	return browserify
		entries: "./src/#{pkg.name}.js"
		standalone: pkg.name
		noparse: true
		hasExports: false
	.bundle()
	.pipe source "#{pkg.name}.js"
	.pipe buffer()
	.pipe header '// ' + [
		pkg.name
		pkg.author.name,
		"v#{pkg.version}",
		pkg.homepage
	].join(' | ') + '\n\n\n\n\n\n'
	.pipe gulp.dest './dist'




gulp.task 'minify', ['build'], () ->
	return gulp.src "./dist/#{pkg.name}.js"
	.pipe streamify uglify
		compress:
			unsafe: true
			pure_getters: true
	.pipe rename "#{pkg.name}.min.js"
	.pipe buffer()
	.pipe header '// ' + [
		pkg.name
		pkg.author.name,
		"v#{pkg.version}"
	].join(' | ') + '\n\n'
	.pipe gulp.dest './dist'




gulp.task 'gzip', ['minify'], () ->
	return gulp.src "./dist/#{pkg.name}.min.js"
	.pipe gzip
		gzipOptions:
			level: 9    # highest compression
	.pipe gulp.dest './dist'




gulp.task 'cleanup', ['build'], () ->
	return gulp.src "./src/#{pkg.name}.js", read:false
	.pipe rimraf()




gulp.task 'default', ['concat', 'build', 'minify', 'gzip', 'cleanup'], () ->
	gulp.src ["./dist/*"]
	.pipe size
		showFiles: true