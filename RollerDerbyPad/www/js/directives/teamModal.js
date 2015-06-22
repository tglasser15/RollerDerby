// directive for editing an account
rollerDerby.directive('teamModal', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope) {
            var self = 'teamModal';

            $scope.states = dataService.states;
            $scope.ageGroup = dataService.ageGroup;

            var currentUser = dataService.getCurrentUser();

            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            $scope.team = {
                teamName: '',
                leagueName: '',
                ageGroup: '',
                city: '',
                state: ''
            };

            $scope.registerTeam = function(team) {
                dataService.registerTeam(team).then(function(team) {
                    toastService.success(messageService.toast.registerTeam);
                    $scope.closeModal();
                }, function(error) {
                    toastService.error(messageService.toast.error(error));
                });
            };

            $scope.$on(messageService.messages.teamInit, function(event, modal) {
                $timeout(function() {
                    console.log(modal);
                });

            });

        }
    };
});
