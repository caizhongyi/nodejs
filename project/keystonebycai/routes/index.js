var _ = require('underscore'),
	keystone = require('keystone'),
	importRoutes = keystone.importer(__dirname)


function restrictToAdmins(req, res, next) {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.redirect('/signin');
	}
}

keystone.pre('routes', function(req, res, next) {
	
	res.locals.navLinks = [
		{ label: '首页', key: 'home', href: '/' },
		/*{ label: 'Nodejs', key: 'blog', href: '/blog' },*/
		{ label: 'Nodejs', key: 'Nodejs', href: 'http://nodejs.org/' },
		{ label: 'NPM', key: 'NPM', href: 'https://www.npmjs.org/' },
		{ label: 'watchify', key: 'watchify', href: 'http://seajs.org/' },
		{ label: 'borwserify', key: 'borwserify', href: 'http://seajs.org/' },
		{ label: 'SPM', key: 'SPM', href: 'http://spmjs.io/' },
		{ label: 'Jade', key: 'Jade', href: '/jade' },
		{ label: 'Stylus', key: 'Stylus', href: 'http://learnboost.github.io/stylus/docs/introspection.html' },
		{ label: 'Keystonejs', key: 'Keystonejs', href: 'http://keystonejs.com/' },
	/*	{ label: 'Gallery', key: 'gallery', href: '/gallery' },*/
		{ label: '留言', key: 'contact', href: '/contact' }
	];
	
	res.locals.user = req.user;
	
	next();
	
});

keystone.pre('render', function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;
	
	next();
	
});

keystone.set('404', function(req, res, next) {
	res.status(404).render('errors/404');
});

// Load Routes
var routes = {
	//api: importRoutes('./api'),
	download: importRoutes('./download'),
	views: importRoutes('./views'),
    //filemanager: importRoutes('./node_modules/keystone/public/js/lib/tinymce/plugins/filemanager'),
    server: importRoutes('./server')
};

exports = module.exports = function(app) {
	//tinymce routes
    require('../node_modules/keystone/public/js/lib/tinymce/plugins/filemanager/routes')(app);
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.get('/jade', routes.views.jade);
	app.all('/contact', routes.views.contact);

	app.all('/statistics/:type', routes.server.statistics);
	app.all('/json/:json', routes.server.json);
	//app.all('/capp', routes.server.capp);
	//app.all('/node_modules/keystone/public/js/lib/tinymce/plugins/filemanager/dialog.js', routes.filemanager.dialog);

	// Downloads
	app.get('/download/users', routes.download.users);

	//app.use(keystone.express.bodyParser({uploadDir:'./upload'}));

	// API
	//app.all('/api*', keystone.initAPI);

	//combo server
	//app.use(combo(__dirname + '/../public/', "public"));

}

