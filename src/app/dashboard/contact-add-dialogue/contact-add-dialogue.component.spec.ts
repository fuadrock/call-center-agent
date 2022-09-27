import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddDialogueComponent } from './contact-add-dialogue.component';

describe('ContactAddDialogueComponent', () => {
  let component: ContactAddDialogueComponent;
  let fixture: ComponentFixture<ContactAddDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAddDialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAddDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
