rollerDerby.controller('shellController',
    function shellController($scope, $rootScope, $timeout, $ionicLoading, viewService, configService) {
        var self = this;

        $scope.currentPage = 'login';

        $scope.$on('$ionicView.enter', function(event) {

        });

        self.logout = function() {
            viewService.logOut();
            viewService.goToPage('/login')
        };



        $scope.$on('$locationChangeSuccess', function (next, current) {
            $timeout(function() {
                // check if user is logged in if accessing most pages
                if ($scope.currentPage != 'login'){
                    if (Parse.User.current()){
                        console.log("user logged in");
                    }
                    else {
                        viewService.goToPage('/login');
                    }
                }

                $scope.currentPage = current.split('#')[1] ? current.split('#')[1].split('/')[1] : '';
                $rootScope.$broadcast(configService.messages.navigate, $scope.currentPage);

            });
        });


        // ------------- Toast Functions ------------- \\
        $scope.toasts = [];

        $scope.$on(configService.messages.toast, function (event, message, type, callback) {
            showToast(message.message, type, callback);
        })

        var showToast = function (message, type, callback) {
            // New Toast Item
            var item = {
                message: message,
                error: type === 'error',
                success: type === 'success',
                slideIn: true,
                slideOut: false
            };

            $timeout(function () {
                $scope.toasts.push(item);
            });

            if (callback) {
                callback = $scope.closeToast(item);
                return;
            }

            $timeout(function () {
                $scope.closeToast(item);
            }, 5000);
        };

        $scope.closeToast = function (item) {
            if ($scope.toasts.indexOf(item) == -1) {
                return;
            }

            // Wait for animation to finish before removing toast
            item.slideOut = true;
            $timeout(function () {
                // do closing animation
                $scope.toasts.splice($scope.toasts.indexOf(item), 1);
            },1000);
        }
        // ------------- END Toast Functions ------------- \\
    });