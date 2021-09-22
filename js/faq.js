$(document).ready(function() {
    $('.answer').hide();

    $('.question').on('click', function() {
        $(this).next().slideToggle(500);
    });

});