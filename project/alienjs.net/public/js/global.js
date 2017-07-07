var $ = require('jquery'),
    pre = require('prettify')
require('jquery-masonry');
require('jquery-migrate');
//require('alienjs-extra');

//$.get('/json',{ val : '123'},function(data){ console.log(data)})
$('.site-header').find('.logo').bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(e){
    $(this).css('opacity', '1');
});

$('.code-example').each(function () {
    var html = $(this).html();
    $(this).empty();
    $('<pre class="prettyprint linenums">' + html + '</pre>').appendTo(this);
})
pre();

$('.masonry').length && $('.masonry').masonry({
    itemSelector: '.masonrybox',
    columnWidth: function( containerWidth ) {
        return containerWidth / 4;
    }
});
