var $ = require('jquery');

$(function($) {
    var comments = $('#comments');
    var input = $('.comment-field-input');
    var submit = comments.find('button[type=submit]');


    // Scroll to comments and focus input field
    function scrollToComments(e) {

        e.preventDefault();

        $('html, body').animate({ scrollTop: comments.offset().top }, 250);

        input.eq(0).focus();
    }
    $('[href="#comments"]').click( scrollToComments );


    // Check if field has content: enable/disable submit. Disable by default
    submit.attr('disabled','disabled');
    input.keyup(function() {
        if ($.trim($(this).val())) {
            submit.removeAttr('disabled');
        } else {
            submit.attr('disabled','disabled');
        }
    });
});