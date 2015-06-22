// service for handling toast notifications
rollerDerby.factory('toastService', function($rootScope, messageService) {
   var
       general = function (message) {
           $rootScope.$broadcast(messageService.messages.toast, message, 'general');
       },

       success = function(message) {
           $rootScope.$broadcast(messageService.messages.toast, message, 'success');
       },

       error = function(message) {
           $rootScope.$broadcast(messageService.messages.toast, message, 'error');
       }
    ; return {
        general: general,
        success: success,
        error: error
    }
});