import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoMenuComponent } from './todo-menu.component';

describe('TodoMenuComponent', () => {
  let component: TodoMenuComponent;
  let fixture: ComponentFixture<TodoMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoMenuComponent]
    });
    fixture = TestBed.createComponent(TodoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
