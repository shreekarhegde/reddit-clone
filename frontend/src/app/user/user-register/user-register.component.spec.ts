import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisterComponent } from './user-register.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('UserRegisterComponent', () => {
  let component: UserRegisterComponent;
  let fixture: ComponentFixture<UserRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule.forRoot([]), HttpClientModule],
      declarations: [UserRegisterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('length of email should be greater than 2', () => {
    component['email'] = 'test@gmail.com';
    expect(component.email.length).toBeGreaterThan(2);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
