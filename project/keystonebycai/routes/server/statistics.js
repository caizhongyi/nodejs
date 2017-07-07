var keystone = require('keystone'),
     $ = require('mongoalienjs')(keystone._options.mongo);

exports = module.exports = function(req, res) {

    //console.log(req.body) // post
   // console.log(req.query)  // get
   // console.log(req.params) // route 参数 app.all('/json/:json', routes.server.json);  "/json/123"  params: [ json: '123' ];
    function callback( err , res ){
        if( err ){
            console.log(err);
            res.send({ "err" :  err });
            return ;
        }
        console.log(res);
        res.send({ "count" :  res });
    }
    $.get('app_updates').remove().find(function( err , data ){ console.log(data)}).exec();
    $.get('users').remove().find(function( err , data ){console.log(data) }).exec();
    res.send({ "count" :  1 });
  /*  var id = req.query.id;
    switch (req.params.type){
        case 'download':  $post.findAndModify({ _id : id } ,{ download : function(){ return this.download ++ ;}}).exec(callback);break;
        case 'view': $post.save({ _id : id, view : 1},callback);break;
    }*/

}
