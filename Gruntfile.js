"use strict";

module.exports = function( grunt ) {

  // Project configuration.
  grunt.initConfig( {

    // Metadata.
    pkg: grunt.file.readJSON( "data-events.jquery.json" ),
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // Task configuration.
    clean: {
      files: [ "dist" ]
    },
    concat: {
      options: {
        banner: "<%= banner %>",
        stripBanners: true
      },
      dist: {
        src: [ "src/jquery.<%= pkg.name %>.js" ],
        dest: "dist/jquery.<%= pkg.name %>.js"
      }
    },
    uglify: {
      options: {
        banner: "<%= banner %>"
      },
      dist: {
        src: "<%= concat.dist.dest %>",
        dest: "dist/jquery.<%= pkg.name %>.min.js"
      }
    },
    qunit: {
      files: [ "test/**/*.html" ]
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: "Gruntfile.js"
      },
      src: {
        src: [ "src/**/*.js" ]
      },
      test: {
        src: [ "test/**/*.js" ]
      }
    },
    watch: {
      gruntfile: {
        files: "<%= jshint.gruntfile.src %>",
        tasks: [ "jshint:gruntfile" ]
      },
      src: {
        files: "<%= jshint.src.src %>",
        tasks: [ "jshint:src", "qunit" ]
      },
      test: {
        files: "<%= jshint.test.src %>",
        tasks: [ "jshint:test", "qunit" ]
      }
    },
    jscs: {
        gruntfile: [ "Gruntfile.js" ],
        src: [ "src/**/*.js" ],
        test: [ "test/**/*.js" ]
    },
	yuidoc: {
		compile: {
			name: "<%= pkg.name %>",
			description: "<%= pkg.description %>",
			version: "<%= pkg.version %>",
			url: "<%= pkg.homepage %>",
			options: {
				paths: "./src",
				outdir: "docs/api"
			}
		}
	}
  } );

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-contrib-concat" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-contrib-qunit" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-jscs" );
  grunt.loadNpmTasks( "grunt-contrib-yuidoc" );

  // Default task.
  grunt.registerTask( "default", [ "jshint", "jscs", "qunit", "clean", "concat", "uglify",
                                  "yuidoc" ] );

  //Travis CI task
  grunt.registerTask( "travis", [ "jshint", "jscs", "qunit" ] );

};
