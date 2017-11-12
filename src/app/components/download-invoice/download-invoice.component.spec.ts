import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadInvoiceComponent } from './download-invoice.component';

describe('DownloadInvoiceComponent', () => {
  let component: DownloadInvoiceComponent;
  let fixture: ComponentFixture<DownloadInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
