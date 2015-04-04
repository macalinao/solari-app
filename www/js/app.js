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

.controller('HomeCtrl', function($scope, $location, locks, $http, $ionicPlatform, $cordovaGeolocation) {
  $scope.locks = locks;

  $scope.add = function() {
    $location.url('/add');
  };

  $scope.update = function(lock) {
    if (lock.manual) {
      if (lock.locked) {
        $http.post('http://solari.azurewebsites.net/on').success(function() {
          // pass
        });
      } else {
        $http.post('http://solari.azurewebsites.net/off').success(function() {
          // pass
        });
      }
    }
  };

  $ionicPlatform.ready(function() {
    console.log('ready for cordova');
    var watchOptions = {
      frequency : 500,
      timeout : 10000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        console.log(err);
        // error
      },
      function(position) {
        console.log(position);
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        $scope.pos = {
          lat: lat,
          long: long
        };
    });
  });

  $scope.dist = function(item) {
    if (!$scope.pos || !item.lat) return '';
    return '(' + (distance($scope.pos.lat, $scope.pos.long, item.lat, item.long, 'K') * 1000) + 'm away)';
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
    console.log('ready for cordova');
    var watchOptions = {
      frequency : 500,
      timeout : 10000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        console.log(err);
        // error
      },
      function(position) {
        console.log(position);
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        $scope.lock.lat = lat;
        $scope.lock.long = long;
    });
  });

});

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
}
