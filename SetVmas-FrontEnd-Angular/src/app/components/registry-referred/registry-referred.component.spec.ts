import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryReferredComponent } from './registry-referred.component';

describe('RegistryReferredComponent', () => {
  let component: RegistryReferredComponent;
  let fixture: ComponentFixture<RegistryReferredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryReferredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryReferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
