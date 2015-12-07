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
    templateCache = require('gulp-angular-templatecache'),
    merge = require('merge-stream'),
    through = require('through2');

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


function endsWith(suffix){
    return this.substr(-suffix.length) === suffix
}
function getAllModuleFilesFromDirectoryAndAssertMaxOneModuleFile(dir) {
    var moduleFiles = fs.readdirSync(dir).filter(function (file) {
        return endsWith.bind(file)("Module.js");
    });
    if (moduleFiles.length > 1) {
        throw "More than 1 Module file (*Module.js) was found in the directory! That's not how we do things around here!";
    }
    return moduleFiles;
}
function getModuleFileFromDirectory(dir) {
    var moduleFiles = getAllModuleFilesFromDirectoryAndAssertMaxOneModuleFile(dir);
    return moduleFiles[0];
}

function containsModuleFile(dir){
    return getAllModuleFilesFromDirectoryAndAssertMaxOneModuleFile(dir).length === 1;
}
function getModuleFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory() && containsModuleFile(path.join(dir,file));
        });
}

function moduleNameFromDirectory(dir) {
    var file = getModuleFileFromDirectory(dir);
    var deps = ngDeps(file.contents);
    console.error("deps", deps);
    const moduleDefinitions = deps.modules;
    console.error("moduleFile:", moduleDefinitions);
    for (var moduleName in moduleDefinitions) {
        if (moduleDefinitions.hasOwnProperty(moduleName)) {
            return moduleName
        }
    }
}

function templatesStream() {
    var modules = getModuleFolders("./src");
    var moduleTasks = modules.map(function (folder) {
        return gulp.src(folder + '/*.html', {cwd: './src'})
            .pipe(templateCache({module: folder, root: folder}))//TODO: eventually make this grab the module name from angular, so it doesnt have to match exactly the directory.
            .pipe(concat("templates.js"))
            .pipe(gulp.dest(config.distPath));
    });
    return merge(moduleTasks)
}

gulp.task('js', function () {
    var jsFilter = filter('*.js');

    var appFiles = appJsStream
        .pipe(concat('app.js'));

    var allFiles = gulp.src(bowerFiles())
        .pipe(jsFilter)
        .pipe(concat('vendor.js'));


    return eventStream.concat(allFiles, appFiles, templatesStream() )
        .pipe(order([
            "vendor.js",
            "app.js",
            "templates.js"
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




gulp.task("reload", function () {
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

