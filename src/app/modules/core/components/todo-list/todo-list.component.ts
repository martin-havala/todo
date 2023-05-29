import { Component, Input, OnInit } from '@angular/core';
import { PopulatedToDoList } from 'src/app/models/todo_list';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.sass'],
})
export class TodoListComponent implements OnInit {
  @Input() list!: PopulatedToDoList;

  constructor() {}

  ngOnInit(): void {}
}
