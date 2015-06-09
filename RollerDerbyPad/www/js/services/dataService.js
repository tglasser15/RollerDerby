rollerDerby.factory('dataService', function ($location, $timeout, $rootScope, configService, toastService, viewService) {

    var
    // Current focus variables
          getCurrentUser = function() {
            return Parse.User.current();
        }
        , currentPlayer = {}
        , currentTeam = {}
        , currentGame = {}
        , positions = [{ type: 'P', x: 38, y: 76 }, { type: 'P', x: 1, y: 52 }, { type: 'P', x: 26, y: 52 }, { type: 'P', x: 51, y: 52 }, { type: 'P', x: 76, y: 52 }, { type: 'P', x: 1, y: 28 }, { type: 'P', x: 26, y: 28 }, { type: 'P', x: 51, y: 28 }, { type: 'P', x: 76,  y: 28 }, { type: 'P', x: 26, y: 3 }, { type: 'P', x: 51, y: 3 }]
        , getPositions = function() { return positions; }
    // Local Storage

        , setLocalTeams = function(teams) {
            window.localStorage['teams'] = JSON.stringify(teams);
        }

        , getLocalTeams = function() {
            return JSON.parse(window.localStorage['teams'] || '[]');
        }

        , setLocalGames = function(games, teamId) {
            if (!teamId) {
                window.localStorage['games'] = JSON.stringify(games);
            }
            else {
                var localGames = getLocalGames();
                localGames.push({teamId: teamId, games: games});
                window.localStorage['games'] = JSON.stringify(localGames);
            }
        }

        , getLocalGames = function() {
            return JSON.parse(window.localStorage['games'] || '[]');
        }

        , setLocalGame = function(game) {
            window.localStorage['currentGame'] = JSON.stringify(game);
        }

        , getLocalGame = function() {
            return JSON.parse(window.localStorage['currentGame'] || '{}');
        }

        , setLocalTeam = function(team) {
            window.localStorage['currentTeam'] = JSON.stringify(team);
        }

        , getLocalTeam = function() {
            return JSON.parse(window.localStorage['currentTeam'] || '{}');
        }

        , setLocalPlayers = function(players, teamId) {
                var localPlayers = getLocalPlayers();
                _.each(players, function(player) {
                    localPlayers.push({teamId: teamId, player: player});
                });
                window.localStorage['players'] = JSON.stringify(localPlayers);
        }

        , getLocalPlayers = function(isTeam) {
            if (isTeam) {
                var allPlayers = JSON.parse(window.localStorage['players'] || '[]');
                var currentTeam = getLocalTeam();
                var thesePlayers = [];
                _.each(allPlayers, function(player) {
                    if (currentTeam.objectId == player.teamId) {
                        thesePlayers.push(player);
                    }
                });
                return thesePlayers;
            }
            else {
                return JSON.parse(window.localStorage['players'] || '[]');
            }
        }

        , getLocalGamesStatsByKey = function(key) {
            var allStats = getLocalGamesStats();
            return allStats[key] || [];
        }

        , getLocalGamesStats = function() {
            return JSON.parse(window.localStorage['gameStats'] || '{}');
        }

        , setLocalGameStats = function(key, value, update) {
            var allStats = getLocalGamesStats();

            // If you want to update sub object of key value array
            // then pass in the boolean as true
            if (update) {
                // If array does not exist then set key to empty array
                if (!allStats[key]) {
                    allStats[key] = [];
                }

                var obj = _.find(allStats[key], function(item) {
                    return item.player === value.player;
                });

                // If objects exists in array then update it
                // else add it  to the array
                if (obj) {
                    var index = allStats[key].indexOf(obj);
                    allStats[key][index] = value;
                }
                else {
                    allStats[key].push(value);
                }
            }
            else {
                if (allStats[key]) {
                    allStats[key].push(value);
                }
                else {
                    allStats[key] = [];
                    allStats[key].push(value);

                }
            }


            window.localStorage['gameStats'] = JSON.stringify(allStats);
        }

        , deleteLocalGameStatsItem = function(key, value) {
            var allStats = getLocalGamesStats();

            if (allStats[key]) {
                allStats[key].splice(value, 1);
            }
            else {
                // Throw error
            }
            window.localStorage['gameStats'] = JSON.stringify(allStats);
        }

        , clearLocalStorage = function() {
            window.localStorage['currentGame'] = '';
            window.localStorage['currentTeam'] = '';
              window.localStorage['gameStats'] = [];
                window.localStorage['players'] = [];
                  window.localStorage['games'] = [];
                  window.localStorage['teams'] = [];
        }

    // Initial Login
        , init = function(callback) {
            getTeams(function (teams) {

                // Set teams in local storage
                setLocalTeams(teams);

                _.each(teams, function (team) {
                    getGames(team, function (games) {
                        // Set games in local storage
                        setLocalGames(games, team.id);

                        getPlayersByTeamId(team.id, function(players) {
                            setLocalPlayers(players, team.id);
                            callback();
                        });
                    });
                });
            });
        }

    // Parse Tables
        , playersTable = Parse.Object.extend("Players")
        , userTable = Parse.Object.extend("_User")
        , teamTable = Parse.Object.extend("Team")
        , playerStatsTable = Parse.Object.extend("SeasonPlayerStats")
        , gameTable = Parse.Object.extend("Game")
        , SeasonTeamTable = Parse.Object.extend("SeasonTeamStats")

    // Team Table

        , setCurrentTeam = function(team) {
            currentTeam = team;
        }

        , getCurrentTeam = function() {
            return currentTeam;
        }

        , setCurrentGame = function (game) {
            currentGame = game;
        }

        , getTeams = function(callback) {
            var teamDict = [];
            var query = new Parse.Query(userTable);
            var currentUser = Parse.User.current();
            query.include('teams');
            query.get(currentUser.id, {
                success: function(user) {
                    $timeout(function(){
                        var teams = user.get("teams");
                        // Add each team associated with the current user to the team dropdown list
                        _.each(teams, function (team) {
                            teamDict.push(team);
                        });

                        callback(teamDict);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
            return teamDict;
        }

        , getPlayers = function(callback) {
            var dictionary = [];
            var currentUser = Parse.User.current();
            var query = new Parse.Query(userTable);
            query.include('players');
            query.get(currentUser.id, {
                success: function (user) {
                    $timeout(function() {
                        var players = user.get("players");
                        _.each(players, function (player) {
                            var photo = player.get("photo"),
                                name = player.get("name"),
                                firstName = player.get("firstName"),
                                lastName = player.get("lastName"),
                                birthday = player.get("birthday"),
                                team = player.get("team"),
                                jerseyNumber = player.get("jerseyNumber"),
                                city = player.get("city"),
                                state = player.get("state"),
                                contact = {
                                    emergencyContact : player.get("emergencyContact"),
                                    phone : player.get("phone"),
                                    relationship : player.get("relationship")
                                }
                                ;
                            dictionary.push({
                                photo : photo,
                                name : name,
                                firstName : firstName,
                                lastName : lastName,
                                birthday : birthday,
                                team : team,
                                jerseyNumber : jerseyNumber,
                                city : city,
                                state : state,
                                contact : contact,
                                id : player.id
                            });
                        });

                        callback(dictionary);
                    });

                },
                error: function (user, error) {

                }
            });
            return dictionary;
        }

        , getGames = function(_team, callback) {
            var team = new teamTable();
            var query = new Parse.Query(gameTable);


            team.id = _team.id;
            team.fetch().then(function(team){


                query.equalTo('team',team);
                query.include('gameTeamStats');
                query.include('gameTeamStats.roster');
                query.include('gameTeamStats.roster.player');
                query.find().then(function(parseGames){
                    var game;
                    var games = [];

                    for (var i = 0; i < parseGames.length; i++ ) {

                        game = {
                            id: parseGames[i].id,
                            date: parseGames[i].get("date"),
                            startTime: parseGames[i].get("startTime"),
                            opponent: {
                                name: parseGames[i].get("opponent"),
                                symbol: parseGames[i].get("opponentSymbol"),
                                score: parseGames[i].get("gameTeamStats").get("goalsTaken")
                            },
                            team: {
                                photo: team.get("logo")._url,
                                name: team.get("name"),
                                symbol: team.get("symbol"),
                                score: parseGames[i].get("gameTeamStats").get("goalsMade")
                            },
                            status: parseGames[i].get("status"),
                            notes: parseGames[i].get("gameNotes"),
                            gameTeamStats: parseGames[i].get("gameTeamStats"),
                            roster: []
                        }

                         _.each(parseGames[i].get("gameTeamStats").get("roster"), function (item) {
                             var thisObj = {};
                             if (item) {

                                 var playerId = item.get("player").id;
                                 thisObj[playerId] = item.attributes;
                                 thisObj[playerId].player = item.get('player').attributes;
                                 thisObj[playerId].player.objectId = playerId;

                                 game.roster.push(thisObj);
                                 console.log(thisObj);
                             }
                         });

                        games.push(game);
                    }

                    callback(games);
                }, function(error){
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");

                });
            });
        }

        , getSeasonTeamStats = function(team_id,callback){

            var query = new Parse.Query(teamTable);

            query.include('teamStats');
            query.include("teamStats.topAssists");
            query.include("teamStats.topAssists.playerStats");
            query.include("teamStats.topGoals");
            query.include("teamStats.topGoals.playerStats");
            query.include("teamStats.topShots");
            query.include("teamStats.topShots.playerStats");

            query.equalTo('objectId',team_id)
            query.first().then(function(team){

                if (team.get('teamStats').get('topAssists'))  team.get('teamStats').get('topAssists').slice(0,4);
                if (team.get('teamStats').get('topGoals'))  team.get('teamStats').get('topGoals').slice(0,4);
                if(team.get('teamStats').get('topShots'))  team.get('teamStats').get('topShots').slice(0,4);
                callback(team.get('teamStats'));
            }, function(error){
                console.log("Error: " + error.code + " " + error.message);
                callback({error:"Someting happened"});
            });
        }

        , registerTeam = function(newTeam) {
            var _team = new teamTable();

            _team.set("ageGroup", newTeam.ageGroup);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", (_.invert(states))[newTeam.state]);
            _team.set("logo", newTeam.logo);
            _team.set("primaryColor", newTeam.primaryColor);
            _team.set("teamStats", new SeasonTeamTable());

            return _team;
        }

        , registerCoach = function (newUser, _team, inviteEmails) {
            _team.save(null, {
                success: function (_team) {
                    var registerUser = new Parse.User();

                    registerUser.set("username", newUser.email);
                    registerUser.set("firstName", newUser.firstName);
                    registerUser.set("lastName", newUser.lastName);
                    registerUser.set("name", newUser.firstName + ' ' + newUser.lastName);
                    registerUser.set("email", newUser.email);
                    registerUser.set("password", newUser.password);
                    registerUser.set("phone", newUser.phone);
                    registerUser.set("city", newUser.city);
                    registerUser.set("state", (_.invert(states))[newUser.state]);
                    registerUser.set("photo", newUser.photo);

                    // Adds a pointer to the team to an array of pointers
                    registerUser.addUnique("teams", _team);
                    registerUser.set("accountType", 1);

                    //register team
                    registerUser.signUp(null, {
                        success: function (registerUser) {
                            toastService.success(configService.toasts.registrationSuccess);
                            viewService.goToPage('/home');
                        },
                        error: function (registerUser, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            if (error.code === 202)
                                toastService.error(error.message);
                            // toastService.error("There was a an error (" + error.code +"). Please try again.");

                        }
                    });

                },
                error: function (_team, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , registerPlayer = function(player, self, coach) {
            var currentUser = getCurrentUser();
            var newPlayer = new playersTable();
            var playerStats = new playerStatsTable();
            var query = new Parse.Query(teamTable);
            query.get(player.team.id, {
                success: function (team) {
                    if (coach) {
                        newPlayer.set("name", player.name);
                        newPlayer.set("jerseyNumber", player.jerseyNumber);
                        newPlayer.set("team", team);
                        newPlayer.set("playerStats", playerStats);

                    } else {
                        if (player.newPhoto) newPlayer.set("photo", player.newPhoto);
                        newPlayer.set("name", player.name);
                        newPlayer.set("birthday", player.birthday);
                        newPlayer.set("team", team);
                        newPlayer.set("jerseyNumber", player.jerseyNumber);
                        newPlayer.set("city", player.city);
                        newPlayer.set("state", (_.invert(states))[player.state]);
                        newPlayer.set("emergencyContact", player.emergencyContact.name);
                        newPlayer.set("phone", player.emergencyContact.phone);
                        newPlayer.set("relationship", player.emergencyContact.relationship);
                        newPlayer.set("playerStats", playerStats);
                    }
                    //update parse
                    newPlayer.save(null, {
                        success: function (newPlayer) {
                            if (player.parentId) {
                                Parse.Cloud.run('registerPlayer', {newPlayerId: newPlayer.id, parentId: player.parentId}, {
                                    success: function (result) {
                                        toastService.success("Player, " + player.name + ", successfully added.");
                                        $rootScope.$broadcast(configService.messages.playerAdded, newPlayer);
                                        viewService.closeModal(self);
                                    },
                                    error: function (error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                        toastService.error("There was an error (" + error.code +"). Please try again.");
                                    }
                                });
                            } else {
                                currentUser.addUnique("players", newPlayer);
                                currentUser.save(null, {
                                    success: function (currentUser) {
                                        toastService.success("Player, " + player.name + ", successfully added.");
                                        $rootScope.$broadcast(configService.messages.playerAdded, newPlayer);
                                        viewService.closeModal(self);
                                    },
                                    error: function (currentUser, error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                        toastService.error("There was a an error (" + error.code +"). Please try again.");
                                    }
                                });
                            }
                        },
                        error: function (newPlayer, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                        }
                    });
                },
                error: function (teamTable, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , registerNewTeam = function(_team, self) {
            var currentUser = getCurrentUser();
            _team.save(null, {
                success: function(_team) {
                    currentUser.addUnique("teams", _team);
                    currentUser.save(null, {
                        success: function(currenUser) {
                            toastService.success(configService.toasts.teamAddSuccess);
                            viewService.closeModal(self);
                            $rootScope.$broadcast(configService.messages.addNewTeam, _team);
                            $rootScope.$broadcast(configService.messages.teamChanged, {team: _team, refresh: false});
                        },
                        error: function(currentUser, error) {
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                            console.log(error.message);
                        }
                    });

                },
                error: function(_team, error) {
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                    console.log(error.message);
                }
            });
        }

        , updateAccount = function (editUser, self) {
            var currentUser = getCurrentUser();
            currentUser.set("username", editUser.email);
            currentUser.set("firstName", editUser.firstName);
            currentUser.set("lastName", editUser.lastName);
            currentUser.set("name", editUser.firstName + " " + editUser.lastName);
            currentUser.set("email", editUser.email);
            currentUser.set("phone", editUser.phone);
            currentUser.set("city", editUser.city);
            currentUser.set("state", (_.invert(states))[editUser.state]);
            if (editUser.newPhoto)
                currentUser.set("photo", editUser.newPhoto);
            if(editUser.newPassword !== '')
                currentUser.set("password", editUser.newPassword);

            currentUser.save(null, {
                success: function (currentUser) {
                    toastService.success(configService.toasts.accountUpdateSuccess);
                    viewService.closeModal(self);
                    //$route.reload();
                    //currentUser.fetch();
                },
                error: function (currentUser, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , updateTeam = function(currentTeamID, editTeam, self) {
            var query = new Parse.Query(teamTable);
            query.get(currentTeamID, {
                success: function(team) {
                    team.set("leagueName", editTeam.leagueName);
                    team.set("ageGroup", editTeam.ageGroup);
                    team.set("primaryColor", editTeam.primaryColor);
                    team.set("city", editTeam.city);
                    team.set("name", editTeam.name);
                    team.set("number", editTeam.number);
                    team.set("state", (_.invert(states))[editTeam.state]);
                    if (editTeam.newLogo)
                        team.set("logo", editTeam.newLogo);
                    team.save(null, {
                        success: function (editTeam) {
                            setCurrentTeam(editTeam);
                            toastService.success(configService.toasts.teamUpdateSuccess);
                            viewService.closeModal(self);
                            //$route.reload();
                        },
                        error: function(editTeam, error) {
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                        }
                    });

                },
                error: function(team, error) {
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , updatePlayer = function(player, self) {
            var query = new Parse.Query(playersTable);
            query.get(player.id, {
                success: function(editPlayer) {
                    query = new Parse.Query(teamTable);
                    query.get(player.team.id, {
                        success: function(team) {
                            if (player.newPhoto) {
                                editPlayer.set("photo", player.newPhoto);
                            }
                            editPlayer.set("name", player.name);
                            editPlayer.set("birthday", player.birthday);
                            editPlayer.set("team", team);
                            editPlayer.set("jerseyNumber", player.jerseyNumber);
                            editPlayer.set("city", player.city);
                            editPlayer.set("state", (_.invert(states))[player.state]);
                            editPlayer.set("emergencyContact", player.emergencyContact.name);
                            editPlayer.set("phone", player.emergencyContact.phone);
                            editPlayer.set("relationship", player.emergencyContact.relationship);
                            editPlayer.save(null, {
                                success: function(editPlayer) {
                                    toastService.success("Player " + player.name + "'s profile updated.");
                                    $rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
                                    viewService.closeModal(self);
                                    // $route.reload();
                                },
                                error: function(editPlayer, error) {
                                    console.log("Error: " + error.code + " " + error.message);
                                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                                }
                            });
                        },
                        error : function(team, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                        }
                    });

                },
                error: function(player, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , getTeamById = function(id, callback) {
            var query = new Parse.Query(teamTable);
            query.equalTo('objectId', id);
            query.first({
                success: function(team) {
                    $timeout(function(){
                        callback(team);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

    // Player Table
        , getPlayersByTeamId = function(id, callback) {
            var query = new Parse.Query(playersTable);
            query.equalTo('team', {
                __type: "Pointer",
                className: "Team",
                objectId: id
            });
            query.include('player');
            query.find({
                success: function(players) {
                    $timeout(function(){
                        callback(players);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , getSeasonPlayerStatsByPlayerId = function(id, callback) {
            var query = new Parse.Query(playerStatsTable);
            query.equalTo('objectId', id);
            query.first({
                success: function(playerStats) {
                    $timeout(function() {
                        callback(playerStats);
                    });
                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , getPlayerByPlayerId = function (playerID, callback) {
            var query = new Parse.Query(playersTable);
            query.equalTo("objectId", playerID);
            query.first({
                success: function(player) {
                    $timeout(function() {
                        callback(player);
                    });
                },
                error: function(player, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , getGameStatsById = function(game_id,callback){

            var query = new Parse.Query(gameTable);
            query.include('gameTeamStats');
            query.first(game_id).then(function(game){
                callback(game);
            }, function(error){
                console.log("Error: " + error.code + " " + error.message);
                callback({});
            });
        }

        , getParentEmailsByTeamId = function(teamId, callback) {
            var query = new Parse.Query(userTable);
            query.equalTo("teams", {
                __type : "Pointer",
                className : "Team",
                objectId : teamId
            });
            query.equalTo("accountType", 2);
            query.find({
                success: function(parentEmails) {
                    callback(parentEmails);
                },
                error: function(parentEmails, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , saveGame = function(game, teamID) {
            var newGame = new Game();

            // Things the user entered
            newGame.set("date", game.date);
            newGame.set("opponent", game.opponent.name);
            newGame.set("opponentSymbol", game.opponent.symbol);
            newGame.set("startTime", game.time.toTimeString());
            newGame.set("team", {__type: "Pointer", className: "Team", objectId: teamID});
            newGame.set("gameTeamStats", new SeasonTeamTable());

            // Default values
            newGame.set("status", "not_started");

            // Save the game object
            newGame.save(null, {
                success: function(newGame) {
                    toastService.success("Game on " + (game.date.getMonth() + 1) + "/" + game.date.getDate() + " added.");
                },
                error: function(newGame, error) {
                    console.log("Error saving game: " + error.code + " " + error.message);
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , saveGameAttributes = function (game, attributes, data) {
            var query = new Parse.Query(gameTable);
            query.equalTo("objectId", game.id);
            query.first({
                success: function(editGame) {

                    for(var i = 0; i < attributes.length; i++) {
                        editGame.set(attributes[i], data[i]);
                    }

                    editGame.save(null, {
                        success: function() {
                            toastService.success("Successfully saved game notes.");
                        },
                        error: function (error) {
                            toastService.error("There was an error.");
                        }
                    })
                },
                error: function(editGame, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , playerConstructor = function(player, stats) {
            var retPlayer = {
                id : player.id,
                photo: player.attributes.photo ? player.attributes.photo._url : './img/player-icon.svg',
                fname: player.attributes.name,
                lname: '',
                number: player.attributes.jerseyNumber,
                position: '',
                total: {
                    goals: stats.attributes.goals ? stats.attributes.goals : 0,
                    fouls: stats.attributes.fouls ? stats.attributes.fouls : 0,
                    playingTime : stats.attributes.playingTime ? Math.round(stats.attributes.playingTime) : 0,
                    assists: stats.attributes.assists ? stats.attributes.assists : 0,
                    yellows: 0,
                    reds: 0,
                    cardInit : function(playerCard, stats) {
                        _.each(stats.attributes.cards, function(card) {
                            if (card.type === "yellow")
                                playerCard.yellows++;
                            else if (card.type === "red")
                                playerCard.reds++;
                        });
                    }
                },
                // TODO: how are we calculating shot accuracy?
                shots : {
                    data : [
                        {
                            value: 0,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Missed"
                        },
                        {
                            value: 0,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ],
                    accuracy: 0,
                    blocks: 0,
                    onGoal: 0,
                    offGoal: 0,
                    goals: 0,
                    shotInit: function(playerShot, stats) {
                        _.each(stats.attributes.shots, function(shot) {
                            playerShot.blocks += shot.blocked;
                            playerShot.onGoal += shot.onGoal;
                            playerShot.offGoal += shot.offGoal;
                            playerShot.goals += shot.goals;
                        });
                        var total = playerShot.blocks + playerShot.onGoal + playerShot.offGoal + playerShot.goals;
                        playerShot.accuracy = Math.round(((total - playerShot.offGoal) / total)*100);
                        playerShot.data[0].value = playerShot.offGoal;
                        playerShot.data[1].value = total;
                    }
                },
                passes: {
                    data : [
                        {
                            value: 0,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Turnovers"
                        },
                        {
                            value: 0,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Total Passes"
                        }
                    ],
                    completion: '0/0',
                    turnovers: 0,
                    total: 0,
                    passInit: function(playerPass, stats) {
                        _.each(stats.attributes.passes, function(pass) {
                            playerPass.turnovers += pass.turnovers;
                            playerPass.total += pass.total;
                        });
                        playerPass.completion = (playerPass.total-playerPass.turnovers) + '/' + playerPass.total;
                        playerPass.data[0].value = playerPass.turnovers;
                        playerPass.data[1].value = playerPass.total;
                    }
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name: player.attributes.emergencyContact,
                    phone: player.attributes.phone,
                    relationship: player.attributes.relationship
                }
            };
            if (stats.attributes.cards)
                retPlayer.total.cardInit(retPlayer.total, stats);
            if (stats.attributes.shots)
                retPlayer.shots.shotInit(retPlayer.shots, stats);
            if (stats.attributes.passes)
                retPlayer.passes.passInit(retPlayer.passes, stats);

            return retPlayer;
        }

        ; return {
        init: init,
        getPositions: getPositions,

        getLocalGames: getLocalGames,
        setLocalGames: setLocalGames,

        getLocalGame: getLocalGame,
        setLocalGame: setLocalGame,

        getLocalTeam: getLocalTeam,
        setLocalTeam: setLocalTeam,

        getLocalTeams: getLocalTeams,
        setLocalTeams: setLocalTeams,

        setLocalPlayers: setLocalPlayers,
        getLocalPlayers: getLocalPlayers,

        getLocalGamesStatsByKey: getLocalGamesStatsByKey,

        getLocalGamesStats: getLocalGamesStats,
        setLocalGameStats: setLocalGameStats,

        deleteLocalGameStatsItem: deleteLocalGameStatsItem,

        clearLocalStorage: clearLocalStorage,

        getTeams : getTeams,
        getTeamById : getTeamById,
        getPlayersByTeamId : getPlayersByTeamId,
        setCurrentTeam : setCurrentTeam,
        getCurrentTeam : getCurrentTeam,
        registerTeam : registerTeam,
        getPlayers: getPlayers,
        getCurrentUser: getCurrentUser,
        getSeasonPlayerStatsByPlayerId : getSeasonPlayerStatsByPlayerId,
        getGames : getGames,
        playerConstructor : playerConstructor,
        getPlayerByPlayerId : getPlayerByPlayerId,
        getSeasonTeamStats : getSeasonTeamStats,
        saveGame : saveGame,
        saveGameAttributes : saveGameAttributes,
        getGameStatsById : getGameStatsById,
        registerCoach : registerCoach,
        updateAccount : updateAccount,
        updateTeam : updateTeam,
        registerPlayer : registerPlayer,
        updatePlayer : updatePlayer,
        registerNewTeam : registerNewTeam,
        getParentEmailsByTeamId : getParentEmailsByTeamId
    }

});