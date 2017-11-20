import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveFamilyDetailsComponent } from './inactive-family-details.component';

describe('InactiveFamilyDetailsComponent', () => {
  let component: InactiveFamilyDetailsComponent;
  let fixture: ComponentFixture<InactiveFamilyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveFamilyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveFamilyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
