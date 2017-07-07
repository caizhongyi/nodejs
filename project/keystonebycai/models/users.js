var _ = require('underscore'),
	keystone = require('keystone'),
    bcrypt = require('bcrypt-nodejs'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var User = new keystone.List('User', {
	// use nodelete to prevent people from deleting the demo admin user
	nodelete: true
});


User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	phone: { type: String, width: 'short' },
	photo: { type: Types.CloudinaryImage, collapse: true },
	password: { type: Types.Password, initial: true, required: false }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone' },
	isProtected: { type: Boolean, noedit: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'author' });


/** 
	Methods
	=======
*/

User.schema.methods.wasActive = function() {
	this.lastActiveOn = new Date();
	return this;
}


/**
 * PROTECTING THE DEMO USER
 * The following hooks prevent anyone from editing the main demo user itself,
 * and breaking access to the website cms.
 */

var protect = function(path) {
	User.schema.path(path).set(function(value) {
		return (this.isProtected) ? this.get(path) : value;
	});
}

_.each(['name.first', 'name.last', 'email', 'isAdmin'], protect);

function hash( val ){
    var salt = bcrypt.genSaltSync( 10 );
    return  bcrypt.hashSync( val ,salt , function(){} );
}

User.schema.path('password').set(function(value) {
	return (this.isProtected) ? hash('admin') : value;
});


/**
 * Registration
 */

User.addPattern('standard meta');
User.defaultColumns = 'name, email, isAdmin';
User.register();
