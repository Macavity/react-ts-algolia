

module.exports = function(grunt) {
    "use strict";

    var path = require("path");

    var pkg = grunt.file.readJSON("package.json");

    var paths = {

        js: path.join("src", "js"),

        build: {
            js: path.join("build", "js"),
            css: path.join("build", "css"),
            images: path.join("build", "css", "images")
        }

    };

    var jsFiles = {
        script: path.join(paths.js, "app.ts"),

        build: {
            script: path.join(paths.build.js, "script.js")
        },
        min: {
            scriptDev: path.join(paths.build.js, "script.min.js")
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            script: {
                src: jsFiles.script,
                dest: jsFiles.build.script,
                options: {
                    plugin: ['tsify']
                }
            }


        },

        /*
         * Watches for changes in files and executes the tasks
         */
        watch: {

            /**
             * Watch for js changes during development and build Dev-Files
             */
            ts: {
                options: { cwd: paths.js },
                files: [ "**/*.ts", "**/*.tsx" ],
                tasks: [ "browserify:script" ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.loadNpmTasks("grunt-shell");

    /**
     * Default Build task
     */
    grunt.registerTask("default", [
        "css-dev",
        "scripts-dev"
    ]);

    grunt.registerTask("build", [
        "css-dev",
        "css-min",
        "scripts-min"
    ]);

    grunt.registerTask("build-search", [
        "browserify:search",
        "uglify:search"
    ]);

    // Used during development
    grunt.registerTask("test", function(){
        grunt.log.writeln("Path: "+path.join("_sass","js"));
    });
    /**
     * CSS: Production
     */
    grunt.registerTask("css-min", [
        "cssmin"
    ]);

    /**
     * CSS: Development
     */
    grunt.registerTask("css-dev", [
        "compass"
    ]);

    /**
     * Scripts: Production
     */
    grunt.registerTask("scripts-min", [
        "browserify:script",
        "uglify:script",
        "uglify:vendor"
    ]);

    /**
     * Scripts: Development
     */
    grunt.registerTask('scripts-dev', [
        "browserify:script",
        "uglify:vendor"
    ]);

    grunt.event.on("watch", function(action, filepath) {
        grunt.log.writeln(filepath + " has " + action);
    });
};
