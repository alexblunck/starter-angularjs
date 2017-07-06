/**
 * Component: App
 */

class AppCtrl {

    $onInit() {
        this.name = 'starter-angular'
    }

}

export default {
    controller: AppCtrl,
    template: require('./app.html')
}
