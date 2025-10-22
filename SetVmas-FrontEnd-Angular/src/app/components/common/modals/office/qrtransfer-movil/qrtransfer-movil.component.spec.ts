import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRTransferMovilComponent } from './qrtransfer-movil.component';

describe('QRTransferMovilComponent', () => {
  let component: QRTransferMovilComponent;
  let fixture: ComponentFixture<QRTransferMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRTransferMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRTransferMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
