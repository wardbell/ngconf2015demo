///<reference path="typings/tsd.d.ts"/>
import {Component, View, bootstrap, NgFor, bind} from 'angular2/angular2';

//import {AngularFire, FirebaseArray} from 'firebase/angularfire';
//import {Todo, TodoService} from 'todo.fake.service';
import {Todo, TodoService} from 'todo.service';
import {TodoService as TodoServiceFn} from 'todo.service.as.function';

@Component({
  selector: 'todo-app',
  appInjector: [
    //AngularFire,
    //bind(Firebase).toValue(new Firebase('https://webapi.firebaseio-demo.com/test')),
    TodoService,
    TodoServiceFn
]})
@View({
  templateUrl: 'todo.html',
  directives: [NgFor]
})
export class TodoApp {
  //todoService: FirebaseArray ;
  todoService: TodoService;
  todoEdit: Todo;
  todoFilter: Boolean;

  // constructor(sync: AngularFire) {
  //   this.todoService = sync.asArray();
  constructor(service:TodoService) {
    this.todoService = service;
    this.todoEdit = null;
    this.todoFilter = null;
  }
  enterTodo($event, newTodo) {
    if($event.which === 13) { // ENTER_KEY
      var todoText = newTodo.value.trim();
      if (todoText) {
        this.addTodo(todoText);
        newTodo.value = '';
      }
    }
  }
  editTodo($event, todo) {
    this.todoEdit = todo;
  }
  doneEditing($event, todo) {
    var which = $event.which;
    var target = $event.target;
    if(which === 13) {
      todo.title = target.value;
      this.todoService.save(todo);
      this.todoEdit = null;
    } else if (which === 27) {
      this.todoEdit = null;
      target.value = todo.title;
    }
  }
  addTodo(newTitle) {
    this.todoService.add({
      title: newTitle,
      completed: false
    });
  }
  completeMe(todo) {
    todo.completed = !todo.completed;
    this.todoService.save(todo);
  }
  deleteMe(todo) {
    this.todoService.remove(todo);
  }
  toggleAll($event) {
    var isComplete = $event.target.checked;
    this.todoService.list.forEach((todo)=> {
      todo.completed = isComplete;
      this.todoService.save(todo);
    });
  }
  clearCompleted() {
    var toClear = {};
    this.todoService.list.forEach((todo) => {
      if(todo.completed) {
        // toClear[todo._key] = null; // firebase
        toClear[todo._id] = null; // mongodb
      }
    });
    this.todoService.bulkUpdate(toClear);
  }
  
  showAll() {
    this.todoFilter = null;
  }
  showActive() {
    this.todoFilter = true;
  }
  showCompleted() {
    this.todoFilter = false;
  }
  
  getMembers() {
    this.todoService.getMembers()
    .then(members => {
      alert("Got github IdeaBlade members: "+ members.join(', '));
    })
    .catch(error => {
      alert("Got error: " + error.message);
    }) 
  }
  
}

bootstrap(TodoApp);
