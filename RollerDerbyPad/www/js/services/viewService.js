rollerDerby.factory('viewService', function ($location, $timeout) {

    var
        goToPage = function(path) {
            $timeout(function() {
                $location.path(path);
            });
        }
        , validateAreaByFormName = function (form) {
            // Find all the required fields
            var isValid = true;
            _.each($('form[name=' + form + '] input, form[name=' + form + '] select'), function (field) {
                if ($(field).is('[required]')) {

                    // Simulate the blur on the
                    $(field).addClass('ng-touched');

                    // Is there a value? set to ng-valid
                    if (!field.value || (field.className.indexOf('ng-invalid-email') != -1)) {
                        isValid = false;
                        $(field).addClass('ng-invalid');
                        $(field).addClass('ng-invalid-required');
                    }
                    else {
                        $(field).addClass('ng-valid');
                        $(field).addClass('ng-valid-required');
                    }

                }
            });

            return isValid;
        }
        ,logOut = function() {
            Parse.User.logOut();
            window.localStorage['currentGame'] = '';
            window.localStorage['currentTeam'] = '';
              window.localStorage['gameStats'] = [];
                window.localStorage['players'] = [];
                  window.localStorage['games'] = [];
                  window.localStorage['teams'] = [];
            goToPage('/login');
        };

    return {
        goToPage: goToPage,
        validateAreaByFormName: validateAreaByFormName,
        logOut: logOut
    }

});