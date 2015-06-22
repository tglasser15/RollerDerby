// contains all local data storage, get and set functions
rollerDerby.factory('dataService', function ($location, $timeout, $rootScope, messageService, viewService, toastService) {
    // set: window.localStorage['teams'] = JSON.stringify(teams);
    // get: return JSON.parse(window.localStorage['teams'] || '[]');
    var
        // static set of states
        states = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District Of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"}

        // static set of age groups
        , ageGroup = {junior:"junior", older:"older"}

        // Parse tables
        , userTable = Parse.Object.extend("_User")
        , teamTable = Parse.Object.extend("Team")

        // get functions
        , getCurrentUser = function() {
            return Parse.User.current();
        }

        // set functions

        // other functions
        , logIn = function(user) {
            return Parse.User.logIn(user.email, user.password);
        }

        , register = function(newUser) {
            var user = new Parse.User();
            var name = newUser.firstName + " " + newUser.lastName;
            user.set("username", newUser.email);
            user.set("password", newUser.password);
            user.set("email", newUser.email);
            user.set("name", name);
            user.set("firstName", newUser.firstName);
            user.set("lastName", newUser.lastName);
            user.set("city", newUser.city);
            user.set("state", newUser.state);
            return user.signUp();
        }

        , registerTeam = function(team) {
            var newTeam = new teamTable();
            newTeam.set("teamName", team.teamName);
            newTeam.set("leagueName", team.leagueName);
            newTeam.set("ageGroup", team.ageGroup);
            newTeam.set("city", team.city);
            newTeam.set("state", team.state);
            return newTeam.save();
        }

        , updateAccount = function(user) {
            var currentUser = getCurrentUser();
            var name = user.firstName + " " + user.lastName;
            currentUser.set("username", user.email);
            if (user.password)
                currentUser.set("password", user.password);
            currentUser.set("email", user.email);
            currentUser.set("name", name);
            currentUser.set("firstName", user.firstName);
            currentUser.set("lastName", user.lastName);
            currentUser.set("city", user.city);
            currentUser.set("state", user.state);
            return currentUser.save();
        }

        , removeAccount = function() {
            var currentUser = getCurrentUser();
            return currentUser.destroy();
        }

        , logOut = function() {  //on logout, clear local storage for next visit
            Parse.User.logOut();
            viewService.goToPage('/login');
        }
        ; return {
        states: states
        , ageGroup: ageGroup
        , getCurrentUser: getCurrentUser
        , register: register
        , registerTeam: registerTeam
        , updateAccount: updateAccount
        , removeAccount: removeAccount
        , logIn: logIn
        , logOut: logOut
    }

});