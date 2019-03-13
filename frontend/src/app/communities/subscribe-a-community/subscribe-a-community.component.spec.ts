import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeACommunityComponent } from './subscribe-a-community.component';

describe('SubscribeACommunityComponent', () => {
  let component: SubscribeACommunityComponent;
  let fixture: ComponentFixture<SubscribeACommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeACommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeACommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
