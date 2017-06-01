/**
 * Module
 * app
 */

import angular from 'angular'
import router from '@uirouter/angularjs'

import config from './config'
import constants from './constants'
import directives from './directives'
import filters from './filters'
import services from './services'

angular
    .module('app', [
        router,
        config,
        constants,
        directives,
        filters,
        services
    ])
