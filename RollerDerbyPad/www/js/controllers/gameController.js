rollerDerby.controller('gameController',
    function gameController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;

        $scope.addGame = function() {
            viewService.openModal('gameModal');
        };

    });
