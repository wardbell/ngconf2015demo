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
		return Promise.resolve(this.list);	
	}
	
	/**
	 * Add new Todo and save
	 */
	add(todo: Todo)	{
		this.list.push(todo);
	}
	/**
	 * Remove Todo and save
	 */
	remove(todo: Todo) {
		let ix = this.list.indexOf(todo);
		if (ix > 0) {
			this.list.splice(ix, 1);
			return true;
		} else {
			return false;
		}
	}
	/**
	 * Save changes to a single Todo
	 */	
	save(todo: Todo) {
		// no op
	}
	/**
	 * Save update changes to many Todos
	 */
	bulkUpdate(toUpdate:{}){
		// no op
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