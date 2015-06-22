rollerDerby.controller('registerController',
    function registerController(viewService, dataService, toastService, messageService, $scope, $timeout, $ionicPopup) {
        var self = 'registerModal';

        $scope.states = dataService.states;

        $scope.user = {
            email: 'tommy@example.com',
            password: '123',
            confirmPassword: '123',
            firstName: 'Tommy',
            lastName: 'Glasser',
            city: 'Spokane',
            state: 'Washington'
        };

        // check password function
        $scope.checkPassword = function(newUser) {
            return newUser.password === newUser.confirmPassword;
        };

        // register function
        $scope.register = function(newUser) {
            if(viewService.validateAreaByFormName('registerForm') && $scope.checkPassword(newUser))
            {
                dataService.register(newUser).then(function(newUser) {
                    viewService.goToPage('/home');
                    toastService.success(messageService.toast.registerSuccess);
                }, function(error) {
                    console.log(error);
                    $timeout(function() {
                        toastService.error(messageService.toast.error(error));
                    });

                });
            } else {
                toastService.error(messageService.toast.missingFields);
            }
        };

    });