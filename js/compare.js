$(document).ready(function () {
    var apiKey = 'STEAM_API_KEY_HERE';         
    var steamVariables = {};
    const mutualGames = [];
    const playerOneGameIds = [];
    const playerTwoGamesIds = [];
    
    // Hide steps that are not needed at start
    $('#profile-spinner').hide();
    $('.player-one').hide();
    $('.player-two').hide();
    $('.friends').hide();
    $('#friend-search').hide();
    $('.mutual-games').hide();
    $('#mutual-games-list').hide();
    $('#mutual-games-error').hide();
    $('#empty-input-one').hide();
    $('#empty-input-two').hide();
    $('#page-refresh').hide();
    $('.applied-alert').hide();

    // Start process of getting player one information
    $('#p1-submit').on('click', function(event) {
        event.preventDefault();
        // Makes sure the input is not empty if it is then don't run rest of function
        if($('#steamid1').val().trim().length === 0) {
            $('#empty-input-one').show();
            return
        } else {
        $('.player-one-search').hide();
        $('#p1-profile').empty();
        $('#profile-spinner').show();
        $('#profile-spinner').show();

        steamVariables.userId1 = [];
        var getUserId1 = $("#steamid1").val();
        
        // Convert vanity url to valid steam ID if needed
        $.ajax({
            type: 'GET',
            url: 'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key='+ apiKey +'&vanityurl=' + getUserId1,
            success: function(convertId) { 
            if(convertId.response.steamid === undefined) {
                steamVariables.userId1 = (getUserId1);
            } else {
                steamVariables.userId1 = (convertId.response.steamid);
            }}
        });
        
        // Get Player One Profile
        setTimeout(function() {
        $.ajax({
        type: 'GET',
        url: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + apiKey +'&steamids=' + steamVariables.userId1,
        success: function(profile) {
            
            // Get neccessary values from player profile
            $.each(profile, function(i, profile) {
                var Profiles = (profile.players);
                // If player is not available give error message, disable friend search and fill placeholder profile
                if(Profiles.length === 0) {
                    $("#friendId").prop('disabled', true);
                    $("#p2-submit").prop('disabled', true);
                    $("#p2-submit").css({"background-color": "#ccc", "color": "#000", "text-shadow": "none", "cursor": "not-allowed"});
                    $('#p1-games').css({"align-items": "center"});
                    $('#p1-profile').append('<div class="playerTwoProfile"><img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg" alt="Default Profile Picture"></div>');
                    $('#p1-games').append('<div class="library-error"><h1>User not found!</h1></div>');
                } else { // Append player profile
                $.each(Profiles, function(i,e) {
                    var personaname = Profiles[i].personaname;
                    var avatar = Profiles[i].avatarfull;
                    var profileUrl = Profiles[i].profileurl;
                    var str1='';
                    $('#p1-profile').append('<div class="playerOneProfile" ><a target="_blank" href="' + profileUrl + '"><img src="' + avatar + '" alt=""></a><p>' + personaname + '</p></div>');
                                    })}
            });
        }
    });

    // Start of getting player one library
    $.ajax({
        type: 'GET',
        url: 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey +'&include_appinfo=true&include_played_free_games=true&steamid=' + steamVariables.userId1 + '&format=json',
        success: function(games) {
            // Get each game player one owns
            $.each(games, function(i, game) {
                var Games = (games.response.games);
                $('#p1-games').css({"flex-direction":"row"});
                $.each(Games, function(i,e) {
                    var name1 = Games[i].name;
                    var playtime_forever1 = Math.floor(Games[i].playtime_forever / 60) ;
                    var appid1 = Games[i].appid;
                    playerOneGameIds.push(appid1); // Push each game player one owns for comparison against player two later
                    // Appending each game
                    $('#p1-games').append('<div class="perspective"><li><div data-sid=' + playtime_forever1 + ' id="img-card">' +
                                                '<a target="_blank" href="https://store.steampowered.com/app/' + appid1 +'/">' +
                                                    '<img class="game-cover" src="https://steamcdn-a.akamaihd.net/steam/apps/' + appid1 + '/library_600x900.jpg" alt="'+ name1 +'">' +
                                                    '<p class="game-logo">' + name1 + '</p>' +
                                                '</a>' +
                                        '</div></li></div>');
                                        $(".game-cover").on("error", function() {
                                            $(this).hide();
                                        });
                                    })
            });
        }
    });

    // Start of getting player one friends
    $.ajax({
        type: 'GET',
        url: 'https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=' + apiKey + '&steamid=' + steamVariables.userId1 + '&relationship=friend',
        success: function(friends) {
            // Getting friends list
            $.each(friends, function(i, friend) {
                var getFriends = (friends.friendslist.friends);
                // Getting each friend
                $.each(getFriends, function(i,e) {
                    var getFriendId = getFriends[i].steamid;
                    // Pulling in each friends information to be displayed in friends list
                    $.ajax({
                        type: 'GET',
                        url: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + apiKey + '&steamids=' + getFriendId + '',
                        success: function(friendsCards) {
                            $.each(friendsCards, function(i, friendCard) {
                                var setFriends = (friendsCards.response.players)
                                // Pulling in specific information from each friend
                                $.each(setFriends, function(i, setFriend) {
                                    var friendName = setFriends[i].personaname;
                                    var friendImg = setFriends[i].avatarfull;
                                    var friendSteamId = setFriends[i].steamid;
                                    // Append each friend in their own card
                                    $('#friends').append(
                                    '<li class="friend-card">' + 
                                        '<img src="' + friendImg + '" alt="' + friendName + ' profile picture">' + 
                                        '<div class="friend-info">' +
                                            '<h1>' + friendName + '</h1>' +
                                            '<button id="friend-id" value="' + friendSteamId + '">Load friend ID</button>' +
                                        '</div>' +
                                    '</li>'
                                    );
                                    // Assigns friend steam id in the search bar
                                    $(".friend-info > button").on('click', function(){
                                        $('#friendId').val($(this).attr("value"));
                                        $('.applied-alert').show().delay(3000).fadeOut();
                                    });
                                });
                            });
                        }});
                });
            });
        }
    });
    // Checks if friends are empty to display error message for user
    setTimeout( function() {
        if($('#friends').is(':empty')) {
            $('#friends').css({"align-content": "center"});
            $('#friends').append('<h1 style="width: 100%">Friends list not found!</h1><br/><p>Enter friend ID in search bar above</p>');
        }
    }, 750);

    // Shows and hides neccessary elements
    $('#profile-spinner').hide();
    $('#friend-search').show(); 
    $('.friends').show();
    $('.player-one').show();  
    $('.mutual-games').show();
    $('.mutual-loading').hide();
    $('#mutual-games-warning').show();    
}, 2000);
}});     

    // Start of getting information for player two
    $('#p2-submit').on('click', function(event) {
        event.preventDefault();
        // Makes sure the input is not empty if it is then don't run rest of function
        if($('#friendId').val().trim().length === 0) {
            $('#empty-input-two').show();
            return
        } else {
        $('#profile-spinner').show();
        $('.mutual-loading').show();
        $('#mutual-games-warning').hide();   
        $('.friends').hide();
        $('#p2-games').empty();
        $('#p2-profile').empty();

        var getUserId2 = $("#friendId").val();
        // Catch inputed user SteamID and convert if neccessary
        $.ajax({
            type: 'GET',
            url: 'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key='+ apiKey +'&vanityurl=' + getUserId2,
            success: function(convertId) { 
            // If inputed value is not a valid vanity URL then keep value assuming it is a valid steam ID
            if(convertId.response.steamid === undefined) {
                steamVariables.userId2 = (getUserId2);
            // Fun error message, not needed but I liked it :)
            } else if(convertId.response.steamid === steamVariables.userId1 ) {
                alert("You have the same games as yourself, duh!\nBut whatever, check for youself..");
                steamVariables.userId2 = (convertId.response.steamid);
            // If valid vanity url get and save the returning steam ID
            } else {
                steamVariables.userId2 = (convertId.response.steamid);
            }}
        });
        
        // Start of loading Steam Profile
        setTimeout(function() {
        $.ajax({
        type: 'GET',
        url: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + apiKey +'&steamids=' + steamVariables.userId2,
        success: function(profile) {
            // Get profile
            $.each(profile, function(i, profile) {
                var Profiles = (profile.players);
                // If a profile is not returned then give error message & fill placeholder profile
                if(Profiles.length === 0) {
                    $('#p2-profile').append('<div class="playerTwoProfile"><img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg" alt="Default Profile Picture"><p>User not found</p></div>');
                    $('#p2-games').append('<div class="library-error"><h1>User not found!</h1>' + '<br>' + '<p>Lets try a different ID!</p></div>');
                } else {
                // Get player info for profile
                $.each(Profiles, function(i,e) {
                    var friendName = Profiles[i].personaname;
                    var friendAvatar = Profiles[i].avatarfull;
                    var friendProfileUrl = Profiles[i].profileurl;
                    var str1='';
                    // Append profile
                    $('#p2-profile').append('<div class="playerTwoProfile"><a target="_blank" href="' + friendProfileUrl + '"><img src="' + friendAvatar + '" alt="' + friendName + ' Profile Picture"></a><p>' + friendName + '</p></div>');
                })}
            });
        }
    });

    // Get selected players game library
    $.ajax({
        type: 'GET',
        url: 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey +'&include_appinfo=true&include_played_free_games=true&steamid=' + steamVariables.userId2 + '&format=json',
        success: function(games) {
            // Get player library
            $.each(games, function(i, game) {
                var Games = (games.response.games);
                // If no games then return error message
                if(Games === undefined) {
                    $('#p2-games').css({"flex-direction":"column"});
                    $('#p2-games').append('<div class="library-error"><h1>Account library not available</h1>' + '<br>' + '<p>Please try again later</p></div>');
                } else { // Else continue to get player games
                    $('#p2-games').css({"flex-direction":"row"});
                    // Get game specific information
                $.each(Games, function(i,e) {
                    var name2 = Games[i].name;
                    var playtime_forever2 = Math.floor(Games[i].playtime_forever / 60) ;
                    var appid2 = Games[i].appid;
                    // Push player two games to it's own array for future use in library comparison
                    playerTwoGamesIds.push(appid2);
                    // Append player two games
                    $('#p2-games').append('<div class="perspective"><li><div data-sid=' + playtime_forever2 + ' id="img-card">' +
                                                '<a target="_blank" href="https://store.steampowered.com/app/' + appid2 +'/">' +
                                                    '<img class="game-cover" src="https://steamcdn-a.akamaihd.net/steam/apps/' + appid2 + '/library_600x900.jpg" alt="'+ name2 +'">' +
                                                    '<p class="game-logo">' + name2 + '</p>' +
                                                '</a>' +
                                        '</div></li></div>');
                                        // If game are not available then hide it to prevent img error icon
                                        $(".game-cover").on("error", function() {
                                            $(this).hide();
                                        });
                                    })}
            });
        }
    });    
}, 2000);
// Pause to allow games to load to prevent jarring loading for user
setTimeout(function() {
    $('#profile-spinner').hide();
    $('.player-two').show();
    $('.mutual-loading').show();
}, 3000)


// Compare player one and player two games
setTimeout(function() {
    for (let i = 0; i < playerOneGameIds.length; i++) {
            for (let j = 0; j < playerTwoGamesIds.length; j++) {
                if (playerOneGameIds[i] === playerTwoGamesIds[j]) {
                    mutualGames.push(playerOneGameIds[i]);
                }
            }
        };

        // Append games both players have
        $.each(mutualGames, function(i,e) {
            var sharedGame = mutualGames[i];
                $('#mutual-games').append(
                    '<div class="perspective"><li><div id="img-card">' +
                        '<a target="_blank" href="https://store.steampowered.com/app/' + sharedGame +'/">' +
                            '<img class="game-cover" src="https://steamcdn-a.akamaihd.net/steam/apps/' + sharedGame + '/library_600x900.jpg" alt="game cover art">' +
                            '<img class="game-header" src="https://cdn.akamai.steamstatic.com/steam/apps/' + sharedGame + '/header.jpg" alt="game cover art">' +
                            '<p class="gameError">Oops! <br> Game not found! <br> This could be a test server!</p>' +
                        '</a>' +
                    '</div></li></div>' );

                // Remove game box are if not available to prevent image errors on screen
                $(".game-cover").on("error", function() {
                    $(this).remove();
                        // Remove back up game art to prevent image errors on screen
                        $(".game-header").on("error", function() {
                            $(this).remove();
                    });
                });
        })

        // If no mutual games are returned then show error
        if(mutualGames.length === 0) {
            $('#mutual-games-error').show();    
        }
        $('#mutual-game-count').append(" " + mutualGames.length);
        $('.mutual-loading').hide();
        $('#mutual-games-list').show();
}, 10000)}
});     

    // Hide Current friend and show friends list
    $('#show-friends').on('click', function() {
        $('#mutual-games-warning').show();  
        $('#mutual-games-error').hide();   
        $('#mutual-game-count').empty();
        $('#mutual-games').empty();
        $('.player-two').hide();
        $('.friends').show();
        $('#empty-input-two').hide();
        mutualGames.length = 0;
        playerTwoGamesIds.length = 0;
    })

    // Refresh page to allow user to return to original search bar, this is a temporary solution
    $('#show-search').click(function() {
        history.go(0)
    });
});