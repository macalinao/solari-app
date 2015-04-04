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

.factory('locks', function() {
  return [{
    name: 'Home',
    locked: true,
    auto: true
  }];
})

.controller('HomeCtrl', function($scope, $location, locks) {
  $scope.locks = locks;

  $scope.add = function() {
    $location.url('/add');
  };
})

.controller('AddCtrl', function($scope, $location) {
  $scope.back = function() {
    $location.url('/');
  };

  $ionicPlatform.ready(function() {
    $cordovaPlugin.someFunction().then(success, error);
  });
});
