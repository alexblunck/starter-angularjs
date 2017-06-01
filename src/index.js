/**
 * Module
 * app
 */

import angular from 'angular'
import router from '@uirouter/angularjs'

import config from './config'
import directives from './directives'
import services from './services'

angular
    .module('app', [
        router,
        config,
        directives,
        services
    ])
