// Mongo
import mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true})
var db = new mongodb.Db('meanTodo', server, { w: 1 });
db.open(function() {});


interface ErrObj {
    message: string,
    status?: number
}

var BAD_ID:ErrObj = {
    message: 'Invalid _id; must represent a MongoDb ObjectID as a string of 24 hex characters',
    status: 400
};

interface Callback<T>{
    (err?:any, objs?:T): void
} 

// v.1 mongodb WriteResult. Should be in mongodb.d.ts
interface WriteResultv1 {
    result: {ok: number, n: number}
}

export interface Todo {
	_id?: mongodb.ObjectID | string,
	completed?: boolean,
	title?: string
}

/**
 * get all Todos. Faked ... doesn't touch the database
 */
export function getFakeTodos(callback: Callback<Todo[]>) {
    //var id = new mongodb.ObjectID(); // the way to create an ID
	let list: Todo[] = [
		{_id: new ObjectId('51f06ded06a7baa417000005'), title: 'Buy wine', completed: true,},
		{_id: new ObjectId('51f06ded06a7baa417000006'), title: 'Buy cheese', completed: true},
		{_id: new ObjectId('51f06ded06a7baa417000007'), title: 'Drink wine', completed: false},
		{_id: new ObjectId('51f06ded06a7baa417000008'), title: 'Buy more cheese', completed: false}     
    ];
    callback(null, list);
}

/**
 * get all Todos
 */
export function getAllTodos(callback:  Callback<Todo[]>) {
    withTodos(todos => {
        console.log('mongodb: getting all todos');
        todos.find({}).toArray(callback);
    }, callback);
}

/**
 * get the Todo with the given id
 */
export function getTodoById(id: string, callback: Callback<Todo>) {
    let _id = get_id(id);
    if (_id === BAD_ID){
        callback(BAD_ID);
        return;
    }
    
    withTodos(todos => {
        console.log('mongodb: looking for Todo w/ _id=' + _id);
        todos.findOne({_id: _id}, callback);
    }, callback);
}

/**
 * add new Todo
 */
export function addTodo(todoData: Todo,  callback: Callback<Todo>) {
    let _id = new ObjectId()
    let newTodo:Todo = {
        _id: new ObjectId(),
        title: todoData.title || '<new todo>',
        completed: !!todoData.completed,
    }
       
    withTodos(todos => {
        todos.insert(newTodo, afterInsert);
    }, callback);
    
    function afterInsert(err: ErrObj, result: WriteResultv1) {
        let emsg = 'mongodb: failed to insert todo' ;
        if (err) {
            emsg += err.message || err;
            console.log(emsg);
            err = {message: emsg};
        } else if (result.result.n !== 1) {
            emsg += ' with id= ' + _id + '; reported insert count = ' +result.result.n;
            console.log(emsg);
            err = {message: emsg}; 
        } else {
          console.log('mongodb: updated todo w/_id=' + _id);              
        }      
        callback(err, newTodo);
    }
}


/**
 * update existing Todo
 */
export function updateTodo(todoData: Todo, callback: Callback<{}>) {
    let _id = get_id(todoData && todoData._id);
    if (_id === BAD_ID){
        callback(BAD_ID);
        return;
    }
    let update = {
        $set: {
            title: todoData.title,
            completed: !!todoData.completed
        }
    }
    withTodos(todos => {
        todos.update({_id: _id}, update, afterUpdateDelete('update', _id, callback));
    }, callback);
}

/**
 * delete existing Todo
 */
export function deleteTodo(id: string, callback: Callback<{}>) {
    let _id = get_id(id);
    if (_id === BAD_ID){
        callback(BAD_ID);
        return;
    }
    withTodos(todos => {
        todos.remove({_id: _id}, {single: true}, afterUpdateDelete('delete', _id, callback));
    }, callback);
}
/////////////

/**
 * Get the 'todos' collection. If that succeeds, perform the action
 */
function withTodos<T>(
    action:   (collection:mongodb.Collection) => void, 
    callback: Callback<T>) {
        
   db.collection('todos', function(error, collection) {
        if(error) { 
            console.error(error); 
            callback(error); 
            return;
        }
        action(collection)
    });   
}

/**
 * Get an ObjectID from the input _id.
 * return it or the BAD_ID if _id is invalid
 */ 
function get_id(_id: string | mongodb.ObjectID) : mongodb.ObjectID | ErrObj {
    if (typeof _id === 'string')  {
        try {
            return new ObjectId(<string>_id); 
        } catch (e) {
            return BAD_ID;           
        }
    } else if (_id instanceof mongodb.ObjectID) {
        return _id;
    } else {
       return BAD_ID; 
    }  
}

function afterUpdateDelete<T>(opName: string, _id: any, callback: Callback<T>){
     return function afterUpdateDelete(err: ErrObj, result: WriteResultv1) {
            let emsg = 'mongodb: failed to '+opName+' todo w/_id=' + _id;
            if (err) {
                emsg += err.message || err;
                console.log(emsg);
                err = {message: emsg};
            } else if (result.result.n === 0) {
                emsg += '; not found';
                console.log(emsg);
                err = {message: emsg, status: 404}; 
            } else if (result.result.n !== 1) {
                emsg += '; reported write count = ' +result.result.n;
                console.log(emsg);
                err = {message: emsg};
            } else {
              console.log('mongodb: '+opName+'ed todo w/_id=' + _id);              
            }      
            callback(err);
        }  
}
