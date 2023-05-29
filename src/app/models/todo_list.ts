import { ToDo } from './todo';

export interface ToDoList {
  id: string;
  createdAt: Date;
  userEmail: string;
  name: string;
  private: boolean;
}

export interface ReferencedToDoList {
  id: string;
  createdAt: Date;
  userEmail: string;
  name: string;
  private: boolean;
  todos: Array<ToDo['id']>;
}

export interface PopulatedToDoList {
  id: string;
  createdAt: Date;
  userEmail: string;
  name: string;
  private: boolean;
  todos: ToDo[];
}
