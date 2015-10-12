'use strict';

var GulpConfig = (function() {
  function gulpConfigCtor() {
  this.source = './src';
  this.tsOutputPath = './js';
  this.allJavascript = './js/**/*.js';
  this.allTypescript = './src/**/*.ts';
  this.typings = './typings';
  this.libraryTypeScriptDefinitions = this.typings + '/**/*.ts';
  }
  return gulpConfigCtor;
})();

module.exports = GulpConfig;
