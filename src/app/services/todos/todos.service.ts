import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import {
  addEntities,
  deleteEntities,
  updateEntities,
} from '@ngneat/elf-entities';
import {
  BehaviorSubject,
  first,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ToDo } from 'src/app/models/todo';
import { PopulatedToDoList, ToDoList } from 'src/app/models/todo_list';
import { todosEntitiesRef, todosStore } from 'src/app/store/store';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  initialized$ = new BehaviorSubject<boolean>(false);
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  reload() {
    return this.authService.user$.pipe(
      switchMap((user) => {
        return this.http
          .get<ToDoList[]>(`${environment.apiUrl}/todoList`)
          .pipe(
            map((list) =>
              list.filter(
                (todo) => todo.userEmail === user?.email || !todo.private
              )
            )
          );
      }),
      switchMap((list) => {
        return list.length
          ? forkJoin(
              list.map((listItem) =>
                this.http
                  .get<ToDo[]>(
                    `${environment.apiUrl}/todoList/${listItem.id}/todos`
                  )
                  .pipe(
                    tap((items) => {
                      todosStore.update(
                        addEntities({
                          ...listItem,
                          todos: items.map((i) => i.id),
                        }),
                        addEntities(items, { ref: todosEntitiesRef })
                      );
                    })
                  )
              )
            )
          : of([]);
      }),
      tap(() => this.initialized$.next(true)),
      first()
    );
  }

  addList(list: Partial<ToDoList>) {
    return this.http
      .post<ToDoList>(`${environment.apiUrl}/todoList/`, list)
      .pipe(
        tap((res) => todosStore.update(addEntities({ ...res, todos: [] })))
      );
  }

  updateList(list: ToDoList) {
    return (
      this.http
        .put<ToDoList>(`${environment.apiUrl}/todoList/${list.id}`, list)
        //.pipe(switchMap((res) => this.reload().pipe(map((a) => res))));
        .pipe(tap((res) => todosStore.update(updateEntities(res.id, res))))
    );
  }

  saveUpdateList(list: PopulatedToDoList) {
    if (list.id) {
      return this.updateList(list);
    } else {
      return this.addList(list);
    }
  }

  deleteList(listId: string) {
    return this.http
      .delete<ToDoList>(`${environment.apiUrl}/todoList/${listId}`)
      .pipe(
        tap(() => {
          todosStore.update(deleteEntities(listId));
        })
      );
  }

  addTodo(todo: Partial<ToDo>) {
    return this.http
      .post<ToDo>(
        `${environment.apiUrl}/todoList/${todo.todoListId}/todos`,
        todo
      )
      .pipe(
        tap((item) => {
          todosStore.update(addEntities(item, { ref: todosEntitiesRef }));
          todosStore.update(
            updateEntities(item.todoListId, (entity) => ({
              ...entity,
              todos: [...entity.todos, item.id],
            }))
          );
        }),
        tap((item) =>
          this.router.navigateByUrl(
            this.router.createUrlTree(['detail', item.todoListId])
          )
        )
      );
  }

  updateTodo(todo: Partial<ToDo>) {
    return this.http
      .put<ToDoList>(
        `${environment.apiUrl}/todoList/${todo.todoListId}/todos/${todo.id}`,
        todo
      )
      .pipe(
        tap((res) => {
          todosStore.update(
            updateEntities(res.id, res, { ref: todosEntitiesRef })
          );
        }),
        tap((item) =>
          this.router.navigateByUrl(
            this.router.createUrlTree(['detail', item.id])
          )
        )
      );
  }

  deleteTodo(todo: ToDo) {
    return this.http
      .delete<ToDo>(
        `${environment.apiUrl}/todoList/${todo.todoListId}/todos/${todo.id}`
      )
      .pipe(
        tap((res) => {
          todosStore.update(deleteEntities(res.id, { ref: todosEntitiesRef }));
        })
      );
  }
}
