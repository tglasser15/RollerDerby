rollerDerby.directive('navBar', function ($location, $timeout, $rootScope, viewService, toastService, dataService, messageService, $ionicPopover) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/nav-bar.html",
        controller: function($scope) {
            var self = 'navBar';  // name of modal

            // closing the modal
            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            $scope.teamPage = function(path) {
                viewService.goToPage(path);
                //$timeout(function() {
                //    $rootScope.$broadcast(messageService.messages.teamInit, {message: false});
                //});
            };

            $scope.selectTeam = function(team) {
                $scope.closePopover();
                dataService.setCurrentTeam(team);
                viewService.goToPage('/teams');
                $timeout(function() {

                    $rootScope.$broadcast(messageService.messages.teamInit);
                });
            };

            $scope.createTeam = function() {
                $scope.closePopover();
                viewService.openModal('teamModal');
            };

            $scope.editAccount = function() {
                viewService.openModal('accountModal');
            };

            $scope.logOut = function() {
                dataService.logOut();
            };

            $scope.$on(messageService.messages.regTeam, function(event, data) {
                console.log(dataService.getCurrentTeam());
                $scope.teams.push(dataService.getCurrentTeam());
            });

            $scope.init = function() {
                //if (dataService.getCurrentUser()) {
                    dataService.getTeams().then(function(user) {
                        $scope.teams = user.get("teams");
                        //console.log($scope.teams);
                    });
                //}
            };

            // popup stuff
            var template = '<ion-popover-view>' +
                                '<ion-header-bar>' +
                                    '<h1 class="title pop"> Select a team</h1>' +
                                '</ion-header-bar>' +
                                '<ion-content>' +
                                    '<a class="item item-icon-left pop" ng-click="selectTeam(team)" ng-repeat="team in teams">' +
                                        '<i class="icon ion-arrow-right-b pop"></i>' +
                                            '{{team.get("teamName")}}' +
                                    '</a>' +
                                    '<a class="item item-icon-left pop" ng-click="createTeam(team)">' +
                                        '<i class="icon ion-plus"></i>' +
                                        'Create a new team' +
                                    '</a>' +
                                '</ion-content>' +
                            '</ion-popover-view>';

            $scope.popover = $ionicPopover.fromTemplate(template, {
                scope: $scope
            });

            // .fromTemplateUrl() method
            //$ionicPopover.fromTemplateUrl('my-popover.html', {
            //    scope: $scope
            //}).then(function(popover) {
            //    $scope.popover = popover;
            //});

            $scope.openPopover = function($event) {
                $scope.popover.show($event);
                $scope.init();
            };
            $scope.closePopover = function() {
                $scope.popover.hide();
            };
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.popover.remove();
            });
            // Execute action on hide popover
            $scope.$on('popover.hidden', function() {
                // Execute action
            });
            // Execute action on remove popover
            $scope.$on('popover.removed', function() {
                // Execute action
            });

        }
    };
});