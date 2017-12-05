import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateInvoiceDetailsComponent} from './create-invoice-details.component';

describe('CreateInvoiceDetailsComponent', () => {
  let component: CreateInvoiceDetailsComponent;
  let fixture: ComponentFixture<CreateInvoiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInvoiceDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvoiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
