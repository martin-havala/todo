import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first, forkJoin, map } from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import { PopulatedToDoList } from 'src/app/models/todo_list';
import { TodosService } from 'src/app/services/todos/todos.service';

@UntilDestroy()
@Component({
  selector: 'app-todo-list-detail',
  templateUrl: './todo-list-detail.component.html',
  styleUrls: ['./todo-list-detail.component.sass'],
})
export class TodoListDetailComponent implements OnInit {
  list!: Partial<PopulatedToDoList> | null;

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
    forkJoin({
      list: this.route.data
        .pipe(map(({ todoList }) => todoList as PopulatedToDoList))
        .pipe(first()),
      user: this.authService.user$.pipe(first()),
    })
      .pipe(untilDestroyed(this))
      .subscribe(({ list, user }) => {
        this.list = list ?? {
          name: '',
          private: true,
          userEmail: user?.email,
        };

        this.formGroup.patchValue({
          name: this.list.name,
          private: this.list.private,
        });
      });
  }

  save() {
    if (this.formGroup.value && this.formGroup.valid) {
      this.todoService
        .saveUpdateList({
          createdAt: this.list?.createdAt,
          id: this.list?.id,
          userEmail: this.list?.userEmail,
          ...this.formGroup.value,
        } as PopulatedToDoList)
        .subscribe(() => {
          this.router.navigate(['//']);
        });
    }
  }

  deleteList() {
    if (this.list?.id) {
      this.todoService
        .deleteList(this.list.id)
        .subscribe(() => this.router.navigate(['//']));
    }
  }

  deleteTodo(todo: ToDo) {
    this.todoService.deleteTodo(todo).subscribe(() => this.initList());
  }

  trackFn(i: number) {
    return i;
  }
}
