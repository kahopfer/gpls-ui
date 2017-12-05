import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InactiveFamilyListComponent} from './inactive-family-list.component';

describe('InactiveFamilyListComponent', () => {
  let component: InactiveFamilyListComponent;
  let fixture: ComponentFixture<InactiveFamilyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InactiveFamilyListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveFamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
