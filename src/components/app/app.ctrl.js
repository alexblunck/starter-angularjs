/**
 * Controller
 * AppCtrl
 */

const angular = require('angular');

angular
    .module('app')
    .controller('AppCtrl', Controller);


function Controller (ApiService) {

    this.foo = 'starter-angular';

    ApiService.get();

}