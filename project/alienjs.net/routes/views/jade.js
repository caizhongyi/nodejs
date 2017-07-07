var md = require("node-markdown").Markdown,
    keystone = require('keystone'),
    fs = require("fs");

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res),
         locals = res.locals;
    var html = fs.readFileSync('./templates/files/jade.md',{encoding:'utf8',flag:'r'});
    locals.codes = md(html, true);
    view.render('jade', {
        section: 'home'
    });
}