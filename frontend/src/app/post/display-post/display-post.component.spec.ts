import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPostComponent } from './display-post.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('DisplayPostComponent', () => {
  let component: DisplayPostComponent;
  let fixture: ComponentFixture<DisplayPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [DisplayPostComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [HttpClient]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
