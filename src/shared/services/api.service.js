/**
 * Service
 * ApiService
 */

const angular = require('angular');

angular
    .module('app')
    .factory('ApiService', ApiService);


function ApiService () {

    let service = {
        get: get
    };
    return service;

    //////////////////////////////

    function get () {
        console.log('ApiService.get');
    }

}