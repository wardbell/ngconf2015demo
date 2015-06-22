// Mongo
import mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true})
var db = new mongodb.Db('meanTodo', server, { w: 1 });
db.open(function() {});

export interface Todo {
	_id?: mongodb.ObjectID,
	completed: boolean,
	title: string
}

export var BAD_ID = new Error('Invalid _id; must represent a MongoDb ObjectID as a string of 24 hex characters');

interface Callback<T>{
    (err:any, objs?:T): void
} 

// v.1 mongodb WriteResult. Should be in mongodb.d.ts
interface WriteResultv1 {
    ok: number, n: number
}

var ObjectId = mongodb.ObjectID;
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
    let _id: mongodb.ObjectID;
    try {
      _id = new ObjectId(id);          
    } catch(e){
        callback(BAD_ID);
        return;
    }
    
    withTodos(todos => {
        console.log('mongodb: looking for Todo w/ _id=' + _id.toString());
        todos.findOne({_id: _id}, callback);
    }, callback);
}

/**
 * add new Todo
 */
export function addTodo(todoData: Todo,  callback: Callback<Todo>) {
    let newTodo:Todo = {
        _id: new ObjectId(),
        title: todoData['title'] || '<new todo>',
        completed: !!todoData['completed'],
    }
    
    withTodos(todos => {
        todos.insert(newTodo, afterInsert);
    }, callback);
    
    function afterInsert(err: {}, result: WriteResultv1) {
        if (err) {
            console.log('mongodb: insert of new todo failed.')
            callback(err);
            return;
        }
        if (result.n != 1) {
            
        }
        
        console.log('mongodb: inserted new todo w/ _id=' + newTodo._id)
        callback(null, newTodo);
    }
}

/////////////

// Get the 'todos' collection. If that succeeds, perform the action
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

/*
export function getUsers(callback: (users: User[]) => void) {
    db.collection('users', function(error, users_collection) {
        if(error) { console.error(error); return; }
        users_collection.find({}, { '_id': 1 }).toArray(function(error, userobjs) {
           if(error) { console.error(error); return; }
           callback(userobjs);
        });
    });
}

export function getImage(imageId: string, callback: (image: Image) => void) {
    db.collection('images', function(error, images_collection) {
        if(error) { console.error(error); return; }
        images_collection.findOne({_id: new mongodb.ObjectID(imageId)}, function(error, image) {
            if(error) { console.error(error); return; }
            callback(image);
        });
    });
}

export function getImages(imageIds: mongodb.ObjectID[], callback: (images: Image[]) => void) {
    db.collection('images', function(error, images_collection) {
        if(error) { console.error(error); return; }
        images_collection.find({_id: {$in: imageIds}}).toArray(function(error, images) {
            callback(images);
        });
    }); 
}

export function addBoard(userid: any, title: string, description: string, callback: (user: User) => void) {
    db.collection('users', function(error, users) {
        if(error) { console.error(error); return; }
        users.update(
            {_id: userid}, 
            {"$push": {boards: { title: title, description: description, images: []}}}, 
            function(error, user) {
                if(error) { console.error(error); return; }
                callback(user);
            }
        );
    });
}

export function addPin(userid: string, boardid: string, imageUri: string, link: string, caption: string, callback: (user: User) => void) {
    db.collection('images', function(error, images_collection) {
        if(error) { console.error(error); return; }
        images_collection.insert({
            user: userid,
            caption: caption,
            imageUri: imageUri,
            link: link,
            board: boardid,
            comments: []
        }, function(error, image) {
            console.log(image);
            db.collection('users', function(error, users) {
                if(error) { console.error(error); return; }
                users.update(
                    {_id: userid, "boards.title": boardid}, 
                    {"$push": {"boards.$.images": image[0]._id}},
                    function(error, user) {
                        callback(user);
                    }
                );
            })
        })
    })
}
*/
