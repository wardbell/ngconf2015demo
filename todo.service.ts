///<reference path="typings/tsd.d.ts"/>
///<reference path="typings/window.extend.d.ts" />
export interface Todo {
	_id?: string,
	completed: boolean,
	title: string
}

export class TodoService {
	apiRoute = '/api/';
	list: Todo[];
	members: string[];
    constructor(){
		console.log('*** Using MONGODB todo.service');
		this.list = [];
		this.getTodos();
    }
		
	/**
	 * Get all todos from node server
	 * GET: ~/api/todos
	 */	
	getTodos() : Promise<Todo[]> {		
	    return window.fetch(this.apiRoute + 'todos')
	        .then(response => response.json())
	        .then(todos => {
				this.list = todos;
				console.log("Got todos from db: " + 
					this.list.map(t=>t.title).join(', '))
				return this.list;
	        })
	        .catch(this._handleError('getting todos'));		
	}
	
	/**
	 * Save changes to a single existing Todo
	 * PUT: ~/api/todos
	 */	
	save(updateTodo: Todo) {
		let options =  {
			method: 'put',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updateTodo)
		};
		return window.fetch(this.apiRoute + 'todos', options)
			.then(response => {
				console.log('Updated todo in db: ' + updateTodo.title);
				return updateTodo;
			})
			.catch(this._handleError('updating todo'));
	}
		
	/**
	 * Add new Todo and save
     * POST: ~/api/todos
	 */
	add(newTodo: Todo)	{
		this.list.push(newTodo);
		let options =  {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTodo)
		};
	    return window.fetch(this.apiRoute + 'todos', options)
	        .then(response => response.json())
	        .then(todo => {
				newTodo._id = todo._id;
				console.log('Added todo="'+todo.title+'" to db with _id=' + todo._id);
				return todo;
	        })
	        .catch(this._handleError('adding todo', () => {
				let ix = this.list.indexOf(newTodo);
				if (ix > -1) {
					this.list.splice(ix, 1);  // remove it 
				}				
			}));	
	}
	
	/**
	 * Remove Todo and save
	 * DELETE: ~/api/todos/51f06ded06a7baa417000001
	 */
	remove(remTodo: Todo) {
		let ix = this.list.indexOf(remTodo);
		if (ix < 0) {
			console.log('Remove error: ' + remTodo.title + ' not found');
			return Promise.reject({message: 'not found'});
		}
		
		this.list.splice(ix, 1);
		return window.fetch(this.apiRoute + 'todos/' + remTodo._id, {method: 'delete'})
        	.then(response => {
				console.log('Deleted todo in db: ' + remTodo.title);
				return remTodo;
			})
			.catch(this._handleError('removing todo', () => {
				this.list.splice(ix, 0, remTodo); // put it back		
			}));
	}

	/**
	 * Save updated changes to many Todos
	 */
	bulkUpdate(updates:{}){
		// TODO: implement this
		// no op
		console.log('called noop bulkUpdate');
	}
	
	/**
	 * get the IdeaBlade github members and populate member array
	 * demonstrates use of `fetch` for HTTP service calls
	 */	
	getMembers() : Promise<string[]> {
		
	    return window.fetch('https://api.github.com/orgs/ideablade/members')
	        .then(response => response.json())
	        .then(json => {
				this.members = json.map(x => x.login);
				console.log("Got github IdeaBlade members: " + this.members.join(', '))
				return this.members;
	        })
	        .catch(this._handleError('getting github IdeaBlade members')) ;  
    }
	
	/////////////
	
	private _handleError(opName: string, recover?: () => void) {
		return function handleError(error: {message?:string}){
          console.log('Error ' + opName + ': ' + error.message);
		  if (recover) {
			  recover();
		  }
		  return Promise.reject(error);		
		}
	}
}
