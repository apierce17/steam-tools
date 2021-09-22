$(document).ready(function() {
    windowSize = $(document).width();

    $('#hamburger').on('click', function() {
        $('#nav-list').toggleClass("slide-in");
        $('#nav-list').toggleClass("slide-out");
        $('body').toggleClass("no-scroll");
        $('#hamburger').toggleClass("is-active");
    });

    $('.close-nav').on('click', function() {
        $('#nav-list').fadeToggle(200);
        $('body').toggleClass("no-scroll");
    });

    $(window).resize(function() {
        if(windowSize > 900) {
            $('#nav-list').css({"display": "flex"});
            $('body').removeClass("no-scroll");
        }
    });
});