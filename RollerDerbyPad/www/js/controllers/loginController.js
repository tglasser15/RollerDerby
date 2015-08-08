rollerDerby.controller('loginController',
    function loginController(viewService, toastService, dataService, messageService, $timeout, $scope) {
        var self = this;

        $scope.init = function() {
            $scope.user = {
                email: 'tommy@example.com',
                password: '123'
            };
        };

        $scope.init();

        // login function
        $scope.login = function(user) {
            viewService.goToPage('/home');
            //if(viewService.validateAreaByFormName('loginForm'))
            //{
            //    dataService.logIn(user).then(function(user) {
            //        viewService.goToPage('/home');
            //        $timeout(function() {
            //            toastService.success(messageService.toast.loginSuccess(user));
            //        });
            //
            //    }, function(error) {
            //        $timeout(function() {
            //            toastService.error(messageService.toast.error(error));
            //        });
            //
            //    });
            //} else {
            //    toastService.error(messageService.toast.missingFields);
            //}
        };

        $scope.signUp = function() {
            viewService.goToPage('/register');
        };

    });