import { createStore, select } from '@ngneat/elf';
import {
  addEntities,
  entitiesPropsFactory,
  updateEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { ToDo } from '../models/todo';
import { PopulatedToDoList, ReferencedToDoList } from '../models/todo_list';

export const { todosEntitiesRef, withTodosEntities } =
  entitiesPropsFactory('todos');
export const todosStore = createStore(
  { name: 'todos' },
  withEntities<ReferencedToDoList>(),
  withTodosEntities<ToDo>(),
  withActiveId()
);

export const todoLists$ = todosStore.pipe(
  select(({ entities, todosEntities }) => {
    return Object.keys(entities).reduce(
      (acc, key) => [
        ...acc,
        {
          ...entities[key],
          todos: entities[key].todos.map((key) => todosEntities[key]),
        } as PopulatedToDoList,
      ],
      [] as PopulatedToDoList[]
    );
  })
);

export const selectTodoList = (id: string | null) =>
  todosStore.pipe(
    select(({ entities, todosEntities }) => {
      const list = id && entities[id];
      return list
        ? { ...list, todos: list.todos.map((key) => todosEntities[key]) }
        : null;
    })
  );

export const selectTodo = (id: string | null) =>
  todosStore.pipe(
    select(({ todosEntities }) => {
      return id ? todosEntities[id] : null;
    })
  );

export const insertTodo = (item: ToDo) => {
  todosStore.update(addEntities(item, { ref: todosEntitiesRef })),
    todosStore.update(
      updateEntities(item.todoListId, (entity) => ({
        ...entity,
        todos: [...entity.todos, item.id],
      }))
    );
};

export const updateTodo = (item: ToDo) => {
  todosStore.update(updateEntities(item.id, item, { ref: todosEntitiesRef }));
};
