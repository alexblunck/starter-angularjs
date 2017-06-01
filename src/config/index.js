/**
 * Module
 * app.config
 */

import angular from 'angular'

import defaultConfig from './default.config'
import statesConfig from './states.config'

angular
    .module('app.config', [])
    .config(defaultConfig)
    .config(statesConfig)

export default 'app.config'
