module.exports = function (grunt) {

    grunt.registerTask('prepModuleTemplates', '...', function () {
        var ngtemplates = {};
        var camelCase = require('camelcase');

        // loop through our modules directory and create subtasks
        // for each module, modifying tasks that affect modules.
        grunt.file.expand("public/javascripts/*").forEach(function (path) {
            // add ngtemplate subtasks for each module, turning
            // all module partials into $templateCache objects
            var dirName = path.substr(path.lastIndexOf('/') + 1);
            if (!grunt.file.isDir(path) || dirName === 'config') {
                return;
            }
            // get the module name by looking at the directory we're in (camelCase it)
            var moduleName = camelCase(dirName);

            console.error("module", moduleName);
            ngtemplates[moduleName] = {
                module: moduleName,
                src: path + "/*.html",
                dest: 'public/templates/modules/' + moduleName + '/' + moduleName + '.templates.min.js'
            };
        });

        grunt.config.set('ngtemplates', ngtemplates);
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            uses_defaults: {}
        },

        concat: {
            dist: {
                src: ['public/app.js', 'public/javascripts/**/*.js'],
                dest: 'public/dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        jshint: {
            files: [
                '*.js',
                'public/javascripts/**/*.js',
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
                        'bower_components/angular-ui-router/release/angular-ui-router.js',
                        'public/*.js',
                        'public/javascripts/**/*Module.js', //module definitions first things in the modules
                        'public/javascripts/**/*!(Module).js',
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
                    "public/dist/<%= pkg.name %>.min.css": "public/stylesheets/*.less"
                }
            }
        },

        watch: {
            files: ['public/javascripts/**/*', 'public/javascripts/*', 'public/stylesheets/*.less'],
            tasks: ['less', 'prepModuleTemplates', 'ngtemplates', 'concat', 'uglify']
        },

        copy: {
            files: [
                // includes files within path
                {expand: true, cwd: 'public/javascripts', src: ['index.html'], dest: 'public/dist/', filter: 'isFile'}
            ]
        },

        clean: ['public/dist/']
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
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
