import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginComponent } from './user-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserLoginComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [HttpClient]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
