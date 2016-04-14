/**
 * starter-angular
 * index.js
 */

const angular = require('angular');
const bulk = require('bulk-require');

angular
    .module('app', []);

bulk(__dirname, [
    'components/**/*.js',
    'shared/**/*.js'
]);
