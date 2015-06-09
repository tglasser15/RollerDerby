rollerDerby.factory('toastService', function ($rootScope, configService) {

    var
        info = function(message) {
            $rootScope.$broadcast(configService.messages.toast, {message: message}, 'info');
        }
        , error = function(message) {
            $rootScope.$broadcast(configService.messages.toast, {message: message}, 'error');
        }
        , success = function(message) {
            $rootScope.$broadcast(configService.messages.toast, {message: message}, 'success');
        };


    return {
        info: info,
        error: error,
        success: success
    }
});