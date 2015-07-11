// directive for editing an account
rollerDerby.directive('gameModal', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService, $ionicPopup) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/game-modal.html",
        controller: function($scope) {
            var self = 'gameModal';
            var currentUser = dataService.getCurrentUser();
            $scope.title = "Create a new game";

            $scope.states = dataService.states;

            $scope.game = {
                date: '',
                home: '',
                visitor: '',
                city: '',
                state: '',
                difference: 0,
                status: 'ready'
            };

            $scope.addGame = function(game) {
                dataService.registerTeam(game).then(function(game) {

                });
            };

            if (currentUser) {
                dataService.getTeams().then(function(user) {
                    $timeout(function() {
                        $scope.teams = user.get("teams");
                    });
                });
            };

            $scope.teams = [];
        }
    };
});
