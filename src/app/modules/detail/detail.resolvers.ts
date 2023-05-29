import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { filter, first, switchMap } from 'rxjs';
import { TodosService } from 'src/app/services/todos/todos.service';
import { selectTodo, selectTodoList } from 'src/app/store/store';

export const todoResolveFn = (route: ActivatedRouteSnapshot) =>
  inject(TodosService).initialized$.pipe(
    filter(Boolean),
    switchMap(() => {
      const todoId = route.paramMap.get('todoId');
      return selectTodo(todoId).pipe(first());
    })
  );

export const todoListResolveFn = (route: ActivatedRouteSnapshot) => {
  return inject(TodosService).initialized$.pipe(
    filter(Boolean),
    switchMap(() => {
      const todoList = route.paramMap.get('listId');
      return selectTodoList(todoList).pipe(
        first(),
      );
    })
  );
};
