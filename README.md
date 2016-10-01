# grunt-babel-helpers v1.0.0

> Consolidates Babel helper functions generated in a typical Browserify workflow.

This is a Grunt plugin to help consolidate the numerous and often duplicated
Babel helper functions that are created in a typical Browserify workflow.

There are several other modules/plugins out there that do similar things,
however they typically "require" a massive amount of dependencies that
ultimately bloat the final output.

This plugin simply aims to find all the helper functions and move them to the
top of the file, inside the UMD wrapper if one exists.


## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-babel-helpers --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-babel-helpers');
```

### Options
Below are some basic options to override the default behavior of this plugin.

#### helpers
Type: `Array` `Function`  
Default: Predefined list from the [babel-helpers](https://github.com/babel/babel/blob/master/packages/babel-helpers/src/helpers.js) module.

An array of Babel helper functions that should be consolidated.
Note: none of the Babel helper function should be prefixed with an underscore (_).

#### index
Type: `Number` `'after'` `'before'` `'replace'` `Function`  
Default: `'before'`

The character index to use for injecting the consolidated helpers.

This can be either a numeric value, a string value containing: `'after'`,
`'before'` or `'replace'` or a function that returns one of those values.

If the value is `'after'`, `'before'` or `'replace'` then it will attempt to
automatically determine the index position based on the above marker's
position.

If the value passed is invalid or if a position could not be determined
from the provided marker, then this option's value will default to `0`.

#### marker
Type: `RegExp` `String` `Function`  
Default: `/var\s+define,\s*module,\s*exports;?/`

The marker that determines where to inject the consolidated helpers.

#### prefix
Type: `String` `Function`  
Default: `'_'`

The prefix prepended to babel-helper functions.

### Usage example

```js
grunt.initConfig({
  babelHelpers: {
    dist: {
      src: 'dist/build.js'
    }
  }
});
```
