rollerDerby.factory('configService', function () {
    return {

        messages: {
              navigate: 'navigate'
            , toast: 'toast'
            , loginSuccess: 'loginSuccess'
            , setGame: 'setGame'
            , addNewTeam: 'addNewTeam'
            , teamChanged: 'teamChanged'
            , updateTeam: 'updateTeam'
            , updatePlayer : 'updatePlayer'
            , teamSet : 'teamSet'
            , loadPlayerCardData: 'loadPlayerCardData'

        }, toasts: {
            general: function(action, type, success){
                switch(action){
                    case 'a':  //add
                        action = success ? 'saved' : 'saving'
                        break;
                    case 'u':  //update
                        action = success ? 'updated' : 'updating'
                        break;
                    case 'r':  //remove
                        action = success ? 'removed' : 'removing'
                        break;
                    default:throw{msg:'that action is not supported', action:action, code:'T1'};
                }
                if(success){
                    //uppercase
                    return type.charAt(0).toUpperCase() + type.slice(1) + ' ' + action + ' successfully.'

                }else{
                    return 'There was an error ' + action + ' this ' + type + '.  Please try again.'
                }
            }, loginSuccess: function (name) {
                return 'Welcome ' + name + '!';
            }, changedPassword : function(success){
                return success ? 'Password successfully changed.' : 'There was an error updating your password. Please try again.'
            }, fileTooLarge: function(size) {
                return 'The image is too large (' + (size * 0.000001).toFixed(1) + 'mb)! It should be less than 1mb.';
            }
            , requiredFields : 'Please fill out the required fields.'
            , passwordsDoNotMatch : 'The passwords you provided do not match.'
            , registrationSuccess : 'Registration successful!'
            , emailValidation : 'Please enter a valid email address.'
            , notAuthenticated: 'You could not be authenticated. Please login again.'
            , cannotConnectToServer: 'The server could not be contacted.  Please check your connection and try again.'
            , savingInProgress: 'Saving is already in progress'
            , logoutSuccess: 'You have successfully logged out'
            , emailVerification : 'Please verify your email before continuing'
            , teamAddSuccess: 'You have successfully added a new team'
            , accountUpdateSuccess: 'You have updated your profile'
            , teamUpdateSuccess: 'Your team has been updated'
            , missingPhoto: 'Please select a profile picture'
        }
    }
});