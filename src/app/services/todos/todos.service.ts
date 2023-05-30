import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { deleteEntities } from '@ngneat/elf-entities';
import {
  BehaviorSubject,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ToDo } from 'src/app/models/todo';
import { PopulatedToDoList, ToDoList } from 'src/app/models/todo_list';
import {
  deleteTodo,
  insertTodo,
  insertTodoList,
  populateTodos,
  todosStore,
  updateTodo,
  updateTodoList,
} from 'src/app/store/store';

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
                    map((todos) => ({
                      listItem,
                      todos,
                    }))
                  )
              )
            ).pipe(tap((todos) => populateTodos(todos)))
          : of([]);
      }),
      tap(() => this.initialized$.next(true))
    );
  }

  addList(list: Partial<ToDoList>) {
    return this.http
      .post<ToDoList>(`${environment.apiUrl}/todoList/`, list)
      .pipe(tap((list) => insertTodoList(list)));
  }

  updateList(list: ToDoList) {
    return this.http
      .put<ToDoList>(`${environment.apiUrl}/todoList/${list.id}`, list)
      .pipe(tap((list) => updateTodoList(list)));
  }

  saveUpdateList(list: PopulatedToDoList) {
    return (list.id ? this.updateList(list) : this.addList(list)).pipe(
      tap(() => this.router.navigate(['//']))
    );
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
        tap((item) => insertTodo(item)),
        tap((item) =>
          this.router.navigateByUrl(
            this.router.createUrlTree(['detail', item.todoListId])
          )
        )
      );
  }

  updateTodo(todo: Partial<ToDo>, reroute = false) {
    return this.http
      .put<ToDo>(
        `${environment.apiUrl}/todoList/${todo.todoListId}/todos/${todo.id}`,
        todo
      )
      .pipe(
        tap((item) => updateTodo(item)),
        tap((item) => {
          reroute &&
            this.router.navigateByUrl(
              this.router.createUrlTree(['detail', item.todoListId])
            );
        })
      );
  }

  deleteTodo(todo: ToDo) {
    return this.http
      .delete<ToDo>(
        `${environment.apiUrl}/todoList/${todo.todoListId}/todos/${todo.id}`
      )
      .pipe(map((todo) => deleteTodo(todo)));
  }
}
