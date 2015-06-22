rollerDerby.directive('navBar', function ($location, $timeout, $rootScope, viewService, toastService, dataService, messageService) {
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
                $rootScope.$broadcast(messageService.messages.teamInit, 'blah');

            };

            $scope.editAccount = function() {
                viewService.openModal('accountModal');
            };

            $scope.logOut = function() {
                dataService.logOut();
            };

        }
    };
});