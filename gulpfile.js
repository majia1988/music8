var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemap = require('gulp-sourcemaps'),
    autofixer = require('gulp-autoprefixer');
    

gulp.task('testless',function(){
	gulp.src('less/style.less')
	.pipe(less())//基于gulpfile.js的位置找到less文件并执行less
	.pipe(autofixer())
	.pipe(sourcemap.init())//初始化sourcemap
	.pipe(sourcemap.write('./'))//写入sourcemap
	.pipe( gulp.dest('css/') )//把less编译的css文件创建在css/目录下

})

gulp.task('lesswatch',function(){
	gulp.watch('less/*.less',['testless']);//设置监听

})


gulp.task('default',['testless','lesswatch']);  //执行默认任务testless