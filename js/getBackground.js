$(document).ready(function () {
    var randomBg = [0, 80, 440, 730, 570, 252490, 1085660, 578080, 271590, 381210, 359550, 230410, 413150, 289070, 489830]
    var randomNumber =  Math.floor(Math.random() * (15 - 1) + 1);

    $('body').css("background-image", "url('https://cdn.cloudflare.steamstatic.com/steam/apps/" + randomBg[randomNumber] + "/page_bg_generated_v6b.jpg')");
});