/**
 * Module: app
 */

import './index.scss'

import angular from 'angular'
import router from '@uirouter/angularjs'

import config from './config'
import constants from './constants'
import directives from './directives'
import filters from './filters'
import services from './services'

import AppComponent from './components/app/app'

angular
    .module('app', [
        router,
        config,
        constants,
        directives,
        filters,
        services
    ])
    .component('app', AppComponent)

angular.bootstrap(document, ['app'])
