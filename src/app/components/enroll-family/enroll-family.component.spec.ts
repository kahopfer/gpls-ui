import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollFamilyComponent} from './enroll-family.component';

describe('EnrollFamilyComponent', () => {
  let component: EnrollFamilyComponent;
  let fixture: ComponentFixture<EnrollFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollFamilyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
