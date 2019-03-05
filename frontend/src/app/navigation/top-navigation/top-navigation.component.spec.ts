import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavigationComponent } from './top-navigation.component';
import { ViewFiltersComponent } from '../view-filters/view-filters.component';

describe('TopNavigationComponent', () => {
  let component: TopNavigationComponent;
  let fixture: ComponentFixture<TopNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopNavigationComponent, ViewFiltersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
