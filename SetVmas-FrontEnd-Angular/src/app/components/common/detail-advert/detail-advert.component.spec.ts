import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAdvertComponent } from './detail-advert.component';

describe('DetailAdvertComponent', () => {
  let component: DetailAdvertComponent;
  let fixture: ComponentFixture<DetailAdvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAdvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAdvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
