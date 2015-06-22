rollerDerby.controller('teamController',
    function teamController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;

        $scope.addTeam = function() {
              viewService.openModal('teamModal');
        };

    });
