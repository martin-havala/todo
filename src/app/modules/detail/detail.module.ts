import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DATE_FNS_FORMATS,
  MatDateFnsModule,
} from '@angular/material-date-fns-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes } from '@angular/router';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { TodoListDetailComponent } from './components/todo-list-detail/todo-list-detail.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { enIN } from 'date-fns/locale';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { CoreModule } from '../core/core.module';
import { todoListResolveFn, todoResolveFn } from './detail.resolvers';
import { of } from 'rxjs';

const routes: Routes = [
  {
    path: ':listId/todo/:todoId',
    component: TodoDetailComponent,
    resolve: {
      todo: todoResolveFn,
    },
  },
  {
    path: ':listId/todo',
    component: TodoDetailComponent,
    pathMatch: 'full',
    resolve: {
      todoList: todoListResolveFn,
      todo: () => of({}),
    },
  },
  {
    path: ':listId',
    component: TodoListDetailComponent,
    resolve: {
      todoList: todoListResolveFn,
    },
  },
  {
    path: '**',
    component: TodoListDetailComponent,
  },
];

@NgModule({
  bootstrap: [TodoListDetailComponent],
  declarations: [TodoDetailComponent, TodoListDetailComponent],
  imports: [
    CoreModule,
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatDateFnsModule,
  ],

  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: 'always' },
    },
    { provide: MAT_DATE_FNS_FORMATS, useValue: { useUtc: true } },
    {
      provide: MAT_DATE_LOCALE,
      useValue: enIN,
    },
  ],
})
export class DetailModule {}
