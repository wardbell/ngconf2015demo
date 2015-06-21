/// <reference path='tsd-server.d.ts' />
import express = require('express')
import db = require('./db')

export var router:express.Router = express.Router();

router.get('/todos/:id', getTodoById); 
router.get('/todos',  getAllTodos); 
router.get('/:resource', apiNotFound); 

function apiNotFound(req: express.Request, res: express.Response, next: Function) {
    var resourceName  = req.params.resource;
        res.status(404).send('Unable to get resource "' + resourceName + '"');
}

function getAllTodos(req: express.Request, res: express.Response, next: Function) {
    //res.status(404).send('get Todos not yet implemented');
    //db.getFakeTodos(_callback(res, next));
    db.getAllTodos(_callback(res, next));
}

function getTodoById(req: express.Request, res: express.Response, next: Function) {
     db.getTodoById(req.params.id, _callback404(res, next));
}

/////////////


// a common callback for query and save
function _callback(res: express.Response, next: Function) {
    return function(err:any, results?:{} | {}[]) {     
        if (err) {
            console.log("mongodb returned error: " + err.message || err)
            if (err === db.BAD_ID){
               res.status(400).json({message: err.message || 'bad request'}); 
               return;
            }
            next(err);
        } else {
            
            // DIAGNOSTIC
            if (results == null) {
                console.log('db: returned null/undefined');
            } else if (Array.isArray(results)){
                console.log('db: returned with results length ' + (<{}[]>results).length);
                console.log('db: first is ' + JSON.stringify(results[0]));               
            } else {
                console.log('db: returned a single obj: ' + JSON.stringify(results));               
            }

            
            // Prevent browser from caching results of API data requests
            res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.setHeader("Content-Type:", "application/json");
            res.json(results);
        }
    }
}

// returns a 404 if the response is null; wraps _callback
function _callback404(res: express.Response, next: Function) {
    var cb = _callback(res, next);
    return function(err:any, results:{} | {}[]) {
         if(err) {
             cb(err);
         } else if (results == null) {
             console.log('db: returned null/undefined');
             res.status(404).json({message: 'not found'});            
         } else {
             cb(null, results);
         }
    }
}