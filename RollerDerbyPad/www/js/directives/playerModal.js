// directive for editing an account
rollerDerby.directive('playerModal', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService, $ionicPopup) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/player-modal.html",
        controller: function($scope) {
            var self = 'playerModal';

            $scope.title = 'Create a new player';

            $scope.states = dataService.states;

            var currentUser = dataService.getCurrentUser();

            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            $scope.player = {
                name: '',
                number: '',
                firstName: '',
                lastName: '',
                city: '',
                state: ''
            };

            $scope.registerPlayer = function(player) {
                if(viewService.validateAreaByFormName('playerForm')) {
                    dataService.registerPlayer(player).then(function (player) {
                        $scope.closeModal();
                        $timeout(function() {
                            toastService.success(messageService.toast.registerPlayer);
                            $rootScope.$broadcast(messageService.messages.addPlayer, player);
                        }, 1000);
                    }, function(error) {
                        $timeout(function() {
                            toastService.error(messageService.toast.error(error));
                        });
                    });
                }
            };

            $scope.editPlayer = function(player) {
                dataService.getPlayer(player.id).then(function(parsePlayer) {
                    dataService.updatePlayer(player, parsePlayer).then(function(editPlayer) {
                        $scope.closeModal();
                        $timeout(function() {
                            toastService.success(messageService.toast.updatePlayerSuccess);
                            $rootScope.$broadcast(messageService.messages.teamInit, {message: true});
                        }, 1000);
                    });
                }, function(error) {
                    $timeout(function() {
                        toastService.error(messageService.toast.error(error));
                    });
                });
            };

            $scope.removePlayer = function(playerId) {
                dataService.getPlayer(playerId).then(function(player) {
                    dataService.removePlayer(player).then(function(player) {
                        $scope.closeModal();
                        $timeout(function() {
                            toastService.success(messageService.toast.playerRemoved);
                            $rootScope.$broadcast(messageService.messages.teamInit);
                        }, 1000);
                    });
                }, function(error) {
                    $timeout(function() {
                        toastService.error(messageService.toast.error(error));
                    });
                });
            };

            $scope.$on(messageService.messages.editPlayer, function(event, editPlayer) {
                $scope.player = {
                    id: editPlayer.id,
                    name: editPlayer.get("name"),
                    number: editPlayer.get("playerNumber"),
                    firstName: editPlayer.get("firstName"),
                    lastName: editPlayer.get("lastName"),
                    city: editPlayer.get("city"),
                    state: editPlayer.get("state"),
                    update: true
                };
                $scope.title = "Edit " + $scope.player.name;
            });

            $scope.showConfirm = function(player) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Remove Player',
                    template: 'Are you sure you want to delete ' + player.name + '?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $scope.removePlayer(player.id);
                    } else {
                        console.log('Do not delete team');
                    }
                });
            };
        }
    };
});
