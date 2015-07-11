// directive for editing an account
rollerDerby.directive('teamModal', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope) {
            var self = 'teamModal';

            $scope.title = 'Create a new team';

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
                if(viewService.validateAreaByFormName('teamForm')) {
                    dataService.registerTeam(team).then(function (team) {
                        dataService.addTeamToUser(team).then(function (user) {
                            dataService.setCurrentTeam((team));
                            $scope.closeModal();
                            $timeout(function () {
                                toastService.success(messageService.toast.registerTeam);
                                $rootScope.$broadcast(messageService.messages.regTeam);
                            });
                        });
                    }, function (error) {
                        toastService.error(messageService.toast.error(error));
                    });
                }
            };

            $scope.editTeam = function(team) {
                dataService.getTeam(team.id).then(function(parseTeam) {
                    dataService.updateTeam(team, parseTeam).then(function(editTeam) {
                        dataService.setCurrentTeam(editTeam);
                        $scope.closeModal();
                        $timeout(function() {
                            toastService.success(messageService.toast.updateTeamSuccess);
                            $rootScope.$broadcast(messageService.messages.teamInit, {message: true});
                        }, 1000);
                    });
                }, function(error) {
                    $timeout(function() {
                        toastService.error(messageService.toast.error(error));
                    });
                });
            };

            $scope.$on(messageService.messages.editTeam, function(event, editTeam) {
                $scope.team = {
                    id: editTeam.id,
                    teamName: editTeam.get("teamName"),
                    leagueName: editTeam.get("leagueName"),
                    ageGroup: editTeam.get("ageGroup"),
                    city: editTeam.get("city"),
                    state: editTeam.get("state"),
                    update: true
                };
                $scope.title = "Edit " + $scope.team.teamName;
            });

        }
    };
});
