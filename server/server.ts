/// <reference path='tsd-server.d.ts' />
import http = require("http")
import url = require("url")
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

app.listen(port, function(){
    console.log("process.cwd(): "+process.cwd());
    console.log("__dirname: "+__dirname);
    console.log("Demo Express server listening on port %d in %s mode", port, app.settings.env);
});

export var App = app;