///<reference path="typings/tsd.d.ts"/>
///<reference path="typings/window.extend.d.ts" />
export interface Todo {
	_id?: string,
	completed: boolean,
	title: string
}

export class TodoService {
	list: Todo[];
	members: string[];
    constructor(){
		console.log('*** Using FAKE todo.service');
	    this.list = [];	
		this.getTodos();
    }
	/**
	 * Get all todos
	 */
    getTodos() : Promise<Todo[]> {			
		// Start with fake todos
        this.list = [
			{_id: '51f06ded06a7baa417000001', completed: true, title: 'Buy beer'},
			{_id: '51f06ded06a7baa417000002', completed: true, title: 'Buy pretzels'},
			{_id: '51f06ded06a7baa417000003', completed: false, title: 'Drink beer'},
			{_id: '51f06ded06a7baa417000004', completed: false, title: 'Buy more beer'}
		];
		console.log("Got fake todos: " + 
			this.list.map(t=>t.title).join(', '));
		return Promise.resolve(this.list);	
	}
	
	/**
	 * Save changes to a single Todo
	 */	
	save(updateTodo: Todo) {
		// no op
		console.log('Updated fake todo: ' + updateTodo.title);
		return Promise.resolve(updateTodo);
	}
		
	/**
	 * Add new Todo and save
	 */
	add(newTodo: Todo)	{
		newTodo._id = 'NEW_TODO_' + Date.now();
		this.list.push(newTodo);
		console.log('Added fake todo="'+newTodo.title+'" with _id=' + newTodo._id);
		return Promise.resolve(newTodo);
	}
	
	/**
	 * Remove Todo and save
	 */
	remove(remTodo: Todo) {
		let ix = this.list.indexOf(remTodo);
		if (ix < 0) {
			console.log('Remove error: fake ' + remTodo.title + ' not found');
			return Promise.reject({message: 'not found'});
		}
		this.list.splice(ix, 1);
		console.log('Deleted fake todo: ' + remTodo.title);
		return Promise.resolve(remTodo);
	}

	/**
	 * Save updated changes to many Todos
	 */
	bulkUpdate(updates:{}){
		// no op
		console.log('called noop bulkUpdate');
	}
	
	/**
	 * get the IdeaBlade github members and populate member array
	 * demonstrates use of `fetch` for HTTP service calls
	 */	
	getMembers() : Promise<string[]> {		
	    return window.fetch('https://api.github.com/orgs/ideablade/members')
	        .then(response => 
				response.json())
	        .then(json => {
				this.members = json.map(x => x.login);
				console.log("Got github IdeaBlade members: " + this.members.join(', '))
				return this.members;
	        })
	        .catch(error => {
	          console.log("Error getting members: " + error.message);
			  return Promise.reject(error);
	        })   
    }

}