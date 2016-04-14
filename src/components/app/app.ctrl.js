/**
 * Controller
 * AppCtrl
 */

const angular = require('angular');

angular
    .module('app')
    .controller('AppCtrl', Controller);


function Controller () {
    this.name = 'starter-angular';
}
