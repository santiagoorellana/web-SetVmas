import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditAnnouncePage } from './edit-announce.page';

describe('EditAnnouncePage', () => {
  let component: EditAnnouncePage;
  let fixture: ComponentFixture<EditAnnouncePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAnnouncePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAnnouncePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
