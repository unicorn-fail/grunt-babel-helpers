/*
 * grunt-babel-helpers
 * https://github.com/unicorn-fail/grunt-babel-helpers
 *
 * Copyright (c) 2016 Mark Carver
 * Licensed under the MIT license.
 */

var chalk = require('chalk');
var helpers = require('babel-helpers');
var maxmin = require('maxmin');

'use strict';
module.exports = function(grunt) {

  grunt.registerMultiTask('babelHelpers', function () {
    var options = this.options({

      /**
       * An array of Babel helper functions to consolidate.
       *
       * Note: none of the Babel helper function should be prefixed with an
       * underscore (_).
       *
       * @type {Array|Function}
       */
      helpers: helpers.list,

      /**
       * The character index to use for injecting the consolidated helpers.
       *
       * This can be either a numeric value, a string value containing: "after",
       * "before" or "replace" or a function that returns one of those values.
       *
       * If the value is "after", "before" or "replace" then it will attempt to
       * automatically determine the index position based on the above marker's
       * position.
       *
       * If the value passed is invalid or if a position could not be determined
       * from the provided marker, then this value will default to 0.
       *
       *
       * @type {Number|'after'|'before'|'replace'|Function}
       */
      index: 'before',

      /**
       * The marker that determines where to inject the consolidated helpers.
       *
       * @type {RegExp|String|Function}
       */
      marker: /var\s+define,\s*module,\s*exports;?/,

      /**
       * The prefix prepended to babel-helper functions.
       * @type {String|Function}
       */
      prefix: '_'

    });

    if (!options.helpers.length) {
      grunt.fail.fatal('There must be at least one Babel helper function passed to the "helpers" option.');
      return;
    }

    var createdFiles = 0;

    // Iterate over all src-dest file pairs.
    this.files.forEach(function (file) {
      // Ensure there are valid source file(s).
      var src = [].concat(file.src).filter(function (filepath) {
        if (!filepath || !grunt.file.exists(filepath)) {
          grunt.log.warn('Source file ' + chalk.cyan(filepath) + ' not found');
          return false;
        }
        return true;
      });

      var source = '';
      for (var i = 0, l = src.length; i < l; i++) {
        source += grunt.file.read(src[i]);
      }

      // Allow the destination file to be the source file only if there's one.
      var destination = file.dest;
      if (!destination) {
        if (src.length === 1) {
          destination = src[0];
        }
        else {
          return grunt.fail.fatal('Multiple files were specified without any valid destination.');
        }
      }

      var original = source;

      // Normalize the marker option.
      var marker = options.marker;
      if (typeof marker === 'function') {
        marker = marker.call(this, source);
      }

      // Convert standalone strings or numbers into a regular expression.
      if (typeof marker === 'string' || typeof marker === 'number') {
        marker = new RegExp(marker);
      }

      // Ensure marker is a regular expression.
      if (!(marker instanceof RegExp)) {
        marker = false;
      }

      // Normalize the index option.
      var index = 0;
      if (marker) {
        index = options.index;
        if (typeof index === 'function') {
          index = index.call(this, source);
        }
        if (typeof index === 'string') {
          var before = source.search(marker);
          if (before !== -1) {
            if (index === 'after') {
              var after = source.match(marker);
              before += after ? after[0].length : 0;
            }
            else if (index === 'replace') {
              source.replace(marker, '');
            }
            index = before;
          }
        }
      }
      if (typeof index !== 'number' || index === -1) {
        index = 0;
      }

      var prefix = options.prefix;
      if (typeof prefix === 'function') {
        prefix = prefix.call(this, source);
      }
      if (typeof prefix !== 'string') {
        prefix = false;
      }

      // Keep track of found helpers and remove them from the source.
      var count = {};
      var found = {};
      var prefixRegex = prefix ? prefix + '?' : '';
      var regex = new RegExp('^(?:var|function)\\s(' + prefixRegex + options.helpers.join('|' + prefixRegex) + ')[^\\n]*\\n?$', 'gm');
      source = source.replace(regex, function (string, name) {
        // Remove the prefix from the matched name.
        if (prefix) {
          name = name.replace(new RegExp('^' + prefix), '');
        }
        found[name] = string;
        if (!count[name]) {
          count[name] = 0;
        }
        count[name]++;
        return '';
      });

      // If there were no found helpers, just return.
      if (!Object.keys(found).length) {
        grunt.verbose.writeln('There are no Babel helper functions found in ' + chalk.cyan(file.src) + ', skipping.');
        return;
      }

      // Inject the helpers at the specified index, if any.
      var total = 0;
      var output = index ? source.substr(0, index) + '\n' : '';
      for (var i in found) {
        if (found.hasOwnProperty(i)) {
          output += found[i];
          total += count[i];
          grunt.verbose.writeln('Found ' + chalk.green(count[i]) + ' ' + chalk.cyan(i) + ' Babel helper ' + grunt.util.pluralize(count[i], 'function/functions'));
        }
      }
      output +=  '\n' + (index ? source.substr(index) : source);

      var outputSize = maxmin(original, output, true);
      grunt.verbose.writeln('Consolidated ' + chalk.green(total) + ' → ' + chalk.green(Object.keys(found).length) + ' Babel helper ' + grunt.util.pluralize(total, 'function/functions') + ' ' + outputSize);

      // Write to the destination file.
      grunt.file.write(destination, output);

      createdFiles++;
    });

    grunt.log.ok(createdFiles + ' ' + grunt.util.pluralize(createdFiles, 'file/files') + ' created.');

  });


};
