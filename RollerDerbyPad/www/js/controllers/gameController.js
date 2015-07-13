rollerDerby.controller('gameController',
    function gameController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;

        var currentUser = dataService.getCurrentUser();

        $scope.addGame = function() {
            viewService.openModal('gameModal');
        };

        $scope.viewGame = function(game) {
            viewService.openModal('gameModal');
            $timeout(function() {
                $rootScope.$broadcast(messageService.messages.editGame, game);
            });
        };

        $scope.$on(messageService.messages.addGame, function(event, game) {
            //$scope.games.push(game);
            $scope.init();
        });

        $scope.$on(messageService.messages.gameInit, function(event, data) {
            $scope.init();
        });

        $scope.init = function() {
            dataService.getGames().then(function(games) {
                $timeout(function() {
                    $scope.games = games;
                    _.each($scope.games, function(game) {
                        $timeout(function() {
                            game.attributes.time = new Date(game.get("time"));
                        });

                    });
                }) ;
            });
        };

        $scope.init();

        $scope.games = [];
    });
