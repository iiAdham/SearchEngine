import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationRingComponent } from './notification-ring.component';

describe('NotificationRingComponent', () => {
  let component: NotificationRingComponent;
  let fixture: ComponentFixture<NotificationRingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationRingComponent]
    });
    fixture = TestBed.createComponent(NotificationRingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
