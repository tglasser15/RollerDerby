// handles the navigation between pages and basic modal views
rollerDerby.factory('viewService', function ($location, $timeout, $rootScope, messageService) {
    var
        goToPage = function(path) {
            $timeout(function() {
                $location.path(path);
            });
        }

        , closeModal = function (modal) {
            $rootScope.$broadcast(messageService.messages.closeModal, modal);
        }

        , openModal = function (modal) {
            $rootScope.$broadcast(messageService.messages.openModal, modal);
        }

        , confirmPopup = function() {
            $rootScope.$broadcast(messageService.messages.confirmPopup);
        }

    // Credit to Alec Moore: https://github.com/alecmmoore
        , validateAreaByFormName = function (form) {
            var isValid = true;
            // for each of the input and select fields on the form
            _.each($('form[name=' + form + '] input, form[name=' + form + '] select'), function (field) {
                // if the field is required, check for value input
                if ($(field).is('[required]')) {

                    // Simulate the blur on the field
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
            // return form validation
            return isValid;
        };

    return {
        goToPage: goToPage
        , closeModal: closeModal
        , openModal: openModal
        , confirmPopup: confirmPopup
        , validateAreaByFormName: validateAreaByFormName
    }

});