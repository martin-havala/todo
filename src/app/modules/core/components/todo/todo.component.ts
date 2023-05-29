import { Component, Host, HostBinding, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import { TodosService } from 'src/app/services/todos/todos.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.sass'],
})
export class TodoComponent implements OnInit {
  @Input() item!: ToDo;

  @HostBinding('class') get cls() {
    return 'app-todo';
  }
  resolvedFC!: FormControl<boolean | null>;

  constructor(private todoService: TodosService) {}
  ngOnInit(): void {
    this.resolvedFC = new FormControl(this.item.resolved);

    this.resolvedFC.valueChanges
      .pipe(switchMap((v) => this.updateResolved(v ?? false)))
      .subscribe();
  }

  updateResolved(resolved: boolean) {
    return this.todoService.updateTodo({ ...this.item, resolved: resolved });
  }
}
