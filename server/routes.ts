/// <reference path='tsd-server.d.ts' />
import express = require('express')
import db = require('./db')

export var router:express.Router = express.Router();

router.get( '/todos',   getAllTodos); 
router.get( '/:resource',  apiNotFound); 

function apiNotFound(req: express.Request, res: express.Response, next: Function) {
    var resourceName  = req.params.resource;
        res.status(404).send('Unable to get resource "' + resourceName + '"');
}

function getAllTodos(req: express.Request, res: express.Response, next: Function) {
        //res.status(404).send('get Todos not yet implemented');
        db.getDummyTodos(_callback(res, next));
}

/////////////


// a common callback for query and save
function _callback(res: express.Response, next: Function) {
    return function(err:any, results:any) {
        if (err) {
            next(err);
        } else {
            // Prevent browser from caching results of API data requests
            res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.setHeader("Content-Type:", "application/json");
            res.json(results);
        }
    }
}