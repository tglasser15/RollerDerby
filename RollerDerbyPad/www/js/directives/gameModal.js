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

            $scope.closeModal = function() {
                $timeout(function() {
                    viewService.closeModal(self);
                    $rootScope.$broadcast(messageService.messages.gameInit);
                });

            };

            $scope.addGame = function(game) {
                if (viewService.validateAreaByFormName('gameForm')) {
                    //$scope.error.status = false;
                    dataService.registerGame(game).then(function(game) {
                        viewService.closeModal(self);
                        $timeout(function() {
                            toastService.success(messageService.toast.registerGame);
                            $rootScope.$broadcast(messageService.messages.addGame, game);
                        }, 1000);
                    }, function(error) {
                        $timeout(function() {
                            toastService.success(messageService.toast.error(error));
                        });
                    });
                } else {
                    $scope.error = {
                        status: true,
                        msg: 'Please fill out all required fields'
                    }
                }
            };

            $scope.editGame = function(game) {
                //console.log($scope.teams);
                $scope.formDisabled = false;
                $scope.title = "Edit Game";
            };

            $scope.startGame = function() {
                console.log($scope.game);
            };

            $scope.saveChanges = function(game) {
                dataService.getGame(game.id).then(function(parseGame) {
                    dataService.updateGame(game, parseGame).then(function(game) {
                        $timeout(function() {
                            $scope.init(game);
                            $scope.formDisabled = true;
                            $scope.title = "Game Preview";
                        });

                    });
                }, function(error) {
                    toastService.error(messageService.toast.error(error));
                });
            };

            $scope.removeGame = function() {
                dataService.getGame($scope.game.id).then(function(parseGame) {
                    dataService.removeGame(parseGame).then(function(game) {
                        viewService.closeModal(self);
                        $timeout(function() {
                            toastService.success(messageService.toast.gameRemoved);
                            $rootScope.$broadcast(messageService.messages.gameInit);
                        }, 1000);
                    });
                }, function(error) {
                    $timeout(function() {
                        toastService.error(messageService.toast.error(error));
                    });
                });
            };

            $scope.$on(messageService.messages.editGame, function(event, game) {
                $scope.title = "Game Preview";
                $scope.init(game);
                //console.log($scope.game.home);
                $scope.formDisabled = true;
            });

            $scope.showRemoveConfirm = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Remove Game',
                    template: 'Are you sure you want to delete this game?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $scope.removeGame();
                    } else {
                        console.log('Do not delete team');
                    }
                });
            };

            $scope.showStartConfirm = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Start Game',
                    template: 'Are you sure you want to start this game?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $scope.startGame();
                    } else {
                        console.log('Do not delete team');
                    }
                });
            };

            $scope.init = function(game) {
                $scope.game = {
                    id: game.id,
                    date: game.get("date"),
                    time: new Date(game.get("time")),
                    homeName: game.get("homeTeam").get("teamName"),
                    home: game.get("homeTeam"),
                    visitor: game.get("visitorTeam"),
                    city: game.get("city"),
                    state: game.get("state"),
                    difference: 0,
                    status: 'ready',
                    update: true
                };
            };

            if(currentUser) {
                dataService.getTeams().then(function (user) {
                    $timeout(function () {
                        $scope.teams = user.get("teams");
                    });
                });
            }

            $scope.game = {};
            $scope.teams = [];
            $scope.formDisabled = false;

            $scope.game = {
                date: '',
                time: '',
                home: '',
                visitor: '',
                city: '',
                state: '',
                difference: 0,
                status: 'ready'
            };
        }
    };
});
