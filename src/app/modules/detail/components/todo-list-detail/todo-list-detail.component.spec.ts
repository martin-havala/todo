import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListDetailComponent } from './todo-list-detail.component';

describe('TodoDetailComponent', () => {
  let component: TodoListDetailComponent;
  let fixture: ComponentFixture<TodoListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoListDetailComponent]
    });
    fixture = TestBed.createComponent(TodoListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
