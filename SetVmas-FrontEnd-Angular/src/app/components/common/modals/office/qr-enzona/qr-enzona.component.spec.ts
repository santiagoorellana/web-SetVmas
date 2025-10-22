import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrEnzonaComponent } from './qr-enzona.component';

describe('QrEnzonaComponent', () => {
  let component: QrEnzonaComponent;
  let fixture: ComponentFixture<QrEnzonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrEnzonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrEnzonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
