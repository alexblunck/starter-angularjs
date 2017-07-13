/**
 * Component: App
 */

import icon from '../../assets/icon.svg'

class AppCtrl {

    /* @ngInject */
    constructor($element) {
        const elem = $element[0].querySelector('.icon')
        elem.innerHTML = icon
    }

    $onInit() {
        this.name = 'starter-angular'
    }

}

export default {
    controller: AppCtrl,
    template: require('./app.html')
}
