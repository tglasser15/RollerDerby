// contains all local data storage, get and set functions
rollerDerby.factory('dataService', function ($location, $timeout, $rootScope, messageService, viewService, toastService) {
    // set: window.localStorage['teams'] = JSON.stringify(teams);
    // get: return JSON.parse(window.localStorage['teams'] || '[]');
    var
        // static set of states
        states = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District Of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"}

        // static set of age groups
        , ageGroup = {junior:"junior", older:"older"}

        , currentTeam = {}
        // Parse tables
        , userTable = Parse.Object.extend("_User")
        , teamTable = Parse.Object.extend("Team")
        , playerTable = Parse.Object.extend("Players")
        , gameTable = Parse.Object.extend("Game")

        // get functions
        , getCurrentUser = function() {
            return Parse.User.current();
        }

        , getCurrentTeam = function() {
            return currentTeam;
        }

        , getTeams = function() {
            var currentUser = getCurrentUser();
            var teams = [];
            var query = new Parse.Query(userTable);
            query.include("teams");
            return query.get(currentUser.id);
        }

        , getPlayers = function() {
            var team = getCurrentTeam();
            var query = new Parse.Query(playerTable);
            query.equalTo("team", team);
            return query.find();
        }

        , getGames = function() {
            var query = new Parse.Query(gameTable);
            query.include("homeTeam");
            return query.find();
        }

        , getTeam = function(teamId) {
            var query = new Parse.Query(teamTable);
            return query.get(teamId);
        }

        , getPlayer = function(playerId) {
            var query = new Parse.Query(playerTable);
            return query.get(playerId);
        }

        , getGame = function(gameId) {
            var query = new Parse.Query(gameTable);
            return query.get(gameId);
        }

        // set functions

        , setCurrentTeam = function(team) {
            currentTeam = team;
        }

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
            user.set("teams", []);
            return user.signUp();
        }

        , registerTeam = function(team) {
            var newTeam = new teamTable();
            newTeam.set("teamName", team.teamName);
            newTeam.set("leagueName", team.leagueName);
            newTeam.set("ageGroup", team.ageGroup);
            newTeam.set("city", team.city);
            newTeam.set("state", team.state);
            newTeam.set("players", []);
            return newTeam.save();
        }

        , registerPlayer = function(player) {
            //console.log(player);
            var newPlayer = new playerTable();
            var team = getCurrentTeam();
            newPlayer.set("name", player.firstName + " " + player.lastName);
            newPlayer.set("team", team);
            newPlayer.set("playerNumber", player.number);
            newPlayer.set("firstName", player.firstName);
            newPlayer.set("lastName", player.lastName);
            newPlayer.set("city", player.city);
            newPlayer.set("state", player.state);
            return newPlayer.save();
        }

        , registerGame = function(game) {
            console.log(game);
            var newGame = new gameTable();
            newGame.set("date", game.date);
            newGame.set("time", game.time.toString());
            newGame.set("homeTeam", game.home);
            newGame.set("visitorTeam", game.visitor);
            newGame.set("location", game.city + ", " + game.state);
            newGame.set("city", game.city);
            newGame.set("state", game.state);
            newGame.set("scoreDifference", game.difference);
            newGame.set("status", game.status);
            return newGame.save();
        }

        , addTeamToUser = function(team) {
            var currentUser = getCurrentUser();
            currentUser.addUnique("teams", team);
            return currentUser.save();
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

        , updateTeam = function(team, parseTeam) {
            parseTeam.set("teamName", team.teamName);
            parseTeam.set("leagueName", team.leagueName);
            parseTeam.set("ageGroup", team.ageGroup);
            parseTeam.set("city", team.city);
            parseTeam.set("state", team.state);
            return parseTeam.save();
        }

        , updatePlayer = function(player, parsePlayer) {
            parsePlayer.set("name", player.firstName + " " + player.lastName);
            parsePlayer.set("playerNumber", player.number);
            parsePlayer.set("firstName", player.firstName);
            parsePlayer.set("lastName", player.lastName);
            parsePlayer.set("city", player.city);
            parsePlayer.set("state", player.state);
            return parsePlayer.save();
        }

        , updateGame = function(game, parseGame) {
            parseGame.set("date", game.date);
            parseGame.set("time", game.time.toString());
            parseGame.set("homeTeam", game.home);
            parseGame.set("visitorTeam", game.visitor);
            parseGame.set("location", game.city + ", " + game.state);
            parseGame.set("city", game.city);
            parseGame.set("state", game.state);
            return parseGame.save();
        }

        , removeAccount = function() {
            var currentUser = getCurrentUser();
            return currentUser.destroy();
        }

        , removeTeamFromUser = function(teamId) {
            var currentUser = getCurrentUser();
            var t = _.find(currentUser.get("teams"), function(obj){return obj.id == teamId});
            currentUser.remove("teams", t);
            return currentUser.save();
        }

        , removeTeam = function(team) {
            return team.destroy();
        }

        , removePlayer = function(player) {
            return player.destroy();
        }

        , removeGame = function(game) {
            return game.destroy();
        }

        , logOut = function() {  //on logout, clear local storage for next visit
            Parse.User.logOut();
            toastService.success(messageService.toast.logoutSuccess);
            viewService.goToPage('/login');
        }
        ; return {
        states: states
        , ageGroup: ageGroup
        , currentTeam: currentTeam
        , getCurrentUser: getCurrentUser
        , getTeams: getTeams
        , getPlayers: getPlayers
        , getGames: getGames
        , getTeam: getTeam
        , getPlayer: getPlayer
        , getGame: getGame
        , register: register
        , registerTeam: registerTeam
        , registerPlayer: registerPlayer
        , registerGame: registerGame
        , addTeamToUser: addTeamToUser
        , updateAccount: updateAccount
        , updateTeam: updateTeam
        , updatePlayer: updatePlayer
        , updateGame: updateGame
        , removeAccount: removeAccount
        , removeTeamFromUser: removeTeamFromUser
        , removeTeam: removeTeam
        , removePlayer: removePlayer
        , removeGame: removeGame
        , logIn: logIn
        , logOut: logOut
        , getCurrentTeam: getCurrentTeam
        , setCurrentTeam: setCurrentTeam
    }

});