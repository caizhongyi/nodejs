var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
        locals = res.locals;

    var html2jade = require('html2jade');
    var html = req.params.post.html;
    html2jade.convertHtml(html, {}, function (err, jade) {
        // do your thing
        locals.jade = jade;
    });

    view.render('index', {
		section: 'html2jade'
	});
	
}
