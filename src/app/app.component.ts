import { Component, OnInit } from '@angular/core';
import { TodosService } from './services/todos/todos.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  isLoading = true;
  constructor(private todoService: TodosService) {}

  ngOnInit(): void {
    this.todoService
      .reload()
      .pipe(first())
      .subscribe(() => (this.isLoading = false));
  }
}
