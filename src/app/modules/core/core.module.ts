import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoMenuComponent } from './components/todo-menu/todo-menu.component';
import { TodoComponent } from './components/todo/todo.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const CORE_COMPONENTS = [
  HeaderComponent,
  TodoListComponent,
  TodoMenuComponent,
  TodoComponent,
];
@NgModule({
  declarations: [CORE_COMPONENTS],
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
  ],
  exports: [CORE_COMPONENTS],
})
export class CoreModule {}
