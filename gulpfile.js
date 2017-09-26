var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');
var uglifycss = require('gulp-uglifycss');
var rev = require('gulp-rev');
var rimraf = require('gulp-rimraf');

// 删除旧的构建文件
gulp.task('clean', function() {
    return gulp.src('assets', { read: false })
        .pipe(rimraf());
});

// 处理JS
gulp.task('scripts', ['clean'], function() {
    return gulp.src('script/app/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('assets/script'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('assets/script'))
});

// 处理CSS
gulp.task('csss', ['clean'], function() {
    return gulp.src('css/style.css')
        .pipe(concatCss('main.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('assets/css'))
});

// 为独立CSS添加版本号
gulp.task('css-single', ['clean', 'csss'], function() {
    return gulp.src(['css/wuhan.css', 'css/taizhou.css'])
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('assets/css'))
});

// 为CSS文件添加版本号
gulp.task('css-rev', ['css-single'], function() {
    return gulp.src(['assets/css/*'])
        .pipe(rev())
        .pipe(gulp.dest('assets/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('assets/css'))
});

// 移动字体等静态文件
gulp.task('move', ['clean'], function() {
    return gulp.src(['images/**/*', 'font/**/*', 'media/**/*'], {base:"."})
        .pipe(gulp.dest('assets'));

});

// 优化图片
gulp.task('images', ['clean'], function () {
    return gulp.src('images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('assets/images'));
});

// 为html模版添加版本号
gulp.task('views', ['clean'], function() {
    return gulp.src(['views/**/*'])
        .pipe(rev())
        .pipe(gulp.dest('assets/views'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('assets/views'))
});


gulp.task('default', function() {
    gulp.run('clean', 'scripts', 'csss', 'css-single', 'css-rev', 'views', 'move');

    // 监听文件变化
    // gulp.watch('script/app/*.js', function(){
    //     gulp.run('scripts');
    // });

    // // 监听文件变化
    // gulp.watch('css/style.css', function(){
    //     gulp.run('csss');
    // });
});