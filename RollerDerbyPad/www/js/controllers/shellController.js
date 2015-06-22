// the shell controller acts as a wrapper around all other controllers - directly related to index.html
rollerDerby.controller('shellController',
    function shellController($scope, $rootScope, $timeout, $ionicLoading, viewService, messageService, dataService, $ionicPopup) {
        var self = this;

        // the first page to show up is the login page
        $scope.currentPage = 'login';

        $scope.goToPage = function(path) {
            viewService.goToPage(path);
        };

        // detects navigation
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

                // split the URL down to just the page name
                $scope.currentPage = current.split('#')[1] ? current.split('#')[1].split('/')[1] : '';
                //$rootScope.$broadcast(configService.messages.navigate, $scope.currentPage);

            });
        });


        //// ------------- Toast Functions ------------- \\
        //$scope.toasts = [];
        //
        $scope.$on(messageService.messages.toast, function (event, message, type) {
            $scope.toast = {
                toggle: true,
                message: message,
                type: type
            };
            $timeout(function() {
                $scope.toast.toggle = false;
            }, 3000);
        });

        // modal functionality
        $scope.currentModal = '';

        $scope.$on(messageService.messages.openModal, function(event, modal) {
            if (modal) {
                $timeout(function() {
                    $scope.currentModal = modal;
                });

            }
        });

        $scope.$on(messageService.messages.closeModal, function(event, modal) {
            if (modal) {
                $timeout(function() {
                    $scope.currentModal = '';
                });

            }
        });

        $scope.openModal = function(modal) {
            $scope.currentModal = modal;
        };

        $scope.$on(messageService.messages.confirmPopup, function(event, data) {
            var myPopup = $ionicPopup.show({
                title: 'Do you really wish to delete your account?',
                scope: $scope,
                buttons: [
                    { text: 'No' },
                    {
                        text: '<b>Yes</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            return 'Yes';
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                $timeout(function() {
                    $rootScope.$broadcast(messageService.messages.popupMsg, res);
                });
            });
        });
    });