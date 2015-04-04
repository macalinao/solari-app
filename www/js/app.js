angular.module('solari', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    templateUrl: 'templates/home.html',
    url: '/',
    controller: 'HomeCtrl'
  }).state('add', {
    templateUrl: 'templates/add.html',
    url: '/add',
    controller: 'AddCtrl'
  });

  $urlRouterProvider.otherwise('/');
})

.factory('locks', function($http) {
  var locks = [{
    name: 'Home',
    locked: true,
    auto: true
  }];

  setInterval(function() {
    locks.map(function(lock) {
      if (lock.manual) {
        $http.get('http://solari.azurewebsites.net/status').success(function(res) {
          lock.locked = JSON.parse(res);
        });
      }
    });
  }, 1000);

  return locks;
})

.controller('HomeCtrl', function($scope, $location, locks) {
  $scope.locks = locks;

  $scope.add = function() {
    $location.url('/add');
  };
})

.controller('AddCtrl', function($scope, $location, $cordovaGeolocation, locks, $ionicPlatform) {
  $scope.back = function() {
    $location.url('/');
  };

  $scope.lock = {
    locked: true,
    auto: true,
    manual: true
  };

  $scope.create = function() {
    locks.push($scope.lock);
    $location.url('/');
  };

  $ionicPlatform.ready(function() {
    var watchOptions = {
      frequency : 500,
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        // error
      },
      function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        $scope.pos = {
          lat: lat,
          long: long
        };
    });
  });

});
