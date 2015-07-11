rollerDerby.controller('teamController',
    function teamController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;

        $scope.editTeam = function(team) {
            //console.log($scope.currentTeam);
            if(!jQuery.isEmptyObject(team)) {
                viewService.openModal('teamModal');
                $timeout(function() {
                    $rootScope.$broadcast(messageService.messages.editTeam, team);
                });
            } else {
                $timeout(function() {
                    toastService.general("Please select a team first");
                });
            }
        };

        $scope.addPlayer = function() {
            viewService.openModal('playerModal');
        };

        $scope.editPlayer = function(player) {
            if(!jQuery.isEmptyObject(player)) {
                viewService.openModal('playerModal');
                $timeout(function() {
                    $rootScope.$broadcast(messageService.messages.editPlayer, player);
                });
            } else {
                $timeout(function() {
                    toastService.general("Please select a player first");
                });
            }
        };

        $scope.viewStats = function(player) {
            console.log(player);
        };

        $scope.removeTeam = function(team) {
            dataService.removeTeamFromUser(team.id).then(function(user) {
                dataService.removeTeam(team).then(function(team) {
                    viewService.goToPage('/home');
                    $timeout(function () {
                        toastService.success(messageService.toast.teamRemoved);
                    }, 1000);
                });
            }, function(error) {
                $timeout(function() {
                    toastService.error(messageService.toast.error(error));
                });
            });
        };

        $scope.$on(messageService.messages.teamInit, function(event, data) {
            $scope.players = [];
            $scope.currentTeam = dataService.getCurrentTeam();
            console.log($scope.currentTeam);
            $scope.init();
        });

        $scope.$on(messageService.messages.addPlayer, function(event, player) {
            $scope.players.push(player);
            $scope.init();
        });

        $scope.showConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Remove Team',
                template: 'Are you sure you want to delete ' + $scope.currentTeam.get("teamName") + '?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $scope.removeTeam($scope.currentTeam);
                } else {
                    console.log('Do not delete team');
                }
            });
        };

        $scope.init = function() {
            dataService.getPlayers().then(function(players) {
                $timeout(function() {
                    $scope.players = players;
                });
            }, function(error) {
                $timeout(function() {
                    toastService.error(messageService.toast.error(error));
                });
            });
        };

        $scope.init();

        $scope.currentTeam = {};
        $scope.teams = [];
        $scope.players = [];
    });
