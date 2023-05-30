import { createStore, select } from '@ngneat/elf';
import {
  addEntities,
  deleteEntities,
  entitiesPropsFactory,
  updateEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { ToDo } from '../models/todo';
import {
  PopulatedToDoList,
  ReferencedToDoList,
  ToDoList,
} from '../models/todo_list';

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

export function selectTodoList(id: string | null) {
  return todosStore.pipe(
    select(({ entities, todosEntities }) => {
      const list = id && entities[id];
      return list
        ? { ...list, todos: list.todos.map((key) => todosEntities[key]) }
        : null;
    })
  );
}

export function selectTodo(id: string | null) {
  return todosStore.pipe(
    select(({ todosEntities }) => {
      return id ? todosEntities[id] : null;
    })
  );
}

export function insertTodoList(list: ToDoList) {
  return todosStore.update(addEntities({ ...list, todos: [] }));
}

export function updateTodoList(list: ToDoList) {
  return todosStore.update(updateEntities(list.id, list));
}

export function insertTodo(item: ToDo) {
  return (
    todosStore.update(addEntities(item, { ref: todosEntitiesRef })),
    todosStore.update(
      updateEntities(item.todoListId, (entity) => ({
        ...entity,
        todos: [...entity.todos, item.id],
      }))
    )
  );
}

export function updateTodo(item: ToDo) {
  return todosStore.update(
    updateEntities(item.id, item, { ref: todosEntitiesRef })
  );
}

export function deleteTodo(item: ToDo) {
  return todosStore.update(
    updateEntities(item.todoListId, (entity) => ({
      ...entity,
      todos: entity.todos.filter((id) => id !== item.id),
    })),
    deleteEntities(item.id, { ref: todosEntitiesRef })
  );
}

export function populateTodos(
  storeUpdates: { listItem: ToDoList; todos: ToDo[] }[]
) {
  return todosStore.update(
    addEntities(
      storeUpdates.map(({ listItem, todos }) => ({
        ...listItem,
        todos: todos.map((i) => i.id),
      }))
    ),
    addEntities(storeUpdates.map(({ todos }) => todos).flat(1), {
      ref: todosEntitiesRef,
    })
  );
}
