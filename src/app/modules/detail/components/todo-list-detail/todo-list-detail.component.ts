import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { getEntity } from '@ngneat/elf-entities';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first, forkJoin, map } from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import {
  PopulatedToDoList,
  ReferencedToDoList,
  ToDoList,
} from 'src/app/models/todo_list';
import { TodosService } from 'src/app/services/todos/todos.service';
import { todosEntitiesRef, todosStore } from 'src/app/store/store';

@UntilDestroy()
@Component({
  selector: 'app-todo-list-detail',
  templateUrl: './todo-list-detail.component.html',
  styleUrls: ['./todo-list-detail.component.sass'],
})
export class TodoListDetailComponent implements OnInit {
  list!: Partial<ToDoList> | null;
  items: ToDo[] = [];

  formGroup!: FormGroup<{
    name: FormControl<string | null>;
    private: FormControl<boolean | null>;
  }>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initList();
  }

  initForm() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.list?.name ?? null, {
        validators: [Validators.required],
      }),
      private: new FormControl(this.list?.private ?? true, {
        validators: [Validators.required],
      }),
    });
  }
  initList() {
    this.items = [];
    forkJoin({
      list: this.route.data
        .pipe(map(({ todoList }) => todoList as ReferencedToDoList))
        .pipe(first(), untilDestroyed(this)),
      user: this.authService.user$.pipe(first()),
    }).subscribe(({ list, user }) => {
      if (list) {
        this.list = {
          id: list.id,
          name: list.name,
          private: list.private,
          userEmail: list.userEmail,
          createdAt: list.createdAt,
        };

        this.items = list.todos
          .map(
            (td) =>
              todosStore.query(getEntity(td, { ref: todosEntitiesRef })) as ToDo
          )
          .filter(Boolean);
      } else {
        this.list = {
          private: true,
          userEmail: user?.email,
        };
        this.items = [];
      }
      this.formGroup.patchValue(this.list);
    });
  }

  save() {
    if (this.formGroup.value && this.formGroup.valid) {
      this.todoService
        .saveUpdateList({
          ...this.list,
          ...this.formGroup.value,
        } as PopulatedToDoList)
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
  }

  deleteList() {
    if (this.list?.id) {
      this.todoService
        .deleteList(this.list.id)
        .subscribe(() => this.router.navigate(['/']));
    }
  }

  deleteTodo(todo: ToDo) {
    this.todoService.deleteTodo(todo).subscribe(() => this.initList());
  }

  trackFn(i: number) {
    return i;
  }
}
