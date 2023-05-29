import { Component, OnInit, ViewChild } from '@angular/core';
import { format, parse } from 'date-fns';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxMatTimepickerComponent } from 'ngx-mat-timepicker';
import { map } from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import { TodosService } from 'src/app/services/todos/todos.service';

@UntilDestroy()
@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.sass'],
})
export class TodoDetailComponent implements OnInit {
  time!: string;
  todoListId!: string;

  constructor(
    private todoService: TodosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild(NgxMatTimepickerComponent) pickerTime!: NgxMatTimepickerComponent;

  initValue(todo: Partial<ToDo>): void {
    this.formGroup.patchValue(todo, { emitEvent: false, onlySelf: true });
    this.time = !todo.deadline
      ? ''
      : todo.deadline instanceof Date
      ? format(todo.deadline, 'h:mm a')
      : format(new Date(todo.deadline), 'h:mm a');
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }

  formGroup!: FormGroup<{
    deadline: FormControl;
    description: FormControl;
    resolved: FormControl;
    title: FormControl;
  }>;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      deadline: new FormControl(null, {}),
      description: new FormControl(null, {}),
      resolved: new FormControl(false, {}),
      title: new FormControl(null, [Validators.required]),
    });
    this.todoListId = this.route.snapshot.paramMap.get('listId') as string;

    this.route.data
      .pipe(
        map(({ todo }) => todo),
        untilDestroyed(this)
      )
      .subscribe((todo) => {
        this.initValue(todo);
      });

    (this.formGroup.get('deadline') as FormControl).valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((v) => {
        if (v) {
          this.time = format(new Date(v), 'h:m a');
        } else {
          this.time = '';
        }
      });
  }

  updateTime(timeString: string, emitEvent = false) {
    const deadline = this.formGroup.get('deadline') as FormControl;
    const timeDate = parse(
      timeString,
      'h:m a',
      deadline.value instanceof Date ? deadline.value : new Date()
    );
    deadline.setValue(timeDate, { emitEvent });
  }

  save() {
    const id = this.route.snapshot.paramMap.get('todoId') as string;
    if (id) {
      this.todoService
        .updateTodo({
          id,
          todoListId: this.todoListId,
          ...this.formGroup.value,
        })
        .subscribe();
    } else {
      this.todoService
        .addTodo({
          todoListId: this.todoListId,
          ...this.formGroup.value,
        })
        .subscribe();
    }
  }

  back() {
    this.router.navigate(['detail', this.todoListId]);
  }
}
