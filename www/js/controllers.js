/**
 * @author JKetelaar
 */

angular.module('starter.controllers', [])

    .controller('DashCtrl', function ($scope) {
    })

    .controller('FlightsCtrl', function ($rootScope, $scope, $timeout, $ionicPopup, $ionicListDelegate, Flights, Airlines) {
        $scope.$on('$ionicView.enter', function (e) {
            load();
        });

        function load(search) {
            /* We're not using this, but maybe we could... */
            if (false) {
                if ($scope.lastload == null) {
                    $scope.lastload = Date.now();
                } else {
                    if (Date.now() - $scope.lastload < 500) {
                        return;
                    } else {
                        $scope.lastload = Date.now();
                    }
                }
            }

            Flights.all().success(function (response) {
                $rootScope.flights = response;
                var i = $rootScope.flights.length;
                while (i--) {
                    (function () {
                        var item = $rootScope.flights[i];

                        var date = new Date(item.time * 1000);

                        var hours = date.getHours();
                        var minutes = "0" + date.getMinutes();

                        item.formattedTime = ('0' + date.getDate()).slice(-2) + '/'
                            + ('0' + (date.getMonth() + 1)).slice(-2) + " " + hours + ':' + minutes.substr(-2);

                        Airlines.getInfo(item.airline).success(function (response) {
                            item.icon = response[0].icon;
                            item.airlineName = response[0].name;
                        });

                        if (search != null) {
                            var found = false;
                            if (!found) {
                                found = item.from.toLowerCase().indexOf(search.toLowerCase()) > -1;
                            }

                            if (!found) {
                                found = item.to.toLowerCase().indexOf(search.toLowerCase()) > -1;
                            }

                            if (!found) {
                                found = item.code.toLowerCase().indexOf(search.toLowerCase()) > -1;
                            }

                            if (!found && item.airlineName != null) {
                                found = item.airlineName.toLowerCase().indexOf(search.toLowerCase()) > -1;
                            }

                            if (!found) {
                                $rootScope.flights.splice(i, 1);
                            }
                        }
                    })();
                }
            });
        }

        $scope.doRefresh = function () {
            $timeout(function () {
                load();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        $scope.search = function () {
            load($scope.searchFlights);
        };

        $scope.clearSearch = function () {
            $scope.searchFlights = '';
        };

        $scope.track = function (flight) {
            $ionicListDelegate.closeOptionButtons();

            var alertPopup = $ionicPopup.alert({
                title: 'Tracking',
                template: ($rootScope.exists(flight) ? 'You stopped tracking flight ' : 'You started tracking flight ') + flight.code
            });

            alertPopup.then(function () {
                $rootScope.track(flight.id, !$rootScope.exists(flight));
            });
        };

        $rootScope.exists = function trackingExists(flight) {
            var flightId = flight.id;
            if ($rootScope.trackings === undefined) {
                $rootScope.trackings = [];
            }

            var length = $rootScope.trackings.length;

            for (var i = 0; i < length; i++) {
                if ($rootScope.trackings[i] === flightId) {
                    return true;
                }
            }
            return false;
        };

        $rootScope.track = function adjustTrack(flightId, track) {
            if ($rootScope.trackings === undefined) {
                $rootScope.trackings = [];
            }

            if (track) {
                $rootScope.trackings.push(flightId);
            } else {
                var i = $rootScope.trackings.length;
                while (i--) {
                    if ($rootScope.trackings[i] == flightId) {
                        $rootScope.trackings.splice(i, 1);
                        break;
                    }
                }
            }
        }
    })

    .controller('FlightDetailCtrl', function ($rootScope, $scope, $stateParams, Flights) {
        $scope.flight = Flights.get($rootScope.flights, $stateParams.id);
    })

    .controller('SettingsCtrl', function ($rootScope, $scope, $timeout) {
        $scope.settings = {
            automaticReporting: true
        };

        $scope.trackedFlights = [];

        $scope.$on('$ionicView.enter', function (e) {
            if ($rootScope.flights != null) {
                $rootScope.flights.forEach(function ($item) {
                    if ($rootScope.exists($item)) {
                        $item.tracking = true;
                        $scope.trackedFlights.push($item);
                    }
                });
            }
        });

        $scope.untrack = function (flight) {
            var i = $scope.trackedFlights.length;
            while (i--) {
                if (flight.id === $scope.trackedFlights[i].id) {
                    $timeout(function (i) {
                        $scope.trackedFlights.splice(i, 1);
                    }, 1000);
                    $rootScope.track(flight.id, false);
                    break;
                }
            }
        };
    })

    .controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {
        $scope.startApp = function () {
            $state.go('tab.dash');
        };
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };
    });
