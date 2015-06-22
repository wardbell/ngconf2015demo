/// <reference path='tsd-server.d.ts' />
import express = require('express')
import db = require('./db')

export var router:express.Router = express.Router();

router.get('/todos/:id', getTodoById); 
router.get('/todos',  getAllTodos); 
router.post('/todos', addTodo); 
router.put('/todos', updateTodo); 
router.delete('/todos/:id', deleteTodo); 

router.all('/:resource?', apiNotFound);
router.all('/', apiNotFound);

function getAllTodos(req: express.Request, res: express.Response, next: Function) {
    db.getAllTodos(_callback(res, next));
}

function getTodoById(req: express.Request, res: express.Response, next: Function) {
     db.getTodoById(req.params.id, _callback404(res, next));
}

function addTodo(req: express.Request, res: express.Response, next: Function){
    // Todo: set the Location header
    db.addTodo(req.body, _callback(res, next, 201));
}

function updateTodo(req: express.Request, res: express.Response, next: Function){
    db.updateTodo(req.body, _callback(res, next, 204));
}

function deleteTodo(req: express.Request, res: express.Response, next: Function){
    db.deleteTodo(req.params.id, _callback(res, next, 204));
}

function apiNotFound(req: express.Request, res: express.Response, next: Function) {
    var resourceName  = req.params.resource || '';
        res.status(404).send('Unable to get resource "' + resourceName + '"');
}
/////////////

// post-process response just before sending it.
type ResHandler = (res: express.Response, results?:{} | {}[]) => express.Response;

function addStandardHeaders(res: express.Response){
    // Prevent browser from caching results of API data requests
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader("Content-Type:", "application/json");   
}

// a common callback for query and save
function _callback(res: express.Response, next: Function, status = 200, resHandler?: ResHandler) {
    return function(err:any, results?:{} | {}[]) {     
        if (err) {
            var emsg = err.message || err;
            console.log("mongodb returned error: " + emsg)
            res.status(err.status || 500)
               .json({message: emsg || 'bad request'}); 
            return;

        } else {
            
            // DIAGNOSTIC
            if (results == null) {
                console.log('db: returned null/undefined');
            } else if (Array.isArray(results)){
                console.log('db: returned with results length ' + (<{}[]>results).length);
                console.log('db: first is ' + JSON.stringify((<{}[]>results)[0]));               
            } else {
                console.log('db: returned a single obj: ' + JSON.stringify(results));               
            }

            res.status(status);
            addStandardHeaders(res);
            if (resHandler){
                resHandler(res, results);
            }       
            res.json(results);
        }
    }
}

// returns a 404 if the response is null; wraps _callback
function _callback404(res: express.Response, next: Function, status = 200, resHandler?: ResHandler) {
    var cb = _callback(res, next, status, resHandler);
    return function(err:any, results:{} | {}[]) {
         if(!err && results == null) {
             console.log('db: returned null/undefined; treat as an error');
             err = {message: 'not found', status: 404}         
         }
         cb(err, results);
    }
}