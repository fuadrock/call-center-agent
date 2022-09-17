import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueLoginComponent } from './queue-login.component';

describe('QueueLoginComponent', () => {
  let component: QueueLoginComponent;
  let fixture: ComponentFixture<QueueLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
