/**
 * Config
 * states
 */

/* @ngInject */
export default function config ($locationProvider, $urlRouterProvider, $stateProvider) {

    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

    $stateProvider
        .state('root', {
            url: '/',
            component: 'app'
        })

}
