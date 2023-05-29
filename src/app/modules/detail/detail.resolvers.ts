import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { selectEntity } from '@ngneat/elf-entities';
import { filter, first, map, of, switchMap } from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import { TodosService } from 'src/app/services/todos/todos.service';
import { todosEntitiesRef, todosStore } from 'src/app/store/store';

export const todoResolveFn = (route: ActivatedRouteSnapshot) =>
  inject(TodosService).initialized$.pipe(
    filter(Boolean),
    switchMap((res) => {
      const todoId = route.paramMap.get('todoId');
      if (todoId) {
        return todosStore.pipe(
          selectEntity(todoId, { ref: todosEntitiesRef }),
          first(),
          map((todo) => todo as ToDo)
        );
      }
      return of({} as ToDo);
    })
  );

export const todoListResolveFn = (route: ActivatedRouteSnapshot) => {
  console.log('resolve list');
  return inject(TodosService).initialized$.pipe(
    filter(Boolean),
    switchMap(() => {
      const todoList = route.paramMap.get('listId');
      if (todoList) {
        return todosStore.pipe(selectEntity(todoList), first());
      } else {
        return of({});
      }
    })
  );
};
