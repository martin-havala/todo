import { ToDoList } from './todo_list';

export interface ToDo {
  id: string;
  todoListId: ToDoList['id'];
  deadline: Date;
  title: string;
  description: string;
  resolved: boolean;
}
