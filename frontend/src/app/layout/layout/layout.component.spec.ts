import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';
import { TopNavigationComponent } from '../../navigation/top-navigation/top-navigation.component';
import { ViewFiltersComponent } from '../../navigation/view-filters/view-filters.component';
import { RouterModule } from '@angular/router';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent, TopNavigationComponent, ViewFiltersComponent],
      imports: [RouterModule.forRoot([])],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
