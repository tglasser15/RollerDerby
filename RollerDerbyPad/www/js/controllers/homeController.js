rollerDerby.controller('homeController',
    function loginController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;

        $scope.init = function() {
            var currentUser = dataService.getCurrentUser();
            $scope.user = {
                email: currentUser.get("email"),
                name: currentUser.get("name"),
                firstName: currentUser.get("firstName"),
                lastName: currentUser.get("lastName"),
                city: currentUser.get("city"),
                state: currentUser.get("state")
            };
        };

        $scope.init();

        $scope.toggleRight = function() {
            $ionicSideMenuDelegate.toggleRight();
        };

        $scope.gamePopup = function() {
            $scope.data = {};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });
        };

        $scope.teamPopup = function() {
            $rootScope.$broadcast(messageService.popup.teamPopup);
        };

        $scope.playerPopup = function() {
            $rootScope.$broadcast(messageService.popup.playerPopup);
        };

        $scope.$on(messageService.messages.updateUser, function(event, data) {
            $scope.init();
        });

    });/**
 * Created by Tommy on 6/15/2015.
 */
