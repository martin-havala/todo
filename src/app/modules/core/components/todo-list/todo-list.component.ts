import { Component, Input } from '@angular/core';
import { PopulatedToDoList } from 'src/app/models/todo_list';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.sass'],
})
export class TodoListComponent {
  @Input() list!: PopulatedToDoList;
}
