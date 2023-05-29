import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {
  getAllEntities,
  selectAllEntities
} from '@ngneat/elf-entities';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  Observable,
  map
} from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import {
  PopulatedToDoList
} from 'src/app/models/todo_list';
import { todosEntitiesRef, todosStore } from 'src/app/store/store';

@UntilDestroy()
@Component({
  selector: 'app-todo-menu',
  templateUrl: './todo-menu.component.html',
  styleUrls: ['./todo-menu.component.sass'],
})
export class TodoMenuComponent implements OnInit {
  list$!: Observable<PopulatedToDoList[]>;
  email$!: Observable<string | null>;
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.list$ = todosStore.pipe(
      selectAllEntities(),
      map((l) => {
        const todos: ToDo[] = todosStore.query(
          getAllEntities({ ref: todosEntitiesRef })
        );
        return l.map(
          (list) =>
            ({
              ...list,
              todos: todos.filter((td) => td.todoListId === list.id),
            } as PopulatedToDoList)
        );
      })
    );
    this.email$ = this.authService.user$.pipe(map((u) => u?.email || null));
  }
}
