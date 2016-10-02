'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
    ' * <%= pkg.title || pkg.name %> v<%= pkg.version %><%= pkg.homepage ? " (" + pkg.homepage + ")" : "" %>\n' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
    ' * Licensed under <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)\n' +
    ' */',
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      js: ['Gruntfile.js', 'tasks/**/*.js']
    },
    usebanner: {
      replace: {
        options: {
          banner: '<%= banner %>',
          linebreak: false,
          position: 'top',
          replace: true
        },
        files: {
          src: ['tasks/**/*.js']
        }
      }
    }
  });

  // Load the grunt tasks.
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['eslint', 'usebanner']);

};
