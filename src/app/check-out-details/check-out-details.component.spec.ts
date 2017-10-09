import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutDetailsComponent } from './check-out-details.component';

describe('CheckOutDetailsComponent', () => {
  let component: CheckOutDetailsComponent;
  let fixture: ComponentFixture<CheckOutDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
