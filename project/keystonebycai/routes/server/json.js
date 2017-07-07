exports = module.exports = function(req, res) {
    //console.log(req.body) // post
   // console.log(req.query)  // get
   // console.log(req.params) // route 参数 app.all('/json/:json', routes.server.json);  "/json/123"  params: [ json: '123' ];
     res.send({ "a" :  req.body.val });
}
