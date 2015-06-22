// directive for editing an account
rollerDerby.directive('accountModal', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/account-modal.html",
        controller: function($scope, viewService) {
            var self = 'accountModal';

            $scope.states = dataService.states;

            var currentUser = dataService.getCurrentUser();

            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            $scope.user = {
                id: currentUser.id,
                email: currentUser.get("email"),
                newPassword: '',
                newConfirmPassword: '',
                firstName: currentUser.get("firstName"),
                lastName: currentUser.get("lastName"),
                city: currentUser.get("city"),
                state: currentUser.get("state"),
            };

            // check password function
            $scope.checkPassword = function(user) {
                return user.password === user.confirmPassword;
            };

            // register function
            $scope.saveChanges = function(user) {
                if(viewService.validateAreaByFormName('accountForm') && $scope.checkPassword(user))
                {
                    dataService.updateAccount(user).then(function(parseUser) {

                    }).then(function(savedUser) {
                        $scope.closeModal();
                        $timeout(function() {
                            toastService.success(messageService.toast.accountSaved);
                        }, 1000);
                        $rootScope.$broadcast(messageService.messages.updateUser);
                    }, function(error) {
                        $timeout(function() {
                            toastService.error(messageService.toast.error(error));
                        });

                    });
                } else {
                    toastService.error(messageService.toast.missingFields);
                }
            };

            // delete account
            $scope.deleteAccount = function(user) {
                viewService.confirmPopup();
            };

            $scope.$on(messageService.messages.popupMsg, function(event, msg) {
                if (msg === 'Yes') {
                    dataService.removeAccount().then(function(user) {
                        viewService.goToPage('/login');
                        $scope.closeModal();
                    }, function(error) {
                        $timeout(function() {
                            toastService.error(messageService.toast.error(error));
                        });
                    });
                }
            });

        }
    };
});