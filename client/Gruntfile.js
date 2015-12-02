module.exports = function (grunt) {

    grunt.registerTask('prepModuleTemplates', '...', function () {
        var ngtemplates = {};
        var camelCase = require('camelcase');

        // loop through our modules directory and create subtasks
        // for each module, modifying tasks that affect modules.
        grunt.file.expand("src/*").forEach(function (path) {
            // add ngtemplate subtasks for each module, turning
            // all module partials into $templateCache objects
            if (!grunt.file.isDir(path)) {
                return;
            }
            // get the module name by looking at the directory we're in (camelCase it)
            var moduleName = camelCase(path.substr(path.lastIndexOf('/') + 1));

            console.error("module", moduleName);
            ngtemplates[moduleName] = {
                module: moduleName,
                src: path + "/*.html",
                dest: 'temp/modules/' + moduleName + '/' + moduleName + '.templates.min.js'
            };
        });

        grunt.config.set('ngtemplates', ngtemplates);
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        jshint: {
            files: [
                '*.js',
                'src/**/*.js',
                'test/**/*.js'
            ]
        },

        karma: {
            unit: {
                options: {
                    browsers: ['Chrome'],
                    frameworks: ['jasmine'],
                    files: [
                        'bower_components/angular/angular.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                        '*.js',
                        'src/**/*Module.js', //module definitions first things in the modules
                        'src/**/*!(Module).js',
                        'test/**/*!(Spec).js', //test helpers before tests
                        'test/**/*Spec.js'
                    ],
                    reporters: ['progress'],
                    singleRun: true,
                    junitReporter: {
                        outputFile: 'test-results.xml'
                    }
                }
            }
        },

        less: {
            build: {
                options: {
                    compress: true,
                    sourceMap: true
                },
                files: {
                    "dist/<%= pkg.name %>.min.css": "assets/stylesheets/*.less"
                }
            }
        },

        watch: {
            files: ['src/**/*', 'src/*', 'assets/stylesheets/*.less'],
            tasks: ['less', 'prepModuleTemplates', 'ngtemplates', 'concat', 'uglify']
        },

        copy: {
            files: [
                // includes files within path
                {expand: true, cwd: 'src', src: ['index.html'], dest: 'dist/', filter: 'isFile'}
            ]
        },

        clean: ['dist/']
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('compile', ['jshint', 'less', 'prepModuleTemplates', 'ngtemplates', 'concat', 'uglify']);
    grunt.registerTask('test', ['jshint', 'prepModuleTemplates', 'karma']);
    grunt.registerTask('build', ['compile', 'test']);
    grunt.registerTask('default', ['build']);
};
