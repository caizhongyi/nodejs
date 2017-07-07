var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
        locals = res.locals;


    view.on('init',function( next ){
        /*   keystone.list('Post').model.find()
         .populate('categories')
         // .where(function(){ return this.categories[0].name = locals[n].title ;})
         // .where('this.state =="draft"')
         .where({ state : 'draft' })
         .exec(function(err, data){
         locals[n].data = data ;
         console.log(data);
         next();
         });
         async.auto({
         postCategory : function( callback , data ){

         var q = keystone.list('PostCategory').model.findOne( { name : n } ) ;
         q.exec(function( err , data ){
         callback( null , data );
         })
         },
         post : [ 'postCategory', function( callback ,data ){
         keystone.list('Post').model.find({ categories : data.postCategory , state : 'published'}).exec(function( err  , data ) {
         locals[n].data = data;
         next();
         });
         }]
         },function( err , data ){});*/
        next();
    })

    view.render('index', {
		section: 'home'
	});
	
}
