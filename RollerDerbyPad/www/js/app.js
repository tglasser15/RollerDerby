// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var rollerDerby = angular.module('rollerDerby', ['ionic'])
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider

      .state('index', {
        url: "/index",
        templateUrl: "templates/pages/home.html"
      })
      .state('login', {
        url: "/login",
        templateUrl: "templates/pages/login.html"
      })
      .state('register', {
        url: "/register",
        templateUrl: "templates/pages/register.html"
      })
      .state('home', {
        url: "/home",
        templateUrl: "templates/pages/home.html"
      })
      .state('teams', {
        url: "/teams",
        templateUrl: "templates/pages/teams.html"
      })
      .state('games', {
        url: "/games",
        templateUrl: "templates/pages/games.html"
      })
      ;
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/login');
    })

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    });
