var gulp = require('gulp');

var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    angularFilesort = require('gulp-angular-filesort'),
    eventStream = require('event-stream'),
    bowerFiles = require('main-bower-files'),
    order = require('gulp-order'),
    inject = require('gulp-inject'),
    filter = require('gulp-filter'),
    ngDeps = require('ng-dependencies'),
    connect = require('gulp-connect'),
    path = require('path'),
    fs = require("fs"),
    through = require('through2');


function NoopPlugin(file, encoding, done) {
    this.push(file);
    return done();
};

function gulpPlugin(){
    return through.obj(NoopPlugin);
}

module.exports = gulpPlugin;

const config = {
    distPath: './dist'
};

var appJsStream = gulp.src(['./src/**/*.js']).pipe(angularFilesort());

gulp.task('lint', function () {
    return appJsStream
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function () {
    return gulp.src('src/app.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.distPath));
});

gulp.task('js', function () {
    var jsFilter = filter('*.js');

    var appFiles = appJsStream
        .pipe(concat('app.js'));

    var allFiles = gulp.src(bowerFiles())
        .pipe(jsFilter)
        .pipe(concat('vendor.js'));


    return eventStream.concat(allFiles, appFiles)
        .pipe(order([
            "vendor.js",
            "app.js"
        ]))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.distPath));
});


gulp.task('injectIndex', function () {
    var builtSources = gulp.src(['./dist/app.js', './dist/app.css'], {
        read: false // do not read the files. This makes the task faster. We only need the file names
    });

    return gulp.src('./src/index.html')
        .pipe(inject(builtSources, {
            addRootSlash: false,
            ignorePath: 'dist'
        }))
        .pipe(gulp.dest(config.distPath));
});

gulp.task('connect', function () {
    connect.server({
        root: [config.distPath],
        port: 9000,
        livereload: true,
        middleware: function (connect, opt) {
            var Proxy = require('gulp-connect-proxy');
            opt.route = '/api';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
});

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}
function moduleNames(file, encoding, done) {
    const moduleDefinitions = ngDeps(file.contents).modules;
    for (var mod in moduleDefinitions) {
        if( moduleDefinitions.hasOwnProperty( mod ) ) {
            this.push(mod)
        }
    }
    //TODO: Now define the templateCacheForTheModule!!!
    return done();
}

function defineTemplateCacheForModule(){
    return through.obj(moduleNames);
}

module.exports = defineTemplateCacheForModule;

gulp.task("cacheTemplates", function(){
    getFolders("./src").map(function(folder) {
        return gulp.src(path.join("src", folder, "/*Module.js"))
            .pipe(defineTemplateCacheForModule());
    });
});

gulp.task("reload", function(){
    gulp.src(config.distPath + "/*")
        .pipe(connect.reload());
});

gulp.task('watch', ['connect'], function () {
    gulp.watch('./src/**/*.js', ['lint', 'js']);
    gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/index.html', ['injectIndex']);
    gulp.watch(config.distPath, ['reload']);
});

gulp.task('build', ['lint', 'sass', 'js', 'injectIndex']);
gulp.task('default', ['build', 'connect', 'watch']);

