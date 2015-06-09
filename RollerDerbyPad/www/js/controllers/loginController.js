rollerDerby.controller('loginController',
    function loginController(viewService, toastService, dataService, configService, $timeout, $ionicPopup) {
        var self = this;

        self.user = {
            email: 'Sounders@mailinator.com',
            password: '123'
        };

        self.init = (function() {
            if (Parse.User.current()) {
                viewService.goToPage('/games');
            }
        })();

        self.login = function() {
            if (viewService.validateAreaByFormName('loginForm')) {
                Parse.User.logIn(self.user.email, self.user.password, {
                    success: function (user) {
                        console.log(user);
                        var name = user.get('name');
                        toastService.success(configService.toasts.loginSuccess(name));
                        viewService.goToPage('/games');

                        // Todo: Get ALL THE DATA
                        dataService.init(function() {

                        });

                    },
                    error : function(error) {
                        toastService.error('Error!');
                    }
                });
            }
            else {
                // Todo: Toast
                console.log('Login failed');
                toastService.error(configService.toasts.requiredFields);

            }
        }

        self.signUp = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Register Online',
                template: 'Go to soccerstats.com to register as a coach and invite parents or players to your team! Then come back and login to start tracking stats.'
            });
            alertPopup.then(function(res) {
                console.log('Alert Closed');
            });
        }

    });