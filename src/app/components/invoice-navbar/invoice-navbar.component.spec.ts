import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InvoiceNavbarComponent} from './invoice-navbar.component';

describe('InvoiceNavbarComponent', () => {
  let component: InvoiceNavbarComponent;
  let fixture: ComponentFixture<InvoiceNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceNavbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
