/// <reference path='tsd-server.d.ts' />
import http = require("http")
import url = require("url")
//import routes = require("./routes/index")
//import db = require("./db")
import express = require("express")
import bodyParser = require("body-parser");
import methodOverride = require("method-override");
import errorHandler = require("errorhandler");
import routes =  require('./routes');

var port = 3001;
var app = express();

// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname+'/../'));

app.use('/api', routes.router);

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
else if (env === 'production') {
    app.use(errorHandler());
}


// Routes

//app.get('/', routes.index);
/*
app.get('/findImages', function(req, res) {
    console.log('getting images from' + req.query['url']);
   
    var req2 = http.get(url.parse(req.query['url']), function(urlres) {  
      console.log("Got response: " + urlres.statusCode);   
      var text = "";
      urlres.on('data', function(chunk: string) {  
        text += chunk;
      });   
      urlres.on('end', function() {
        console.log(text);     
        var re = /<img[^>]+src=[\"\']([^\'\"]+)[\"\']/g;
        var match, matches = [];
        while(match = re.exec(text)) {
            matches.push(match[1]);
        }
        res.write(JSON.stringify(matches));
        res.end();
      });
    }).on('error', function(a,e) {  
      console.log("Got error: " + e.message);   
    });   
});

app.get('/user/:userid', function(req, res) {
    console.log('getting user ' + req.params.userid);
    db.getUser(req.params.userid, function(user) {
        res.render('user', { 
            title: user._id,
            username: user._id, 
            boards: user.boards 
       });
    });
});

app.get('/user/:userid/newboard', function(req, res) {
    res.render('newboard', { 
        username: req.params.userid
    });    
});

app.post('/user/:userid/newboard', function(req, res) {
    db.addBoard(req.params.userid, req.param('title'), req.param('description'), function(user) {
        res.redirect('/user/'+req.params.userid)
    });
});

app.get('/user/:userid/:boardid', function(req, res) {
    console.log('getting ' + req.params.userid + ", " + req.params.boardid);
    db.getUser(req.params.userid, function(user) {
        var board = user.boards.filter(function(board) {
            return decodeURIComponent(req.params.boardid) === board.title;
        })[0];
        if(board) {
            db.getImages(board.images, function(images) {
                res.render('board', { 
                    title: user._id,
                    username: user._id, 
                    board: board,
                    images: images
                });
            });
        } else {
            res.send(404, 'not found');
        }
    });
});

app.get('/user/:userid/:boardid/newpin', function(req, res) {
    res.render('newpin', { 
        username: req.params.userid,
        boardid: req.params.boardid
    });    
});

app.post('/user/:userid/:boardid/newpin', function(req, res) {
    db.addPin(req.params.userid, req.params.boardid, req.param('imageUri'), req.param('link'), req.param('caption'), function(user) {
        res.redirect('/user/'+req.params.userid +"/" + req.params.boardid)
    });
});

app.get('/image/:imageid', function(req, res) {
    console.log('getting image ' + req.params.imageid);
    db.getImage(req.params.imageid, function(image) {
        res.render('image', { 
            title: "image",
            image: image
        });
    });
});
*/

app.listen(port, function(){
    console.log("process.cwd(): "+process.cwd());
    console.log("__dirname: "+__dirname);
    console.log("Demo Express server listening on port %d in %s mode", port, app.settings.env);
});

export var App = app;