import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import { PopulatedToDoList } from 'src/app/models/todo_list';
import { todoLists$ } from 'src/app/store/store';

@UntilDestroy()
@Component({
  selector: 'app-todo-menu',
  templateUrl: './todo-menu.component.html',
  styleUrls: ['./todo-menu.component.sass'],
})
export class TodoMenuComponent implements OnInit {
  list$!: Observable<PopulatedToDoList[]>;
  email$!: Observable<string | null>;
  searchStrCtrl!: FormControl<string | null>;
  filterStateCtrl!: FormControl<'active' | 'resolved' | 'all' | null>;
  constructor(private authService: AuthService) {}

  todoFilter(todos: ToDo[], filterState: 'active' | 'resolved' | 'all' | null) {
    return todos.filter((td) => {
      switch (filterState) {
        case 'resolved':
          return td.resolved;
        case 'active':
          return !td.resolved;
        default:
          return true;
      }
    });
  }
  ngOnInit(): void {
    this.searchStrCtrl = new FormControl('');
    this.filterStateCtrl = new FormControl('all');
    this.list$ = combineLatest({
      list: todoLists$,
      searchStr: this.searchStrCtrl.valueChanges.pipe(startWith('')),
      filterState: this.filterStateCtrl.valueChanges.pipe(startWith(null)),
    }).pipe(
      untilDestroyed(this),
      map(({ list, searchStr, filterState }) => {
        return list
          .filter(
            (l) =>
              !searchStr ||
              l.todos.filter((td) => {
                return td.title.includes(searchStr);
              }).length > 0
          )
          .map((l) => ({
            ...l,
            todos: this.todoFilter(l.todos, filterState),
          }));
      })
    );
    this.email$ = this.authService.user$.pipe(map((u) => u?.email || null));
  }
}
