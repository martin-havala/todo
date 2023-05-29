import { createStore } from '@ngneat/elf';
import {
  entitiesPropsFactory,
  withActiveId,
  withEntities
} from '@ngneat/elf-entities';
import { ToDo } from '../models/todo';
import { ReferencedToDoList } from '../models/todo_list';

export const { todosEntitiesRef, withTodosEntities } = entitiesPropsFactory('todos');
export const todosStore = createStore(
  { name: 'todos' },
  withEntities<ReferencedToDoList>(),
  withTodosEntities<ToDo>(),
  withActiveId()
);
