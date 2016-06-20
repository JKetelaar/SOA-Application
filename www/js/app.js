/**
 * @author JKetelaar
 */

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.flights', {
                url: '/flights',
                views: {
                    'tab-flights': {
                        templateUrl: 'templates/tab-flights.html',
                        controller: 'FlightsCtrl'
                    }
                }
            })
            .state('tab.flight-detail', {
                url: '/flights/:id',
                views: {
                    'tab-flights': {
                        templateUrl: 'templates/flight-detail.html',
                        controller: 'FlightDetailCtrl'
                    }
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('intro', {
                url: '/intro',
                templateUrl: 'templates/app-intro.html',
                controller: 'IntroCtrl'
            });

        $urlRouterProvider.otherwise('/intro');

    });
