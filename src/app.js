/**
 * app.js
 */

var bulk = require('bulk-require');
var angular = require('angular');

angular
    .module('app', []);

bulk(__dirname, ['components/**/*.js', 'shared/**/*.js']);