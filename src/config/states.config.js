/**
 * Config
 * states
 */

import AppCtrl from '../components/app/app.ctrl'

/* @ngInject */
export default function config ($locationProvider, $urlRouterProvider, $stateProvider) {

    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/home')

    $stateProvider
        .state('root', {
            url: '/',
            template: require('../components/app/app.html'),
            controller: AppCtrl,
            controllerAs: '$ctrl'
        })

}
