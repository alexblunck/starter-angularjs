/**
 * Service
 * shared / services / ApiService
 */

var angular = require('angular');

angular
    .module('app')
    .factory('ApiService', ApiService);


function ApiService () {

    var service = {
        get: get
    };
    return service;

    //////////////////////////////

    function get () {
        console.log('ApiService.get');
    }

}