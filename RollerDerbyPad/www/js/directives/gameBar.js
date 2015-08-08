rollerDerby.directive('gameBar', function ($location, $timeout, $rootScope, viewService, toastService, dataService, messageService, $ionicPopover) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/game-bar.html",
        controller: function($scope) {
            var self = 'gameBar';  // name of modal

        }
    };
});