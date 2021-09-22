$(document).ready( function() {
    var apiKey = 'STEAM_API_KEY_HERE';     
    var Games = {};
    
    $('#game-loading').hide();
    
    $.ajax({
        type: 'GET',
        url: 'https://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=' + apiKey + '&format=json',
        success: function(AllGames) { 
            Games = AllGames;
        }});

    $('#random-game-btn').on('click', function() {
    $("#random-game-btn").prop('disabled', true);
    var randomNumber =  Math.floor(Math.random() * (125977 - 1) + 1);
    var randomGame = Games.applist.apps[randomNumber];
    var appId = randomGame.appid;
    var name = randomGame.name;

    $('#random-game-card').empty();
    $('#random-game-name').empty();
    $('#random-game-type').empty();
    $('#random-game-desc').empty();
    $('#random-game-card').hide();
    $('.game-info').hide();
    $('#game-loading').show();
            
    setTimeout(function(){
                $('#random-game-card').append(
                '<div class="perspective"><div id="img-card">' +
                    '<a target="_blank" href="https://store.steampowered.com/app/' + appId +'/">' +
                        '<img class="game-cover" src="https://steamcdn-a.akamaihd.net/steam/apps/' + appId + '/library_600x900.jpg" alt="'+ name +'">' +
                        '<p class="game-logo">' + name + '</p>' +
                    '</a>' +
                '</div></div>');
                $(".game-cover").on("error", function() {
                    $(this).hide();
                });
                $('#random-game-name').append('<p>' + name + '</p>');
                $.ajax({
                    type: 'GET',
                    url: 'https://store.steampowered.com/api/appdetails?appids=' + appId + '&currency_code=USD',
                    success: function(GameInfo) {
                        var type = GameInfo[appId].data.type;
                        var shortDesc = GameInfo[appId].data.short_description;
                        $('#random-game-type').append('<p>' + type + '</p>');
                        $('#random-game-desc').append('<p>' + shortDesc + '</p>');
            }
        });
    $('#random-game-card').show();
    $('.game-info').show();
    $('#game-loading').hide();  
    $("#random-game-btn").prop('disabled', false);    
    }, 500);
    });
});