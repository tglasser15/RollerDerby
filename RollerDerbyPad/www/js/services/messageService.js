// handles all message communication between controllers as well as returns the proper string to avoid mistakes
rollerDerby.factory('messageService', function () {
    return {

        messages: {
            toast: 'toast'
            , navigate: 'navigate'
            , openModal: 'openModal'
            , closeModal: 'closeModal'
            , confirmPopup: 'confirmPopup'
            , popupMsg: 'popupMsg'
            , updateUser: 'updateUser'
            , teamInit: 'teamInit'
        }

        , toast: {
            loginSuccess: function(user) {
                return "Welcome, " + user.get('firstName') + " " + user.get('lastName');
            }
            , error: function(error) {
                return "Error: " + error.code + " " + error.message;
            }
            , registerSuccess: 'You have successfully created an account'
            , registerTeam: 'You have successfully created a new team'
            , missingFields: 'Please fill out all required fields'
            , accountSaved: 'Your profile has been successfully updated'
        }

        , popup: {
            gamePopup: 'gamePopup'
            , teamPopup: 'teamPopup'
            , playerPopup: 'playerPopup'
        }
    }
});