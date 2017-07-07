// Load .env for development environments
require('dotenv')().load();

var keystone = require('keystone');

/**
 * Application Initialisation
 */

keystone.init({
	'name': 'Alienjs',
	'brand': 'Alienjs',
	
	'favicon': 'public/favicon.ico',
	'stylus': 'public',
	//'less': 'public',
	'browserify':'public/js',
	//'sass': 'public',
	'static': 'public',
	
	'views': 'templates/views',
	'view engine': 'jade',

    'auto update':true,

    'port' : 18080,

    'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI ||  'mongodb://localhost:8908/alienjs',
    //'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI ||  'mongodb://x035WHLcDZ24YtiZe6Gk6yCO:EQKgantQ2Lqet2L3pFipty0cDM3LciZb@mongo.duapp.com:8908/dVLbtHWHIpiqcwpYxxKO',

    'compress ':true,

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'Alienjs',
	
	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,
	
	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN,

    'emails': 'templates/emails',
    'mandrill api key': '--- your api key ---',
 //   'email rules': { find: '/images/', replace: (keystone.get('env') != 'production') ? 'http://localhost:3000/images/' : 'http://www.keystonejs.com/images/email/' },

	'cloudinary config': { cloud_name: 'http-www-alienjs-net', api_key: '374497676459149', api_secret: '9Azg0X0oaizMf7AqW1jlyS_J_7M' }
	//'cloudinary config':  'cloudinary://api_key:api_secret@cloud_name',
	//'cloudinary prefix':  'keystone',
	//'cloudinary folders':  'true'
});

require('./models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('wysiwyg images', true );
//keystone.set('wysiwyg cloudinary images', true );
keystone.set('wysiwyg skin', 'alienjs' );
keystone.set('routes', require('./routes'));



keystone.set('nav', {
	'posts': ['posts', 'post-comments', 'post-categories'],
	'galleries': 'galleries',
	'enquiries': 'enquiries',
	'users': 'users',
	'field-tests': 'things'
});

keystone.start();
