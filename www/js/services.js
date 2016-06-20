/**
 * @author JKetelaar
 */

angular.module('starter.services', [])

    .factory('Flights', function ($http) {

        return {
            all: function () {
                return $http.get('http://soa.jketelaar.nl/flights?_sort=time');
            },
            track: function (flight) {

            },
            get: function (flights, flightId) {
                for (var i = 0; i < flights.length; i++) {
                    if (flights[i].id === parseInt(flightId)) {
                        return flights[i];
                    }
                }
                return null;
            }
        };
    })

    .factory('Airlines', function ($http) {
        return {
            all: function () {
                return $http.get('http://soa.jketelaar.nl/airlines');
            },
            getInfo: function (airlineId) {
                return $http.get('http://soa.jketelaar.nl/airlines?id=' + airlineId);
            }
        };
    });