'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var sanfranciscoConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    sanfrancisco: sanfranciscoConfig,
    watch: {
      less: {
        files: ['<%= sanfrancisco.app %>/styles/{,*/}*.less'],
        tasks: ['less']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= sanfrancisco.app %>/*.html',
          '{.tmp,<%= sanfrancisco.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= sanfrancisco.app %>}/scripts/{,*/}*.js',
          '<%= sanfrancisco.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= sanfrancisco.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= sanfrancisco.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= sanfrancisco.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= sanfrancisco.dist %>/*',
            '!<%= sanfrancisco.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    less: {
      dist: {
        files: {
          '<%= sanfrancisco.app %>/styles/main.css': ['<%= sanfrancisco.app %>/styles/main.less']
        },
        options: {
          sourceMap: true,
          sourceMapFilename: '<%= sanfrancisco.app %>/styles/main.css.map',
          sourceMapBasepath: '<%= sanfrancisco.app %>/',
          sourceMapRootpath: '/'
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
//            '<%= sanfrancisco.dist %>/maps/{,*/}*.json',
            '<%= sanfrancisco.dist %>/scripts/{,*/}*.js',
            '<%= sanfrancisco.dist %>/styles/{,*/}*.css',
            '<%= sanfrancisco.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= sanfrancisco.dist %>/fonts/{,*/}*.*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= sanfrancisco.app %>/index.html',
      options: {
        dest: '<%= sanfrancisco.dist %>'
      }
    },
    usemin: {
      html: ['<%= sanfrancisco.dist %>/{,*/}*.html'],
      css: ['<%= sanfrancisco.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= sanfrancisco.dist %>']
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= sanfrancisco.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= sanfrancisco.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= sanfrancisco.app %>',
          src: '*.html',
          dest: '<%= sanfrancisco.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= sanfrancisco.app %>',
          dest: '<%= sanfrancisco.dist %>',
          src: [
            '*.{ico,png,txt}',
            'fonts/{,*/}*.*',
            'maps/*.json',
            '.htaccess',
            'images/{,*/}*.{webp,gif}'
          ]
        }]
      },
      server: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= sanfrancisco.app %>/bower_components/font-awesome/fonts/',
          dest: '<%= sanfrancisco.app %>/fonts/font-awesome',
          src: ['*']
        }, {
          expand: true,
          dot: true,
          cwd: '<%= sanfrancisco.app %>/bower_components/bootstrap/fonts/',
          dest: '<%= sanfrancisco.app %>/fonts/glyphicons',
          src: ['*']
        }]
      }
    },
    concurrent: {
      dist: [
        'less',
        'htmlmin'
      ]
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less',
      'copy:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'less',
    'copy:server',
    'connect:test'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy:server',
    'useminPrepare',
    'concurrent',
    'cssmin',
    'concat',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
