var express = require('express');
var router = express.Router();

var dbConfig = {
    client : 'mysql',
    connection : {
        host: 'localhost',
        user:'root',
        password:'root',
        database : 'nodeapp_db',
        charset : 'utf8'
    },
}
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);


router.get('/', function(req, res, next) {

    var Article = bookshelf.Model.extend({
        tableName: 'article'
    });

    var article = new Article().fetchAll()
        .then(function(articles) {
            res.render('bloglist',{
                articles : articles.toJSON()
            });

        }).catch(function(error) {
            console.log(error);
            res.send('An error occured');
        });


});
router.post('/',function(req,res,next){
    var Article = bookshelf.Model.extend({
        tableName: 'article'
    });
    var data = Article.forge({
        title : req.body.title,
        body : req.body.description,
        author : req.body.author
    }).save().then(function(u){
        res.redirect('/blog');
    });
    console.log(req.body);
})

module.exports = router ;