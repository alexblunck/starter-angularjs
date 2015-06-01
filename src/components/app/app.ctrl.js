/**
 * Controller
 * components / app / AppCtrl
 */

var angular = require('angular');

 angular
     .module('app')
     .controller('AppCtrl', Controller);


function Controller (ApiService) {

    this.foo = 'starter-angular';

    ApiService.get();

}